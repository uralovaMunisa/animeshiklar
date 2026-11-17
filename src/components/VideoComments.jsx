// ANIMESHIKLAR OLAMI — VIDEO & MEDIA COMMENT TIZIMI
// Fikr bildirish, javob qaytarish (reply), o'chirish va like qo'yish

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Heart,
  Trash2,
  CornerDownRight,
  Sparkles,
  Clock,
  User,
  X
} from 'lucide-react';
import { fetchComments, postComment, deleteComment, likeComment } from '../services/apiService';
import { getUserProfile } from '../services/storageService';

export default function VideoComments({ targetId, targetTitle = 'Video' }) {
  const [comments, setComments] = useState([]);
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // comment object
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState(new Set());
  const currentUser = getUserProfile();

  useEffect(() => {
    loadComments();
  }, [targetId]);

  const loadComments = async () => {
    const list = await fetchComments(targetId || 'all');
    setComments(list);
  };

  const handleSendComment = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    setIsSubmitting(true);
    try {
      const newCmt = await postComment({
        targetId: targetId || 'all',
        text: inputText,
        author: currentUser.name || 'Otaku Master',
        username: currentUser.username || '@animeshik_uz',
        avatar: currentUser.avatar
      });

      if (newCmt) {
        setComments((prev) => [newCmt, ...prev]);
        setInputText('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async (parentComment) => {
    if (!replyText.trim()) return;

    const newReply = await postComment({
      targetId: targetId || 'all',
      text: replyText,
      author: currentUser.name || 'Otaku Master',
      username: currentUser.username || '@animeshik_uz',
      avatar: currentUser.avatar,
      parentId: parentComment.id
    });

    if (newReply) {
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === parentComment.id) {
            return {
              ...c,
              replies: [...(c.replies || []), newReply]
            };
          }
          return c;
        })
      );
      setReplyingTo(null);
      setReplyText('');
    }
  };

  const handleDelete = async (commentId) => {
    await deleteComment(commentId, targetId || 'all');
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleLike = (commentId) => {
    likeComment(commentId);
    setLikedComments((prev) => {
      const next = new Set(prev);
      next.add(commentId);
      return next;
    });
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return { ...c, likes: (c.likes || 0) + 1 };
        }
        return c;
      })
    );
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'Hozirgina';
    try {
      const diffMin = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
      if (diffMin < 1) return 'Hozirgina';
      if (diffMin < 60) return `${diffMin} daqiqa oldin`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour} soat oldin`;
      return new Date(isoString).toLocaleDateString();
    } catch (e) {
      return 'Yaqinda';
    }
  };

  return (
    <div className="comments-system-container">
      {/* 1. Header */}
      <div className="comments-header-line">
        <div className="comments-title-wrap">
          <MessageSquare size={18} color="#ff3366" />
          <h3>Fikrlar ({comments.length})</h3>
        </div>
        <span className="comments-subtitle">"{targetTitle.slice(0, 32)}..." bo'yicha fikringizni yozing</span>
      </div>

      {/* 2. Yangi comment kiritish formasi */}
      <form className="comment-create-form" onSubmit={handleSendComment}>
        <img src={currentUser.avatar} alt="User Avatar" className="comment-my-avatar" />
        <div className="comment-input-wrap">
          <textarea
            rows="2"
            className="comment-textarea"
            placeholder="Anime haqida o'z fikringiz yoki taassurotingizni qoldiring..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="comment-submit-bar">
            <span className="comment-hint-text">Enter orqali yuboring</span>
            <button
              type="submit"
              className="btn-send-comment"
              disabled={!inputText.trim() || isSubmitting}
            >
              <Send size={15} />
              <span>Yuborish</span>
            </button>
          </div>
        </div>
      </form>

      {/* 3. Commentlar ro'yxati */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="empty-comments-state">
            <Sparkles size={28} color="#64748b" />
            <p>Hozircha hech kim fikr bildirmadi. Birinchi bo'lib o'z fikringizni qoldiring!</p>
          </div>
        ) : (
          comments.map((item) => (
            <div key={item.id} className="comment-card-box">
              <div className="comment-card-body">
                <img src={item.avatar} alt={item.author} className="commenter-avatar" />
                <div className="comment-content-meta">
                  <div className="comment-author-row">
                    <span className="commenter-name">{item.author}</span>
                    <span className="commenter-username">{item.username}</span>
                    <span className="comment-time-pill">
                      <Clock size={11} /> {formatTime(item.createdAt)}
                    </span>
                  </div>

                  <p className="comment-text-body">{item.text}</p>

                  {/* Amallar: Like, Reply, Delete */}
                  <div className="comment-action-buttons">
                    <button
                      className={`btn-comment-action ${likedComments.has(item.id) ? 'liked' : ''}`}
                      onClick={() => handleLike(item.id)}
                    >
                      <Heart
                        size={14}
                        fill={likedComments.has(item.id) ? '#ff3366' : 'none'}
                        color={likedComments.has(item.id) ? '#ff3366' : '#94a3b8'}
                      />
                      <span>{item.likes || 0}</span>
                    </button>

                    <button
                      className="btn-comment-action"
                      onClick={() => setReplyingTo(replyingTo?.id === item.id ? null : item)}
                    >
                      <CornerDownRight size={14} />
                      <span>Javob qaytarish</span>
                    </button>

                    <button
                      className="btn-comment-action delete"
                      onClick={() => handleDelete(item.id)}
                      title="O'chirish"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Javob qaytarish (Reply) formasi */}
                  {replyingTo?.id === item.id && (
                    <div className="comment-reply-form">
                      <div className="reply-target-tag">
                        <span>@{item.author}'ga javob yozilmoqda</span>
                        <button className="reply-close-btn" onClick={() => setReplyingTo(null)}>
                          <X size={12} />
                        </button>
                      </div>
                      <div className="reply-input-row">
                        <input
                          type="text"
                          className="reply-input"
                          placeholder="Javobingizni yozing..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendReply(item);
                          }}
                        />
                        <button
                          className="btn-submit-reply"
                          onClick={() => handleSendReply(item)}
                          disabled={!replyText.trim()}
                        >
                          <Send size={13} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replylar (Javoblar ro'yxati) */}
                  {item.replies && item.replies.length > 0 && (
                    <div className="comment-replies-list">
                      {item.replies.map((rep) => (
                        <div key={rep.id} className="reply-card">
                          <img src={rep.avatar} alt={rep.author} className="reply-avatar" />
                          <div className="reply-meta">
                            <div className="reply-author-line">
                              <span className="reply-name">{rep.author}</span>
                              <span className="reply-username">{rep.username}</span>
                              <span className="reply-time">{formatTime(rep.createdAt)}</span>
                            </div>
                            <p className="reply-text">{rep.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

