import React, { useState, useEffect } from 'react';
import Layout from '../components/ui/Layout';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { instance } from '../api/axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const response = await instance.get('/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <Layout>
      <Header>
        <div className="vk-header__content">
          <h1 className="vk-header__title">Профиль</h1>
          <Button variant="secondary" size="small" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </Header>
      <div className="vk-profile__container">
        <Sidebar>
          <nav className="vk-sidebar__nav">
            <a href="/profile" className="vk-sidebar__link vk-sidebar__link--active">Моя страница</a>
            <a href="/feed" className="vk-sidebar__link">Новости</a>
            <a href="/messages" className="vk-sidebar__link">Сообщения</a>
          </nav>
        </Sidebar>
        <main className="vk-profile__main">
          <Card className="vk-profile__info">
            <div className="vk-profile__header">
              <Avatar src={user.avatar || 'https://via.placeholder.com/150'} size="large" />
              <div className="vk-profile__details">
                <h2 className="vk-profile__name">{user.firstName} {user.lastName}</h2>
                <div className="vk-profile__status">Онлайн</div>
              </div>
            </div>
            <Button variant="secondary" size="medium">Редактировать профиль</Button>
          </Card>
          <Card>
            <h3 className="vk-profile__section-title">Обо мне</h3>
            <p className="vk-profile__section-content">Здесь информация о пользователе.</p>
          </Card>
        </main>
      </div>
    </Layout>
  );
};

export default Profile;
