import React, { useState, useEffect } from "react";
import classes from "./Content.module.css"; // Ваши стили
import { QRCode } from "antd";
import telegram from "../../../image/telegram.svg"; // Путь к иконке Telegram
import vk from "../../../image/vk.svg"; // Путь к иконке VK
import { io } from "socket.io-client";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

import {url} from "../../../../BLL/baseUrl"
// "http://localhost:5000/auth"
// "https://24academy.ru/auth"

const socket = io( "http://localhost:5000/auth", {
  cors: {
    credentials: true
  },transports : ['websocket']
}); // Подключение к сокету

export default function Content() {
  const [data, setData] = useState({
    accessToken: "",
    refreshTokenId: "",
    userId: "",
  });
  const [tokenForTG, setTokenForTG] = useState("");
  const [socketId, setSocketId] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [ip, setIp] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const userAgent = navigator.userAgent; // Получение User-Agent

  const a = {_ip: "", _fingerprint: ""};

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Параллельное выполнение запросов для IP и Fingerprint
        const [ipResponse, fp] = await Promise.all([
          fetch("https://api.ipify.org?format=json").then((res) => res.json()),
          FingerprintJS.load().then((fp) => fp.get()),
        ]);

        // Обновляем объект `a` и состояние
        a._ip = ipResponse.ip;
        a._fingerprint = fp.visitorId;

        setIp(ipResponse.ip);
        setFingerprint(fp.visitorId);

        console.log("IP-адрес:", a._ip);
        console.log("Fingerprint ID:", a._fingerprint);

        // Запрос на сервер
        const response = await fetch(
          `${url}?fingerprint=${a._fingerprint}&ip=${a._ip}`,
          {
            method: "GET",
            headers: {
              "User-Agent": userAgent,
            },
          }
        );
        const serverData = await response.json();

        if (serverData.isLogged) {
          window.location.href = `#/${serverData.userId}/start`;
        }
        console.log("Ответ от /:", serverData);
        setTokenForTG(serverData.tokenForTG);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchData();

    // Подключение к сокету
    console.log("Попытка подключения к сокету...");
    socket.on("connect", () => {
      console.log("Сокет подключен, socket.id:", socket.id);
      setSocketId(socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Сокет отключен.");
    });

    // Очистка при размонтировании компонента
    return () => {
      console.log("Отключаем сокет...");
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
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
        setData(authData);
      });
    }
  }, [fingerprint, ip, tokenForTG]); // Зависимости эффекта

  // Перенаправление на другую страницу при наличии userId
  useEffect(() => {
    if (data.userId !== "false") {
      window.location.href = `#/${data.userId}/start`;
    }
  }, [data]);

  // Установка QR-кода при наличии tokenForTG и socketId
  useEffect(() => {
    if (tokenForTG && socketId) {
      setQrUrl(
        `tg://resolve?domain=GMAuthBot&start=${encodeURIComponent(
          tokenForTG
        )}-${encodeURIComponent(socketId)}`
      );
    }
  }, [socketId, tokenForTG]);

  // console.log("tokenForTG:", tokenForTG);
  // console.log("socketId:", socketId);

  return (
    <div className={classes.body}>
      <span className={classes.text}>Для входа отсканируйте QR-код</span>
      <div className={classes.QR}>
        {(!socketId) ? (
          <div>Подключение к сокету...</div>
        ) : (tokenForTG && qrUrl) ? (
          <div className={classes.telegram}>
            <QRCode errorLevel="H" value={qrUrl} />
            <a
              href={qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              Или перейдите по ссылке
            </a>
          </div>
        ) : (
          <> Подождите </>
        )}
      </div>
    </div>
  );
}

