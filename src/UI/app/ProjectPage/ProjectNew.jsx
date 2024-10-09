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
import addCircle from "../../image/addCircle.svg";
import CustomSelect from "../../Custom/CustomSelect.jsx";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProjectNewQuery,
  usePostProjectMutation,
} from "../../../BLL/projectApi";

export default function ProjectNew() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/project`);
  };
  const [type, setType] = useState("");
  const [worker, setWorker] = useState("");
  const [strategiya, setStrategiya] = useState("");
  const [products, setProducts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [commons, setCommons] = useState([]);
  const [projectToOrganizations, setProjectToOrganizations] = useState([]);
  const [isProjectToOrganizations, setIsProjectToOrganizations] =
    useState(false);

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

  const [
    postProject,
    {
      isLoading: isLoadingProjectMutation,
      isSuccess: isSuccessProjectMutation,
      isError: isErrorProjectMutation,
    },
  ] = usePostProjectMutation();

  const reset = () => {
    setIsProjectToOrganizations(true);
  };

  const saveProject = async () => {
    await postProject({
      userId,
      programId: "b6ed2664-9510-4a47-9117-6ce89903b4b5",
      content: "null",
      type: type,
      projectToOrganizations: projectToOrganizations,
      strategyId: strategiya,
      targetCreateDtos: [...products, ...tasks, ...statistics, ...commons],
    })
      .unwrap()
      .then(() => {
        reset();
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const addProducts = () => {
    setProducts((prevState) => {
      const index = prevState.length + 1; // Генерация index на основе длины массива

      return [
        ...prevState,
        {
          id: index - 1,
          type: "Продукт",
          productNumber: index,
          content: "",
          holderUserId: "",
          deadline: "",
        },
      ];
    });
  };

  const addTasks = () => {
    setTasks((prevState) => {
      const index = prevState.length + 1; // Генерация index на основе длины массива

      return [
        ...prevState,
        {
          id: index - 1,
          type: "Задачи",
          ruleNumber: index,
          content: "",
          holderUserId: "",
          deadline: "",
        },
      ];
    });
  };

  const addCommon = () => {
    setCommons((prevState) => {
      const index = prevState.length + 1; // Генерация index на основе длины массива

      return [
        ...prevState,
        {
          id: index - 1,
          type: "Обычная",
          commonNumber: index,
          content: "",
          holderUserId: "",
          deadline: "",
        },
      ];
    });
  };

  const addStatistics = () => {
    setStatistics((prevState) => {
      const index = prevState.length + 1; // Генерация index на основе длины массива

      return [
        ...prevState,
        {
          id: index - 1,
          type: "Сатистика",
          statisticNumber: index,
          content: "",
          holderUserId: "",
          deadline: "",
        },
      ];
    });
  };

  // console.log(JSON.stringify(products));
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
              setPolicyToOrganizations={setProjectToOrganizations}
              isPolicyToOrganizations={isProjectToOrganizations}
            ></CustomSelect>
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
            <div className={classes.nameRow}>
              <div>ПРОДУКТ</div>
              <img
                src={addCircle}
                alt="addCircle"
                onClick={() => addProducts()}
              />
            </div>
          </caption>
          <tbody>
            {products.map((item) => {
              return (
                <tr>
                  <td className={classes.numberTableColumn}>
                    {item.productNumber}
                  </td>
                  <td className={classes.nameTableColumn}>
                    <input
                      type="text"
                      value={item.content}
                      onChange={(e) => {
                        const updatedProducts = [...products];
                        updatedProducts[item.id].content = e.target.value;
                        setProducts(updatedProducts);
                      }}
                    />
                  </td>
                  <td className={classes.imageTableColumn}>
                    <select
                      name="mySelect"
                      value={item.holderUserId}
                      onChange={(e) => {
                        const updatedProducts = [...products];
                        updatedProducts[item.id].holderUserId = e.target.value;
                        setProducts(updatedProducts);
                      }}
                      className={classes.select}
                    >
                      <option value="">Выберите опцию</option>
                      {workers.map((item) => {
                        return (
                          <option
                            value={item.id}
                          >{`${item.firstName} ${item.lastName} `}</option>
                        );
                      })}
                    </select>
                  </td>
                  <td className={classes.dateTableColumn}>
                    <input
                      type="date"
                      value={item.deadline}
                      onChange={(e) => {
                        const updatedProducts = [...products];
                        updatedProducts[item.id].deadline = e.target.value;
                        setProducts(updatedProducts);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <table className={classes.table}>
          <caption>
            <div className={classes.nameRow}>
              <div>ЗАДАЧИ</div>
              <img src={addCircle} alt="addCircle" onClick={() => addTasks()} />
            </div>
          </caption>
          <tbody>
            {tasks.map((item) => {
              return (
                <tr>
                  <td className={classes.numberTableColumn}>
                    {item.ruleNumber}
                  </td>
                  <td className={classes.nameTableColumn}>
                    <input
                      type="text"
                      value={item.content}
                      onChange={(e) => {
                        const updated = [...tasks];
                        updated[item.id].content = e.target.value;
                        setTasks(updated);
                      }}
                    />
                  </td>
                  <td className={classes.imageTableColumn}>
                    <select
                      name="mySelect"
                      value={item.holderUserId}
                      onChange={(e) => {
                        const updated = [...tasks];
                        updated[item.id].holderUserId = e.target.value;
                        setTasks(updated);
                      }}
                      className={classes.select}
                    >
                      <option value="">Выберите опцию</option>
                      {workers.map((item) => {
                        return (
                          <option
                            value={item.id}
                          >{`${item.firstName} ${item.lastName} `}</option>
                        );
                      })}
                    </select>
                  </td>
                  <td className={classes.dateTableColumn}>
                    <input
                      type="date"
                      value={item.deadline}
                      onChange={(e) => {
                        const updated = [...tasks];
                        updated[item.id].deadline = e.target.value;
                        setTasks(updated);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <table className={classes.table}>
          <caption>

            <div className={classes.nameRow}>
              <div>Обычная</div>
              <img src={addCircle} alt="addCircle" onClick={() => addCommon()} />
            </div>
          </caption>
          <tbody>
            {commons.map((item) => {
              return (
                <tr>
                  <td className={classes.numberTableColumn}>
                    {item.commonNumber}
                  </td>
                  <td className={classes.nameTableColumn}>
                    <input
                      type="text"
                      value={item.content}
                      onChange={(e) => {
                        const updated = [...commons];
                        updated[item.id].content = e.target.value;
                        setCommons(updated);
                      }}
                    />
                  </td>
                  <td className={classes.imageTableColumn}>
                    <select
                      name="mySelect"
                      value={item.holderUserId}
                      onChange={(e) => {
                        const updatedProducts = [...commons];
                        updatedProducts[item.id].holderUserId = e.target.value;
                        setCommons(updatedProducts);
                      }}
                      className={classes.select}
                    >
                      <option value="">Выберите опцию</option>
                      {workers.map((item) => {
                        return (
                          <option
                            value={item.id}
                          >{`${item.firstName} ${item.lastName} `}</option>
                        );
                      })}
                    </select>
                  </td>
                  <td className={classes.dateTableColumn}>
                    <input
                      type="date"
                      value={item.deadline}
                      onChange={(e) => {
                        const updated = [...commons];
                        updated[item.id].deadline = e.target.value;
                        setCommons(updated);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <table className={classes.table}>
          <caption>
            <div className={classes.nameRow}>
              <div>Статистика</div>
              <img src={addCircle} alt="addCircle" onClick={() => addStatistics()} />
            </div>
          </caption>
          <tbody>
            {statistics.map((item) => {
              return (
                <tr>
                  <td className={classes.numberTableColumn}>
                    {item.statisticNumber}
                  </td>
                  <td className={classes.nameTableColumn}>
                    <input
                      type="text"
                      value={item.content}
                      onChange={(e) => {
                        const updated = [...statistics];
                        updated[item.id].content = e.target.value;
                        setStatistics(updated);
                      }}
                    />
                  </td>
                  <td className={classes.imageTableColumn}>
                    <select
                      name="mySelect"
                      value={item.holderUserId}
                      onChange={(e) => {
                        const updated = [...statistics];
                        updated[item.id].holderUserId = e.target.value;
                        setStatistics(updated);
                      }}
                      className={classes.select}
                    >
                      <option value="">Выберите опцию</option>
                      {workers.map((item) => {
                        return (
                          <option
                            value={item.id}
                          >{`${item.firstName} ${item.lastName} `}</option>
                        );
                      })}
                    </select>
                  </td>
                  <td className={classes.dateTableColumn}>
                    <input
                      type="date"
                      value={item.deadline}
                      onChange={(e) => {
                        const updated = [...statistics];
                        updated[item.id].deadline = e.target.value;
                        setStatistics(updated);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
