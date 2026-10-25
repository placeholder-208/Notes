export function buildSidebar(tocNav, sections, chapters, navigate) {
  tocNav.replaceChildren();
  sections.forEach((section, index) => {
    const item = document.createElement('li');
    item.dataset.chapter = index;
    const link = document.createElement('a');
    link.href = `#chapter-${index}`;
    link.textContent = section.heading.textContent;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navigate(`chapter-${index}`);
    });
    item.append(link);

    const subList = document.createElement('ul');
    subList.className = 'sub-toc';
    chapters[index].querySelectorAll('h3').forEach((heading, subIndex) => {
      // Preserve Kramdown anchors so existing links continue to work.
      if (!heading.id) heading.id = `sub-${index}-${subIndex}`;
      const subItem = document.createElement('li');
      const subLink = document.createElement('a');
      subLink.href = `#${encodeURIComponent(heading.id)}`;
      subLink.textContent = heading.textContent;
      subLink.addEventListener('click', (event) => {
        event.preventDefault();
        navigate(heading.id);
      });
      subItem.append(subLink);
      subList.append(subItem);
    });
    if (subList.children.length) item.append(subList);
    tocNav.append(item);
  });
}

export function updateSidebarActive(tocNav, index) {
  for (const item of tocNav.children) {
    const active = Number(item.dataset.chapter) === index;
    item.classList.toggle('active', active);
    const link = item.firstElementChild;
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
    const subList = item.querySelector('.sub-toc');
    if (subList) subList.hidden = !active;
  }
}
