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
} from "../../../BLL/speedGoalApi.js";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
import MyEditor from "../../Custom/MyEditor";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function SpeedGoalContent() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () =>  navigate(`/${userId}/start`);
  const newSpeedGoal = () => navigate("new");

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
    data = [],
    isLoadingGetUpdateSpeedGoal,
    isErrorGetUpdateSpeedGoal,
  } = useGetSpeedGoalUpdateQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      data: data || [],
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
    }
  }, [currentSpeedGoal]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter" && event.ctrlKey) {
        addEditor();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  
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

  const onDragEnd = (result, type) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    switch (type) {
      case "content":
        const contentState = contentEditors.map((state) => {
          return EditorState.createWithContent(state.getCurrentContent());
        });
        const [contentItem] = contentState.splice(source.index, 1);
        contentState.splice(destination.index, 0, contentItem);
        setContentEditors(contentState);
        break;
      case "situation":
        const situationState = situationEditors.map((state) => {
          return EditorState.createWithContent(state.getCurrentContent());
        });
        const [situationItem] = situationState.splice(source.index, 1);
        situationState.splice(destination.index, 0, situationItem);
        setSituationEditors(situationState);
        break;
      case "rootCause":
        const rootCauseState = rootCauseEditors.map((state) => {
          return EditorState.createWithContent(state.getCurrentContent());
        });
        const [rootCauseItem] = rootCauseState.splice(source.index, 1);
        rootCauseState.splice(destination.index, 0, rootCauseItem);
        setRootCauseEditors(rootCauseState);
        break;
      default:
        break;
    }
  };

  const deleteEditor = (index, type) => {
    switch (type) {
      case "content":
        setContentEditors((prevEditors) => {
          const updated = [...prevEditors];
          updated.splice(index, 1); // Remove the editor at the specified index
          return updated;
        });
        break;
      case "situation":
        setSituationEditors((prevEditors) => {
          const updated = [...prevEditors];
          updated.splice(index, 1); // Remove the editor at the specified index
          return updated;
        });
        break;
      case "rootCause":
        setRootCauseEditors((prevEditors) => {
          const updated = [...prevEditors];
          updated.splice(index, 1); // Remove the editor at the specified index
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
          <div className={classes.iconAdd}>
            <img
              src={iconAdd}
              alt="iconAdd"
              className={classes.image}
              onClick={() => newSpeedGoal()}
            />
          </div>
          <div className={classes.date}>
            <select
              value={nameStrateg || ""}
              onChange={(e) => {
                setNameStrateg(e.target.value);
                getSpeedGoalId(e.target.value);
              }}
            >
              <option value="" disabled>
                Выберите стратегию
              </option>
              {data?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.strategyNumber}
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
          <div className={classes.blockSelect}>
            <img src={Select} alt="Select" className={classes.select} />
            <ul className={classes.option}>
              <li>Опубликовать</li>
              <li>Напечатать</li>
              <li>Отправить сотруднику</li>
              <li>Сохранить как файл</li>
            </ul>
          </div>
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
            {activeIndex === 0 && (
              <DragDropContext
                onDragEnd={(result) => onDragEnd(result, "content")}
              >
                <Droppable droppableId="editorList">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={classes.droppableContainer}
                    >
                      {contentEditors.map((item, index) => (
                        <Draggable
                          key={index}
                          draggableId={`content-item-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={classes.editorContainer}
                            >
                              <MyEditor
                                key={index}
                                editorState={item}
                                setEditorState={(newState) =>
                                  handleEditorChange(index, newState, "content")
                                }
                              />
                              <img
                                src={deleteImage}
                                alt="deleteImage"
                                className={classes.deleteIcon}
                                onClick={() => deleteEditor(index, "content")} // Передаём тип content
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}

            {activeIndex === 1 && (
              <DragDropContext
                onDragEnd={(result) => onDragEnd(result, "situation")}
              >
                <Droppable droppableId="editorList">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={classes.droppableContainer}
                    >
                      {situationEditors.map((item, index) => (
                        <Draggable
                          key={index}
                          draggableId={`situation-item-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={classes.editorContainer}
                            >
                              <MyEditor
                                key={index}
                                editorState={item}
                                setEditorState={(newState) =>
                                  handleEditorChange(
                                    index,
                                    newState,
                                    "situation"
                                  )
                                }
                              />
                              <img
                                src={deleteImage}
                                alt="deleteImage"
                                className={classes.deleteIcon}
                                onClick={() => deleteEditor(index, "situation")} // Передаём тип content
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}

            {activeIndex === 2 && (
              <DragDropContext
                onDragEnd={(result) => onDragEnd(result, "rootCause")}
              >
                <Droppable droppableId="editorList">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={classes.droppableContainer}
                    >
                      {rootCauseEditors.map((item, index) => (
                        <Draggable
                          key={index}
                          draggableId={`rootCause-item-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={classes.editorContainer}
                            >
                              <MyEditor
                                key={index}
                                editorState={item}
                                setEditorState={(newState) =>
                                  handleEditorChange(
                                    index,
                                    newState,
                                    "rootCause"
                                  )
                                }
                              />
                              <img
                                src={deleteImage}
                                alt="deleteImage"
                                className={classes.deleteIcon}
                                onClick={() => deleteEditor(index, "rootCause")} // Передаём тип content
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
            <HandlerMutation
              Loading={isLoadingUpdateSpeedGoalMutation}
              Error={isErrorUpdateSpeedGoalMutation && !manualErrorReset}
              Success={isSuccessUpdateSpeedGoalMutation && !manualSuccessReset}
              textSuccess={"Краткосрочная цель обновлена"}
              textError={
                Error?.data?.errors?.[0]?.errors?.[0] 
                  ? Error.data.errors[0].errors[0] 
                  : Error?.data?.message
              }
            />
            {Object.keys(currentSpeedGoal).length > 0 && (
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
                  <span className={classes.nameButton}>
                    Добавить еще одну цель (Ctrl+Enter)
                  </span>
                </div>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
