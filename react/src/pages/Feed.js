import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/ui/Layout';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import Post from '../components/ui/Post';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';
import { instance } from '../api/axios';
import './Feed.css';

const fetchPosts = async (page) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  const response = await instance.get(`/api/posts?page=${page}&limit=10`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const Feed = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery(
    ['posts', page],
    () => fetchPosts(page),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleNextPage = () => {
    if (data?.pagination?.page < data?.pagination?.pages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  if (isError) {
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
            <ErrorMessage
              message="Не удалось загрузить новости. Попробуйте снова."
              errorDetails={error.message}
              onRetry={refetch}
            />
          </main>
        </div>
      </Layout>
    );
  }

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
          {isLoading ? (
            <Loader message="Загрузка новостей..." />
          ) : data?.posts?.length > 0 ? (
            <>
              {data.posts.map((post) => (
                <Post
                  key={post._id}
                  author={`${post.author.name}`}
                  avatar={post.author.avatar || 'https://via.placeholder.com/150'}
                  content={post.text}
                  timestamp={new Date(post.createdAt).toLocaleString('ru')}
                />
              ))}
              <div className="vk-feed__pagination">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                >
                  Предыдущая
                </Button>
                <span className="vk-feed__pagination-info">
                  Страница {data.pagination.page} из {data.pagination.pages}
                </span>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleNextPage}
                  disabled={data.pagination.page === data.pagination.pages}
                >
                  Следующая
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <p className="vk-feed__no-posts">Новостей пока нет.</p>
            </Card>
          )}
          {isFetching && !isLoading && (
            <Loader message="Обновление данных..." />
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Feed;
