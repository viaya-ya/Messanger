import React from "react";
import classes from "./HandlerQeury.module.css";
import icon from "../image/iconHeader.svg";
import error from "../image/error.svg";

export default function HandlerQeury({Loading, Fetching, Error}) {
  return (
    <>
      {(Fetching || Loading) && (
        <div className={classes.load}>
          <img src={icon} alt="Loading..." className={classes.loadImage} />
          <div>
            <span className={classes.spanLoad}>Идет загрузка...</span>
          </div>
        </div>
      )}

      {Error && (
        <div className={classes.error}>
          <img src={error} alt="Error" className={classes.errorImage} />
          <span className={classes.spanError}>
            Ошибка
          </span>
        </div>
      )}
    </>
  );
}
