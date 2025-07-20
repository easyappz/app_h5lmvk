import React from 'react';
import Button from './Button';
import './ErrorMessage.css';

const ErrorMessage = ({ message, errorDetails, onRetry }) => {
  return (
    <div className="vk-error__container">
      <h3 className="vk-error__title">Ошибка</h3>
      <p className="vk-error__message">{message}</p>
      {errorDetails && (
        <p className="vk-error__details">Детали: {errorDetails}</p>
      )}
      {onRetry && (
        <Button variant="primary" size="small" onClick={onRetry}>
          Попробовать снова
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
