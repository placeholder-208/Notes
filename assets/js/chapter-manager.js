// Keep chapter indexes stable: introductory content belongs to chapter zero.
export function buildChapters(container) {
  const sections = [];
  const preamble = [];
  let current = null;
  for (const node of Array.from(container.childNodes)) {
    if (node.nodeName === 'H2') {
      current = { heading: node, elements: [], preamble: sections.length ? [] : preamble };
      sections.push(current);
    } else if (current) {
      current.elements.push(node);
    } else {
      preamble.push(node);
    }
  }
  if (!sections.length) {
    const heading = document.createElement('h2');
    heading.textContent = '全部内容';
    sections.push({ heading, elements: preamble, preamble: [] });
  }
  return sections;
}

export function renderChapters(container, sections) {
  const chapters = sections.map((section, index) => {
    const chapter = document.createElement('section');
    chapter.className = 'chapter';
    chapter.dataset.chapter = index;
    chapter.id = `chapter-${index}`;
    chapter.append(...section.preamble, section.heading, ...section.elements);
    return chapter;
  });
  container.replaceChildren(...chapters);
  return chapters;
}
