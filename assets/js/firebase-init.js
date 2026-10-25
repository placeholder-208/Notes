import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithPopup, GithubAuthProvider, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const DEFAULT_AVATAR = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
export let auth;
export let db;

export function safeAvatar(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : DEFAULT_AVATAR;
  } catch { return DEFAULT_AVATAR; }
}

export function initializeFirebase(config) {
  const app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
}

export function observeAuth(onChange) {
  const status = document.getElementById('user-status');
  status.textContent = '加载中…';
  return onAuthStateChanged(auth, (user) => {
    const avatar = document.createElement('img');
    avatar.src = safeAvatar(user?.photoURL);
    avatar.alt = user ? '用户头像' : 'GitHub';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = user ? '退出登录' : '登录';
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        if (auth.currentUser) await signOut(auth);
        else await signInWithPopup(auth, new GithubAuthProvider());
      } catch (error) { alert(`登录操作失败：${error.message}`); }
      finally { button.disabled = false; }
    });
    status.replaceChildren(avatar);
    if (user) {
      const name = document.createElement('span');
      name.textContent = user.displayName || 'GitHub用户';
      status.append(name, button);
    } else {
      const register = document.createElement('a');
      register.href = 'https://github.com/join';
      register.target = '_blank';
      register.rel = 'noopener noreferrer';
      register.textContent = '注册';
      status.append(button, register);
    }
    document.querySelectorAll('.comment-avatar').forEach((image) => { image.src = safeAvatar(user?.photoURL); });
    onChange(user);
  }, (error) => {
    status.textContent = '登录暂不可用';
    console.warn('登录状态读取失败：', error);
  });
}
