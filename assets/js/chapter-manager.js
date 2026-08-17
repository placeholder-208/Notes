// 章节分割、渲染、切换逻辑
export function buildChapters(container) {
  const children = container.children;
  const h2s = container.querySelectorAll('h2');
  let sections = [];
  if (h2s.length === 0) {
    const fakeHeading = document.createElement('h2');
    fakeHeading.textContent = '全部内容';
    sections = [{ heading: fakeHeading, elements: Array.from(children) }];
  } else {
    let current = null;
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.tagName === 'H2') {
        if (current) sections.push(current);
        current = { heading: node, elements: [] };
      } else if (current) {
        current.elements.push(node);
      }
    }
    if (current) sections.push(current);
  }
  return sections;
}

export function renderChapters(container, sections, commentHtml) {
  container.innerHTML = '';
  sections.forEach((sec, idx) => {
    const div = document.createElement('div');
    div.className = 'chapter';
    div.dataset.chapter = idx;
    div.id = 'chapter-' + idx;
    div.appendChild(sec.heading.cloneNode(true));
    sec.elements.forEach(el => div.appendChild(el.cloneNode(true)));
    // 插入评论区
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-section';
    commentDiv.dataset.chapter = idx;
    commentDiv.innerHTML = commentHtml(idx);
    div.appendChild(commentDiv);
    container.appendChild(div);
  });
}