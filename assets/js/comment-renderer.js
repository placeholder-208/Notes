import { auth, safeAvatar } from './firebase-init.js';
import { toggleLike, submitComment } from './comment-manager.js';

const expandedReplies = new Set();

export function renderComments(rootComments, chapterIndex, container, onUpdate, expandId = null, noteId) {
  const elements = rootComments.map((comment) => createCommentElement(comment, chapterIndex, 0, onUpdate, expandId, noteId));
  container.replaceChildren(...elements);
  if (!elements.length) container.textContent = '暂无评论';
}

function createCommentElement(comment, chapterIndex, level, onUpdate, expandId, noteId) {
  const item = document.createElement('div');
  item.className = 'comment-item';
  item.dataset.commentId = comment.id;
  const header = document.createElement('div');
  header.className = 'comment-header';
  const avatar = document.createElement('img');
  avatar.src = safeAvatar(comment.avatar);
  avatar.alt = '用户头像';
  avatar.loading = 'lazy';
  const name = document.createElement('strong');
  name.className = 'comment-name';
  name.textContent = comment.name || '匿名用户';
  const time = document.createElement('time');
  time.className = 'comment-time';
  const seconds = comment.timestamp?.seconds;
  if (Number.isFinite(seconds)) {
    const date = new Date(seconds * 1000);
    if (!Number.isNaN(date.getTime())) {
      time.dateTime = date.toISOString();
      time.textContent = date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    }
  }
  header.append(avatar, name, time);
  const content = document.createElement('div');
  content.className = 'comment-content';
  content.textContent = comment.content;
  const actions = document.createElement('div');
  actions.className = 'comment-actions';
  const like = document.createElement('button');
  like.type = 'button';
  const likes = Array.isArray(comment.likes) ? comment.likes : [];
  const liked = likes.includes(auth.currentUser?.uid);
  like.textContent = `♥ ${likes.length}`;
  like.setAttribute('aria-label', liked ? '取消点赞' : '点赞');
  like.setAttribute('aria-pressed', String(liked));
  like.addEventListener('click', async () => {
    if (like.disabled) return;
    like.disabled = true;
    try { await toggleLike(comment.id, likes); }
    finally { like.disabled = false; }
  });
  actions.append(like);
  item.append(header, content, actions);

  if (level < 2) {
    const reply = document.createElement('button');
    reply.type = 'button';
    reply.textContent = '回复';
    reply.setAttribute('aria-expanded', 'false');
    const form = document.createElement('form');
    form.className = 'reply-container';
    form.hidden = true;
    const textarea = document.createElement('textarea');
    textarea.className = 'reply-textarea';
    textarea.setAttribute('aria-label', '回复内容');
    textarea.placeholder = '输入回复…';
    textarea.maxLength = 5000;
    textarea.required = true;
    textarea.rows = 2;
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'reply-submit';
    submit.textContent = '发布';
    form.append(textarea, submit);
    reply.addEventListener('click', () => {
      form.hidden = !form.hidden;
      reply.setAttribute('aria-expanded', String(!form.hidden));
      if (!form.hidden) textarea.focus();
    });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (submit.disabled) return;
      submit.disabled = true;
      try {
        if (await submitComment(noteId, chapterIndex, textarea.value, comment.id)) {
          textarea.value = '';
          form.hidden = true;
          reply.setAttribute('aria-expanded', 'false');
          onUpdate?.(comment.id);
        }
      } finally { submit.disabled = false; }
    });
    textarea.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        form.requestSubmit();
      }
    });
    actions.append(reply);
    item.append(form);
    if (comment.children?.length) {
      const details = document.createElement('details');
      details.className = 'children-container';
      const key = `${noteId}:${chapterIndex}:${comment.id}`;
      details.open = expandedReplies.has(key) || expandId === comment.id || comment.children.some((child) => child.id === expandId);
      const summary = document.createElement('summary');
      summary.textContent = `回复（${comment.children.length}）`;
      details.append(summary);
      for (const child of comment.children) {
        details.append(createCommentElement(child, chapterIndex, level + 1, onUpdate, expandId, noteId));
      }
      details.addEventListener('toggle', () => {
        if (details.open) expandedReplies.add(key);
        else expandedReplies.delete(key);
      });
      item.append(details);
    }
  }
  return item;
}
