import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBrowserModule } from './helpers.js';

test('keeps all introductory nodes without changing existing chapter indexes', async () => {
  const { exports, document } = await loadBrowserModule('assets/js/chapter-manager.js',
    '<div id="note">Introduction <p>Preface</p><h2 id="one">One</h2><p>Body</p><h2>Two</h2><p>Last</p></div>');
  const container = document.getElementById('note');
  const original = container.textContent;
  const sections = exports.buildChapters(container);
  assert.equal(sections.length, 2);
  const chapters = exports.renderChapters(container, sections);
  assert.equal(container.textContent, original);
  assert.equal(chapters[0].querySelector('h2').id, 'one');
  assert.match(chapters[0].textContent, /Introduction PrefaceOneBody/);
});

test('a nested h2 does not discard a document without top-level chapters', async () => {
  const { exports, document } = await loadBrowserModule('assets/js/chapter-manager.js',
    '<div id="note">Text<div><h2>Nested</h2><p>Content</p></div></div>');
  const container = document.getElementById('note');
  const sections = exports.buildChapters(container);
  assert.equal(sections.length, 1);
  exports.renderChapters(container, sections);
  assert.match(container.textContent, /TextNestedContent/);
});

function readerMarkup() {
  return `<div id="user-status"></div><aside class="sidebar">
    <nav id="toc"><ul></ul></nav><div class="nav-controls"><button class="toggle-btn"></button></div>
    </aside><div id="note-content" data-note-id="_notes/test.md">
    <h1>Preface</h1><h2 id="first">One</h2><h3 id="original">Original</h3><p>Body</p>
    <h2 id="second">Two</h2><h3 id="target">Target</h3><p>Last</p></div>`;
}

test('reader works when comments are disabled; anchors and back navigation reveal chapters', async () => {
  const { window, document } = await loadBrowserModule('assets/js/main.js', readerMarkup());
  for (const element of document.querySelectorAll('[id]')) element.scrollIntoView = () => {};
  const chapters = document.querySelectorAll('.chapter');
  assert.equal(chapters.length, 2);
  assert.equal(chapters[0].hidden, false);
  assert.equal(chapters[1].hidden, true);
  assert.ok(document.querySelector('#original'));
  assert.equal(document.querySelector('.sub-toc a').getAttribute('href'), '#original');
  window.location.hash = '#target';
  window.dispatchEvent(new window.Event('hashchange'));
  assert.equal(chapters[1].hidden, false);
  assert.equal(chapters[0].hidden, true);
  window.location.hash = '#sub-0-0';
  window.dispatchEvent(new window.Event('hashchange'));
  assert.equal(chapters[0].hidden, false);
  window.location.hash = '';
  window.dispatchEvent(new window.Event('hashchange'));
  assert.equal(chapters[0].hidden, false);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(document.getElementById('user-status').textContent, '评论未启用');
});

test('mobile expand/collapse uses the current chapter after navigation', async () => {
  const { window, document, media } = await loadBrowserModule('assets/js/main.js', readerMarkup());
  for (const element of document.querySelectorAll('[id]')) element.scrollIntoView = () => {};
  media.matches = true;
  window.location.hash = '#chapter-1';
  window.dispatchEvent(new window.Event('hashchange'));
  const items = document.querySelector('#toc > ul').children;
  assert.equal(items[0].hidden, true);
  const button = document.querySelector('.toggle-btn');
  button.click();
  assert.equal(items[0].hidden, false);
  button.click();
  assert.equal(items[0].hidden, true);
  assert.equal(items[1].hidden, false);
});
