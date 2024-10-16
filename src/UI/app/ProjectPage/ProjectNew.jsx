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
import deleteGrey from "../../image/deleteGrey.svg";
import addCircle from "../../image/addCircle.svg";
import CustomSelect from "../../Custom/CustomSelect.jsx";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProjectNewQuery,
  usePostProjectMutation,
} from "../../../BLL/projectApi";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import MyEditor from "../../Custom/MyEditor";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";

export default function ProjectNew() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/project`);
  };
  const [type, setType] = useState("null");
  const [strategiya, setStrategiya] = useState("null");
  const [programId, setProgramId] = useState("null");
  const [products, setProducts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [commons, setCommons] = useState([]);
  const [projectToOrganizations, setProjectToOrganizations] = useState([]);
  const [isProjectToOrganizations, setIsProjectToOrganizations] =
    useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlContent, setHtmlContent] = useState();
  const [showEditorState, setShowEditorState] = useState(false);

  const {
    workers = [],
    strategies = [],
    organizations = [],
    programsWithoutProject = [],
    isLoadingGetNew,
    isErrorGetNew,
  } = useGetProjectNewQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      workers: data?.workers || [],
      strategies: data?.strategies || [],
      organizations: data?.organizations || [],
      programsWithoutProject: data?.programsWithoutProject || [],
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
      error: Error,
    },
  ] = usePostProjectMutation();

  useEffect(() => {
    const rawContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setHtmlContent(rawContent);
    console.log(rawContent);
  }, [editorState]);

  const reset = () => {
    setType("null");
    setStrategiya("null");
    setProgramId("null");
    setProducts([]);
    setTasks([]);
    setStatistics([]);
    setCommons([]);
    setHtmlContent(null);
    setIsProjectToOrganizations(true);
    setEditorState(EditorState.createEmpty());
  };

  const saveProject = async () => {
    const Data = {};

    // Проверки на изменения и отсутствие null
    if (type !== "null") {
      Data.type = type;
    }
    if (programId !== "null") {
      Data.programId = programId;
    }
    if (strategiya !== "null") {
      Data.strategyId = strategiya;
    }
    if (htmlContent !== null) {
      Data.content = htmlContent;
    }
    if (
      products.length > 0 ||
      tasks.length > 0 ||
      statistics.length > 0 ||
      commons.length > 0
    ) {
      Data.targetCreateDtos = [
        ...products,
        ...tasks,
        ...statistics,
        ...commons,
      ];
    }

    await postProject({
      userId,
      ...Data,
      projectToOrganizations: projectToOrganizations,
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
          id: new Date(),
          type: "Продукт",
          orderNumber: index,
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
          id: new Date(),
          type: "Правила",
          orderNumber: index,
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
          id: new Date(),
          type: "Обычная",
          orderNumber: index,
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
          id: new Date(),
          type: "Статистика",
          orderNumber: index,
          content: "",
          holderUserId: "",
          deadline: "",
        },
      ];
    });
  };

  const deleteRow = (type, id) => {
    switch (type) {
      case "Продукт":
        const updatedProducts = products
          .filter((item) => item.id !== id)
          .map((item, index) => ({
            ...item,
            orderNumber: index + 1,
          }));
        setProducts(updatedProducts);
        break;

      case "Правила":
        const updatedTasks = tasks
          .filter((item) => item.id !== id)
          .map((item, index) => ({
            ...item,
            orderNumber: index + 1,
          }));
        setTasks(updatedTasks);
        break;

      case "Обычная":
        const updatedCommons = commons
          .filter((item) => item.id !== id)
          .map((item, index) => ({
            ...item,
            orderNumber: index + 1,
          }));
        setCommons(updatedCommons);
        break;
      case "Статистика":
        const updatedStatistics = statistics
          .filter((item) => item.id !== id)
          .map((item, index) => ({
            ...item,
            orderNumber: index + 1,
          }));
        setStatistics(updatedStatistics);
        break;
    }
  };

  const show = () => {
    setShowEditorState(!showEditorState);
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
                <option value="null">Выбрать опцию</option>
                <option value="Проект">Проект</option>
                <option value="Программа">Программа</option>
              </select>
            </div>
          </div>
          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>Программа для проекта</span>
            </div>
            <div className={classes.div}>
              <select
                name="mySelect"
                value={programId}
                onChange={(e) => {
                  setProgramId(e.target.value);
                }}
                className={classes.select}
              >
                <option value="null">Выберите опцию</option>
                {programsWithoutProject.map((item) => {
                  return <option value={item.id}>{item.projectNumber}</option>;
                })}
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
                <option value="null">Выберите опцию</option>
                {strategies.map((item) => {
                  return <option value={item.id}>{item.strategyNumber}</option>;
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
              <li onClick={() => show()}>
                {showEditorState ? (
                  <img src={glazikBlack} alt="glazikBlack" />
                ) : (
                  <img src={glazikInvisible} alt="glazikInvisible" />
                )}
                Информация
              </li>
              <li>
                <img src={glazikInvisible} alt="glazikInvisible" />
                Продукт
              </li>
              <li>
                <img src={glazikInvisible} alt="glazikInvisible" /> Показатели
              </li>
              <li>
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
        {isErrorGetNew ? (
          <HandlerQeury Error={isErrorGetNew}></HandlerQeury>
        ) : (
          <>
            {isLoadingGetNew ? (
              <HandlerQeury Loading={isLoadingGetNew}></HandlerQeury>
            ) : (
              <>
                <HandlerMutation
                  Loading={isLoadingProjectMutation}
                  Error={isErrorProjectMutation}
                  Success={isSuccessProjectMutation}
                  textSuccess={"Успешно создано."}
                  textError={Error?.data?.errors[0]?.errors[0]}
                ></HandlerMutation>

                {showEditorState ? (
                  <MyEditor
                    editorState={editorState}
                    setEditorState={setEditorState}
                  />
                ) : (
                  <>
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
                                {item.orderNumber}
                              </td>
                              <td className={classes.nameTableColumn}>
                                <input
                                  type="text"
                                  value={item.content}
                                  onChange={(e) => {
                                    const updatedProducts = [...products];
                                    updatedProducts[
                                      item.orderNumber - 1
                                    ].content = e.target.value;
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
                                    updatedProducts[
                                      item.orderNumber - 1
                                    ].holderUserId = e.target.value;
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
                                  value={item.deadline.slice(0, 10)}
                                  onChange={(e) => {
                                    const updated = [...products];
                                    const date = new Date(e.target.value);
                                    date.setUTCHours(21, 0, 0, 0);
                                    updated[item.orderNumber - 1].deadline =
                                      date.toISOString();
                                    setProducts(updated);
                                  }}
                                />
                              </td>
                              <td className={classes.imageTableColumn}>
                                <img
                                  src={deleteGrey}
                                  alt="deleteGrey"
                                  onClick={() => deleteRow(item.type, item.id)}
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
                          <div>ПРАВИЛА</div>
                          <img
                            src={addCircle}
                            alt="addCircle"
                            onClick={() => addTasks()}
                          />
                        </div>
                      </caption>
                      <tbody>
                        {tasks.map((item) => {
                          return (
                            <tr>
                              <td className={classes.numberTableColumn}>
                                {item.orderNumber}
                              </td>
                              <td className={classes.nameTableColumn}>
                                <input
                                  type="text"
                                  value={item.content}
                                  onChange={(e) => {
                                    const updated = [...tasks];
                                    updated[item.orderNumber - 1].content =
                                      e.target.value;
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
                                    updated[item.orderNumber - 1].holderUserId =
                                      e.target.value;
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
                                  value={item.deadline.slice(0, 10)}
                                  onChange={(e) => {
                                    const updated = [...tasks];
                                    const date = new Date(e.target.value);
                                    date.setUTCHours(21, 0, 0, 0);
                                    updated[item.orderNumber - 1].deadline =
                                      date.toISOString();
                                    setTasks(updated);
                                  }}
                                />
                              </td>
                              <td className={classes.imageTableColumn}>
                                <img
                                  src={deleteGrey}
                                  alt="deleteGrey"
                                  onClick={() => deleteRow(item.type, item.id)}
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
                          <div>ОБЫЧНАЯ</div>
                          <img
                            src={addCircle}
                            alt="addCircle"
                            onClick={() => addCommon()}
                          />
                        </div>
                      </caption>
                      <tbody>
                        {commons.map((item) => {
                          return (
                            <tr>
                              <td className={classes.numberTableColumn}>
                                {item.orderNumber}
                              </td>
                              <td className={classes.nameTableColumn}>
                                <input
                                  type="text"
                                  value={item.content}
                                  onChange={(e) => {
                                    const updated = [...commons];
                                    updated[item.orderNumber - 1].content =
                                      e.target.value;
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
                                    updatedProducts[
                                      item.orderNumber - 1
                                    ].holderUserId = e.target.value;
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
                                  value={item.deadline.slice(0, 10)}
                                  onChange={(e) => {
                                    const updated = [...commons];
                                    const date = new Date(e.target.value);
                                    date.setUTCHours(21, 0, 0, 0);
                                    updated[item.orderNumber - 1].deadline =
                                      date.toISOString();
                                    setCommons(updated);
                                  }}
                                />
                              </td>
                              <td className={classes.imageTableColumn}>
                                <img
                                  src={deleteGrey}
                                  alt="deleteGrey"
                                  onClick={() => deleteRow(item.type, item.id)}
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
                          <div>СТАТИСТИКА</div>
                          <img
                            src={addCircle}
                            alt="addCircle"
                            onClick={() => addStatistics()}
                          />
                        </div>
                      </caption>
                      <tbody>
                        {statistics.map((item) => {
                          return (
                            <tr>
                              <td className={classes.numberTableColumn}>
                                {item.orderNumber}
                              </td>
                              <td className={classes.nameTableColumn}>
                                <input
                                  type="text"
                                  value={item.content}
                                  onChange={(e) => {
                                    const updated = [...statistics];
                                    updated[item.orderNumber - 1].content =
                                      e.target.value;
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
                                    updated[item.orderNumber - 1].holderUserId =
                                      e.target.value;
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
                                  value={item.deadline.slice(0, 10)}
                                  onChange={(e) => {
                                    const updated = [...statistics];
                                    const date = new Date(e.target.value);
                                    date.setUTCHours(21, 0, 0, 0);
                                    updated[item.orderNumber - 1].deadline =
                                      date.toISOString();
                                    setStatistics(updated);
                                  }}
                                />
                              </td>
                              <td className={classes.imageTableColumn}>
                                <img
                                  src={deleteGrey}
                                  alt="deleteGrey"
                                  onClick={() => deleteRow(item.type, item.id)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
