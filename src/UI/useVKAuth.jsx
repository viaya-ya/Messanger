// src/hooks/useVKAuth.jsx
import { useSelector } from 'react-redux';
import vkApi from './Bll/vkApi.js';

const useVKAuth = () => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  const checkAuth = async () => {
    if (!isAuthenticated) {
      throw new Error('Пользователь не авторизован');
    }
    return token;
  };

  const getMe = async () => {
    try {
      const response = await vkApi.get('users.get', { fields: 'photo_id' });
      return response.data.response[0];
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      throw error;
    }
  };

  return { checkAuth, getMe };
};

export default useVKAuth;
