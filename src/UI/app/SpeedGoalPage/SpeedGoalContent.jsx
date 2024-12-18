import React, { useState, useEffect } from "react";
import classes from "./SpeedGoalContent.module.css";
import icon from "../../image/iconHeader.svg";
import Select from "../../image/Select.svg";
import iconBack from "../../image/iconBack.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import iconAdd from "../../image/iconAdd.svg";
import deleteImage from "../../image/delete.svg";
import {
  useGetSpeedGoalIdQuery,
  useGetSpeedGoalUpdateQuery,
  useUpdateSpeedGoalMutation,
  useGetSpeedGoalsQuery,
} from "../../../BLL/speedGoalApi.js";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
import MyEditor from "../../Custom/MyEditor";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import WaveLetters from "../../Custom/WaveLetters.jsx";

export default function SpeedGoalContent() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => navigate(`/${userId}/start`);

  const [activeIndex, setActiveIndex] = useState(0);
  const [nameStrateg, setNameStrateg] = useState("");
  const [selectedStrategId, setSelectedStrategId] = useState(null);
  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  const [contentEditors, setContentEditors] = useState([]);
  const [situationEditors, setSituationEditors] = useState([]);
  const [rootCauseEditors, setRootCauseEditors] = useState([]);

  const [htmlContent, setHtmlContent] = useState([]);
  const [htmlSituation, setHtmlSituation] = useState([]);
  const [htmlRootCause, setHtmlRootCause] = useState([]);

  const {
    activeAndDraftStrategies = [],
    archiveStrategies = [],
    isLoadingGetUpdateSpeedGoal,
    isErrorGetUpdateSpeedGoal,
  } = useGetSpeedGoalsQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      activeAndDraftStrategies: data?.activeAndDraftStrategies || [],
      archiveStrategies: data?.archiveStrategies || [],
      isLoadingGetUpdateSpeedGoal: isLoading,
      isErrorGetUpdateSpeedGoal: isError,
    }),
  });

  const {
    currentSpeedGoal = {},
    isLoadingGetSpeedGoalId,
    isErrorGetSpeedGoalId,
    isFetchingGetSpeedGoalId,
  } = useGetSpeedGoalIdQuery(
    { userId, strategId: selectedStrategId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentSpeedGoal: data?.currentSpeedGoal || {},
        isLoadingGetSpeedGoalId: isLoading,
        isErrorGetSpeedGoalId: isError,
        isFetchingGetSpeedGoalId: isFetching,
      }),
      skip: !selectedStrategId,
    }
  );

  const [
    updateSpeedGoal,
    {
      isLoading: isLoadingUpdateSpeedGoalMutation,
      isSuccess: isSuccessUpdateSpeedGoalMutation,
      isError: isErrorUpdateSpeedGoalMutation,
      error: Error,
    },
  ] = useUpdateSpeedGoalMutation();

  // Convert editor content to HTML whenever it changes
  useEffect(() => {
    setHtmlContent(
      contentEditors.map((editor) =>
        draftToHtml(convertToRaw(editor.getCurrentContent()))
      )
    );
  }, [contentEditors]);

  useEffect(() => {
    setHtmlSituation(
      situationEditors.map((editor) =>
        draftToHtml(convertToRaw(editor.getCurrentContent()))
      )
    );
  }, [situationEditors]);

  useEffect(() => {
    setHtmlRootCause(
      rootCauseEditors.map((editor) =>
        draftToHtml(convertToRaw(editor.getCurrentContent()))
      )
    );
  }, [rootCauseEditors]);

  useEffect(() => {
    // Initialize editors for 'content' if it's an array
    if (Array.isArray(currentSpeedGoal.content)) {
      const contentStates = currentSpeedGoal.content.map((item) => {
        if (typeof item === "string" && item.trim()) {
          const contentBlocks = convertFromHTML(item);
          return EditorState.createWithContent(
            ContentState.createFromBlockArray(contentBlocks)
          );
        }
        return EditorState.createEmpty();
      });
      setContentEditors(contentStates);
    } else if (currentSpeedGoal.content === null) {
      setContentEditors([]);
    }

    // Initialize editors for 'situation' if it's an array
    if (Array.isArray(currentSpeedGoal.situation)) {
      const situationStates = currentSpeedGoal.situation.map((item) => {
        if (typeof item === "string" && item.trim()) {
          const situationBlocks = convertFromHTML(item);
          return EditorState.createWithContent(
            ContentState.createFromBlockArray(situationBlocks)
          );
        }
        return EditorState.createEmpty();
      });
      setSituationEditors(situationStates);
    } else if (currentSpeedGoal.situation === null) {
      setSituationEditors([]);
    }

    // Initialize editors for 'rootCause' if it's an array
    if (Array.isArray(currentSpeedGoal.rootCause)) {
      const rootCauseStates = currentSpeedGoal.rootCause.map((item) => {
        if (typeof item === "string" && item.trim()) {
          const rootCauseBlocks = convertFromHTML(item);
          return EditorState.createWithContent(
            ContentState.createFromBlockArray(rootCauseBlocks)
          );
        }
        return EditorState.createEmpty();
      });
      setRootCauseEditors(rootCauseStates);
    } else if (currentSpeedGoal.rootCause === null) {
      setRootCauseEditors([]);
    }
  }, [currentSpeedGoal]);

  const saveUpdateSpeedGoal = async () => {
    await updateSpeedGoal({
      userId,
      objectiveId: currentSpeedGoal.id,
      _id: userId,
      situation: htmlSituation,
      content: htmlContent,
      rootCause: htmlRootCause,
      strategyId: selectedStrategId,
    })
      .unwrap()
      .then(() => {
        setManualSuccessReset(false);
        setManualErrorReset(false);
      })
      .catch((error) => {
        setManualErrorReset(false);
        console.error("Error:", JSON.stringify(error, null, 2));
      });
  };

  const handleEditorChange = (index, newState, type) => {
    switch (type) {
      case "content":
        setContentEditors((prevEditors) => {
          const updated = [...prevEditors];
          updated[index] = newState;
          return updated;
        });
        break;
      case "situation":
        setSituationEditors((prevEditors) => {
          const updated = [...prevEditors];
          updated[index] = newState;
          return updated;
        });
        break;
      case "rootCause":
        setRootCauseEditors((prevEditors) => {
          const updated = [...prevEditors];
          updated[index] = newState;
          return updated;
        });
        break;
      default:
        break;
    }
  };

  const getSpeedGoalId = (id) => {
    setSelectedStrategId(id);
    setManualSuccessReset(true);
    setManualErrorReset(true);
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
              onClick={back}
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
        </div>
        <div className={classes.selectHeader}>
          {["КРАТКОСРОЧАЯ ЦЕЛЬ", "СИТУАЦИЯ", "ПРИЧИНА"].map((text, index) => (
            <div
              key={index}
              className={classNames(
                classes.textSelectHeader,
                activeIndex === index && classes.activeTextSelectHeader
              )}
              onClick={() => setActiveIndex(index)}
            >
              <span
                className={classNames(
                  activeIndex === index
                    ? classes.active
                    : classes.textSelectHeaderSpan
                )}
              >
                {text}
              </span>
            </div>
          ))}
        </div>
        <div className={classes.editText}>
          <div className={classes.date}>
            <select
              value={nameStrateg || ""}
              onChange={(e) => {
                setNameStrateg(e.target.value);
                getSpeedGoalId(e.target.value);
              }}
              className={`${classes.select} ${
                currentSpeedGoal?.strategy?.state === "Активный"
                  ? classes.activeSelect
                  : currentSpeedGoal?.strategy?.state === "Завершено"
                  ? classes.completed
                  : classes.draft
              }`}
            >
              <option value="" disabled>
                Выберите стратегию
              </option>
              {activeAndDraftStrategies?.map((item, index) => (
                <option
                  key={index}
                  value={item?.id}
                  className={`${
                    item.state === "Активный"
                      ? classes.activeSelect
                      : classes.draft
                  }`}
                >
                  Стратегия №{item?.strategyNumber}
                </option>
              ))}
              {archiveStrategies?.map((item, index) => (
                <option
                  key={index}
                  value={item?.id}
                  className={`${classes.completed} `}
                >
                  Стратегия №{item?.strategyNumber}
                </option>
              ))}
            </select>
          </div>
          <div className={classes.iconSave}>
            <img
              src={Blacksavetmp}
              alt="Blacksavetmp"
              className={classes.image}
              onClick={() => saveUpdateSpeedGoal()}
            />
          </div>
          {/* <div className={classes.blockSelect}>
            <img src={Select} alt="Select" className={classes.select} />
            <ul className={classes.option}>
              <li>Опубликовать</li>
              <li>Напечатать</li>
              <li>Отправить сотруднику</li>
              <li>Сохранить как файл</li>
            </ul>
          </div> */}
        </div>
      </div>

      <div className={classes.main}>
        {isErrorGetUpdateSpeedGoal && (
          <>
            <HandlerQeury Error={isErrorGetUpdateSpeedGoal}></HandlerQeury>
          </>
        )}

        {isLoadingGetUpdateSpeedGoal && (
          <>
            <HandlerQeury Loading={isLoadingGetUpdateSpeedGoal}></HandlerQeury>
          </>
        )}

        {isErrorGetSpeedGoalId ? (
          <HandlerQeury Error={isErrorGetSpeedGoalId} />
        ) : isFetchingGetSpeedGoalId || isLoadingGetSpeedGoalId ? (
          <HandlerQeury
            Loading={isLoadingGetSpeedGoalId}
            Fetching={isFetchingGetSpeedGoalId}
          />
        ) : (
          <>
            {currentSpeedGoal.id ? (
              <>
                {activeIndex === 0 && (
                  <>
                    {contentEditors.map((item, index) => (
                      <MyEditor
                        key={index}
                        editorState={item}
                        setEditorState={(newState) =>
                          handleEditorChange(index, newState, "content")
                        }
                      />
                    ))}
                  </>
                )}

                {activeIndex === 1 && (
                  <>
                    {situationEditors.map((item, index) => (
                      <MyEditor
                        key={index}
                        editorState={item}
                        setEditorState={(newState) =>
                          handleEditorChange(index, newState, "situation")
                        }
                      />
                    ))}
                  </>
                )}

                {activeIndex === 2 && (
                   <>
                   {rootCauseEditors.map((item, index) => (
                     <MyEditor
                       key={index}
                       editorState={item}
                       setEditorState={(newState) =>
                        handleEditorChange(index, newState, "rootCause")
                       }
                     />
                   ))}
                 </>
                )}

                <HandlerMutation
                  Loading={isLoadingUpdateSpeedGoalMutation}
                  Error={isErrorUpdateSpeedGoalMutation && !manualErrorReset}
                  Success={
                    isSuccessUpdateSpeedGoalMutation && !manualSuccessReset
                  }
                  textSuccess={"Краткосрочная цель обновлена"}
                  textError={
                    Error?.data?.errors?.[0]?.errors?.[0]
                      ? Error.data.errors[0].errors[0]
                      : Error?.data?.message
                  }
                />
              </>
            ) : (
              <>
                <WaveLetters
                  letters={"Выберите краткосрочную цель"}
                ></WaveLetters>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
