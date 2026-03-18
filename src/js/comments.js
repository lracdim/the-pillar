import { databases, DB_ID, COL_COMMENTS } from './appwrite.js';
import { Query } from "https://cdn.jsdelivr.net/npm/appwrite@16/dist/esm/sdk.js";
import { getSession } from './auth.js';

let currentSlug = '';
let currentLang = '';

export async function loadComments(episodeSlug, language) {
  currentSlug = episodeSlug;
  currentLang = language;
  
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;
  
  try {
    const result = await databases.listDocuments(DB_ID, COL_COMMENTS, [
      Query.equal('episodeSlug', episodeSlug),
      Query.equal('language', language),
      Query.orderDesc('$createdAt'),
      Query.limit(50)
    ]);
    
    renderComments(result.documents);
  } catch (err) {
    console.warn('Failed to load comments:', err.message);
    commentsList.innerHTML = '<div class="comments-empty">Failed to load comments</div>';
  }
}

export function renderComments(comments) {
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;
  
  const lang = document.body.dataset.lang || 'ko';
  const isKo = lang === 'ko';
  
  const translations = {
    ko: { empty: '아직 댓글이 없습니다. 첫 번째 독자가 되어 주세요.' },
    en: { empty: 'No comments yet. Be the first reader.' },
    tl: { empty: 'Wala pang komento. Maging unang mambabasa na magkomento.' }
  };
  
  if (!comments || comments.length === 0) {
    const emptyMsg = translations[lang] ? translations[lang].empty : translations['en'].empty;
    commentsList.innerHTML = `<div class="comments-empty">${emptyMsg}</div>`;
    return;
  }
  
  commentsList.innerHTML = comments.map(comment => {
    const date = new Date(comment.$createdAt);
    const timeStr = date.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    
    return `
      <div class="comment-item">
        <div class="comment-user">${escapeHtml(comment.userName)}</div>
        <div class="comment-body">${escapeHtml(comment.body)}</div>
        <div class="comment-time">${timeStr}</div>
      </div>
    `;
  }).join('');
}

export async function postComment(episodeSlug, language, userId, userName, body) {
  if (body.length < 3 || body.length > 500) {
    throw new Error("Comment must be between 3 and 500 characters.");
  }
  
  return await databases.createDocument(DB_ID, COL_COMMENTS, 'unique()', {
    episodeSlug,
    language,
    userId,
    userName,
    body: body.trim()
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function setupCommentForm() {
  const commentForm = document.getElementById('comment-form');
  if (!commentForm) return;
  
  const commentInput = document.getElementById('comment-input');
  
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const session = await getSession();
    if (!session) return;
    
    const body = commentInput.value.trim();
    if (body.length < 3 || body.length > 500) return;
    
    const submitBtn = commentForm.querySelector('.comment-post-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '...';
    
    try {
      await postComment(currentSlug, currentLang, session.$id, session.name, body);
      commentInput.value = '';
      await loadComments(currentSlug, currentLang);
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert(err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.originalText || 'Post';
    }
  });
  
  const submitBtn = commentForm.querySelector('.comment-post-btn');
  submitBtn.dataset.originalText = submitBtn.textContent;
}

export async function updateCommentUIAuth() {
  const session = await getSession();
  const signedOutPrompt = document.getElementById('comments-form-signed-out');
  const commentForm = document.getElementById('comment-form');
  
  if (session) {
    if (signedOutPrompt) signedOutPrompt.classList.add('hidden');
    if (commentForm) commentForm.classList.remove('hidden');
  } else {
    if (signedOutPrompt) signedOutPrompt.classList.remove('hidden');
    if (commentForm) commentForm.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const slug = document.body.dataset.slug;
  const lang = document.body.dataset.lang;
  
  if (slug && slug.startsWith('ep')) {
    loadComments(slug, lang);
    setupCommentForm();
    updateCommentUIAuth();
  }
});
