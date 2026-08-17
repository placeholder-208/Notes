import { auth, db } from './firebase-init.js';
import { buildChapters, renderChapters } from './chapter-manager.js';
import { buildSidebar, updateSidebarActive, generateSubToc } from './sidebar-manager.js';
import { loadComments, submitComment } from './comment-manager.js';
import { renderComments } from './comment-renderer.js';

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('note-content');
  if (!container) return;

  const sections = buildChapters(container);
  const commentHtml = (idx) => `
    <h3 class="comment-section-title">评论</h3>
    <div class="comment-form">
      <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
           class="comment-avatar" alt="avatar">
      <textarea id="comment-input-${idx}" placeholder="写下你的评论..." rows="2"></textarea>
      <button class="comment-submit">发布</button>
    </div>
    <div class="comment-list"></div>
  `;
  renderChapters(container, sections, commentHtml);

  const tocNav = document.querySelector('#toc ul');
  let unsubscribeComments = null; // 用于取消评论监听
   let currentChapter = 0;

  // 刷新评论函数
  function refreshComments(expandId = null) {
    if (unsubscribeComments) {
      unsubscribeComments();
      unsubscribeComments = null;
    }
    const commentList = document.querySelector(`.chapter[data-chapter="${currentChapter}"] .comment-list`);
    if (!commentList) return;
    commentList.innerHTML = '';
    unsubscribeComments = loadComments(currentChapter, (rootComments) => {
      renderComments(rootComments, currentChapter, commentList, (parentId) => {
        // 评论发布后，传递 parentId 作为 expandId
        refreshComments(parentId);
      }, expandId);
    });
  }

  const onChapterClick = (index) => {
    // 取消旧的评论监听
    if (unsubscribeComments) {
      unsubscribeComments();
      unsubscribeComments = null;
    }

    // 1. 清除所有章节的子标题列表（全局清除）
    document.querySelectorAll('#toc ul > li ul.sub-toc').forEach(el => el.remove());

    // 2. 切换显示章节
    document.querySelectorAll('.chapter').forEach(el => el.style.display = 'none');
    const target = document.querySelector(`.chapter[data-chapter="${index}"]`);
    if (target) target.style.display = 'block';
    updateSidebarActive(index);

    // 3. 生成当前章节的子标题
    const parentLi = document.querySelector(`#toc ul > li[data-chapter="${index}"]`);
    if (parentLi) {
      const subHeadings = target.querySelectorAll('h3:not(.comment-section-title)');
      if (subHeadings.length > 0) {
        const subUl = document.createElement('ul');
        subUl.className = 'sub-toc';
        subHeadings.forEach((h3, subIdx) => {
          const id = `sub-${index}-${subIdx}`;
          h3.id = id;
          const subLi = document.createElement('li');
          const subA = document.createElement('a');
          subA.href = '#' + id;
          subA.textContent = h3.textContent;
          subA.addEventListener('click', (e) => {
            e.preventDefault();
            onChapterClick(index);
            history.pushState(null, '', '#' + id);
            const el = document.getElementById(id);
            if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
          });
          subLi.appendChild(subA);
          subUl.appendChild(subLi);
        });
        parentLi.appendChild(subUl);
      }
    }

    // 4. 加载评论
    const commentList = document.querySelector(`.chapter[data-chapter="${index}"] .comment-list`);
    if (commentList) {
      // 清空列表，显示“加载中”或留空
      commentList.innerHTML = '';
      // 订阅评论更新
      unsubscribeComments = loadComments(index, (rootComments) => {
        // 使用渲染组件
        renderComments(rootComments, index, commentList, () => {
          // 更新回调：由于 onSnapshot 会自动更新，这里留空即可
        });
      });
    }
    currentChapter = index;
    refreshComments(null); // 加载评论，不展开
  };

  buildSidebar(tocNav, sections, onChapterClick);

  // 绑定评论发布事件（根评论发布）
  document.querySelectorAll('.comment-form .comment-submit').forEach(btn => {
    const chapterDiv = btn.closest('.chapter');
    if (!chapterDiv) return;
    const chapterIndex = parseInt(chapterDiv.dataset.chapter);
    btn.addEventListener('click', async () => {
      const textarea = btn.closest('.comment-form').querySelector('textarea');
      const content = textarea ? textarea.value : '';
      if (content.trim() === '') {
        alert('内容不能为空');
        return;
      }
      // 提交根评论（parentId 为 null）
      await submitComment(chapterIndex, content, null);
      textarea.value = ''; // 清空
      // 评论发布后，onSnapshot 会自动更新，无需手动重新加载
      // 根评论发布，不展开任何父评论（expandId = null）
      refreshComments(null);
    });
  });

  // 快捷键 Ctrl+Enter 发布
  document.querySelectorAll('.comment-form textarea').forEach(textarea => {
    const chapterDiv = textarea.closest('.chapter');
    if (!chapterDiv) return;
    const chapterIndex = parseInt(chapterDiv.dataset.chapter);
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const btn = textarea.closest('.comment-form').querySelector('.comment-submit');
        if (btn) btn.click();
      }
    });
  });

  // 默认显示第一章
  if (sections.length > 0) {
    onChapterClick(0);
  }

  // 处理 URL hash
  window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
      let targetIdx = -1, subIdx = -1;
      if (hash.startsWith('#chapter-')) {
        targetIdx = parseInt(hash.replace('#chapter-', ''));
      } else if (hash.startsWith('#sub-')) {
        const parts = hash.replace('#sub-', '').split('-');
        targetIdx = parseInt(parts[0]);
        subIdx = parseInt(parts[1]);
      }
      if (!isNaN(targetIdx) && targetIdx >= 0 && targetIdx < sections.length) {
        onChapterClick(targetIdx);
        if (!isNaN(subIdx) && subIdx >= 0) {
          const el = document.getElementById(`sub-${targetIdx}-${subIdx}`);
          if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      }
    }
  });

  // 暴露调试接口
  window.__note = { onChapterClick, submitComment };
});