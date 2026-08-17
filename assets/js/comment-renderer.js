import { getAuth } from 'firebase/auth';
import { toggleLike, submitComment } from './comment-manager.js';

let activeReplyContainer = null;

function getCurrentUid() {
  const auth = getAuth();
  return auth.currentUser ? auth.currentUser.uid : null;
}

export function renderComments(rootComments, chapterIndex, container, onUpdate, expandId = null) {
  container.innerHTML = '';
  rootComments.forEach(root => {
    const el = createCommentElement(root, chapterIndex, 0, onUpdate, expandId);
    container.appendChild(el);
  });
}

function createCommentElement(comment, chapterIndex, level, onUpdate, expandId) {
  const div = document.createElement('div');
  div.className = 'comment-item';
  div.dataset.commentId = comment.id;
  div.style.marginLeft = level * 1.5 + 'rem';

  // 头部
  const header = document.createElement('div');
  header.className = 'comment-header';
  header.innerHTML = `
    <img src="${comment.avatar || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}" alt="avatar">
    <strong>${comment.name || '匿名用户'}</strong>
    <span class="comment-time">${comment.timestamp ? new Date(comment.timestamp.seconds * 1000).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : ''}</span>
  `;
  div.appendChild(header);

  // 内容
  const content = document.createElement('div');
  content.className = 'comment-content';
  content.textContent = comment.content;
  div.appendChild(content);

  // 互动栏
  const actions = document.createElement('div');
  actions.className = 'comment-actions';

  // 点赞
  const likeBtn = document.createElement('button');
  const currentUid = getCurrentUid();
  const isLiked = (comment.likes || []).includes(currentUid);
  const likeCount = (comment.likes || []).length;
  likeBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" fill="${isLiked ? 'red' : 'currentColor'}">
    <path fill-rule="evenodd" clip-rule="evenodd" 
    d="M9.77234 30.8573V11.7471H7.54573C5.50932 11.7471 3.85742 13.3931 
    3.85742 15.425V27.1794C3.85742 29.2112 5.50932 30.8573 7.54573 
    30.8573H9.77234ZM11.9902 30.8573V11.7054C14.9897 10.627 16.6942 7.8853
    17.1055 3.33591C17.2666 1.55463 18.9633 0.814421 20.5803 
    1.59505C22.1847 2.36964 23.243 4.32583 23.243 6.93947C23.243 8.50265 
    23.0478 10.1054 22.6582 11.7471H29.7324C31.7739 11.7471 33.4289 13.402
    33.4289 15.4435C33.4289 15.7416 33.3928 16.0386 33.3215 16.328L30.9883 
    25.7957C30.2558 28.7683 27.5894 30.8573 24.528 
    30.8573H11.9911H11.9902Z" ></path></svg>
    <span class="like-count">${likeCount}</span>
  `;
  likeBtn.addEventListener('click', async () => {
    await toggleLike(comment.id, comment.likes || []);
    if (onUpdate) onUpdate(null);
  });
  actions.appendChild(likeBtn);

  // 回复按钮（仅 level < 2）
  let replyContainer = null;
  if (level < 2) {
    const replyBtn = document.createElement('button');
    replyBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" 
          d="M10,10 h16 a3,3 0 0 1 3 3 v12 a3,3 0 0 1 -3 3 h-10 l-5 5 v-5 h-4 a3,3 0 0 1 -3 -3 v-12 a3,3 0 0 1 3 -3 z" />
      </svg>
    `;
    replyBtn.title = '回复';

    replyContainer = document.createElement('div');
    replyContainer.className = 'reply-container';
    replyContainer.style.display = 'none';
    const textarea = document.createElement('textarea');
    textarea.className = 'reply-textarea';
    textarea.placeholder = '输入回复...';
    textarea.rows = 2;
    const submitBtn = document.createElement('button');
    submitBtn.className = 'reply-submit';
    submitBtn.textContent = '发布';
    replyContainer.appendChild(textarea);
    replyContainer.appendChild(submitBtn);

    replyBtn.addEventListener('click', () => {
      if (activeReplyContainer && activeReplyContainer !== replyContainer) {
        activeReplyContainer.style.display = 'none';
        activeReplyContainer = null;
      }
      if (replyContainer.style.display === 'none') {
        replyContainer.style.display = 'block';
        activeReplyContainer = replyContainer;
        textarea.focus();
      } else {
        replyContainer.style.display = 'none';
        activeReplyContainer = null;
      }
    });

    submitBtn.addEventListener('click', async () => {
      const content = textarea.value.trim();
      if (!content) {
        alert('内容不能为空');
        return;
      }
      const parentId = await submitComment(chapterIndex, content, comment.id);
      textarea.value = '';
      replyContainer.style.display = 'none';
      if (activeReplyContainer === replyContainer) {
        activeReplyContainer = null;
      }
      if (onUpdate) {
        onUpdate(parentId);
      }
    });

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submitBtn.click();
      }
    });

    actions.appendChild(replyBtn);
  }

  // 子评论容器
  const childrenContainer = document.createElement('div');
  childrenContainer.className = 'children-container';

  if (level < 2) {
    const children = comment.children || [];
    const sortedChildren = [...children].sort((a, b) => {
      const aLikes = (a.likes || []).length;
      const bLikes = (b.likes || []).length;
      if (aLikes !== bLikes) return bLikes - aLikes;
      return (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0);
    });

    if (sortedChildren.length > 0) {
      let showFirstOnly = false;
      let showToggle = false;

      if (level === 0) {
        showFirstOnly = true;
        if (sortedChildren.length > 1) showToggle = true;
      } else if (level === 1) {
        showFirstOnly = false;
        if (sortedChildren.length > 0) showToggle = true;
      }

      const shouldExpand = (expandId === comment.id);
      let expanded = shouldExpand;

      sortedChildren.forEach((child, index) => {
        const childEl = createCommentElement(child, chapterIndex, level + 1, onUpdate, expandId);
        childEl.classList.add('child-comment');
        if (expanded) {
          childEl.style.display = 'block';
        } else if (showFirstOnly) {
          childEl.style.display = (index === 0) ? 'block' : 'none';
        } else {
          childEl.style.display = 'none';
        }
        childrenContainer.appendChild(childEl);
      });

      if (showToggle) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-children';
        toggleBtn.innerHTML = expanded ? `
          <svg width="25" height="25" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" fill="#0d0d0d">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18 10 L6 24 h24 z" />
          </svg>
        ` : `
          <svg width="25" height="25" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" fill="#0d0d0d">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18 26 L6 12 h24 z" />
          </svg>
        `;

        toggleBtn.addEventListener('click', () => {
          expanded = !expanded;
          const directChildren = childrenContainer.children;
          Array.from(directChildren).forEach((el, idx) => {
            if (!expanded && level === 0 && idx === 0) {
              el.style.display = 'block';
            } else {
              el.style.display = expanded ? 'block' : 'none';
            }
          });
          toggleBtn.innerHTML = expanded ? `
            <svg width="25" height="25" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" fill="#0d0d0d">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M18 10 L6 24 h24 z" />
            </svg>
          ` : `
            <svg width="25" height="25" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" fill="#0d0d0d">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M18 26 L6 12 h24 z" />
            </svg>
          `;
        });
        actions.appendChild(toggleBtn);
      }
    }
  }

  div.appendChild(actions);
  if (replyContainer) {
    div.appendChild(replyContainer);
  }
  if (childrenContainer.children.length > 0) {
    div.appendChild(childrenContainer);
  }

  return div;
}