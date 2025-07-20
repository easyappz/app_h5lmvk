import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', size = 'medium', onClick, disabled, fullWidth = false }) => {
  return (
    <button
      className={`vk-button vk-button--${variant} vk-button--${size} ${fullWidth ? 'vk-button--full-width' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
