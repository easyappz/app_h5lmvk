import React from 'react';
import Avatar from './Avatar';
import './Post.css';

const Post = ({ author, avatar, content, timestamp }) => {
  return (
    <div className="vk-post">
      <div className="vk-post__header">
        <Avatar src={avatar} size="medium" />
        <div className="vk-post__info">
          <div className="vk-post__author">{author}</div>
          <div className="vk-post__timestamp">{timestamp}</div>
        </div>
      </div>
      <div className="vk-post__content">{content}</div>
      <div className="vk-post__actions">
        <button className="vk-post__action">Нравится</button>
        <button className="vk-post__action">Комментировать</button>
        <button className="vk-post__action">Поделиться</button>
      </div>
    </div>
  );
};

export default Post;
