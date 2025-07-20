import React from 'react';
import './Input.css';

const Input = ({ type = 'text', placeholder, value, onChange, name, required = false }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      className="vk-input"
    />
  );
};

export default Input;
