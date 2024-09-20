import React from "react";
import classes from "./Content.module.css";
import { QRCode } from "antd";
import telegram from "../../../image/telegram.svg";
import vk from "../../../image/vk.svg";

export default function Content() {
  return (
    <div className={classes.body}>
      <span className={classes.text}>Для входа отсканируйте QR-код</span>
      <div className={classes.QR}>
        <div className={classes.telegram}>
          <QRCode errorLevel="H" value="https://ant.design/" icon={telegram} />
          <a href="#" className={classes.link}>Или перейдите по ссылке</a>
        </div>
        <div className={classes.vk}>
          <QRCode errorLevel="H" value="https://ant.design/" icon={vk} />
          <a href="#" className={classes.link}>Или перейдите по ссылке</a>
        </div>
      </div>
    </div>
  );
}
