import React, { useState, useEffect } from "react";
import classes from "./StrategContent.module.css";
import icon from "../../image/iconHeader.svg";
import Select from "../../image/Select.svg";
import iconBack from "../../image/iconBack.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import iconAdd from "../../image/iconAdd.svg";
import email from "../../image/email.svg";
import iconGroup from "../../image/iconGroup.svg";
import greySavetmp from "../../image/greySavetmp.svg";
import watch from "../../image/watch.svg";
import MyEditor from "../../Custom/MyEditor";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import { useNavigate, useParams } from "react-router-dom";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import formatDate from "../../Custom/FuncFormatedDate.js";
import {
  useGetStrategIdQuery,
  useGetStrategQuery,
  useUpdateStrategMutation,
  useGetStrategNewQuery,
  usePostStrategMutation,
} from "../../../BLL/strategApi.js";
import styles from "../../Custom/CommonStyles.module.css";
import WaveLetters from "../../Custom/WaveLetters.jsx";
import ModalWindow from "../../Custom/ModalWindow.jsx";

export default function StrategContent() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const back = () => {
    navigate(`/${userId}/start`);
  };

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlContent, setHtmlContent] = useState();
  const [state, setState] = useState("");
  const [number, setNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  const [organizationId, setOrganizationId] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [activeStrategDB, setActiveStrategDB] = useState(null);
  const [disabledSelectStrategy, setDisabledSelectStrategy] = useState(true);

  const [openModalDraft, setOpenModalDraft] = useState(false);
  const [postId, setPostId] = useState(null);
  const [manualPostSuccessReset, setManualPostSuccessReset] = useState(false);
  const [manualPostErrorReset, setManualPostErrorReset] = useState(false);

  const {
    getOrganizations = [],
    isLoadingNewStrateg,
    isErrorNewStrateg,
  } = useGetStrategNewQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      getOrganizations: data?.organizations || [],
      isLoadingNewStrateg: isLoading,
      isErrorNewStrateg: isError,
    }),
  });

  const {
    data = {},
    completedStrategies = [],
    draftAndActiveStrategies = [],
    hasDraftStrategy,
    isLoadingStrateg,
    isFetchingStrateg,
    isErrorStrateg,
  } = useGetStrategQuery(
    { userId, organizationId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        data: data?.data || {},
        draftAndActiveStrategies: data?.draftAndActiveStrategies || [],
        completedStrategies: data?.completedStrategies || [],
        hasDraftStrategy: data?.hasDraftStrategy || false,
        isLoadingStrateg: isLoading,
        isFetchingStrateg: isFetching,
        isErrorStrateg: isError,
      }),
      skip: !organizationId,
    }
  );

  const {
    currentStrategy = {},
    isLoadingGetStrategId,
    isErrorGetStrategId,
    isFetchingGetStrategId,
  } = useGetStrategIdQuery(
    { userId, strategyId: number },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentStrategy: data?.currentStrategy || {},
        isLoadingGetStrategId: isLoading,
        isErrorGetStrategId: isError,
        isFetchingGetStrategId: isFetching,
      }),
      skip: !number,
    }
  );

  //coздание черновика
  useEffect(() => {
    if (postId !== null) {
      setNumber(postId);
    }
  }, [postId]);

  const newStrateg = () => {
    if (hasDraftStrategy) {
      setOpenModalDraft(true);
    } else {
      setManualPostSuccessReset(true);
      setManualPostErrorReset(true);
      savePostStarteg();
    }
  };

  const [
    postStarteg,
    {
      isLoading: isLoadingPostStrateg,
      isError: isErrorPostStrateg,
      isSuccess: isSuccessPostStrateg,
      error: ErrorPostStrateg,
    },
  ] = usePostStrategMutation();

  const savePostStarteg = async () => {
    await postStarteg({
      userId,
      content: " ",
      organizationId: organizationId,
    })
      .unwrap()
      .then((result) => {
        setManualPostSuccessReset(false);
        setManualPostErrorReset(false);
        setPostId(result.id);
      })
      .catch((error) => {
        setManualPostErrorReset(false);
        // При ошибке также сбрасываем флаги
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  //остальная хуйня
  useEffect(() => {
    if (organizationId !== "") {
      const activeStrateg = data?.strategies?.find(
        (item) => item.state === "Активный"
      );
      console.log("activeStrateg");
      console.log(activeStrateg);
      setActiveStrategDB(activeStrateg?.id);
    }
  }, [organizationId, isLoadingStrateg, isFetchingStrateg]);

  useEffect(() => {
    if (organizationId !== "") {
      setDisabledSelectStrategy(false);
    }
  }, [organizationId]);

  useEffect(() => {
    const rawContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setHtmlContent(rawContent);
  }, [editorState]);

  useEffect(() => {
    setState(currentStrategy.state);

    if (currentStrategy.content) {
      const { contentBlocks, entityMap } = convertFromHTML(
        currentStrategy.content
      );
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const oldEditorState = EditorState.createWithContent(contentState);
      setEditorState(oldEditorState);
    }
  }, [currentStrategy.id, isLoadingGetStrategId, isFetchingGetStrategId]);

  const [
    updateStrateg,
    {
      isLoading: isLoadingUpdateStrategMutation,
      isSuccess: isSuccessUpdateStrategMutation,
      isError: isErrorUpdateStrategMutation,
      error: ErrorUpdateStrategMutation,
    },
  ] = useUpdateStrategMutation();

  const resetRequest = () => {
    setManualSuccessReset(false);
    setManualErrorReset(false);
    setEditorState(EditorState.createEmpty());
    setHtmlContent();
    setState("");
    setSelectedDate("");
    setOpenModal(false);
    setActiveStrategDB(null);
  };

  const resetSelect = () => {
    setManualSuccessReset(true);
    setManualErrorReset(true);

    setManualPostSuccessReset(true);
    setManualPostErrorReset(true);
    
    setEditorState(EditorState.createEmpty());
    setHtmlContent();
    setState("");
    setSelectedDate("");
    setNumber("");
  };

  const save = () => {
    console.log("save");
    console.log(state);
    console.log(currentStrategy.state);
    console.log(activeStrategDB);
    if (
      state === "Активный" &&
      currentStrategy.state === "Черновик" &&
      activeStrategDB
    ) {
      setOpenModal(true);
    } else {
      saveUpdateStrateg();
    }
  };

  const btnYes = async () => {
    await updateStrateg({
      userId,
      strategyId: activeStrategDB,
      _id: activeStrategDB,
      state: "Завершено",
    })
      .unwrap()
      .then(() => {
        saveUpdateStrateg();
      })
      .catch((error) => {
        // При ошибке также сбрасываем флаги
        setManualErrorReset(false);
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const btnNo = async () => {
    const Data = [];
    if (htmlContent !== currentStrategy.content) {
      Data.content = htmlContent;
    }
    if (Data.content) {
      await updateStrateg({
        userId,
        strategyId: number,
        _id: number,
        ...Data,
      })
        .unwrap()
        .then(() => {
          setState("Черновик");
          setOpenModal(false);
        })
        .catch((error) => {
          // При ошибке также сбрасываем флаги
          setManualErrorReset(false);
          console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
        });
    } else {
      setOpenModal(false);
      setState("Черновик");
    }
  };

  const saveUpdateStrateg = async () => {
    const Data = [];
    if (state !== "" && state !== currentStrategy.state) {
      Data.state = state;
    }
    if (htmlContent !== currentStrategy.content) {
      Data.content = htmlContent;
    }
    await updateStrateg({
      userId,
      strategyId: number,
      _id: number,
      ...Data,
    })
      .unwrap()
      .then(() => {
        resetRequest();
      })
      .catch((error) => {
        // При ошибке также сбрасываем флаги
        setManualErrorReset(false);
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };
console.log("isErrorPostStrateg  && !manualPostErrorReset");
console.log(isErrorPostStrateg  && !manualPostErrorReset);
console.log("isSuccessPostStrateg && !manualPostSuccessReset");
console.log(isSuccessPostStrateg && !manualPostSuccessReset);
  return (
    <div className={classes.dialog}>
      <div className={styles.header}>
        <div className={styles.fon}></div>
        <div className={styles.pomoshnikSearch}>
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

        <div className={styles.editText}>
          <div className={classes.date}>
            <div>
              <select
                value={organizationId}
                onChange={(e) => {
                  if (e.target.value) {
                    resetSelect();
                    setOrganizationId(e.target.value);
                  }
                }}
                className={classes.select}
              >
                <option value="" disabled>
                  {" "}
                  Выберите организацию{" "}
                </option>
                {getOrganizations?.map((item) => {
                  return (
                    <option value={item.id}> {item.organizationName}</option>
                  );
                })}
              </select>
            </div>

            <div>
              <select
                value={number}
                onChange={(e) => {
                  resetSelect();
                  const selectedId = e.target.value;
                  setNumber(selectedId);
                  const selectedItem = data.strategyToOrganizations?.find(
                    (item) => item?.strategy.id === selectedId
                  );
                  if (selectedItem) {
                    setSelectedDate(selectedItem.dateActive);
                  }
                }}
                className={`${classes.select} ${
                  (state && currentStrategy.state) === "Активный"
                    ? classes.active
                    : (state && currentStrategy.state) === "Завершено"
                    ? classes.completed
                    : classes.draft
                }`}
                disabled={disabledSelectStrategy}
              >
                <option value="" disabled>
                  Выберите стратегию
                </option>
                {draftAndActiveStrategies?.map((item) => (
                  <option
                    key={item?.id}
                    value={item?.id}
                    className={`${
                      item.state === "Активный" ? classes.active : classes.draft
                    }`}
                  >
                    Стратегия № {item?.strategyNumber}
                  </option>
                ))}

                {completedStrategies?.map((item) => (
                  <option
                    key={item?.id}
                    value={item?.id}
                    className={`${classes.completed}`}
                  >
                    Стратегия № {item?.strategyNumber}
                  </option>
                ))}
              </select>
            </div>

            {selectedDate && number && (
              <div>
                <img src={watch} alt="watch" style={{ marginRight: "10px" }} />
                <input type="date" value={formatDate(selectedDate)} readOnly />
              </div>
            )}
          </div>

          {number ? (
            <>
              <div className={classes.item}>
                <div className={classes.itemName}>
                  <span>
                    Состояние <span style={{ color: "red" }}>*</span>
                  </span>
                </div>
                <div className={classes.div}>
                  <select
                    name="mySelect"
                    className={classes.select}
                    value={state || currentStrategy.state}
                    onChange={(e) => {
                      setState(e.target.value);
                    }}
                    disabled={currentStrategy.state === "Завершено"}
                  >
                    <option value="" disabled>
                      {" "}
                      Выберите состояние
                    </option>
                    {currentStrategy.state === "Черновик" && (
                      <>
                        <option value="Активный">Активный</option>
                        <option value="Черновик">Черновик</option>
                      </>
                    )}

                    {currentStrategy.state === "Активный" && (
                      <>
                        <option value="Активный">Активный</option>
                        <option value="Завершено">Завершено</option>
                      </>
                    )}

                    {currentStrategy.state === "Завершено" && (
                      <>
                        <option value="Завершено">Завершено</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* <div className={classes.item}>
                <div className={classes.itemName}>
                  <span>Помененять организацию</span>
                </div>
                <div className={classes.div}>
                  <select
                    name="mySelect"
                    className={classes.select}
                    value={updateOrganizationId}
                    onChange={(e) => {
                      setUpdateOrganizationId(e.target.value);
                    }}
                  >
                    <option value="null">Выберите опцию</option>
                    {getOrganizations?.map((item) => {
                      return (
                        <option value={item.id}>{item.organizationName}</option>
                      );
                    })}
                  </select>
                </div>
              </div> */}
            </>
          ) : (
            <></>
          )}

          {/* <div className={classes.two}>
            <div className={classes.blockSelect}>
              <img src={Select} alt="Select" />
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
          </div> */}

          <div className={classes.actionButton}>
            <div className={classes.iconAdd}>
              <img
                src={iconAdd}
                alt="iconAdd"
                className={classes.image}
                onClick={() => newStrateg()}
              />
            </div>
            <div className={classes.iconSave}>
              <img
                src={Blacksavetmp}
                alt="Blacksavetmp"
                className={classes.image}
                onClick={() => save()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.main}>
        {isErrorStrateg && isErrorNewStrateg ? (
          <>
            <HandlerQeury Error={true}></HandlerQeury>
          </>
        ) : (
          <>
            {isErrorGetStrategId ? (
              <HandlerQeury Error={isErrorGetStrategId}></HandlerQeury>
            ) : (
              <>
                <HandlerQeury Loading={isLoadingNewStrateg}></HandlerQeury>
                <HandlerQeury Loading={isLoadingStrateg}></HandlerQeury>

                {isLoadingGetStrategId || isFetchingGetStrategId ? (
                  <HandlerQeury
                    Loading={isLoadingGetStrategId}
                    Fetching={isFetchingGetStrategId}
                  ></HandlerQeury>
                ) : (
                  <>
                    {currentStrategy.id ? (
                      <>
                        <MyEditor
                          key={currentStrategy.id}
                          editorState={editorState}
                          setEditorState={setEditorState}
                          readOnly={currentStrategy.state === "Завершено"}
                        />

                        <HandlerMutation
                          Loading={isLoadingUpdateStrategMutation}
                          Error={
                            isErrorUpdateStrategMutation && !manualErrorReset
                          } // Учитываем ручной сброс
                          Success={
                            isSuccessUpdateStrategMutation &&
                            !manualSuccessReset
                          } // Учитываем ручной сброс
                          textSuccess={"Стратегия обновлена"}
                          textError={
                            ErrorUpdateStrategMutation?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorUpdateStrategMutation.data.errors[0]
                                  .errors[0]
                              : ErrorUpdateStrategMutation?.data?.message
                          }
                        ></HandlerMutation>

                         <HandlerMutation
                          Loading={isLoadingPostStrateg}
                          Error={isErrorPostStrateg  && !manualPostErrorReset}
                          Success={isSuccessPostStrateg && !manualPostSuccessReset}
                          textSuccess={"Стратегия успешно создана."}
                          textError={
                            ErrorPostStrateg?.data?.errors?.[0]?.errors?.[0]
                              ? ErrorPostStrateg.data.errors[0].errors[0]
                              : ErrorPostStrateg?.data?.message
                          }
                        ></HandlerMutation>
                      </>
                    ) : (
                      <>
                        <WaveLetters
                          letters={"Выберите стратегию"}
                        ></WaveLetters>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
        {openModal ? (
          <ModalWindow
            text={
              "У Вас уже есть Активная стратегия, при нажатии на Да, Она будет завершена."
            }
            close={setOpenModal}
            btnYes={btnYes}
            btnNo={btnNo}
          ></ModalWindow>
        ) : (
          <></>
        )}

        {openModalDraft ? (
          <ModalWindow
            text={"У Вас уже есть Черновик стратегии"}
            close={setOpenModalDraft}
            exitBtn={true}
          ></ModalWindow>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
