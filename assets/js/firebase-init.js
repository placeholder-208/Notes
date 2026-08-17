import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPopup, GithubAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrBchiaoec595ZH5o10o1KwK4YdNX6PNc",
  authDomain: "placeholder-208-notes.firebaseapp.com",
  projectId: "placeholder-208-notes",
  storageBucket: "placeholder-208-notes.firebasestorage.app",
  messagingSenderId: "290710396926",
  appId: "1:290710396926:web:728d47683016450f6aeaaf",
  measurementId: "G-GGKW7VSX0B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 监听登录状态，更新顶部栏
const userStatusDiv = document.getElementById('user-status');
onAuthStateChanged(auth, (user) => {
  if (user) {
    userStatusDiv.innerHTML = `
      <img src="${user.photoURL || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}" 
           alt="avatar">
      <span>${user.displayName || user.email}</span>
      <button id="sign-out-btn">退出登录</button>
    `;
    document.getElementById('sign-out-btn').addEventListener('click', () => signOut(auth));
    
    // 更新所有评论头像
    const avatarSrc = user ? (user.photoURL || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png') 
                          : 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
    document.querySelectorAll('.comment-avatar').forEach(img => {
      img.src = avatarSrc;
    });
  } else {
    userStatusDiv.innerHTML = `
      <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
            alt="default avatar">
      <button id="sign-in-btn">登录</button>
      <a href="https://github.com/join" target="_blank">注册</a>
    `;
    document.getElementById('sign-in-btn').addEventListener('click', () => {
      const provider = new GithubAuthProvider();
      signInWithPopup(auth, provider).catch((error) => alert('登录失败：' + error.message));
    });
  }
});

export { auth, db };