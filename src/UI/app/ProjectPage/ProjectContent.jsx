import React, { useState, useEffect } from "react";
import classes from "./ProjectContent.module.css";
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
import { useNavigate, useParams } from "react-router-dom";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import iconAdd from "../../image/iconAdd.svg";
import addCircle from "../../image/addCircle.svg";
import deleteGrey from "../../image/deleteGrey.svg";
import {
  useGetProjectIdQuery,
  useGetProjectQuery,
  useGetProjectNewQuery,
  useUpdateProjectMutation,
} from "../../../BLL/projectApi";
import CustomSelect from "../../Custom/CustomSelect.jsx";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import MyEditor from "../../Custom/MyEditor";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import WaveLetters from "../../Custom/WaveLetters.jsx";

export default function ProjectContent() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/start`);
  };
  const newProject = () => {
    navigate("new");
  };
  const [type, setType] = useState("null");
  const [strategiya, setStrategiya] = useState("null");
  const [programId, setProgramId] = useState("null");

  const [oldProducts, setOldProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsCreate, setProductsCreate] = useState([]);

  const [oldTasks, setOldTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tasksCreate, setTasksCreate] = useState([]);

  const [oldStatistics, setOldStatistics] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [statisticsCreate, setStatisticsCreate] = useState([]);

  const [oldCommons, setOldCommons] = useState([]);
  const [commons, setCommons] = useState([]);
  const [commonsCreate, setCommonsCreate] = useState([]);

  const [organizationsUpdate, setOrganizationsUpdate] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlContent, setHtmlContent] = useState();
  const [showEditorState, setShowEditorState] = useState(false);

  const {
    data = [],
    isErrorGetProject,
    isLoadingGetProject,
  } = useGetProjectQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      data: data || [],
      isErrorGetProject: isError,
      isLoadingGetProject: isLoading,
    }),
  });

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

  const {
    currentProject = {},
    targets = [],
    isLoadingGetProjectId,
    isErrorGetProjectId,
    isFetchingGetProjectId,
  } = useGetProjectIdQuery(
    { userId, projectId: selectedProjectId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentProject: data?.currentProject || {},
        targets: data?.targets || [],
        isLoadingGetProjectId: isLoading,
        isErrorGetProjectId: isError,
        isFetchingGetProjectId: isFetching,
      }),
      skip: !selectedProjectId,
    }
  );

  useEffect(() => {
    const rawContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setHtmlContent(rawContent);
  }, [editorState]);

  useEffect(() => {
    if (currentProject.content) {
      console.log("currentProject.content");
      console.log(currentProject.content);
      const { contentBlocks, entityMap } = convertFromHTML(
        currentProject.content
      );
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const oldEditorState = EditorState.createWithContent(contentState);
      setEditorState(oldEditorState);
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [currentProject.content]);

  useEffect(() => {
    console.log("Current targets:", targets);
    if (targets.length > 0) {
      setProducts(targets.filter((item) => item.type === "Продукт"));
      setOldProducts(targets.filter((item) => item.type === "Продукт"));

      setTasks(targets.filter((item) => item.type === "Правила"));
      setOldTasks(targets.filter((item) => item.type === "Правила"));

      setStatistics(targets.filter((item) => item.type === "Статистика"));
      setOldStatistics(targets.filter((item) => item.type === "Статистика"));

      setCommons(targets.filter((item) => item.type === "Обычная"));
      setOldCommons(targets.filter((item) => item.type === "Обычная"));
    }
  }, [targets, isLoadingGetProjectId, isFetchingGetProjectId]);

  const [
    updateProject,
    {
      isLoading: isLoadingProjectMutation,
      isSuccess: isSuccessProjectMutation,
      isError: isErrorProjectMutation,
      error: Error,
    },
  ] = useUpdateProjectMutation();

  const reset = () => {
    setType("null");
    setStrategiya("null");
    setProgramId("null");
    ////// Приходящие
    setProducts([]);
    setTasks([]);
    setStatistics([]);
    setCommons([]);
    ////// Мои
    setCommonsCreate([]);
    setProductsCreate([]);
    setStatisticsCreate([]);
    setTasksCreate([]);
  };

  function compareArrays(oldArray, newArray) {
    const changes = [];

    newArray.forEach((newItem) => {
      const oldItem = oldArray.find((item) => item.id === newItem.id);

      if (oldItem) {
        const itemChanges = {};

        // Сравниваем каждое поле
        Object.keys(newItem).forEach((key) => {
          if (newItem[key] !== oldItem[key]) {
            itemChanges[key] = newItem[key];
          }
        });

        // Если есть изменения, добавляем их в результат
        if (Object.keys(itemChanges).length > 0) {
          changes.push({ _id: newItem.id, ...itemChanges });
        }
      }
    });

    return changes;
  }

  const saveUpdateProject = async () => {
    const Data = {};

    Data.targetUpdateDtos = [];

    // Проверки на изменения и отсутствие null
    if (type !== currentProject.type && type !== "null") {
      Data.type = type;
    }
    if (strategiya !== currentProject.strategyId && strategiya !== "null") {
      Data.strategyId = strategiya;
    }
    if (programId !== currentProject.programId && programId !== "null") {
      Data.programId = programId;
    }
    if (htmlContent !== currentProject.content && htmlContent !== null) {
      Data.content = programId;
    }
    if (products.length > 0) {
      Data.targetUpdateDtos.push(...compareArrays(oldProducts, products));
      console.log(compareArrays(oldProducts, products));
    }
    if (tasks.length > 0) {
      Data.targetUpdateDtos.push(...compareArrays(oldTasks, tasks));
      console.log(compareArrays(oldTasks, products));
    }
    if (statistics.length > 0) {
      Data.targetUpdateDtos.push(...compareArrays(oldStatistics, statistics));
      console.log(compareArrays(oldStatistics, products));
    }
    if (commons.length > 0) {
      Data.targetUpdateDtos.push(...compareArrays(oldCommons, commons));
      console.log(compareArrays(oldCommons, products));
    }
    if (Data.targetUpdateDtos.length == 0) {
      delete Data.targetUpdateDtos;
    }
    if (
      productsCreate.length > 0 ||
      tasksCreate.length > 0 ||
      statisticsCreate.length > 0 ||
      commonsCreate.length > 0
    ) {
      Data.targetCreateDtos = [
        ...productsCreate,
        ...tasksCreate,
        ...statisticsCreate,
        ...commonsCreate,
      ];
    }

    await updateProject({
      userId,
      projectId: selectedProjectId,
      _id: selectedProjectId,
      ...Data,
      projectToOrganizations: organizationsUpdate,
    })
      .unwrap()
      .then(() => {
        reset();
        setManualSuccessReset(false);
        setManualErrorReset(false);
      })
      .catch((error) => {
        setManualErrorReset(false);
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const addProducts = () => {
    setProductsCreate((prevState) => {
      const index = products.length + prevState.length + 1; // Генерация index на основе длины массива

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
    setTasksCreate((prevState) => {
      const index = tasks.length + prevState.length + 1; // Генерация index на основе длины массива

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
    setCommonsCreate((prevState) => {
      const index = commons.length + prevState.length + 1; // Генерация index на основе длины массива

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
    setStatisticsCreate((prevState) => {
      const index = statistics.length + prevState.length + 1; // Генерация index на основе длины массива

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
        const updatedProducts = productsCreate
          .filter((item) => item.id !== id)
          .map((item, index) => ({
            ...item,
            orderNumber: index + 1,
          }));
        setProductsCreate(updatedProducts);
        break;

      case "Правила":
        const updatedTasks = tasksCreate
          .filter((item) => item.id !== id)
          .map((item, index) => ({
            ...item,
            orderNumber: index + 1,
          }));
        setTasksCreate(updatedTasks);
        break;

      case "Обычная":
        const updatedCommons = commonsCreate
          .filter((item) => item.id !== id)
          .map((item, index) => ({
            ...item,
            orderNumber: index + 1,
          }));
        setCommonsCreate(updatedCommons);
        break;
      case "Статистика":
        console.log("Статистика");
        const updatedStatistics = statisticsCreate
          .filter((item) => item.id !== id)
          .map((item, index) => ({
            ...item,
            orderNumber: index + 1,
          }));
        setStatisticsCreate(updatedStatistics);
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
              <span>Выбирите проект</span>
            </div>
            <div className={classes.div}>
              <select
                className={classes.select}
                value={selectedProjectId || ""}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setManualSuccessReset(true);
                  setManualErrorReset(true);
                }}
              >
                <option value="">Выберите опцию</option>
                {data?.map((item) => {
                  return <option value={item.id}>{item.projectNumber}</option>;
                })}
              </select>
            </div>
          </div>

          {Object.keys(currentProject).length > 0 ? (
            <>
              <div className={classes.item}>
                <div className={classes.itemName}>
                  <span>Тип</span>
                </div>
                <div className={classes.div}>
                  <select
                    className={classes.select}
                    value={type == "null" ? currentProject.type : type}
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

              {currentProject.programId ? (
                <>
                  <div className={classes.item}>
                    <div className={classes.itemName}>
                      <span>Программа проекта</span>
                    </div>
                    <div className={classes.div}>
                      <input
                        type="text"
                        value={currentProject.programNumber}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={classes.item}>
                    <div className={classes.itemName}>
                      <span>Поменять программу для проекта</span>
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
                          return (
                            <option value={item.id}>
                              {item.projectNumber}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
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
                          return (
                            <option value={item.id}>
                              {item.projectNumber}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className={classes.item}>
                <div className={classes.itemName}>
                  <span>Выбрать стратегию</span>
                </div>
                <div className={classes.div}>
                  <select
                    name="mySelect"
                    value={
                      strategiya == "null"
                        ? currentProject?.strategy?.id
                        : strategiya
                    }
                    onChange={(e) => {
                      setStrategiya(e.target.value);
                    }}
                    className={classes.select}
                  >
                    <option value="null">Выберите опцию</option>
                    {strategies.map((item) => {
                      return (
                        <option value={item.id}>{item.strategyNumber}</option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className={classes.item}>
                <CustomSelect
                  organizations={organizations}
                  selectOrganizations={currentProject.projectToOrganizations}
                  setPolicyToOrganizations={setOrganizationsUpdate}
                ></CustomSelect>
              </div>
            </>
          ) : (
            <></>
          )}
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

          <div className={classes.actionButton}>
            <div className={classes.iconAdd}>
              <img
                src={iconAdd}
                alt="iconAdd"
                className={classes.image}
                onClick={() => newProject()}
              />
            </div>
            <div className={classes.iconSave}>
              <img
                src={Blacksavetmp}
                alt="Blacksavetmp"
                className={classes.image}
                onClick={() => saveUpdateProject()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.main}>
        {isErrorGetProject ? (
          <>
            <HandlerQeury Error={isErrorGetProject}></HandlerQeury>
          </>
        ) : (
          <>
            {isErrorGetProjectId ? (
              <HandlerQeury Error={isErrorGetProjectId}></HandlerQeury>
            ) : (
              <>
                <HandlerQeury Loading={isLoadingGetProject}></HandlerQeury>

                {isLoadingGetProjectId || isFetchingGetProjectId ? (
                  <HandlerQeury
                    Loading={isLoadingGetProjectId}
                    Fetching={isFetchingGetProjectId}
                  ></HandlerQeury>
                ) : (
                  <>
                    {currentProject.id ? (
                      <>
                        {showEditorState ? (
                          <MyEditor
                            editorState={editorState}
                            setEditorState={setEditorState}
                          />
                        ) : (
                          <>
                            {console.log(products)}
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
                                {products.map((item, index) => {
                                  return (
                                    <tr key={item.id}>
                                      <td className={classes.numberTableColumn}>
                                        {item.orderNumber}
                                      </td>
                                      <td className={classes.nameTableColumn}>
                                        <input
                                          type="text"
                                          value={item.content}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              products.map((product, i) => {
                                                if (i === index) {
                                                  return {
                                                    ...product,
                                                    content: e.target.value,
                                                  };
                                                }
                                                return product;
                                              });
                                            setProducts(updatedProducts);
                                          }}
                                        />
                                      </td>
                                      <td className={classes.imageTableColumn}>
                                        <select
                                          name="mySelect"
                                          value={item.holderUserId}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              products.map((product, i) => {
                                                if (i === index) {
                                                  return {
                                                    ...product,
                                                    holderUserId:
                                                      e.target.value,
                                                  };
                                                }
                                                return product;
                                              });
                                            setProducts(updatedProducts);
                                          }}
                                          className={classes.select}
                                        >
                                          <option value="">
                                            Выберите опцию
                                          </option>
                                          {workers.map((worker) => {
                                            return (
                                              <option
                                                key={worker.id}
                                                value={worker.id}
                                              >{`${worker.firstName} ${worker.lastName}`}</option>
                                            );
                                          })}
                                        </select>
                                      </td>
                                      <td className={classes.dateTableColumn}>
                                        <input
                                          type="date"
                                          value={item.deadline.slice(0, 10)}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              products.map((product, i) => {
                                                if (i === index) {
                                                  const date = new Date(
                                                    e.target.value
                                                  );
                                                  date.setUTCHours(21, 0, 0, 0);
                                                  return {
                                                    ...product,
                                                    deadline:
                                                      date.toISOString(),
                                                  };
                                                }
                                                return product;
                                              });
                                            setProducts(updatedProducts);
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                                {productsCreate.map((item, index) => {
                                  return (
                                    <tr key={item.id}>
                                      <td className={classes.numberTableColumn}>
                                        {item.orderNumber}
                                      </td>
                                      <td className={classes.nameTableColumn}>
                                        <input
                                          type="text"
                                          value={item.content}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              productsCreate.map(
                                                (product, i) => {
                                                  if (i === index) {
                                                    return {
                                                      ...product,
                                                      content: e.target.value,
                                                    };
                                                  }
                                                  return product;
                                                }
                                              );
                                            setProductsCreate(updatedProducts);
                                          }}
                                        />
                                      </td>
                                      <td className={classes.imageTableColumn}>
                                        <select
                                          name="mySelect"
                                          value={item.holderUserId}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              productsCreate.map(
                                                (product, i) => {
                                                  if (i === index) {
                                                    return {
                                                      ...product,
                                                      holderUserId:
                                                        e.target.value,
                                                    };
                                                  }
                                                  return product;
                                                }
                                              );
                                            setProductsCreate(updatedProducts);
                                          }}
                                          className={classes.select}
                                        >
                                          <option value="">
                                            Выберите опцию
                                          </option>
                                          {workers.map((worker) => {
                                            return (
                                              <option
                                                key={worker.id}
                                                value={worker.id}
                                              >{`${worker.firstName} ${worker.lastName}`}</option>
                                            );
                                          })}
                                        </select>
                                      </td>
                                      <td className={classes.dateTableColumn}>
                                        <input
                                          type="date"
                                          value={item.deadline.slice(0, 10)}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              productsCreate.map(
                                                (product, i) => {
                                                  if (i === index) {
                                                    const date = new Date(
                                                      e.target.value
                                                    );
                                                    date.setUTCHours(
                                                      21,
                                                      0,
                                                      0,
                                                      0
                                                    );
                                                    return {
                                                      ...product,
                                                      deadline:
                                                        date.toISOString(),
                                                    };
                                                  }
                                                  return product;
                                                }
                                              );
                                            setProductsCreate(updatedProducts);
                                          }}
                                        />
                                      </td>
                                      <td className={classes.imageTableColumn}>
                                        <img
                                          src={deleteGrey}
                                          alt="deleteGrey"
                                          onClick={() =>
                                            deleteRow(item.type, item.id)
                                          }
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
                                {tasks.map((item, index) => {
                                  return (
                                    <tr key={item.id}>
                                      <td className={classes.numberTableColumn}>
                                        {item.orderNumber}
                                      </td>
                                      <td className={classes.nameTableColumn}>
                                        <input
                                          type="text"
                                          value={item.content}
                                          onChange={(e) => {
                                            const updatedTasks = tasks.map(
                                              (task, i) => {
                                                if (i === index) {
                                                  return {
                                                    ...task,
                                                    content: e.target.value,
                                                  };
                                                }
                                                return task;
                                              }
                                            );
                                            setTasks(updatedTasks);
                                          }}
                                        />
                                      </td>
                                      <td className={classes.imageTableColumn}>
                                        <select
                                          name="mySelect"
                                          value={item.holderUserId}
                                          onChange={(e) => {
                                            const updatedTasks = tasks.map(
                                              (task, i) => {
                                                if (i === index) {
                                                  return {
                                                    ...task,
                                                    holderUserId:
                                                      e.target.value,
                                                  };
                                                }
                                                return task;
                                              }
                                            );
                                            setTasks(updatedTasks);
                                          }}
                                          className={classes.select}
                                        >
                                          <option value="">
                                            Выберите опцию
                                          </option>
                                          {workers.map((worker) => {
                                            return (
                                              <option
                                                key={worker.id}
                                                value={worker.id}
                                              >{`${worker.firstName} ${worker.lastName}`}</option>
                                            );
                                          })}
                                        </select>
                                      </td>
                                      <td className={classes.dateTableColumn}>
                                        <input
                                          type="date"
                                          value={item.deadline.slice(0, 10)}
                                          onChange={(e) => {
                                            const updatedTasks = tasks.map(
                                              (task, i) => {
                                                if (i === index) {
                                                  const date = new Date(
                                                    e.target.value
                                                  );
                                                  date.setUTCHours(21, 0, 0, 0);
                                                  return {
                                                    ...task,
                                                    deadline:
                                                      date.toISOString(),
                                                  };
                                                }
                                                return task;
                                              }
                                            );
                                            setTasks(updatedTasks);
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                                {tasksCreate.map((item, index) => {
                                  return (
                                    <tr key={item.id}>
                                      <td className={classes.numberTableColumn}>
                                        {item.orderNumber}
                                      </td>
                                      <td className={classes.nameTableColumn}>
                                        <input
                                          type="text"
                                          value={item.content}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              tasksCreate.map((product, i) => {
                                                if (i === index) {
                                                  return {
                                                    ...product,
                                                    content: e.target.value,
                                                  };
                                                }
                                                return product;
                                              });
                                            setTasksCreate(updatedProducts);
                                          }}
                                        />
                                      </td>
                                      <td className={classes.imageTableColumn}>
                                        <select
                                          name="mySelect"
                                          value={item.holderUserId}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              tasksCreate.map((product, i) => {
                                                if (i === index) {
                                                  return {
                                                    ...product,
                                                    holderUserId:
                                                      e.target.value,
                                                  };
                                                }
                                                return product;
                                              });
                                            setTasksCreate(updatedProducts);
                                          }}
                                          className={classes.select}
                                        >
                                          <option value="">
                                            Выберите опцию
                                          </option>
                                          {workers.map((worker) => {
                                            return (
                                              <option
                                                key={worker.id}
                                                value={worker.id}
                                              >{`${worker.firstName} ${worker.lastName}`}</option>
                                            );
                                          })}
                                        </select>
                                      </td>
                                      <td className={classes.dateTableColumn}>
                                        <input
                                          type="date"
                                          value={item.deadline.slice(0, 10)}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              tasksCreate.map((product, i) => {
                                                if (i === index) {
                                                  const date = new Date(
                                                    e.target.value
                                                  );
                                                  date.setUTCHours(21, 0, 0, 0);
                                                  return {
                                                    ...product,
                                                    deadline:
                                                      date.toISOString(),
                                                  };
                                                }
                                                return product;
                                              });
                                            setTasksCreate(updatedProducts);
                                          }}
                                        />
                                      </td>
                                      <td className={classes.imageTableColumn}>
                                        <img
                                          src={deleteGrey}
                                          alt="deleteGrey"
                                          onClick={() =>
                                            deleteRow(item.type, item.id)
                                          }
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
                                {commons.map((item, index) => {
                                  return (
                                    <tr key={item.id}>
                                      <td className={classes.numberTableColumn}>
                                        {item.orderNumber}
                                      </td>
                                      <td className={classes.nameTableColumn}>
                                        <input
                                          type="text"
                                          value={item.content}
                                          onChange={(e) => {
                                            const updatedProducts = commons.map(
                                              (product, i) => {
                                                if (i === index) {
                                                  return {
                                                    ...product,
                                                    content: e.target.value,
                                                  };
                                                }
                                                return product;
                                              }
                                            );
                                            setCommons(updatedProducts);
                                          }}
                                        />
                                      </td>
                                      <td className={classes.imageTableColumn}>
                                        <select
                                          name="mySelect"
                                          value={item.holderUserId}
                                          onChange={(e) => {
                                            const updatedProducts = commons.map(
                                              (product, i) => {
                                                if (i === index) {
                                                  return {
                                                    ...product,
                                                    holderUserId:
                                                      e.target.value,
                                                  };
                                                }
                                                return product;
                                              }
                                            );
                                            setCommons(updatedProducts);
                                          }}
                                          className={classes.select}
                                        >
                                          <option value="">
                                            Выберите опцию
                                          </option>
                                          {workers.map((worker) => {
                                            return (
                                              <option
                                                key={worker.id}
                                                value={worker.id}
                                              >{`${worker.firstName} ${worker.lastName}`}</option>
                                            );
                                          })}
                                        </select>
                                      </td>
                                      <td className={classes.dateTableColumn}>
                                        <input
                                          type="date"
                                          value={item.deadline.slice(0, 10)}
                                          onChange={(e) => {
                                            const updatedProducts = commons.map(
                                              (product, i) => {
                                                if (i === index) {
                                                  const date = new Date(
                                                    e.target.value
                                                  );
                                                  date.setUTCHours(21, 0, 0, 0);
                                                  return {
                                                    ...product,
                                                    deadline:
                                                      date.toISOString(),
                                                  };
                                                }
                                                return product;
                                              }
                                            );
                                            setCommons(updatedProducts);
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                                {commonsCreate.map((item, index) => {
                                  return (
                                    <tr key={item.id}>
                                      <td className={classes.numberTableColumn}>
                                        {item.orderNumber}
                                      </td>
                                      <td className={classes.nameTableColumn}>
                                        <input
                                          type="text"
                                          value={item.content}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              commonsCreate.map(
                                                (product, i) => {
                                                  if (i === index) {
                                                    return {
                                                      ...product,
                                                      content: e.target.value,
                                                    };
                                                  }
                                                  return product;
                                                }
                                              );
                                            setCommonsCreate(updatedProducts);
                                          }}
                                        />
                                      </td>
                                      <td className={classes.imageTableColumn}>
                                        <select
                                          name="mySelect"
                                          value={item.holderUserId}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              commonsCreate.map(
                                                (product, i) => {
                                                  if (i === index) {
                                                    return {
                                                      ...product,
                                                      holderUserId:
                                                        e.target.value,
                                                    };
                                                  }
                                                  return product;
                                                }
                                              );
                                            setCommonsCreate(updatedProducts);
                                          }}
                                          className={classes.select}
                                        >
                                          <option value="">
                                            Выберите опцию
                                          </option>
                                          {workers.map((worker) => {
                                            return (
                                              <option
                                                key={worker.id}
                                                value={worker.id}
                                              >{`${worker.firstName} ${worker.lastName}`}</option>
                                            );
                                          })}
                                        </select>
                                      </td>
                                      <td className={classes.dateTableColumn}>
                                        <input
                                          type="date"
                                          value={item.deadline.slice(0, 10)}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              commonsCreate.map(
                                                (product, i) => {
                                                  if (i === index) {
                                                    const date = new Date(
                                                      e.target.value
                                                    );
                                                    date.setUTCHours(
                                                      21,
                                                      0,
                                                      0,
                                                      0
                                                    );
                                                    return {
                                                      ...product,
                                                      deadline:
                                                        date.toISOString(),
                                                    };
                                                  }
                                                  return product;
                                                }
                                              );
                                            setCommonsCreate(updatedProducts);
                                          }}
                                        />
                                      </td>
                                      <td className={classes.imageTableColumn}>
                                        <img
                                          src={deleteGrey}
                                          alt="deleteGrey"
                                          onClick={() =>
                                            deleteRow(item.type, item.id)
                                          }
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
                                {statistics.map((item, index) => {
                                  return (
                                    <tr key={item.id}>
                                      <td className={classes.numberTableColumn}>
                                        {item.orderNumber}
                                      </td>
                                      <td className={classes.nameTableColumn}>
                                        <input
                                          type="text"
                                          value={item.content}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              statistics.map((product, i) => {
                                                if (i === index) {
                                                  return {
                                                    ...product,
                                                    content: e.target.value,
                                                  };
                                                }
                                                return product;
                                              });
                                            setStatistics(updatedProducts);
                                          }}
                                        />
                                      </td>
                                      <td className={classes.imageTableColumn}>
                                        <select
                                          name="mySelect"
                                          value={item.holderUserId}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              statistics.map((product, i) => {
                                                if (i === index) {
                                                  return {
                                                    ...product,
                                                    holderUserId:
                                                      e.target.value,
                                                  };
                                                }
                                                return product;
                                              });
                                            setStatistics(updatedProducts);
                                          }}
                                          className={classes.select}
                                        >
                                          <option value="">
                                            Выберите опцию
                                          </option>
                                          {workers.map((worker) => {
                                            return (
                                              <option
                                                key={worker.id}
                                                value={worker.id}
                                              >{`${worker.firstName} ${worker.lastName}`}</option>
                                            );
                                          })}
                                        </select>
                                      </td>
                                      <td className={classes.dateTableColumn}>
                                        <input
                                          type="date"
                                          value={item.deadline.slice(0, 10)}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              statistics.map((product, i) => {
                                                if (i === index) {
                                                  const date = new Date(
                                                    e.target.value
                                                  );
                                                  date.setUTCHours(21, 0, 0, 0);
                                                  return {
                                                    ...product,
                                                    deadline:
                                                      date.toISOString(),
                                                  };
                                                }
                                                return product;
                                              });
                                            setStatistics(updatedProducts);
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                                {statisticsCreate.map((item, index) => {
                                  return (
                                    <tr key={item.id}>
                                      <td className={classes.numberTableColumn}>
                                        {item.orderNumber}
                                      </td>
                                      <td className={classes.nameTableColumn}>
                                        <input
                                          type="text"
                                          value={item.content}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              statisticsCreate.map(
                                                (product, i) => {
                                                  if (i === index) {
                                                    return {
                                                      ...product,
                                                      content: e.target.value,
                                                    };
                                                  }
                                                  return product;
                                                }
                                              );
                                            setStatisticsCreate(
                                              updatedProducts
                                            );
                                          }}
                                        />
                                      </td>
                                      <td className={classes.imageTableColumn}>
                                        <select
                                          name="mySelect"
                                          value={item.holderUserId}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              statisticsCreate.map(
                                                (product, i) => {
                                                  if (i === index) {
                                                    return {
                                                      ...product,
                                                      holderUserId:
                                                        e.target.value,
                                                    };
                                                  }
                                                  return product;
                                                }
                                              );
                                            setStatisticsCreate(
                                              updatedProducts
                                            );
                                          }}
                                          className={classes.select}
                                        >
                                          <option value="">
                                            Выберите опцию
                                          </option>
                                          {workers.map((worker) => {
                                            return (
                                              <option
                                                key={worker.id}
                                                value={worker.id}
                                              >{`${worker.firstName} ${worker.lastName}`}</option>
                                            );
                                          })}
                                        </select>
                                      </td>
                                      <td className={classes.dateTableColumn}>
                                        <input
                                          type="date"
                                          value={item.deadline.slice(0, 10)}
                                          onChange={(e) => {
                                            const updatedProducts =
                                              statisticsCreate.map(
                                                (product, i) => {
                                                  if (i === index) {
                                                    const date = new Date(
                                                      e.target.value
                                                    );
                                                    date.setUTCHours(
                                                      21,
                                                      0,
                                                      0,
                                                      0
                                                    );
                                                    return {
                                                      ...product,
                                                      deadline:
                                                        date.toISOString(),
                                                    };
                                                  }
                                                  return product;
                                                }
                                              );
                                            setStatisticsCreate(
                                              updatedProducts
                                            );
                                          }}
                                        />
                                      </td>
                                      <td className={classes.imageTableColumn}>
                                        <img
                                          src={deleteGrey}
                                          alt="deleteGrey"
                                          onClick={() =>
                                            deleteRow(item.type, item.id)
                                          }
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </>
                        )}

                        <HandlerMutation
                          Loading={isLoadingProjectMutation}
                          Error={isErrorProjectMutation && !manualErrorReset} // Учитываем ручной сброс
                          Success={
                            isSuccessProjectMutation && !manualSuccessReset
                          } // Учитываем ручной сброс
                          textSuccess={"Обновлена"}
                          textError={
                            Error?.data?.errors?.[0]?.errors?.[0]
                              ? Error.data.errors[0].errors[0]
                              : Error?.data?.message
                          }
                        ></HandlerMutation>
                      </>
                    ) : (
                      <>
                        <WaveLetters
                          letters={"Выберите пост или проект"}
                        ></WaveLetters>
                      </>
                    )}
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
