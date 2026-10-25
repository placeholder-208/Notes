import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { loadBrowserModule } from './helpers.js';

const init = resolve('assets/js/firebase-init.js');
const manager = resolve('assets/js/comment-manager.js');
const flush = () => new Promise((done) => setImmediate(done));

test('comment headers render untrusted names as text and preserve noteId in nested replies', async () => {
  const submissions = [];
  const { exports, document } = await loadBrowserModule('assets/js/comment-renderer.js', '<div id="comments"></div>', {
    [init]: { auth: { currentUser: null }, safeAvatar: () => 'https://example.com/avatar.png' },
    [manager]: { toggleLike: async () => true, submitComment: async (...args) => { submissions.push(args); return true; } },
  });
  const container = document.getElementById('comments');
  exports.renderComments([{
    id: 'root', name: '<img src=x onerror=alert(1)>', content: '<script>bad()</script>', likes: [],
    children: [{ id: 'child', content: 'Reply', likes: [], children: [] }],
  }], 4, container, () => {}, null, '_notes/example.md');
  assert.equal(container.querySelector('strong').textContent, '<img src=x onerror=alert(1)>');
  assert.equal(container.querySelectorAll('script').length, 0);
  assert.equal(container.querySelectorAll('[onerror]').length, 0);
  const child = container.querySelector('[data-comment-id="child"]');
  const form = child.querySelector('form');
  form.querySelector('textarea').value = 'Nested reply';
  form.dispatchEvent(new document.defaultView.Event('submit', { cancelable: true }));
  await flush();
  assert.deepEqual(submissions[0], ['_notes/example.md', 4, 'Nested reply', 'child']);
});

test('failed replies keep their draft and re-enable submission', async () => {
  const { exports, document } = await loadBrowserModule('assets/js/comment-renderer.js', '<div id="comments"></div>', {
    [init]: { auth: { currentUser: null }, safeAvatar: () => 'https://example.com/avatar.png' },
    [manager]: { toggleLike: async () => false, submitComment: async () => false },
  });
  const container = document.getElementById('comments');
  exports.renderComments([{ id: 'root', content: 'Text', children: [] }], 0, container, () => {}, null, '_notes/test.md');
  const form = container.querySelector('form');
  const textarea = form.querySelector('textarea');
  textarea.value = 'Unsaved draft';
  form.hidden = false;
  form.dispatchEvent(new document.defaultView.Event('submit', { cancelable: true }));
  await flush();
  assert.equal(textarea.value, 'Unsaved draft');
  assert.equal(form.hidden, false);
  assert.equal(form.querySelector('button').disabled, false);
});

test('comment submission reports failure for signed-out users and failed writes', async () => {
  const auth = { currentUser: null };
  let writes = 0;
  const firestore = Object.fromEntries(['collection', 'query', 'where', 'updateDoc', 'doc', 'arrayUnion', 'arrayRemove', 'onSnapshot', 'serverTimestamp'].map((name) => [name, () => {}]));
  firestore.addDoc = async () => { writes++; throw new Error('offline'); };
  const { exports } = await loadBrowserModule('assets/js/comment-manager.js', '', {
    [init]: { auth, db: {}, DEFAULT_AVATAR: 'https://example.com/avatar.png' },
    'firebase/firestore': firestore,
  }, { console: { warn() {} } });
  assert.equal(await exports.submitComment('_notes/test.md', 0, 'Draft'), false);
  assert.equal(writes, 0);
  auth.currentUser = { uid: 'user-1' };
  assert.equal(await exports.submitComment('_notes/test.md', 0, 'Draft'), false);
  assert.equal(writes, 1);
});
