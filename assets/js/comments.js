import { loadComments, submitComment } from './comment-manager.js';
import { renderComments } from './comment-renderer.js';
import { DEFAULT_AVATAR } from './firebase-init.js';

export function initializeCommentUI(reader, observeAuth) {
  const { container, chapters } = reader;
  const noteId = container.dataset.noteId;
  let unsubscribe = null;
  let latestComments = [];
  let expandId = null;

  for (const [index, chapter] of chapters.entries()) {
    const section = document.createElement('section');
    section.className = 'comment-section';
    section.innerHTML = `
      <h3 class="comment-section-title">评论</h3>
      <form class="comment-form">
        <img class="comment-avatar" src="${DEFAULT_AVATAR}" alt="用户头像">
        <textarea aria-label="评论内容" placeholder="写下你的评论…" rows="2" maxlength="5000" required></textarea>
        <button class="comment-submit" type="submit">发布</button>
      </form>
      <div class="comment-list" aria-live="polite"></div>`;
    chapter.append(section);
    const form = section.querySelector('form');
    const textarea = form.querySelector('textarea');
    const button = form.querySelector('button');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (button.disabled) return;
      button.disabled = true;
      try {
        if (await submitComment(noteId, index, textarea.value)) textarea.value = '';
      } finally { button.disabled = false; }
    });
    textarea.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        form.requestSubmit();
      }
    });
  }

  function render() {
    const index = reader.currentChapter;
    const list = chapters[index].querySelector('.comment-list');
    renderComments(latestComments, index, list, (parentId) => {
      expandId = parentId;
      render();
    }, expandId, noteId);
  }

  function subscribe() {
    unsubscribe?.();
    latestComments = [];
    expandId = null;
    const index = reader.currentChapter;
    const list = chapters[index].querySelector('.comment-list');
    list.textContent = '正在加载评论…';
    unsubscribe = loadComments(noteId, index, (comments) => {
      if (index !== reader.currentChapter) return;
      latestComments = comments;
      render();
    }, () => { list.textContent = '评论加载失败，请稍后重试。'; });
  }

  observeAuth(() => render());
  container.addEventListener('chapterchange', subscribe);
  // Restore subscriptions after returning from the browser's back/forward cache.
  window.addEventListener('pagehide', () => { unsubscribe?.(); });
  window.addEventListener('pageshow', (event) => { if (event.persisted) subscribe(); });
  subscribe();
}
