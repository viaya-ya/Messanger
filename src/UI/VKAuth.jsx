// // src/components/VKAuth.jsx
// import React, { useState, useEffect } from 'react';
// import { VK } from 'react-vk';

// const VKAuth = () => {
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [isVKInitialized, setIsVKInitialized] = useState(false);

//   useEffect(() => {
//     // Проверяем, существует ли VK и инициализируем его
//     if (!window.VK || !window.VK.init) {
//       console.warn('VK не найден или не инициализирован. Попробуйте перезапустить страницу.');
//       return;
//     }

//     window.VK.init({
//       apiId: 'YOUR_API_ID',
//       scope: ['friends', 'photos']
//     }).then(() => {
//       console.log('VK инициализирован успешно');
//       setIsVKInitialized(true);
//     }).catch((error) => {
//       console.error('Ошибка при инициализации VK:', error);
//     });
//   }, []);

//   useEffect(() => {
//     if (isVKInitialized && !isAuthorized) {
//       handleVKAuth();
//     }
//   }, [isVKInitialized, isAuthorized]);

//   const handleVKAuth = async () => {
//     try {
//       if (!VK.auth) {
//         throw new Error('VK.auth недоступен');
//       }
      
//       await VK.auth.login({
//         redirect_uri: `${window.location.origin}/auth`,
//       });
      
//       console.log('vkToken', VK.getAccessToken());
//       localStorage.setItem('vkToken', VK.getAccessToken());
//       setIsAuthorized(true);
//     } catch (error) {
//       console.error('Ошибка авторизации:', error);
//     }
//   };

//   return (
//     <div>
//       {!isAuthorized ? (
//         <button onClick={handleVKAuth} disabled={!isVKInitialized}>
//           Авторизация через ВКонтакте
//         </button>
//       ) : (
//         <p>Вы успешно авторизованы!</p>
//       )}
//     </div>
//   );
// };

// export default VKAuth;
// VKAuth.js
// VKAuth.jsx
// VkAuth.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoaded, setProcessing, setLoggedIn, setLoggedOut } from '../BLL/authSlice';
import PropTypes from 'prop-types';

function VKAuth({ disabled, callback, apiId, containerStyle }) {
  const dispatch = useDispatch();
  const { isLoaded, isProcessing, isLoggedIn, userId } = useSelector(state => state.auth);

  useEffect(() => {
    const proxyUrl = 'http://localhost:3001/api/vk/auth';
    
    window.vkAsyncInit = () => {
      window.VK.init({ apiId });
      dispatch(setLoaded(true));
    };

    const el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = 'https://vk.com/js/api/openapi.js?';
    el.async = true;
    el.id = 'vk-sdk';
    document.head.appendChild(el);
    const handleLogin = async () => {
      if (!isLoaded || isProcessing || disabled) {
        return;
      }

      dispatch(setProcessing(true));

      try {
        const response = await window.VK.Auth.login();
        
        if (response && response.user_id !== undefined) {
          dispatch(setLoggedIn(response.user_id));
          callback && callback(response);
        } else {
          console.error('Отсутствует идентификатор пользователя в ответе');
        }
      } catch (error) {
        console.error('Ошибка авторизации:', error);
      } finally {
        dispatch(setProcessing(false));
      }
    };

    fetch(proxyUrl, {
      method: 'POST',
      body: JSON.stringify({
        action: 'login'
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Здесь должна быть логика обработки ответа от VK API через прокси-сервер
      handleLogin();
    })
    .catch(error => console.error('Ошибка:', error));
  }, [dispatch]);

  return (
    <span style={containerStyle}>
      <button
        onClick={() => {}}
        disabled={disabled}
      >
        {isLoggedIn ? 'Вы уже авторизованы' : 'Авторизация'}
      </button>
    </span>
  );
}

VKAuth.propTypes = {
  disabled: PropTypes.bool,
  callback: PropTypes.func,
  apiId: PropTypes.string.isRequired,
  containerStyle: PropTypes.object,
};

export default VKAuth;

