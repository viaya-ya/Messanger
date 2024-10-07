import React, { useState, useEffect } from "react";
import classes from "./ProjectNew.module.css";
import icon from "../../image/iconHeader.svg";
import iconBack from "../../image/iconBack.svg";
import Select from "../../image/Select.svg";
import Addlink from "../../image/Addlink.svg";
import Listsetting from "../../image/Listsetting.svg";
import iconGroupBlack from "../../image/iconGroupBlack.svg";
import glazikBlack from "../../image/glazikBlack.svg";
import starBlack from "../../image/starBlack.svg";
import galka from "../../image/galka.svg";
import tgBlack from "../../image/tgBlack.svg";
import glazikInvisible from "../../image/glazikInvisible.svg";
import blackStrategy from "../../image/blackStrategy.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import CustomSelect from "../../Custom/CustomSelect.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProjectNewQuery } from "../../../BLL/projectApi";

export default function ProjectNew() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/project`);
  };
  const [type, setType] = useState("");
  const [worker, setWorker] = useState("");
  const [strategiya, setStrategiya] = useState("");
  const [goalToOrganizations, setGoalToOrganizations] = useState([]);
  const [isGoalToOrganizations, setIsGoalToOrganizations] = useState(false);
  const {
    workers = [],
    strategies = [],
    organizations = [],
    isLoadingGetNew,
    isErrorGetNew,
  } = useGetProjectNewQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      workers: data?.workers || [],
      strategies: data?.strategies || [],
      organizations: data?.organizations || [],
      isLoadingGetNew: isLoading,
      isErrorGetNew: isError,
    }),
  });
  const saveProject = () => {};
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
          <input type="search" placeholder="Поиск" className={classes.search} />
        </div>

        <div className={classes.editText}>
          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>Тип</span>
            </div>
            <div className={classes.div}>
              <select
                className={classes.select}
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                }}
              >
                <option value="">Выбрать опцию</option>
                <option value="Проект">Проект</option>
                <option value="Программа">Программа</option>
              </select>
            </div>
          </div>
          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>Выбрать стратегию</span>
            </div>
            <div className={classes.div}>
              <select
                name="mySelect"
                value={strategiya}
                onChange={(e) => {
                  setStrategiya(e.target.value);
                }}
                className={classes.select}
              >
                <option value="">Выберите опцию</option>
                {strategies.map((item) => {
                  return <option value={item.id}>{item.strategyName}</option>;
                })}
              </select>
            </div>
          </div>
          <div className={classes.item}>
            <CustomSelect
              organizations={organizations}
              setPolicyToOrganizations={setGoalToOrganizations}
              isPolicyToOrganizations={isGoalToOrganizations}
            ></CustomSelect>
          </div>
          <div className={classes.itemLast}>
            <div className={classes.itemName}>
              <span>Ответственный за выполнение </span>
            </div>
            <div className={classes.div}>
            <select
                name="mySelect"
                value={worker}
                onChange={(e) => {
                  setWorker(e.target.value);
                }}
                className={classes.select}
              >
                <option value="">Выберите опцию</option>
                {workers.map((item) => {
                  return <option value={item.id}>{`${item.firstName} ${item.lastName} `}</option>;
                })}
              </select>
            </div>
          </div>

          <div className={classes.blockSelect}>
            <img src={Addlink} alt="Addlink" className={classes.select} />
            <ul className={`${classes.optionNumber}`}>
              <div className={classes.nameList}>
                СВЯЗЬ ПРОЕКТА С ЗАДАЧЕЙ ПРОГРАММЫ
              </div>
              <div className={classes.blackStrategy}>
                {" "}
                <img src={blackStrategy} alt="blackStrategy" /> Программа 1{" "}
              </div>
              <li> Арендовать помещение под новый </li>
              <li> Разработать дизайн помещения</li>
              <li> Разработать меню для нового </li>
              <li> Подготовить команду для новго </li>
              <li> Провести открытие нового </li>
            </ul>
          </div>

          <div className={classes.blockSelect}>
            <img
              src={Listsetting}
              alt="Listsetting"
              className={classes.select}
            />
            <ul className={classes.option}>
              <div className={classes.nameList}>РАЗДЕЛЫ</div>
              <li>
                {" "}
                <img
                  src={glazikInvisible}
                  alt="glazikInvisible"
                /> Информация{" "}
              </li>
              <li>
                {" "}
                <img src={glazikBlack} alt="glazikBlack" /> Продукт
              </li>
              <li>
                {" "}
                <img
                  src={glazikInvisible}
                  alt="glazikInvisible"
                /> Показатели{" "}
              </li>
              <li>
                {" "}
                <img src={glazikInvisible} alt="glazikInvisible" />{" "}
                Организационные мероприятия
              </li>
              <li>
                {" "}
                <img src={glazikInvisible} alt="glazikInvisible" /> Правила и
                ограничения{" "}
              </li>
              <li>
                {" "}
                <img src={glazikInvisible} alt="glazikInvisible" /> Задачи{" "}
              </li>
            </ul>
          </div>

          <div className={classes.blockSelect}>
            <img src={Select} alt="Select" className={classes.select} />
            <ul className={classes.option}>
              <div className={classes.nameList}>ДЕЙСТВИЯ</div>
              <li>
                {" "}
                <img src={iconGroupBlack} alt="iconGroupBlack" /> Пригласить
                участников в группу{" "}
              </li>
              <li>
                {" "}
                <img src={glazikBlack} alt="glazikBlack" /> Отправить ссылку для
                просмотра
              </li>
              <li>
                {" "}
                <img src={starBlack} alt="starBlack" /> Запустить проект в
                исполнение{" "}
              </li>
              <li>
                {" "}
                <img src={galka} alt="galka" /> Завершить проект{" "}
              </li>
              <li>
                {" "}
                <img src={tgBlack} alt="tgBlack" /> Отправить текст в Telegram{" "}
              </li>
            </ul>
          </div>

          <div className={classes.iconSave}>
            <img
              src={Blacksavetmp}
              alt="Blacksavetmp"
              className={classes.image}
              onClick={() => saveProject()}
            />
          </div>
        </div>
      </div>

      <div className={classes.main}>
        <table className={classes.table}>
          <caption>
            <div>ПРОДУКТ</div>
          </caption>
          <tbody>
            <tr>
              <td className={classes.numberTableColumn}>1</td>
              <td className={classes.nameTableColumn}>
                Готовое к использованию меню нового ресторана
              </td>
              <td className={classes.imageTableColumn}>image</td>
              <td className={classes.dateTableColumn}>
                <input type="date" />
              </td>
            </tr>
          </tbody>
        </table>

        <table className={classes.table}>
          <caption>
            <div>ЗАДАЧИ</div>
          </caption>
          <tbody>
            <tr>
              <td className={classes.numberTableColumn}>1</td>
              <td className={classes.nameTableColumn}>
                Разработать блюда, десерты и напитки для меню нового ресторана.
              </td>
              <td className={classes.imageTableColumn}>image</td>
              <td className={classes.dateTableColumn}>
                <input type="date" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
