import React, { useState, useEffect } from "react";
import classes from "./SpeedGoalContent.module.css";
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
import watch from "../../image/watch.svg";
import { useNavigate } from "react-router-dom";
import classNames from 'classnames';

export default function SpeedGoalContent() {
  const [textAreas, setTextAreas] = useState([{}]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const back = () => {
    navigate("/start");
  };
  const addTextarea = () => {
    setTextAreas((prevState) => [...prevState, {}]);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter" && event.ctrlKey) {
        addTextarea();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredTextAreas = textAreas.filter((area, index) => {
    const areaText = area.value || "";
    return areaText.toLowerCase().includes(searchTerm);
  });

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return text;
    }

    const regex = new RegExp(`(${highlight})`, "gi");
    return text
      .split(regex)
      .map((fragment, i) =>
        fragment.toLowerCase() === highlight.toLowerCase()
          ? `<span>${fragment}</span>`
          : fragment
      )
      .join("");
  };
  const [activeIndex, setActiveIndex] = useState(null);

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
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className={classes.selectHeader}>
        {['КРАТКОСРОЧАЯ ЦЕЛЬ', 'СИТУАЦИЯ', 'ПРИЧИНА'].map((text, index) => (
                  <div 
                  key={index} 
                  className={classNames(classes.textSelectHeader, activeIndex === index ? classes.activeTextSelectHeader : classes.textSelectHeader)}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className={ classNames(activeIndex === index ? classes.active : classes.textSelectHeaderSpan)}>{text}</span>
                </div>
        
        ))}
          {/* <div className={classes.textSelectHeader}>
            <span className={classes.textSelectHeaderSpan}>
              КРАТКОСРОЧАЯ ЦЕЛЬ
            </span>
          </div>
          <div className={classes.textSelectHeader}>
            <span className={classes.textSelectHeaderSpan}>СИТУАЦИЯ</span>
          </div>
          <div className={classes.textSelectHeader}>
            <span className={classes.textSelectHeaderSpan}>ПРИЧИНА</span>
          </div> */}
        </div>
        <div className={classes.editText}>
          <div className={classes.one}>
            <img src={L} alt="L" />
            <img src={E} alt="E" />
            <img src={R} alt="R" />
            <img src={J} alt="J" />
          </div>
          <div className={classes.two}>
            <img src={numeration} alt="numeration" />
            <img src={bulet} alt="bulet" />
          </div>
          <div className={classes.three}>
            <img src={Bold} alt="Bold" />
            <img src={Italic} alt="Italic" />
            <img src={Underline} alt="Underline" />
            <img src={Crosed} alt="Crosed" />
          </div>

          <div className={classes.empty}></div>

          <div className={classes.date}>
            <img src={watch} alt="watch" />
            <div>
              <span className={classes.text}>Стратегия №11</span>
            </div>
            <input type="date" style={{ fontWeight: "600" }} />
          </div>

          <div className={classes.blockSelect}>
            <img src={Select} alt="Select" className={classes.select} />
            <ul className={classes.option}>
              <li>Опубликовать</li>
              <li>Напечатать</li>
              <li>Отправить сотруднику</li>
              <li>Сохранить как файл</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={classes.main}>
        {filteredTextAreas.map((area, index) => (
          <textarea
            key={index}
            className={classes.Teaxtaera}
            placeholder={`текст части краткосрочной цели ${index + 1}`}
            onChange={(e) => {
              const newAreas = [...textAreas];
              newAreas[index].value = e.target.value;
              setTextAreas(newAreas);
            }}
            value={highlightText(area.value || "", searchTerm)}
          />
        ))}
        <button className={classes.add} onClick={() => addTextarea()}>
          <img src={add} alt="add" />
          <div> Добавить еще одну цель (Ctrl+Enter) </div>
        </button>
      </div>
    </div>
  );
}
