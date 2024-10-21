import React, { useState, useEffect } from "react";
import classes from "./Content.module.css"; // Ваши стили
import { QRCode } from "antd";
import telegram from "../../../image/telegram.svg"; // Путь к иконке Telegram
import vk from "../../../image/vk.svg"; // Путь к иконке VK
import { io } from 'socket.io-client';

// Подключение к серверу
const socket = io("http://localhost:80/");

export default function Content() {
  const [serverResponse, setServerResponse] = useState("");
  const [authStatus, setAuthStatus] = useState("");

  // useEffect(() => {
  //   // Получаем информацию о User-Agent
  //   const userAgent = navigator.userAgent;

  //   // Отправляем информацию о User-Agent на сервер
  //   socket.emit("requestInfo", { userAgent });

  //   // Подписываемся на событие 'responseFromClient' для получения ответа от сервера
  //   socket.on("responseFromClient", (data) => {
  //     console.log("Ответ от сервера:", data);
  //     setServerResponse(data.message); // Сохраняем сообщение в состоянии
  //   });

  //   socket.on("receiveAuthInfo", (data) => {
  //     console.log("Ответ от сервера:", data);
  //     setAuthStatus(data.message); // Сохраняем сообщение в состоянии
  //   });
  //   // Очищаем подписки на события при размонтировании компонента
  //   return () => {
  //     socket.off("responseFromClient");
  //     socket.off("receiveAuthInfo");
  //   };
  // }, []);

  return (
    <div className={classes.body}>
      <span className={classes.text}>Для входа отсканируйте QR-код</span>
      <div className={classes.QR}>
        <div className={classes.telegram}>
          <QRCode errorLevel="H" value="https://your-backend-url/auth/telegram" icon={telegram} />
          <a href="https://your-backend-url/auth/telegram" className={classes.link}>Или перейдите по ссылке</a>
        </div>
        <div className={classes.vk}>
          <QRCode errorLevel="H" value="https://your-backend-url/auth/vk" icon={vk} />
          <a href="https://your-backend-url/auth/vk" className={classes.link}>Или перейдите по ссылке</a>
        </div>
      </div>
    </div>
  );
}
