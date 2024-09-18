import React, { useState, useEffect } from "react";
import classes from "./StrategContent.module.css";
import icon from "../../image/iconHeader.svg";
import add from "../../image/add.svg";
import L from "../../image/L.svg";
import E from "../../image/E.svg";
import R from "../../image/R.svg";
import J from "../../image/J.svg";
import numeration from "../../image/numeration.svg";
import bulet from "../../image/bulet.svg";
import Bold from "../../image/Bold.svg";
import Italic from "../../image/Italic.svg";
import Underline from "../../image/Underline.svg";
import Crosed from "../../image/Crosed.svg";
import Select from "../../image/Select.svg";
import iconBack from "../../image/iconBack.svg";
import mountain from "../../image/mountain.svg";
import oval from "../../image/oval.svg";
import subbarSearch from "../../image/subbarSearch.svg";
import iconSavetmp from "../../image/iconSavetmp.svg";
import email from "../../image/email.svg";
import iconGroup from "../../image/iconGroup.svg";
import greySavetmp from "../../image/greySavetmp.svg";
import watch from "../../image/watch.svg";
import { useNavigate } from "react-router-dom";

export default function StrategContent() {
  const navigate = useNavigate();
  const back = () => {
    navigate("/start");
  };

  return (
    <div className={classes.dialog}>
      <div className={classes.header}>
        <div className={classes.fon}></div>
        <div className={classes.pomoshnikSearch}>
          <div className={classes.pomoshnik}>
            <img
              src={iconBack}
              alt="iconBack"
              onClick={() => back()}
              className={classes.iconBack}
            />
            <div>
              <img
                src={icon}
                alt="icon"
                style={{ width: "33px", height: "33px" }}
              />
            </div>

            <div className={classes.spanPomoshnik}>
              <span>Личный помощник</span>
            </div>
          </div>
          <input
            type="search"
            placeholder="Поиск"
            className={classes.search}
            // value={searchTerm}
            // onChange={handleSearchChange}
          />
        </div>

        <div className={classes.editText}>
        <div className={classes.date}>
            <img src={watch} alt="watch" />
            <div>
              <span className={classes.text}>Стратегия №11</span>
            </div>
            <input type="date" style={{ fontWeight: "600" }} />
          </div>

          <div className={classes.two}>
            <div className={classes.blockSelect}>
              <img src={Select} alt="Select" className={classes.select} />
              <ul className={classes.option}>
                <li>
                  {" "}
                  <img src={email} alt="email" /> Отправить сотруднику для
                  прочтения
                </li>
                <li>
                  {" "}
                  <img src={iconGroup} alt="iconGroup" /> В должностную
                  инструкцию постам
                </li>
                <li>
                  {" "}
                  <img src={greySavetmp} alt="greySavetmp" /> Сохранить и издать{" "}
                </li>
              </ul>
            </div>
            <img
              src={iconSavetmp}
              alt="iconSavetmp"
              className={classes.iconSavetmp}
              style={{ marginLeft: "0.5%" }}
            />
          </div>
        </div>
      </div>

      <div className={classes.main}>
        <textarea className={classes.Teaxtaera} />
      </div>
    </div>
  );
}
