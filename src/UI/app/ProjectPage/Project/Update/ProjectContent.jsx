import React, { useState, useEffect } from "react";
import classes from "./ProjectContent.module.css";
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
} from "../../../../../BLL/projectApi.js";
import HandlerMutation from "../../../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../../../Custom/HandlerQeury.jsx";
import MyEditor from "../../../../Custom/MyEditor.jsx";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import WaveLetters from "../../../../Custom/WaveLetters.jsx";
import TableProject from "../../../../Custom/TableProject/TableProject.jsx";
import { useSelector } from "react-redux";
import Lupa from "../../../../Custom/Lupa/Lupa.jsx";

export default function ProjectContent() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/startProject`);
  };

  const newProject = () => {
    navigate(`/${userId}/project/new`);
  };

  const [organizationId, setOrganizationId] = useState(""); // Сначало выбираем организацию по ней проекты
  const [selectedProjectId, setSelectedProjectId] = useState(""); // Для выбора проекта

  // Поля которые получаю от Максона
  const [projectName, setProjectName] = useState();
  const [type, setType] = useState();
  const [strategy, setStrategy] = useState("null");
  const [programId, setProgramId] = useState("null");

  const [products, setProducts] = useState([]);
  const [event, setEvent] = useState([]);
  const [rules, setRules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState([]);

  // Все для Editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlContent, setHtmlContent] = useState();

  const [showEvent, setShowEvent] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showInformation, setShowInformation] = useState(false);

  const showTable = {
    "Организационные мероприятия": {
      isShow: showEvent,
      setIsShow: setShowEvent,
    },
    Правила: { isShow: showRules, setIsShow: setShowRules },
    Метрика: { isShow: showStatistics, setIsShow: setShowStatistics },
    Информация: { isShow: showInformation, setIsShow: setShowInformation },
  };

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
  const [sortPrograms, setSortPrograms] = useState([]);

  // Disabled данных
  const [disabledStrategy, setDisabledStrategy] = useState(false);
  const [disabledProgramId, setDisabledProgramId] = useState(false);
  const [disabledTable, setDisabledTable] = useState(false);

  const nameTableRecieved = {
    Продукт: { array: products, setArray: setProducts, isShow: true },
    Обычная: { array: tasks, setArray: setTasks, isShow: true },

    "Организационные мероприятия": {
      array: event,
      setArray: setEvent,
      isShow: showEvent,
    },
    Правила: { array: rules, setArray: setRules, isShow: showRules },
    Статистика: {
      array: statistics,
      setArray: setStatistics,
      isShow: showStatistics,
    },
  };

  const nameTableCreated = {
    Обычная: {
      _array: tasksCreate,
      _setArray: setTaskCreate,
    },

    "Организационные мероприятия": {
      _array: eventCreate,
      _setArray: setEventCreate,
    },
    Правила: {
      _array: rulesCreate,
      _setArray: setRulesCreate,
    },
    Статистика: {
      _array: statisticsCreate,
      _setArray: setStatisticsCreate,
    },
  };

  //Лупа
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const {
    projects = [],
    archivesProjects = [],

    projectsWithProgram = [],
    archivesProjectsWithProgram = [],
    isErrorGetProject,
    isLoadingGetProject,
  } = useGetProjectQuery(
    { userId, organizationId },
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        projects: data?.projects || [],
        archivesProjects: data?.archivesProjects || [],

        projectsWithProgram: data?.projectsWithProgram || [],
        archivesProjectsWithProgram: data?.archivesProjectsWithProgram || [],

        isErrorGetProject: isError,
        isLoadingGetProject: isLoading,
      }),
      skip: !organizationId,
    }
  );

  
  const {
    workers = [],
    strategies = [],
    organizations = [],
    programs = [],
    isLoadingGetNew,
    isErrorGetNew,
  } = useGetProjectNewQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      workers: data?.workers || [],
      strategies: data?.strategies || [],
      organizations: data?.organizations || [],
      programs: data?.programs || [],
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

  const [
    updateProject,
    {
      isLoading: isLoadingProjectMutation,
      isSuccess: isSuccessProjectMutation,
      isError: isErrorProjectMutation,
      error: Error,
    },
  ] = useUpdateProjectMutation();

  // После создания нового проекта он открывается
  const projectCreatedId = useSelector(
    (state) => state.project.projectCreatedId
  );
  const organizationProjectId = useSelector(
    (state) => state.project.organizationProjectId
  );

  useEffect(() => {
    if (organizationProjectId) {
      setOrganizationId(organizationProjectId);
    }
  }, []);

  // Обновление html contenta у Editora
  useEffect(() => {
    const rawContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setHtmlContent(rawContent);
  }, [editorState]);

  useEffect(() => {
    if (organizationId) {
      // Сброс переменных
      setSelectedProjectId(""); // Сначала сбросить проект

      setStrategy("null");
      setProgramId("null");

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

      // Фильтрация массивов
      const filteredStrategies = strategies?.filter(
        (strategy) => strategy?.organization?.id === organizationId
      );
      setSortStrategies(filteredStrategies);

      const filteredPrograms = programs?.filter(
        (program) => program?.organization?.id === organizationId
      );
      setSortPrograms(filteredPrograms);

      // Установить новый проект
      if (projectCreatedId) {
        setSelectedProjectId(projectCreatedId);
      }
      // Для открытия созданного нового проекта
    }
  }, [organizationId, strategies, programs, projectCreatedId]);

  useEffect(() => {
    if (programId !== "null") {
      const obj = programs?.find(
        (program) => program?.organization?.id === organizationId
      );
      setStrategy(obj?.strategy?.id);
      setDisabledStrategy(true);
    } else {
      setDisabledStrategy(false);
    }
  }, [programId]);

  // Начальная инициализация данных при открытии по id
  useEffect(() => {
    if (currentProject?.projectName) {
      setProjectName(currentProject.projectName);
    }

    if (currentProject?.type) {
      setType(currentProject.type);
    }

    if (currentProject?.strategy?.id) {
      setStrategy(currentProject.strategy.id);
    } else {
      setStrategy("null");
    }

    if (currentProject?.programId) {
      setProgramId(currentProject?.programId);
    } else {
      setProgramId("null");
    }

    if (currentProject.content) {
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
  }, [currentProject.id]);

  useEffect(() => {
    if (targets.length > 0) {
      setProducts(
        targets
          .filter((item) => item.type === "Продукт")
          .map((item) => ({ ...item, holderUserIdchange: item.holderUserId }))
          .sort((a, b) => a.orderNumber - b.orderNumber)
      );

      setEvent(
        targets
          .filter((item) => item.type === "Организационные мероприятия")
          .map((item) => ({ ...item, holderUserIdchange: item.holderUserId }))
          .sort((a, b) => a.orderNumber - b.orderNumber)
      );

      setRules(
        targets
          .filter((item) => item.type === "Правила")
          .map((item) => ({ ...item, holderUserIdchange: item.holderUserId }))
          .sort((a, b) => a.orderNumber - b.orderNumber)
      );

      setTasks(
        targets
          .filter((item) => item.type === "Обычная")
          .map((item) => ({ ...item, holderUserIdchange: item.holderUserId }))
          .sort((a, b) => a.orderNumber - b.orderNumber)
      );

      setStatistics(
        targets
          .filter((item) => item.type === "Статистика")
          .map((item) => ({ ...item, holderUserIdchange: item.holderUserId }))
          .sort((a, b) => a.orderNumber - b.orderNumber)
      );
    }
  }, [targets, isLoadingGetProjectId, isFetchingGetProjectId]);

  // Сброс данных
  const reset = () => {
    setEventCreate([]);
    setRulesCreate([]);
    setTaskCreate([]);
    setStatisticsCreate([]);
  };

  // Сохранение изменений
  const saveUpdateProject = async () => {
    const Data = {};

    Data.targetUpdateDtos = [];
    Data.targetCreateDtos = [];
    Data.type = "Проект";

    // Проверки на изменения и отсутствие null

    if (projectName !== currentProject.projectName) {
      Data.projectName = projectName;
    }

    if (!(currentProject.strategy?.id === undefined && strategy === "null")) {
      Data.strategyId = strategy === "null" ? null : strategy;
    }

    if (!(currentProject.programId === null && programId === "null")) {
      Data.programId = programId === "null" ? null : programId;
    }

    if (htmlContent !== currentProject.content && htmlContent !== null) {
      Data.content = htmlContent;
    }

    if (products.length > 0) {
      Data.targetUpdateDtos = [
        ...products.map(
          ({ isExpired, id, holderUserId, holderUserIdchange, ...rest }) => {
            if (holderUserId === holderUserIdchange) {
              return {
                _id: id,
                ...rest,
              };
            } else {
              return {
                _id: id,
                ...rest,
                holderUserId,
              };
            }
          }
        ),
      ];
    }
    if (tasks.length > 0) {
      const array = tasks.map(
        (
          { isExpired, id, holderUserId, holderUserIdchange, ...rest },
          index
        ) => ({
          _id: id,
          ...rest,
          orderNumber: index + 1,
          ...(holderUserIdchange !== holderUserId && { holderUserId }),
        })
      );

      Data.targetUpdateDtos = [...Data.targetUpdateDtos, ...array];
    }

    if (event.length > 0) {
      const array = event.map(
        (
          { isExpired, id, holderUserId, holderUserIdchange, ...rest },
          index
        ) => ({
          _id: id,
          ...rest,
          orderNumber: index + 1,
          ...(holderUserIdchange !== holderUserId && { holderUserId }),
        })
      );

      Data.targetUpdateDtos = [...Data.targetUpdateDtos, ...array];
    }
    if (rules.length > 0) {
      const array = rules.map(
        (
          { isExpired, id, holderUserId, holderUserIdchange, ...rest },
          index
        ) => ({
          _id: id,
          ...rest,
          orderNumber: index + 1,
          ...(holderUserIdchange !== holderUserId && { holderUserId }),
        })
      );

      Data.targetUpdateDtos = [...Data.targetUpdateDtos, ...array];
    }
    if (statistics.length > 0) {
      const array = statistics.map(
        (
          { isExpired, id, holderUserId, holderUserIdchange, ...rest },
          index
        ) => ({
          _id: id,
          ...rest,
          orderNumber: index + 1,
          ...(holderUserIdchange !== holderUserId && { holderUserId }),
        })
      );
      Data.targetUpdateDtos = [...Data.targetUpdateDtos, ...array];
    }

    if (eventCreate.length > 0) {
      Data.targetCreateDtos = [...eventCreate.map(({ id, ...rest }, index) => ({...rest, orderNumber: event.length + index + 1}))];
    }
    if (rulesCreate.length > 0) {
      Data.targetCreateDtos = [
        ...Data.targetCreateDtos,
        ...rulesCreate.map(({ id, ...rest }, index) => ({...rest, orderNumber: rules.length + index + 1})),
      ];
    }
    if (tasksCreate.length > 0) {
      Data.targetCreateDtos = [
        ...Data.targetCreateDtos,
        ...tasksCreate.map(({ id, ...rest }, index) => ({...rest, orderNumber: tasks.length + index + 1})),
      ];
    }
    if (statisticsCreate.length > 0) {
      Data.targetCreateDtos = [
        ...Data.targetCreateDtos,
        ...statisticsCreate.map(({ id, ...rest }, index) => ({...rest, orderNumber: statistics.length + index + 1})),
      ];
    }

    if (Data.targetCreateDtos.length === 0) {
      delete Data.targetCreateDtos;
    }

    await updateProject({
      userId,
      projectId: selectedProjectId,
      _id: selectedProjectId,
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

  // Методы для таблиц
  const add = (name) => {
    const data = nameTableCreated[name];
    const { _array, _setArray } = data;
  
    _setArray((prevState) => {
      const index = prevState.length + 1;
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

  const disabledFieldsArchive = (state) => {
    setDisabledProgramId(state);
    setDisabledStrategy(state);
    setDisabledTable(state);
  };

  useEffect(() => {
    if (selectedProjectId) {
      setManualSuccessReset(true);
      setManualErrorReset(true);

      if (archivesProjects.some((item) => item.id === selectedProjectId) || archivesProjectsWithProgram.some((item) => item.id === selectedProjectId)) {
        disabledFieldsArchive(true);
      } else {
        disabledFieldsArchive(false);
      }
    }
  }, [selectedProjectId]);

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
                <span>Выберите проект</span>
              </div>

              <div className={classes.div}>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                  }}
                  className={classes.select}
                  disabled={disabledTable}
                />
                <Lupa
                  setIsOpenSearch={setIsOpenSearch}
                  isOpenSearch={isOpenSearch}
                  select={setSelectedProjectId}
                  projects={projects}
                  archivesProjects={archivesProjects}
                  projectsWithProgram={projectsWithProgram}
                  archivesProjectsWithProgram={archivesProjectsWithProgram}
                ></Lupa>
              </div>
            </div>
          )}

          {selectedProjectId && (
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
                    disabled={disabledProgramId}
                  >
                    <option value="null">—</option>
                    {sortPrograms.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.projectName}
                        </option>
                      );
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
                    value={strategy}
                    onChange={(e) => {
                      setStrategy(e.target.value);
                    }}
                    className={classes.select}
                    disabled={disabledStrategy}
                  >
                    <option value="null">—</option>
                    {sortStrategies.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          Стратегия №{item.strategyNumber}
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
              <li>
                <img src={glazikBlack} alt="glazikBlack" />
                Продукт
              </li>
              <li>
                <img src={glazikBlack} alt="glazikBlack" /> Задача
              </li>

              {Object.keys(showTable).map((key) => {
                const { isShow, setIsShow } = showTable[key];
                return (
                  <li onClick={() => setIsShow(!isShow)}>
                    {isShow ? (
                      <img src={glazikBlack} alt="glazikBlack" />
                    ) : (
                      <img src={glazikInvisible} alt="glazikInvisible" />
                    )}

                    {key}
                  </li>
                );
              })}
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
        {isErrorGetProject || isErrorGetNew ? (
          <>
            <HandlerQeury
              Error={isErrorGetProject || isErrorGetNew}
            ></HandlerQeury>
          </>
        ) : (
          <>
            <HandlerQeury
              Loading={isLoadingGetProject || isLoadingGetNew}
            ></HandlerQeury>

            {isErrorGetProjectId ? (
              <HandlerQeury Error={isErrorGetProjectId}></HandlerQeury>
            ) : (
              <>
                {isLoadingGetProjectId || isFetchingGetProjectId ? (
                  <HandlerQeury
                    Loading={isLoadingGetProjectId}
                    Fetching={isFetchingGetProjectId}
                  ></HandlerQeury>
                ) : (
                  <>
                    {currentProject.id ? (
                      <>
                        {Object.keys(nameTableRecieved).map((key) => {
                          const { array, setArray, isShow } =
                            nameTableRecieved[key];

                          const { _array = [], _setArray = () => {} } =
                            nameTableCreated[key] || {};

                          return (
                            isShow && (
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
                                updateProject={true}
                              />
                            )
                          );
                        })}

                        {showInformation && (
                          <MyEditor
                            editorState={editorState}
                            setEditorState={setEditorState}
                            readOnly = {disabledTable}
                          />
                        )}

                        <HandlerMutation
                          Loading={isLoadingProjectMutation}
                          Error={isErrorProjectMutation && !manualErrorReset} // Учитываем ручной сброс
                          Success={
                            isSuccessProjectMutation && !manualSuccessReset
                          } // Учитываем ручной сброс
                          textSuccess={"Проект обновлен"}
                          textError={
                            Error?.data?.errors?.[0]?.errors?.[0]
                              ? Error.data.errors[0].errors[0]
                              : Error?.data?.message
                          }
                        ></HandlerMutation>
                      </>
                    ) : (
                      <>
                        <WaveLetters letters={"Выберите проект"}></WaveLetters>
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
