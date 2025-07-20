import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Layout from '../components/ui/Layout';
import { instance } from '../api/axios';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post('/api/login', formData);
      localStorage.setItem('token', response.data.token);
      alert('Вход успешен!');
      window.location.href = '/profile';
    } catch (error) {
      alert('Ошибка при входе');
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="vk-login">
        <Card>
          <h2>Вход</h2>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Электронная почта"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="Пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="primary" fullWidth>
              Войти
            </Button>
          </form>
          <div className="vk-login__register">
            Нет аккаунта? <a href="/register">Зарегистрироваться</a>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
