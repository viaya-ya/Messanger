import React, { useState, useEffect } from "react";
import classes from "./SpeedGoalNew.module.css";
import icon from "../../image/iconHeader.svg";
import iconBack from "../../image/iconBack.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import { useNavigate, useParams } from "react-router-dom";
import MyEditor from "../../Custom/MyEditor.jsx";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
import classNames from "classnames";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import {
  useGetSpeedGoalNewQuery,
  usePostSpeedGoalMutation,
} from "../../../BLL/speedGoalApi.js";

export default function SpeedGoalNew() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/speedgoal`);
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const [nameStrateg, setNameStrateg] = useState();

  const [contentEditors, setContentEditors] = useState([
    EditorState.createEmpty(),
  ]);
  const [situationEditors, setSituationEditors] = useState([
    EditorState.createEmpty(),
  ]);
  const [rootCauseEditors, setRootCauseEditors] = useState([
    EditorState.createEmpty(),
  ]);

  const [htmlContent, setHtmlContent] = useState([]);
  const [htmlSituation, setHtmlSituation] = useState([]);
  const [htmlRootCause, setHtmlRootCause] = useState([]);

  const {
    data = [],
    isLoadingNewSpeedGoal,
    isErrorNewSpeedGoal,
  } = useGetSpeedGoalNewQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      data: data || [],
      isLoadingNewSpeedGoal: isLoading,
      isErrorNewSpeedGoal: isError,
    }),
  });

  const [
    postSpeedGoal,
    {
      isLoading: isLoadingPostSpeedGoalMutation,
      isSuccess: isSuccessPostSpeedGoalMutation,
      isError: isErrorPostSpeedGoalMutation,
    },
  ] = usePostSpeedGoalMutation();

  useEffect(() => {
    contentEditors.forEach((editorState, index) => {
      const rawContent = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );
      setHtmlContent((prev) => {
        const updated = [...prev];
        updated[index] = rawContent;
        return updated;
      });
    });
  }, [contentEditors]);

  useEffect(() => {
    situationEditors.forEach((editorState, index) => {
      const rawContent = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );
      setHtmlSituation((prev) => {
        const updated = [...prev];
        updated[index] = rawContent;
        return updated;
      });
    });
  }, [situationEditors]);

  useEffect(() => {
    rootCauseEditors.forEach((editorState, index) => {
      const rawContent = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );
      setHtmlRootCause((prev) => {
        const updated = [...prev];
        updated[index] = rawContent;
        return updated;
      });
    });
  }, [rootCauseEditors]);

  const reset = () => {
    setContentEditors([EditorState.createEmpty()]);
    setSituationEditors([EditorState.createEmpty()]);
    setRootCauseEditors([EditorState.createEmpty()]);
  };

  const saveSpeedGoal = async () => {
    await postSpeedGoal({
      userId,
      situation: htmlSituation,
      content: htmlContent,
      rootCause: htmlRootCause,
      strategyId: nameStrateg,
    })
      .unwrap()
      .then(() => {
        reset();
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2));
      });
  };

  const addEditor = () => {
    switch (activeIndex) {
      case 0:
        setContentEditors((prevEditors) => [
          ...prevEditors,
          EditorState.createEmpty(),
        ]);
        break;
      case 1:
        setSituationEditors((prevEditors) => [
          ...prevEditors,
          EditorState.createEmpty(),
        ]);
        break;
      case 2:
        setRootCauseEditors((prevEditors) => [
          ...prevEditors,
          EditorState.createEmpty(),
        ]);
        break;
      default:
        break;
    }
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
        </div>
        <div className={classes.selectHeader}>
          {["КРАТКОСРОЧАЯ ЦЕЛЬ", "СИТУАЦИЯ", "ПРИЧИНА"].map((text, index) => (
            <div
              key={index}
              className={classNames(
                classes.textSelectHeader,
                activeIndex === index
                  ? classes.activeTextSelectHeader
                  : classes.textSelectHeader
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
              onChange={(e) => setNameStrateg(e.target.value)}
            >
              <option value="" disabled>
                Выберите стратегию
              </option>
              {data?.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.strategyName}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={classes.iconSave}>
            <img
              src={Blacksavetmp}
              alt="Blacksavetmp"
              className={classes.image}
              onClick={() => saveSpeedGoal()}
            />
          </div>
        </div>
      </div>

      <div className={classes.main}>
        {isErrorNewSpeedGoal && (
          <>
            <HandlerQeury Error={isErrorNewSpeedGoal}></HandlerQeury>
          </>
        )}
        {isLoadingNewSpeedGoal && (
          <>
            <HandlerQeury Loading={isLoadingNewSpeedGoal}></HandlerQeury>
          </>
        )}
        {activeIndex === 0 &&
          contentEditors.map((editorState, index) => (
            <MyEditor
              key={index}
              editorState={editorState}
              setEditorState={(newState) =>
                handleEditorChange(index, newState, "content")
              }
            />
          ))}

        {activeIndex === 1 &&
          situationEditors.map((editorState, index) => (
            <MyEditor
              key={index}
              editorState={editorState}
              setEditorState={(newState) =>
                handleEditorChange(index, newState, "situation")
              }
            />
          ))}

        {activeIndex === 2 &&
          rootCauseEditors.map((editorState, index) => (
            <MyEditor
              key={index}
              editorState={editorState}
              setEditorState={(newState) =>
                handleEditorChange(index, newState, "rootCause")
              }
            />
          ))}

        <HandlerMutation
          Loading={isLoadingPostSpeedGoalMutation}
          Error={isErrorPostSpeedGoalMutation}
          Success={isSuccessPostSpeedGoalMutation}
          textSuccess={"Краткосрочная цель успешно создана."}
        />

        <button className={classes.add} onClick={addEditor}>
          <svg
            width="19.998047"
            height="20.000000"
            viewBox="0 0 19.998 20"
            fill="none"
          >
            <defs />
            <path
              id="Vector"
              d="M10 20C4.47 19.99 0 15.52 0 10L0 9.8C0.1 4.3 4.63 -0.08 10.13 0C15.62 0.07 20.03 4.56 19.99 10.06C19.96 15.56 15.49 19.99 10 20ZM5 9L5 11L9 11L9 15L11 15L11 11L15 11L15 9L11 9L11 5L9 5L9 9L5 9Z"
              fill="#B4B4B4"
              fill-opacity="1.000000"
              fill-rule="nonzero"
            />
          </svg>

          <div>
            <span className={classes.nameButton}> Добавить еще одну цель</span>
          </div>
        </button>
      </div>
    </div>
  );
}
