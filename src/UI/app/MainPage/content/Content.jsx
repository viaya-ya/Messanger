import React, { useState, useEffect } from "react";
import classes from "./Content.module.css"; // Ваши стили
import { QRCode } from "antd";
import telegram from "../../../image/telegram.svg"; // Путь к иконке Telegram
import vk from "../../../image/vk.svg"; // Путь к иконке VK
import { io } from "socket.io-client";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const socket = io("http://localhost:80/auth"); // Подключение к сокету

export default function Content() {
  const [tokenForTG, setTokenForTG] = useState("");
  const [socketId, setSocketId] = useState("");
  const [ip, setIp] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const userAgent = navigator.userAgent; // Получение User-Agent

  useEffect(() => {
    
    // Получение IP-адреса
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        console.log("IP-адрес:", data.ip);
        setIp(data.ip);
      })
      .catch((error) => {
        console.error("Ошибка при получении IP-адреса:", error);
      });

    // Инициализация FingerprintJS
    const fpPromise = FingerprintJS.load();
    fpPromise
      .then((fp) => fp.get())
      .then((result) => {
        const visitorId = result.visitorId;
        console.log("Fingerprint ID:", visitorId);
        setFingerprint(visitorId); // Сохраняем Fingerprint
      })
      .catch((error) => {
        console.error("Ошибка при получении Fingerprint:", error);
      });

    // Запрос к серверу для получения токена
    fetch("http://localhost:5000/", {
      method: "GET",
      headers: {
        "User-Agent": userAgent, // Отправляем User-Agent в заголовке
      },
    })
      .then((response) => response.json()) // Обрабатываем ответ как JSON
      .then((data) => {
        console.log("Ответ от /", data);
        console.log("tokenForTG", data.tokenForTG);
        setTokenForTG(data.tokenForTG);
      })
      .catch((error) => {
        console.error("Ошибка при запросе /:", error);
      });

    // Подключение сокета и получение socketId
    socket.on("connect", () => {
      setSocketId(socket.id); // Сохраняем socket.id
      console.log("Подключение к сокету:", socket.id);
    });

    // Очистка при размонтировании компонента
    return () => {
      socket.off("connect");
      socket.off("requestInfo");
      socket.off("receiveAuthInfo");
      socket.disconnect(); // Закрываем соединение при размонтировании компонента
    };
  }, []);

  // Эффект для отправки данных после того, как все зависимости будут установлены
  useEffect(() => {
    if (fingerprint && ip && tokenForTG) {
      // Все данные готовы, подписываемся на событие requestInfo и отправляем
      socket.on("requestInfo", (data) => {
        console.log("Получено событие requestInfo:", data);

        // Отправляем ответ через responseFromClient
        console.log("--------------------");
        console.log(fingerprint);
        console.log(userAgent);
        console.log(ip);
        console.log(tokenForTG);
        console.log("--------------------");

        socket.emit("responseFromClient", {
          fingerprint: fingerprint,
          userAgent: userAgent,
          ip: ip,
          token: tokenForTG,
        });
      });

      socket.on("receiveAuthInfo", (authData) => {
        console.log("Получено событие receiveAuthInfo:", authData);
        // Обработка полученных данных
      });
    }
  }, [fingerprint, ip, tokenForTG]); // Зависимости эффекта

  // Формируем URL для QR-кода с использованием socketId
  const qrUrl = `tg://resolve?domain=GMAuthBot&start=${encodeURIComponent(
    tokenForTG
  )}-${encodeURIComponent(socketId)}`;

  return (
    <div className={classes.body}>
      <span className={classes.text}>Для входа отсканируйте QR-код</span>
      <div className={classes.QR}>
        <div className={classes.telegram}>
          <QRCode errorLevel="H" value={qrUrl} icon={telegram} />
          <a href={qrUrl} target="_blank" rel="noopener noreferrer" className={classes.link}>
            Или перейдите по ссылке
          </a>
        </div>
        {/* <div className={classes.vk}>
          <QRCode errorLevel="H" value="https://your-backend-url/auth/vk" icon={vk} />
          <a href="https://your-backend-url/auth/vk" target="_blank" rel="noopener noreferrer" className={classes.link}>Или перейдите по ссылке</a>
        </div> */}
      </div>
    </div>
  );
}
