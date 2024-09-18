import React, { useState, useEffect } from "react";
import classes from "./PostContent.module.css";
import icon from "../../image/iconHeader.svg";
import iconBack from "../../image/iconBack.svg";
import greyPolicy from "../../image/greyPolicy.svg";
import blackStatistic from "../../image/blackStatistic.svg";
import { useNavigate } from "react-router-dom";

export default function PostContent() {
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
          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>Название поста</span>
            </div>
            <div className={classes.div}>
              <select name="mySelect" className={classes.select}>
                <option value="">Выберите опцию</option>
                <option value="option1">Опция 1</option>
                <option value="option2">Опция 2</option>
              </select>
            </div>
          </div>
          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>Название подразделения</span>
            </div>
            <div className={classes.div}>
              <select name="mySelect" className={classes.select}>
                <option value="">Выберите опцию</option>
                <option value="option1">Опция 1</option>
                <option value="option2">Опция 2</option>
              </select>
            </div>
          </div>
          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>Руководитель поста</span>
            </div>
            <div className={classes.div}>
              <select name="mySelect" className={classes.select}>
                <option value="">Выберите опцию</option>
                <option value="option1">Опция 1</option>
                <option value="option2">Опция 2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.main}>
        <div className={classes.productTeaxtaera}>
          <textarea
            className={classes.Teaxtaera}
            placeholder="описание продукта поста"
          />
        </div>

        <div className={classes.destinyTeaxtaera}>
          <textarea
            className={classes.Teaxtaera}
            placeholder="описнаие предназначения поста"
          />
        </div>
        
        <div className={classes.post}>
          <img src={greyPolicy} alt="greyPolicy" />
          <div>
            <span className={classes.nameButton}>Прикрепить политику с описанием образцового положения дел поста</span>
          </div>
          
        </div>
        <div className={classes.post}>
        <img src={blackStatistic} alt="blackStatistic" />
          <div>
            <span className={classes.nameButton}>Выбрать или создать статистику для поста</span>
          </div>
        </div>
        <button className={classes.button}>
           сохранить
        </button>
      </div>
    </div>
  );
}
