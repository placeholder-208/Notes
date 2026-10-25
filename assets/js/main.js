import { buildChapters, renderChapters } from './chapter-manager.js';
import { buildSidebar, updateSidebarActive } from './sidebar-manager.js';

function initializeReader() {
  const container = document.getElementById('note-content');
  if (!container) return null;
  const sections = buildChapters(container);
  const chapters = renderChapters(container, sections);
  const toc = document.querySelector('#toc > ul');
  const sidebar = document.querySelector('.sidebar');
  const controls = document.querySelector('.nav-controls');
  const toggle = controls.querySelector('.toggle-btn');
  const mobile = window.matchMedia('(max-width: 767px)');
  let currentChapter = 0;
  let expanded = false;

  function updateMobileNav() {
    controls.hidden = !mobile.matches;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.textContent = expanded ? '收起目录' : '展开目录';
    for (const item of toc.children) {
      const index = Number(item.dataset.chapter);
      item.hidden = mobile.matches && !expanded && index !== currentChapter && index !== currentChapter + 1;
    }
    document.documentElement.style.setProperty('--navigation-height', `${mobile.matches ? sidebar.offsetHeight : 0}px`);
  }

  function renderMath() {
    if (window.renderMathInElement) {
      window.renderMathInElement(chapters[currentChapter], {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true },
        ],
        throwOnError: false,
      });
    }
  }

  function restoreHash(scroll = true) {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); }
    catch { return; }
    let target = id ? document.getElementById(id) : null;
    // Support links produced by the previous reader without replacing original IDs.
    const legacy = /^sub-(\d+)-(\d+)$/.exec(id);
    if (!target && legacy) target = chapters[Number(legacy[1])]?.querySelectorAll('h3')[Number(legacy[2])];
    const chapter = target?.closest('.chapter');
    const index = chapter ? Number(chapter.dataset.chapter) : (id ? currentChapter : 0);
    const changed = index !== currentChapter;
    currentChapter = index;
    chapters.forEach((element, chapterIndex) => { element.hidden = chapterIndex !== index; });
    updateSidebarActive(toc, index);
    expanded = false;
    updateMobileNav();
    renderMath();
    if (changed) container.dispatchEvent(new CustomEvent('chapterchange', { detail: index }));
    if (scroll && target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }

  function navigate(id) {
    const hash = `#${encodeURIComponent(id)}`;
    if (window.location.hash === hash) restoreHash();
    else window.location.hash = hash;
  }

  buildSidebar(toc, sections, chapters, navigate);
  toggle.addEventListener('click', () => { expanded = !expanded; updateMobileNav(); });
  mobile.addEventListener('change', updateMobileNav);
  if (window.ResizeObserver) new ResizeObserver(updateMobileNav).observe(sidebar);
  window.addEventListener('hashchange', () => restoreHash());
  window.addEventListener('load', renderMath, { once: true });
  restoreHash(Boolean(window.location.hash));
  return { container, chapters, get currentChapter() { return currentChapter; } };
}

async function initializeComments(reader) {
  const status = document.getElementById('user-status');
  try {
    const response = await fetch(new URL('./firebase-config.json', import.meta.url));
    if (!response.ok) throw new Error('评论配置加载失败');
    const config = await response.json();
    if (config.enabled === false || !config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
      status.textContent = '评论未启用';
      return;
    }
    const { initializeFirebase, observeAuth } = await import('./firebase-init.js');
    initializeFirebase(config);
    if (!reader) { observeAuth(() => {}); return; }
    const { initializeCommentUI } = await import('./comments.js');
    initializeCommentUI(reader, observeAuth);
  } catch (error) {
    status.textContent = '评论暂不可用';
    console.warn('评论初始化失败：', error);
  }
}

const reader = initializeReader();
void initializeComments(reader);
