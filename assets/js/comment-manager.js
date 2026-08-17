import { db } from './firebase-init.js';
import { 
  collection, query, where, getDocs, addDoc, updateDoc, doc, 
  arrayUnion, arrayRemove, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 获取当前用户 uid
function getCurrentUid() {
  const auth = getAuth();
  return auth.currentUser ? auth.currentUser.uid : null;
}

/**
 * 加载评论（实时监听）
 * @param {string|number} chapterIndex - 章节标识
 * @param {Function} callback - 回调函数，接收根评论数组
 * @returns {Function} 取消订阅函数
 */
export function loadComments(chapterIndex, callback) {
  const q = query(
    collection(db, 'comments'),
    where('chapterId', '==', String(chapterIndex))
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const allComments = [];
    snapshot.forEach(doc => {
      allComments.push({ id: doc.id, ...doc.data() });
    });
    // 构建树形结构
    const rootComments = allComments.filter(c => !c.parentId);
    const commentMap = {};
    allComments.forEach(c => { commentMap[c.id] = c; });
    // 为每个评论附加 children
    rootComments.forEach(root => {
      root.children = buildChildren(root.id, commentMap);
      // 按点赞数排序子评论（点赞数高优先，同赞按时间早）
      root.children.sort((a, b) => {
        const aLikes = (a.likes || []).length;
        const bLikes = (b.likes || []).length;
        if (aLikes !== bLikes) return bLikes - aLikes;
        return (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0);
      });
    });
    callback(rootComments);
  }, (error) => {
    console.error('评论监听失败:', error);
  });
  return unsubscribe;
}

function buildChildren(parentId, commentMap) {
  const children = [];
  for (let id in commentMap) {
    if (commentMap[id].parentId === parentId) {
      children.push(commentMap[id]);
    }
  }
  // 对每个子评论，继续构建其子评论（最多两层，但递归可支持任意深度，由前端限制）
  children.forEach(child => {
    child.children = buildChildren(child.id, commentMap);
  });
  return children;
}

/**
 * 发布评论（支持回复）
 * @param {string|number} chapterIndex
 * @param {string} content
 * @param {string|null} parentId
 */
export async function submitComment(chapterIndex, content, parentId = null) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    alert('请先登录');
    return;
  }
  if (!content.trim()) {
    alert('内容不能为空');
    return;
  }
  try {
    await addDoc(collection(db, 'comments'), {
      chapterId: String(chapterIndex),
      parentId: parentId,
      uid: user.uid,
      name: user.displayName || 'GitHub用户',
      avatar: user.photoURL || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
      content: content.trim(),
      timestamp: serverTimestamp(),
      likes: [],
      likeCount: 0
    });
    // 返回 parentId，以便上层知道哪个评论被回复
    return parentId;
  } catch (error) {
    console.error('发布评论失败:', error);
    alert('发布失败，请重试');
    return null;
  }
}

/**
 * 点赞/取消点赞
 * @param {string} commentId
 * @param {Array} currentLikes - 当前点赞用户 uid 列表
 */
export async function toggleLike(commentId, currentLikes) {
  const uid = getCurrentUid();
  if (!uid) {
    alert('请先登录');
    return;
  }
  const commentRef = doc(db, 'comments', commentId);
  const isLiked = currentLikes.includes(uid);
  try {
    if (isLiked) {
      await updateDoc(commentRef, {
        likes: arrayRemove(uid)
      });
    } else {
      await updateDoc(commentRef, {
        likes: arrayUnion(uid)
      });
    }
  } catch (error) {
    console.error('点赞操作失败:', error);
    alert('操作失败，请重试');
  }
}