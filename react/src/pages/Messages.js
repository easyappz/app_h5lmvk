import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instance } from '../api/axios';
import '../styles/Messages.css';

// Fetch list of chats
const fetchChats = async () => {
  const response = await instance.get('/api/messages/chats');
  return response.data;
};

// Fetch messages for a specific chat
const fetchMessages = async (userId) => {
  const response = await instance.get(`/api/messages?userId=${userId}`);
  return response.data;
};

// Send a message
const sendMessage = async ({ receiverId, text }) => {
  const response = await instance.post('/api/messages', { receiverId, text });
  return response.data;
};

// Mark messages as read
const markMessagesAsRead = async (userId) => {
  const response = await instance.put(`/api/messages/read/${userId}`);
  return response.data;
};

function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch chats list
  const { data: chats = [], isLoading: chatsLoading, error: chatsError } = useQuery(
    ['chats'],
    fetchChats,
    { staleTime: 60000 }
  );

  // Fetch messages for selected chat
  const { data: messages = [], isLoading: messagesLoading, error: messagesError } = useQuery(
    ['messages', selectedChat?._id],
    () => fetchMessages(selectedChat?._id),
    { enabled: !!selectedChat, staleTime: 60000 }
  );

  // Mutation for sending messages
  const sendMessageMutation = useMutation(sendMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', selectedChat?._id]);
      queryClient.invalidateQueries(['chats']);
      setMessageText('');
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
    },
  });

  // Mutation for marking messages as read
  const markAsReadMutation = useMutation(markMessagesAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries(['chats']);
    },
  });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when chat is selected
  useEffect(() => {
    if (selectedChat) {
      markAsReadMutation.mutate(selectedChat._id);
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (messageText.trim() && selectedChat) {
      sendMessageMutation.mutate({ receiverId: selectedChat._id, text: messageText });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (chatsLoading) return <div className="loading">Загрузка чатов...</div>;
  if (chatsError) return <div className="error">Ошибка загрузки чатов: {chatsError.message}</div>;

  return (
    <div className="messages-container">
      <div className="sidebar">
        <h2>Чаты</h2>
        {chats.length === 0 ? (
          <p className="no-chats">Нет активных чатов</p>
        ) : (
          <ul className="chat-list">
            {chats.map((chat) => (
              <li
                key={chat.user._id}
                className={`chat-item ${selectedChat?._id === chat.user._id ? 'active' : ''}`}
                onClick={() => setSelectedChat(chat.user)}
              >
                <div className="avatar">
                  {chat.user.avatar ? (
                    <img src={chat.user.avatar} alt={chat.user.name} />
                  ) : (
                    <div className="default-avatar">{chat.user.name.charAt(0)}</div>
                  )}
                </div>
                <div className="chat-info">
                  <h3>{chat.user.name}</h3>
                  <p>{chat.lastMessage?.text || 'Нет сообщений'}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="unread-badge">{chat.unreadCount}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="chat-area">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <h2>{selectedChat.name}</h2>
            </div>
            <div className="messages-list">
              {messagesLoading ? (
                <div className="loading">Загрузка сообщений...</div>
              ) : messagesError ? (
                <div className="error">Ошибка загрузки сообщений: {messagesError.message}</div>
              ) : messages.length === 0 ? (
                <p className="no-messages">Нет сообщений</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`message ${msg.sender._id === selectedChat._id ? 'received' : 'sent'}`}
                  >
                    <div className="message-content">
                      <p>{msg.text}</p>
                      <span className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="message-input">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите сообщение..."
              />
              <button onClick={handleSendMessage} disabled={sendMessageMutation.isLoading}>
                {sendMessageMutation.isLoading ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Выберите чат, чтобы начать общение</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
