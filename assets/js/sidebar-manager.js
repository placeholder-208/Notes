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

export function generateSubToc(target, parentLi) {
  // 移除旧子列表
  const old = parentLi.querySelector('ul.sub-toc');
  if (old) old.remove();

  const subHeadings = target.querySelectorAll('h3');
  if (subHeadings.length === 0) return;
  const subUl = document.createElement('ul');
  subUl.className = 'sub-toc';
  subHeadings.forEach((h3, subIdx) => {
    const id = 'sub-' + parentLi.dataset.chapter + '-' + subIdx;
    h3.id = id;
    const subLi = document.createElement('li');
    const subA = document.createElement('a');
    subA.href = '#' + id;
    subA.textContent = h3.textContent;
    subA.addEventListener('click', (e) => {
      e.preventDefault();
      // 这里需要调用切换章节并滚动，由外部传入
      // 我们通过自定义事件或回调实现，此处由外部处理
    });
    subLi.appendChild(subA);
    subUl.appendChild(subLi);
  });
  parentLi.appendChild(subUl);
}