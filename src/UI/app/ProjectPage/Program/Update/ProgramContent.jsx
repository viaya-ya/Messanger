import React, { useState, useEffect } from "react";
import classes from "./ProgramContent.module.css";
import icon from "../../../../image/iconHeader.svg";
import iconBack from "../../../../image/iconBack.svg";
import Listsetting from "../../../../image/Listsetting.svg";
import glazikBlack from "../../../../image/glazikBlack.svg";
import glazikInvisible from "../../../../image/glazikInvisible.svg";
import { useNavigate, useParams } from "react-router-dom";
import Blacksavetmp from "../../../../image/Blacksavetmp.svg";
import iconAdd from "../../../../image/iconAdd.svg";
import {
  useGetProjectIdQuery,
  useGetProjectQuery,
  useGetProjectNewQuery,
  useUpdateProjectMutation,
  useGetProgramIdQuery,
} from "../../../../../BLL/projectApi.js";
import HandlerMutation from "../../../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../../../Custom/HandlerQeury.jsx";
import MyEditor from "../../../../Custom/MyEditor.jsx";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import WaveLetters from "../../../../Custom/WaveLetters.jsx";
import TableProject from "../../../../Custom/TableProject/TableProject.jsx";

export default function ProgramContent() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/startProject`);
  };
  const newProject = () => {
    navigate(`/${userId}/program/new`);
  };

  const [organizationId, setOrganizationId] = useState(""); // Сначало выбираем организацию по ней проекты
  const [selectedProjectId, setSelectedProjectId] = useState(""); // Для выбора проекта

  // Поля которые получаю от Максона
  const [projectName, setProjectName] = useState();
  const [strategy, setStrategy] = useState("null");

  const [products, setProducts] = useState([]);
  const [event, setEvent] = useState([]);
  const [rules, setRules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState([]);

  // Все для Editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlContent, setHtmlContent] = useState();
  const [showEditorState, setShowEditorState] = useState(false);

  // Для создание массивов хуйни
  const [eventCreate, setEventCreate] = useState([]);
  const [rulesCreate, setRulesCreate] = useState([]);
  const [tasksCreate, setTaskCreate] = useState([]);
  const [statisticsCreate, setStatisticsCreate] = useState([]);

  // Для обработки ошибок
  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  // Сортировка данных
  const [sortStrategies, setSortStrategies] = useState([]);

  // Disabled данных
  const [disabledTable, setDisabledTable] = useState(false);

  // Массив выбранных проектов
  const [arraySelectProjects, setArraySelectProjects] = useState([]);

  const nameTableRecieved = {
    Продукт: { array: products, setArray: setProducts },
    "Организационные мероприятия": { array: event, setArray: setEvent },
    Правила: { array: rules, setArray: setRules },
    Обычная: { array: tasks, setArray: setTasks },
    Статистика: { array: statistics, setArray: setStatistics },
  };

  const nameTableCreated = {
    "Организационные мероприятия": {
      _array: eventCreate,
      _setArray: setEventCreate,
    },
    Правила: {
      _array: rulesCreate,
      _setArray: setRulesCreate, 
    },
    Обычная: {
      _array: tasksCreate,
      _setArray: setTaskCreate,
    },
    Статистика: {
      _array: statisticsCreate,
      _setArray: setStatisticsCreate,
    },
  };

  const {
    programs = [],
    archivesPrograms = [],
    isErrorGetProject,
    isLoadingGetProject,
  } = useGetProjectQuery(
    { userId, organizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        programs: data?.programs || [],
        archivesPrograms: data?.archivesPrograms || [],
        isErrorGetProject: isError,
        isLoadingGetProject: isLoading,
      }),
      skip: !organizationId,
    }
  );

  const {
    currentProgram = {},
    currentProjects = [],
    targets = [],
    isLoadingGetProjectId,
    isErrorGetProjectId,
    isFetchingGetProjectId,
  } = useGetProgramIdQuery(
    { userId, programId: selectedProjectId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentProgram: data?.currentProgram || {},
        currentProjects: data?.currentProjects || [],
        targets: data?.targets || [],
        isLoadingGetProjectId: isLoading,
        isErrorGetProjectId: isError,
        isFetchingGetProjectId: isFetching,
      }),
      skip: !selectedProjectId,
    }
  );

  // Пока что хуйня не все переменные использую
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
  // Конец хуйни

  const [
    updateProject,
    {
      isLoading: isLoadingProjectMutation,
      isSuccess: isSuccessProjectMutation,
      isError: isErrorProjectMutation,
      error: Error,
    },
  ] = useUpdateProjectMutation();

  // Для показа информации о проекте
  const show = () => {
    setShowEditorState(!showEditorState);
  };
  // Конец показа

  // Обновление html contenta у Editora
  useEffect(() => {
    const rawContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setHtmlContent(rawContent);
  }, [editorState]);
  // Конец обновления

  // После выбора другой организации обнуляю все переменные
  useEffect(() => {
    if (organizationId) {
      setSelectedProjectId("");

      setProducts([]);
      setEvent([]);
      setRules([]);
      setTasks([]);
      setStatistics([]);

      setEventCreate([]);
      setRulesCreate([]);
      setTaskCreate([]);
      setStatisticsCreate([]);

      setHtmlContent();
      setEditorState(EditorState.createEmpty());
    }
  }, [organizationId]);

  // Для правильных данный sortStrategies
  useEffect(() => {
    if (organizationId) {
      const filteredStrategies = strategies?.filter(
        (strategy) => strategy?.organization?.id === organizationId
      );
      setSortStrategies(filteredStrategies);
    }
  }, [organizationId]);
  // Конец

  // Начальная инициализация данных при открытии по id
  useEffect(() => {
    if (currentProgram?.projectName) {
      setProjectName(currentProgram.projectName);
    }

    if (currentProgram?.strategy?.id) {
      setStrategy(currentProgram.strategy.id);
    }

    if (currentProgram.content) {
      const { contentBlocks, entityMap } = convertFromHTML(
        currentProgram.content
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
  }, [currentProgram.id]);

  useEffect(() => {
    if (targets.length > 0) {
      setProducts(
        targets
          .filter((item) => item.type === "Продукт")
          .map((item) => ({ ...item }))
      );

      setEvent(
        targets
          .filter((item) => item.type === "Организационные мероприятия")
          .map((item) => ({ ...item }))
          .sort((a, b) => a.orderNumber - b.orderNumber)
      );

      setRules(
        targets
          .filter((item) => item.type === "Правила")
          .map((item) => ({ ...item }))
          .sort((a, b) => a.orderNumber - b.orderNumber)
      );

      setTasks(
        targets
          .filter((item) => item.type === "Обычная")
          .sort((a, b) => a.orderNumber - b.orderNumber)
          .map((item) => ({ ...item }))
      );

      setStatistics(
        targets
          .filter((item) => item.type === "Статистика")
          .map((item) => ({ ...item }))
          .sort((a, b) => a.orderNumber - b.orderNumber)
      );
    }
  }, [targets, isLoadingGetProjectId, isFetchingGetProjectId]);

  useEffect(() => {
    if (currentProjects.length > 0) {
      const array = currentProjects.map((item, index) => {
        const targetWithProductType = item.targets.find(
          (target) => target.type === "Продукт"
        );

        if (targetWithProductType) {
          const worker = workers.find(
            (worker) => worker.id === targetWithProductType.holderUserId
          );
          return {
            id: item.id,
            nameProject: item.projectName,
            orderNumber: index + 1,
            content: targetWithProductType.content,
            holderUserId: worker.id,
            deadline: targetWithProductType.deadline,
          };
        }

        return {
          id: item.id,
          nameProject: item.projectName,
          orderNumber: index + 1,
          content: null,
          holderUserId: null,
          deadline: null,
        };
      });
      setTasks(array);
      setArraySelectProjects(array.map(({ id, ...rest }) => id));
    }
  }, [currentProjects]);
  // Конец

  // Пустая хуйня
  const reset = () => {};
  // конец

  //Сохранение изменений
  const saveUpdateProject = async () => {
    const Data = {};

    Data.targetUpdateDtos = [];
    Data.targetCreateDtos = [];

    // Проверки на изменения и отсутствие null
    if (strategy !== currentProgram.strategyId && strategy !== "null") {
      Data.strategyId = strategy;
    }
    if (htmlContent !== currentProgram.content && htmlContent !== null) {
      Data.content = htmlContent;
    }

    if (products.length > 0) {
      Data.targetUpdateDtos = [
        ...products.map(({ isExpired, id, ...rest }) => ({ _id: id, ...rest })),
      ];
    }
    if (event.length > 0) {
      Data.targetUpdateDtos = [
        ...Data.targetUpdateDtos,
        ...event.map(({ isExpired, id, ...rest }) => ({ _id: id, ...rest })),
      ];
    }
    if (rules.length > 0) {
      Data.targetUpdateDtos = [
        ...Data.targetUpdateDtos,
        ...rules.map(({ isExpired, id, ...rest }) => ({ _id: id, ...rest })),
      ];
    }
    if (statistics.length > 0) {
      Data.targetUpdateDtos = [
        ...Data.targetUpdateDtos,
        ...statistics.map(({ isExpired, id, ...rest }) => ({
          _id: id,
          ...rest,
        })),
      ];
    }


    if (eventCreate.length > 0) {
      Data.targetCreateDtos = [...eventCreate.map(({ id, ...rest }) => rest)];
    }
    if (rulesCreate.length > 0) {
      Data.targetCreateDtos = [
        ...Data.targetCreateDtos,
        ...rulesCreate.map(({ id, ...rest }) => rest),
      ];
    }
    if (statisticsCreate.length > 0) {
      Data.targetCreateDtos = [
        ...Data.targetCreateDtos,
        ...statisticsCreate.map(({ id, ...rest }) => rest),
      ];
    }

    if (Data.targetCreateDtos.length === 0) {
      delete Data.targetCreateDtos;
    }

    await updateProject({
      userId,
      projectId: selectedProjectId,
      _id: selectedProjectId,
      projectIds: arraySelectProjects,
      ...Data,
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
  // Конец

  // Методы для таблиц
  const add = (name) => {
    const data = nameTableCreated[name];
    const { _array, _setArray} = data;

    _setArray((prevState) => {
      const index = prevState.length + 1; // Генерация index на основе длины массива

      return [
        ...prevState,
        {
          id: new Date(),
          type: name,
          orderNumber: index,
          content: "",
          holderUserId: "",
          deadline: "",
        },
      ];
    });
  };

  const deleteRow = (name, id) => {
    const data = nameTableCreated[name];
    const { _array, _setArray } = data;
    const updated = _array
      .filter((item) => item.id !== id)
      .map((item, index) => ({
        ...item,
        orderNumber: index + 1,
      }));
    _setArray(updated);
  };
  // Конец

  const disabledFieldsArchive = () => {
    setDisabledTable(true);
  };

  // Для выбранных проектов
  const handleCheckBox = (id) => {
    setArraySelectProjects((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
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
              <span>
                Организация <span style={{ color: "red" }}>*</span>
              </span>
            </div>
            <div className={classes.div}>
              <select
                name="mySelect"
                className={classes.select}
                value={organizationId}
                onChange={(e) => {
                  setOrganizationId(e.target.value);
                }}
              >
                <option value="" disabled>
                  Выберите организацию
                </option>
                {organizations?.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.organizationName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {organizationId && (
            <div className={classes.item}>
              <div className={classes.itemName}>
                <span>
                  Выберите программу <span style={{ color: "red" }}>*</span>
                </span>
              </div>
              <div className={classes.div}>
                <select
                  className={classes.select}
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    setManualSuccessReset(true);
                    setManualErrorReset(true);

                    if (
                      archivesPrograms.some(
                        (item) => item.id === e.target.value
                      )
                    ) {
                      disabledFieldsArchive();
                    } else {
                      setDisabledTable(false);
                    }
                  }}
                >
                  <option value="" disabled>
                    Выберите программу
                  </option>
                  {programs.length !== 0 && (
                    <option
                      value="Активные"
                      disabled
                      className={classes.activeText}
                    >
                      Активные
                    </option>
                  )}

                  {programs?.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.projectName}
                      </option>
                    );
                  })}

                  {archivesPrograms.length !== 0 && (
                    <option
                      value="Завершенные"
                      disabled
                      className={classes.completedText}
                    >
                      Завершенные
                    </option>
                  )}

                  {archivesPrograms?.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.projectName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}

          {selectedProjectId && (
            <>
              <div className={classes.item}>
                <div className={classes.itemName}>
                  <span>
                    Выбрать стратегию <span style={{ color: "red" }}>*</span>
                  </span>
                </div>
                <div className={classes.div}>
                  <select
                    name="mySelect"
                    value={strategy}
                    onChange={(e) => {
                      setStrategy(e.target.value);
                    }}
                    className={classes.select}
                  >
                    <option value="null" disabled>
                      Выбрать стратегию
                    </option>
                    {sortStrategies.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.strategyNumber}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </>
          )}

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
                    {currentProgram.id ? (
                      <>
                        {showEditorState ? (
                          <MyEditor
                            editorState={editorState}
                            setEditorState={setEditorState}
                          />
                        ) : (
                          <>
                            {Object.keys(nameTableRecieved).map((key) => {
                              const { array, setArray } =
                                nameTableRecieved[key];

                              const { _array = [], _setArray = () => {} } =
                                nameTableCreated[key] || {};

                              return (
                                <TableProject
                                  tableKey={key}
                                  nameTable={key}
                                  add={add}
                                  array={array}
                                  setArray={setArray}
                                  _array={_array}
                                  _setArray={_setArray}
                                  workers={workers}
                                  deleteRow={deleteRow}
                                  disabledTable={disabledTable}
                                  disabledProject={true}
                                  handleCheckBox={handleCheckBox}
                                  arraySelectProjects={arraySelectProjects}
                                  updateProgramm={true}
                                />
                              );
                            })}
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
