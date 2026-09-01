import { auth, db } from './firebase-init.js';
import { buildChapters, renderChapters } from './chapter-manager.js';
import { buildSidebar, updateSidebarActive, generateSubToc } from './sidebar-manager.js';
import { loadComments, submitComment } from './comment-manager.js';
import { renderComments } from './comment-renderer.js';

document.addEventListener('DOMContentLoaded', () => {
  const noteId = window.NOTE_ID || 'default-note';
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
  let unsubscribeComments = null;
  let currentChapter = 0;
  let isMobile = window.innerWidth < 768;
  let navExpanded = false;

  // ---- 布局调整函数 ----
  function adjustLayout() {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const sidebar = document.querySelector('.sidebar');
    if (header && main) {
      const headerHeight = header.offsetHeight;
      main.style.paddingTop = headerHeight + 'px';
      if (sidebar && window.innerWidth < 768) {
        sidebar.style.top = headerHeight + 'px';
      }
    }
  }

  // ---- 移动端导航更新 ----
  function updateMobileNav(currentIdx) {
    if (!isMobile) return;
    const navList = document.querySelector('#toc ul');
    if (!navList) return;
    const items = navList.querySelectorAll('li');
    if (items.length === 0) return;

    // 获取父容器 .sidebar
    const sidebar = navList.parentElement;

    // 创建或获取滚动容器（包裹标题列表）
    let scrollContainer = sidebar.querySelector('.nav-scroll');
    if (!scrollContainer) {
      scrollContainer = document.createElement('div');
      scrollContainer.className = 'nav-scroll';
      // 将原有的 ul 移动到 scrollContainer 中
      navList.parentNode.insertBefore(scrollContainer, navList);
      scrollContainer.appendChild(navList);
    }

    // 获取或创建控制栏（位于 sidebar 底部）
    let controls = sidebar.querySelector('.nav-controls');
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'nav-controls';

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'toggle-btn';
      toggleBtn.textContent = '▼';
      toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navExpanded = !navExpanded;
        updateMobileNav(currentIdx);
      });

      const backLink = document.createElement('a');
      backLink.className = 'back-link';
      backLink.textContent = '← 返回主页';
      backLink.href = window.location.origin + '/Notes/';

      controls.appendChild(toggleBtn);
      controls.appendChild(backLink);
      sidebar.appendChild(controls);
    }

    // 更新标题显示
    items.forEach((li, idx) => {
      if (navExpanded) {
        li.style.display = 'block';
      } else {
        if (idx === currentIdx || idx === currentIdx + 1) {
          li.style.display = 'block';
        } else {
          li.style.display = 'none';
        }
      }
    });

    // 更新按钮文字
    const toggleBtn = controls.querySelector('.toggle-btn');
    toggleBtn.textContent = navExpanded ? '▲' : '▼';

    // 调整 content 的 padding-top（避免被导航栏遮挡）
    const header = document.querySelector('header');
    const content = document.querySelector('.content');
    if (header && content) {
      const headerHeight = header.offsetHeight;
      const sidebarHeight = sidebar.offsetHeight; // 包含控制栏
      content.style.paddingTop = (headerHeight + sidebarHeight + 10) + 'px';
    }
  }

  // 更新标题显示
  items.forEach((li, idx) => {
    if (navExpanded) {
      li.style.display = 'block';
    } else {
      if (idx === currentIdx || idx === currentIdx + 1) {
        li.style.display = 'block';
      } else {
        li.style.display = 'none';
      }
    }
  });

  // 更新按钮文字
  const toggleBtn = controls.querySelector('.toggle-btn');
  toggleBtn.textContent = navExpanded ? '▲' : '▼';

  // 调整 content 的 padding-top（避免被导航栏遮挡）
  const header = document.querySelector('header');
  const content = document.querySelector('.content');
  if (header && content) {
    const headerHeight = header.offsetHeight;
    const sidebarHeight = sidebar.offsetHeight; // 包含控制栏
    content.style.paddingTop = (headerHeight + sidebarHeight + 10) + 'px';
  }

  // ---- 窗口大小变化处理 ----
  function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth < 768;
    if (isMobile !== wasMobile) {
      adjustLayout();
      if (isMobile) {
        updateMobileNav(currentChapter);
        // 移除桌面端可能存在的控制栏（如果之前创建过，但不会再触发）
      } else {
        // 恢复桌面端样式
        const navList = document.querySelector('#toc ul');
        if (navList) {
          navList.querySelectorAll('li').forEach(li => li.style.display = '');
        }
        const controls = document.querySelector('.nav-controls');
        if (controls) controls.remove();
        // 恢复 content padding-top
        const content = document.querySelector('.content');
        if (content) {
          content.style.paddingTop = ''; // 由 CSS 控制
        }
      }
    } else if (isMobile) {
      // 窗口大小变化但仍在移动端，可能影响布局
      adjustLayout();
      updateMobileNav(currentChapter);
    }
  }

  // ---- 刷新评论 ----
  function refreshComments(expandId = null) {
    if (unsubscribeComments) {
      unsubscribeComments();
      unsubscribeComments = null;
    }
    const commentList = document.querySelector(`.chapter[data-chapter="${currentChapter}"] .comment-list`);
    if (!commentList) return;
    commentList.innerHTML = '';
    unsubscribeComments = loadComments(noteId, currentChapter, (rootComments) => {
      renderComments(rootComments, currentChapter, commentList, (parentId) => {
        refreshComments(parentId);
      }, expandId, noteId);
    });
  }

  // ---- 章节点击 ----
  const onChapterClick = (index) => {
    if (unsubscribeComments) {
      unsubscribeComments();
      unsubscribeComments = null;
    }

    document.querySelectorAll('#toc ul > li ul.sub-toc').forEach(el => el.remove());

    document.querySelectorAll('.chapter').forEach(el => el.style.display = 'none');
    const target = document.querySelector(`.chapter[data-chapter="${index}"]`);
    if (target) {
      target.style.display = 'block';
      target.scrollTop = 0;
      document.querySelector('.content')?.scrollTo(0, 0);
    }
    updateSidebarActive(index);

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

    currentChapter = index;
    refreshComments(null);

    // 移动端更新导航
    if (isMobile) updateMobileNav(index);
  };

  buildSidebar(tocNav, sections, onChapterClick);

  // 绑定根评论发布
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
      await submitComment(noteId, chapterIndex, content, null);
      textarea.value = '';
      refreshComments(null);
    });
  });

  // 快捷键发布
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

  // 初始化
  if (sections.length > 0) {
    onChapterClick(0);
  }

  // 窗口 resize
  window.addEventListener('resize', handleResize);
  // 页面加载完成后额外调整一次
  setTimeout(() => {
    adjustLayout();
    if (isMobile) updateMobileNav(currentChapter);
  }, 100);

  // URL hash 处理
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

  // 暴露全局
  window.__note = { onChapterClick, submitComment };
  window.adjustLayout = adjustLayout; // 供 firebase-init.js 调用
});