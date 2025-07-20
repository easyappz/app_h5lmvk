import React from 'react';
import './Avatar.css';

const Avatar = ({ src, alt = 'Avatar', size = 'medium' }) => {
  return (
    <div className={`vk-avatar vk-avatar--${size}`}>
      <img src={src} alt={alt} className="vk-avatar__img" />
    </div>
  );
};

export default Avatar;
