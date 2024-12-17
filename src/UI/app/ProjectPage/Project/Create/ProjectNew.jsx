import React, { useState, useEffect } from "react";
import classes from "./ProjectNew.module.css";
import icon from "../../../../image/iconHeader.svg";
import iconBack from "../../../../image/iconBack.svg";

import Listsetting from "../../../../image/Listsetting.svg";
import glazikBlack from "../../../../image/glazikBlack.svg";
import glazikInvisible from "../../../../image/glazikInvisible.svg";
import Blacksavetmp from "../../../../image/Blacksavetmp.svg";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProjectNewQuery,
  usePostProjectMutation,
} from "../../../../../BLL/projectApi.js";

import HandlerMutation from "../../../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../../../Custom/HandlerQeury.jsx";
import MyEditor from "../../../../Custom/MyEditor.jsx";
import { EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import TableProject from "../../../../Custom/TableProject/TableProject.jsx";
import { useDispatch } from "react-redux";
import {
  setProjectCreatedId,
  setProjectOrganizationId,
} from "../../../../../BLL/Project/Slice/projectSlice.js";



export default function ProjectNew() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const dispatch = useDispatch();

  const back = () => {
    navigate(`/${userId}/project`);
  };

  const [name, setName] = useState("");

  const [programId, setProgramId] = useState("null");
  const [disabledProgramId, setDisabledProgramId] = useState(true);

  const [strategy, setStrategy] = useState("null");
  const [disabledStrategy, setDisabledStrategy] = useState(true);

  const [products, setProducts] = useState([
    {
      type: "Продукт",
      orderNumber: 1,
      content: "",
      holderUserId: "",
      deadline: "",
    },
  ]);
  const [event, setEvent] = useState([]);
  const [rules, setRules] = useState([]);
  const [tasks, setTasks] = useState([
    {
      type: "Обычная",
      orderNumber: 1,
      content: "",
      holderUserId: "",
      deadline: "",
    },
  ]);
  const [statistics, setStatistics] = useState([]);

  const [organizationId, setOrganizationId] = useState("");
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
  const [sortStrategies, setSortStrategies] = useState([]);
  const [sortPrograms, setSortPrograms] = useState([]);

  const nameTable = {
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

  useEffect(() => {
    if (organizationId) {
      const filteredStrategies = strategies?.filter(
        (strategy) => strategy?.organization?.id === organizationId
      );
      setSortStrategies(filteredStrategies);

      const filteredPrograms = programs?.filter(
        (program) => program?.organization?.id === organizationId
      );
      setSortPrograms(filteredPrograms);

      setDisabledProgramId(false);
      setDisabledStrategy(false);
    }
  }, [organizationId]);

  useEffect(() => {
    if (programId !== "null") {
      const obj = programs?.find(
        (program) => program.id === programId
      );
      setStrategy(obj?.strategy?.id);
      setDisabledStrategy(true);
    } else {
      setDisabledStrategy(false);
    }
  }, [programId]);

  const reset = () => {
    setName("");

    setStrategy("null");
    setProgramId("null");

    setProducts([
      {
        type: "Продукт",
        orderNumber: 1,
        content: "",
        holderUserId: "",
        deadline: "",
      },
    ]);
    setTasks([
      {
        type: "Обычная",
        orderNumber: 1,
        content: "",
        holderUserId: "",
        deadline: "",
      },
    ]);
    setEvent([]);
    setRules([]);
    setStatistics([]);

    setHtmlContent(null);
    setEditorState(EditorState.createEmpty());
  };

  const saveProject = async () => {
    const Data = {};
    Data.targetCreateDtos = [];

    Data.projectName = name;
    Data.type = "Проект";
    Data.organizationId = organizationId;

    if (programId !== "null") {
      Data.programId = programId;
    }
    if (strategy !== "null") {
      Data.strategyId = strategy;
    }
    if (htmlContent !== null) {
      Data.content = htmlContent;
    }
    if (event.length > 0) {
      Data.targetCreateDtos = [...event.map(({ id, ...rest }) => rest)];
    }
    if (rules.length > 0) {
      Data.targetCreateDtos = [
        ...Data.targetCreateDtos,
        ...rules.map(({ id, ...rest }) => rest),
      ];
    }
    if (statistics.length > 0) {
      Data.targetCreateDtos = [
        ...Data.targetCreateDtos,
        ...statistics.map(({ id, ...rest }) => rest),
      ];
    }
    Data.targetCreateDtos = [
      ...Data.targetCreateDtos,
      ...tasks.map(({ id, ...rest }) => rest),
      ...products,
    ];
    await postProject({
      userId,
      ...Data,
    })
      .unwrap()
      .then((result) => {
        dispatch(setProjectOrganizationId(organizationId));
        dispatch(setProjectCreatedId(result.id));
        reset();
        back();
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const add = (name) => {
    const data = nameTable[name];
    const { array, setArray } = data;

    setArray((prevState) => {
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
    const data = nameTable[name];
    const { array, setArray } = data;
    const updated = array
      .filter((item) => item.id !== id)
      .map((item, index) => ({
        ...item,
        orderNumber: index + 1,
      }));
    setArray(updated);
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
                Название <span style={{ color: "red" }}>*</span>
              </span>
            </div>
            <div className={classes.div}>
              <input
                className={classes.select}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </div>

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
                    <option value={item.id}>{item.organizationName}</option>
                  );
                })}
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
                disabled={disabledProgramId}
              >
                <option value="null">—</option>
                {sortPrograms.map((item) => {
                  return <option value={item.id}>{item.projectName}</option>;
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
                    <option
                      value={item.id}
                      className={` ${
                        item.state === "Активный" ? classes.active : ""
                      }`}
                    >
                      Стратегия №{item.strategyNumber}
                    </option>
                  );
                })}
              </select>
            </div>
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
                  textSuccess={"Проект создан."}
                  textError={
                    Error?.data?.errors?.[0]?.errors?.[0]
                      ? Error.data.errors[0].errors[0]
                      : Error?.data?.message
                  }
                ></HandlerMutation>

         
                  {Object.keys(nameTable).map((key) => {
                    const { array, setArray, isShow } = nameTable[key]; // Деструктурируем данные
                    return (
                      isShow && (
                        <TableProject
                          key={key}
                          nameTable={key}
                          add={add}
                          array={array}
                          setArray={setArray}
                          workers={workers}
                          deleteRow={deleteRow}
                          createProject={true}
                        />
                      )
                    );
                  })}
          

                {showInformation && (
                  <MyEditor
                    editorState={editorState}
                    setEditorState={setEditorState}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
