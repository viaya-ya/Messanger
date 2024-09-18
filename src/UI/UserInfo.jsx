// src/components/UserInfo.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import useVKAuth from './useVKAuth';

const UserInfo = () => {
  const { checkAuth, getMe } = useVKAuth();

  React.useEffect(() => {
    checkAuth();
  }, []);

  const user = useSelector((state) => state.auth.token ? state.auth.token : null);

  if (!user) {
    return <div>Пожалуйста, авторизируйтесь</div>;
  }

  return (
    <div>
      <img src={user.photo} alt="Профиль пользователя" />
      <p>Имя: {user.first_name}</p>
      <p>Фамилия: {user.last_name}</p>
    </div>
  );
};

export default UserInfo;
