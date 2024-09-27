import React, { useState, useEffect } from "react";
import classes from "./HandlerMutation.module.css";
import icon from "../image/iconHeader.svg";
import error from "../image/error.svg";
import success from "../image/success.svg";
export default function HandlerMutation({Loading, Error, Success, textSuccess}) {

  const [showSuccessMutation, setShowSuccessMutation] = useState(false);
  const [showErrorMutation, setShowErrorMutation] = useState(false);

  // Используем useEffect для отслеживания успешного завершения запроса
  useEffect(() => {
    if (Success) {
      setShowSuccessMutation(true);

      // Убираем сообщение через 1 секунду
      const timer = setTimeout(() => {
        setShowSuccessMutation(false);
      }, 1500);

      // Чистим таймер при размонтировании компонента или повторном запуске
      return () => clearTimeout(timer);
    }
  }, [Success]);

  // Используем useEffect для отслеживания успешного завершения запроса
  useEffect(() => {
    if (Error) {
      setShowErrorMutation(true);

      // Убираем сообщение через 1 секунду
      const timer = setTimeout(() => {
        setShowErrorMutation(false);
      }, 1500);

      // Чистим таймер при размонтировании компонента или повторном запуске
      return () => clearTimeout(timer);
    }
  }, [Error]);
  return (
    <>
      {Loading && (
        <div className={classes.load}>
          <img src={icon} alt="Loading..." className={classes.loadImage} />
          <div>
            <span className={classes.spanLoad}>Идет загрузка...</span>
          </div>
        </div>
      )}

      {showErrorMutation && (
        <div className={classes.error}>
          <img src={error} alt="Error" className={classes.errorImage} />
          <span className={classes.spanError}>
            Ошибка
          </span>
        </div>
      )}

      {showSuccessMutation && (
        <div className={classes.success}>
          <img src={success} alt="success" className={classes.successImage} />
          <span className={classes.spanSuccess}>{textSuccess}</span>
        </div>
      )}
    </>
  );
}
