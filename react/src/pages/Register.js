import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Layout from '../components/ui/Layout';
import { instance } from '../api/axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.post('/api/register', formData);
      alert('Регистрация успешна!');
      window.location.href = '/login';
    } catch (error) {
      alert('Ошибка при регистрации');
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="vk-register">
        <Card>
          <h2>Регистрация</h2>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Имя"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="Фамилия"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
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
            <Input
              placeholder="Подтвердите пароль"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="primary" fullWidth>
              Зарегистрироваться
            </Button>
          </form>
          <div className="vk-register__login">
            Уже есть аккаунт? <a href="/login">Войти</a>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
