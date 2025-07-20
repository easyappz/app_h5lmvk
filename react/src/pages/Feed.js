import React, { useState, useEffect } from 'react';
import Layout from '../components/ui/Layout';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import Post from '../components/ui/Post';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { instance } from '../api/axios';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const response = await instance.get('/api/posts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Layout>
      <Header>
        <div className="vk-header__content">
          <h1 className="vk-header__title">Новости</h1>
          <Button variant="secondary" size="small" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </Header>
      <div className="vk-feed__container">
        <Sidebar>
          <nav className="vk-sidebar__nav">
            <a href="/profile" className="vk-sidebar__link">Моя страница</a>
            <a href="/feed" className="vk-sidebar__link vk-sidebar__link--active">Новости</a>
            <a href="/messages" className="vk-sidebar__link">Сообщения</a>
          </nav>
        </Sidebar>
        <main className="vk-feed__main">
          <Card>
            <textarea
              className="vk-feed__new-post"
              placeholder="Что у вас нового?"
            ></textarea>
            <Button variant="primary" size="small">Опубликовать</Button>
          </Card>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post.id}
                author={`${post.author.firstName} ${post.author.lastName}`}
                avatar={post.author.avatar || 'https://via.placeholder.com/150'}
                content={post.content}
                timestamp={new Date(post.createdAt).toLocaleString('ru')}
              />
            ))
          ) : (
            <Card>
              <p className="vk-feed__no-posts">Новостей пока нет.</p>
            </Card>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Feed;
