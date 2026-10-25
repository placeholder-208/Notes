import { auth, db, DEFAULT_AVATAR } from './firebase-init.js';
import {
  collection, query, where, addDoc, updateDoc, doc,
  arrayUnion, arrayRemove, onSnapshot, serverTimestamp,
} from 'firebase/firestore';

export function loadComments(noteId, chapterIndex, callback, onError) {
  const commentsQuery = query(
    collection(db, 'comments'),
    where('noteId', '==', noteId),
    where('chapterId', '==', String(chapterIndex)),
  );
  return onSnapshot(commentsQuery, (snapshot) => {
    const comments = new Map();
    snapshot.forEach((entry) => {
      const data = entry.data();
      comments.set(entry.id, { ...data, id: entry.id, children: [], likes: Array.isArray(data.likes) ? data.likes : [] });
    });
    const roots = [];
    for (const comment of comments.values()) {
      if (!comment.parentId) roots.push(comment);
      else {
        const parent = comments.get(comment.parentId);
        if (parent && parent !== comment) parent.children.push(comment);
      }
    }
    // Iterative linking avoids recursion over malformed or cyclic data.
    const byTime = (a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0) || a.id.localeCompare(b.id);
    roots.sort(byTime);
    for (const comment of comments.values()) {
      comment.children.sort((a, b) => b.likes.length - a.likes.length || byTime(a, b));
    }
    callback(roots);
  }, (error) => {
    console.warn('评论监听失败：', error);
    onError?.(error);
  });
}

export async function submitComment(noteId, chapterIndex, content, parentId = null) {
  const user = auth.currentUser;
  if (!user) { alert('请先登录'); return false; }
  const text = content.trim();
  if (!text || text.length > 5000) { alert('评论内容须为 1–5000 字'); return false; }
  if (!noteId) { alert('无法确定当前笔记，请刷新后重试'); return false; }
  try {
    await addDoc(collection(db, 'comments'), {
      noteId,
      chapterId: String(chapterIndex),
      parentId,
      uid: user.uid,
      name: user.displayName || 'GitHub用户',
      avatar: user.photoURL || DEFAULT_AVATAR,
      content: text,
      timestamp: serverTimestamp(),
      likes: [],
      likeCount: 0,
    });
    return true;
  } catch (error) {
    console.warn('发布评论失败：', error);
    alert('发布失败，请重试');
    return false;
  }
}

export async function toggleLike(commentId, currentLikes = []) {
  const uid = auth.currentUser?.uid;
  if (!uid) { alert('请先登录'); return false; }
  try {
    await updateDoc(doc(db, 'comments', commentId), {
      likes: currentLikes.includes(uid) ? arrayRemove(uid) : arrayUnion(uid),
    });
    return true;
  } catch (error) {
    console.warn('点赞失败：', error);
    alert('操作失败，请重试');
    return false;
  }
}
