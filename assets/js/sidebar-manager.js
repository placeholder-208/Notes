export function buildSidebar(tocNav, sections, onChapterClick) {
  tocNav.innerHTML = '';
  sections.forEach((sec, idx) => {
    const li = document.createElement('li');
    li.dataset.chapter = idx;
    const a = document.createElement('a');
    a.href = '#chapter-' + idx;
    a.textContent = sec.heading.textContent;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      onChapterClick(idx);
    });
    li.appendChild(a);
    tocNav.appendChild(li);
  });
}

export function updateSidebarActive(index) {
  document.querySelectorAll('#toc ul > li').forEach(li => {
    const liIndex = parseInt(li.dataset.chapter);
    li.classList.toggle('active', liIndex === index);
  });
}