import React, { useState, useEffect } from 'react';
import Layout from '../components/ui/Layout';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { instance } from '../api/axios';
import './Messages.css';

const Messages = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const response = await instance.get('/api/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConversations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Layout>
      <Header>
        <div className="vk-header__content">
          <h1 className="vk-header__title">Сообщения</h1>
          <Button variant="secondary" size="small" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </Header>
      <div className="vk-messages__container">
        <Sidebar>
          <nav className="vk-sidebar__nav">
            <a href="/profile" className="vk-sidebar__link">Моя страница</a>
            <a href="/feed" className="vk-sidebar__link">Новости</a>
            <a href="/messages" className="vk-sidebar__link vk-sidebar__link--active">Сообщения</a>
          </nav>
        </Sidebar>
        <main className="vk-messages__main">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <Card key={conv.id} className="vk-messages__conversation">
                <Avatar src={conv.user.avatar || 'https://via.placeholder.com/150'} size="medium" />
                <div className="vk-messages__info">
                  <div className="vk-messages__name">{conv.user.firstName} {conv.user.lastName}</div>
                  <div className="vk-messages__preview">{conv.lastMessage}</div>
                </div>
                <div className="vk-messages__time">{new Date(conv.updatedAt).toLocaleTimeString('ru')}</div>
              </Card>
            ))
          ) : (
            <Card>
              <p className="vk-messages__no-conversations">Сообщений пока нет.</p>
            </Card>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Messages;
