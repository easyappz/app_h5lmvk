import React from 'react';
import './Loader.css';

const Loader = ({ message = 'Загрузка...' }) => {
  return (
    <div className="vk-loader__container">
      <div className="vk-loader"></div>
      <p className="vk-loader__message">{message}</p>
    </div>
  );
};

export default Loader;
