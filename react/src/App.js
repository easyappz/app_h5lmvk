import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Messages from './pages/Messages';
import './App.css';

// Создаем QueryClient для React Query
const queryClient = new QueryClient();

// Простой роутинг без React Router, так как он не установлен
function App() {
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

  // Подписываемся на изменения пути в браузере
  React.useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Функция для навигации
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Определяем, какую страницу рендерить
  const renderPage = () => {
    switch (currentPath) {
      case '/register':
        return <Register />;
      case '/login':
        return <Login />;
      case '/profile':
        return <Profile />;
      case '/feed':
        return <Feed />;
      case '/messages':
        return <Messages />;
      default:
        return <Login />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {renderPage()}
      </div>
    </QueryClientProvider>
  );
}

export default App;
