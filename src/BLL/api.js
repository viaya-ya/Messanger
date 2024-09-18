// api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/',
  headers: {
    'Content-Type': 'application/json',
 },
 withCredentials: true, // Добавляем свойство withCredentials
});

export default instance;
