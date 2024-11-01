import React, { useState, useEffect } from "react";
import classes from "./NewGoal.module.css";
import icon from "../../image/iconHeader.svg";
import Select from "../../image/Select.svg";
import iconBack from "../../image/iconBack.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import print from "../../image/print.svg";
import { useNavigate, useParams } from "react-router-dom";
import deleteImage from "../../image/delete.svg";
import { usePostGoalMutation, useGetGoalNewQuery } from "../../../BLL/goalApi";
import MyEditor from "../../Custom/MyEditor";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import classNames from "classnames";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from '../../Custom/CommonStyles.module.css';

export default function GoalContent() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/goal`);
  };

  const [editorState, setEditorState] = useState([EditorState.createEmpty()]);
  const [htmlContent, setHtmlContent] = useState([]);
  const [organization, setOrganization] = useState("");

  const {
    organizations = [],
    isLoadingNewGoal,
    isErrorNewGoal,
  } = useGetGoalNewQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      organizations: data?.organizations || [],
      isLoadingNewGoal: isLoading,
      isErrorNewGoal: isError,
    }),
  });

  const [
    postGoal,
    {
      isLoading: isLoadingPostGoalMutation,
      isSuccess: isSuccessPostGoalMutation,
      isError: isErrorPostGoalMutation,
      error: Error,
    },
  ] = usePostGoalMutation();

  useEffect(() => {
    setHtmlContent(
      editorState.map((editor) =>
        draftToHtml(convertToRaw(editor.getCurrentContent()))
      )
    );
  }, [editorState]);

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

  const addEditor = () => {
    setEditorState((prevEditors) => [
      ...prevEditors,
      EditorState.createEmpty(),
    ]);
  };

  const reset = () => {
    setOrganization("");
    setEditorState([EditorState.createEmpty()]);
  };

  const saveGoal = async () => {
    await postGoal({
      userId,
      content: htmlContent,
      organizationId: organization,
    })
      .unwrap()
      .then(() => {
        reset();
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };
  const deleteEditor = (index) => {
    setEditorState((prevEditors) => {
      const updated = [...prevEditors];
      updated.splice(index, 1); // Remove the editor at the specified index
      return updated;
    });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
  
    if (!destination) {
      return;
    }

    const updatedState = editorState.map((state) => {
      return EditorState.createWithContent(state.getCurrentContent());
    });
    const [movedItem] = updatedState.splice(source.index, 1);
    updatedState.splice(destination.index, 0, movedItem);
  
    setEditorState(updatedState);
  };
  
  
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
          <div className={classes.five}>
            <select
              value={organization}
              onChange={(e) => {
                setOrganization(e.target.value);
              }}
            >
              <option value=""> Выберите организацию</option>
              {organizations.map((item) => {
                return <option value={item.id}>{item.organizationName}</option>;
              })}
            </select>
          </div>

          <div className={classes.four}>
            <div className={classNames(classes.blockIconSavetmp)}>
              <img
                src={Blacksavetmp}
                alt="Blacksavetmp"
                className={classNames(classes.image, classes.blockIconSavetmp)}
                onClick={() => saveGoal()}
              />
            </div>

            <div className={classNames(classes.blockIconPrint)}>
              <img src={print} alt="print" className={classes.image} />
            </div>

            <div className={classes.blockSelect}>
              <img src={Select} alt="Select" className={classes.select} />
              <ul className={classes.option}>
                <li>
                  {" "}
                  <svg
                    width="18.000000"
                    height="15.000000"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={classes.selectImage}
                  >
                    <desc>Created with Pixso.</desc>
                    <defs>
                      <clipPath id="clip77_1070">
                        <rect
                          id="subbar /attach policy"
                          width="24.000000"
                          height="24.000000"
                          fill="white"
                          fill-opacity="0"
                        />
                      </clipPath>
                    </defs>
                    <rect
                      id="icon / attach policy"
                      width="24.000000"
                      height="24.000000"
                      fill="#FFFFFF"
                      fill-opacity="0"
                    />
                    <rect
                      id="subbar /attach policy"
                      width="24.000000"
                      height="24.000000"
                      fill="#FFFFFF"
                      fill-opacity="0"
                    />
                    <g clip-path="url(#clip77_1070)">
                      <path
                        id="Vector"
                        d="M4.33 1.33L19.66 1.33C20.21 1.33 20.66 1.78 20.66 2.33L20.66 21C20.66 21.55 20.21 22 19.66 22L4.33 22C3.78 22 3.33 21.55 3.33 21L3.33 2.33C3.33 1.78 3.78 1.33 4.33 1.33Z"
                        fill="#FFFFFF"
                        fill-opacity="1.000000"
                        fill-rule="evenodd"
                      />
                      <path
                        id="Vector"
                        d="M4.33 1.33L19.66 1.33C20.21 1.33 20.66 1.78 20.66 2.33L20.66 21C20.66 21.55 20.21 22 19.66 22L4.33 22C3.78 22 3.33 21.55 3.33 21L3.33 2.33C3.33 1.78 3.78 1.33 4.33 1.33ZM4.33 2.33L19.66 2.33L19.66 21L4.33 21L4.33 2.33Z"
                        fill="#3A3A3A"
                        fill-opacity="1.000000"
                        fill-rule="evenodd"
                      />
                      <path
                        id="Vector 24"
                        d="M8 7.33L16.66 7.33"
                        stroke="#3A3A3A"
                        stroke-opacity="1.000000"
                        stroke-width="1.000000"
                        stroke-linecap="round"
                      />
                      <path
                        id="Vector 25"
                        d="M7.33 10L16.66 10"
                        stroke="#3A3A3A"
                        stroke-opacity="1.000000"
                        stroke-width="1.000000"
                        stroke-linecap="round"
                      />
                      <path
                        id="Vector 26"
                        d="M7.33 12.66L16.66 12.66"
                        stroke="#3A3A3A"
                        stroke-opacity="1.000000"
                        stroke-width="1.000000"
                        stroke-linecap="round"
                      />
                      <path
                        id="Vector 27"
                        d="M7.33 15.33L16.66 15.33"
                        stroke="#3A3A3A"
                        stroke-opacity="1.000000"
                        stroke-width="1.000000"
                        stroke-linecap="round"
                      />
                      <path
                        id="Vector"
                        d="M17.78 15.03L22.05 19.3C22.44 19.7 22.67 20.22 22.7 20.76C22.72 21.29 22.52 21.8 22.16 22.16C21.8 22.52 21.29 22.72 20.76 22.7C20.22 22.67 19.7 22.44 19.3 22.05L14.66 17.4C14.42 17.16 14.27 16.83 14.26 16.5C14.24 16.16 14.36 15.85 14.59 15.62C14.82 15.39 15.13 15.27 15.47 15.28C15.8 15.3 16.13 15.44 16.38 15.69L20.28 19.59C20.37 19.69 20.43 19.82 20.44 19.95C20.44 20.09 20.4 20.21 20.3 20.3C20.21 20.39 20.09 20.44 19.95 20.44C19.82 20.43 19.69 20.37 19.59 20.28L16.06 16.75L15.55 17.26L19.08 20.79C19.32 21.04 19.65 21.18 19.98 21.2C20.32 21.21 20.63 21.09 20.86 20.86C21.09 20.63 21.21 20.32 21.2 19.98C21.18 19.65 21.04 19.32 20.79 19.08L16.89 15.18C16.5 14.78 15.97 14.55 15.44 14.53C14.9 14.51 14.4 14.7 14.03 15.06C13.67 15.43 13.48 15.93 13.5 16.47C13.52 17 13.75 17.52 14.15 17.92L18.79 22.56C19.33 23.1 20.05 23.42 20.79 23.45C21.52 23.48 22.22 23.22 22.72 22.72C23.22 22.22 23.48 21.52 23.45 20.79C23.42 20.05 23.1 19.33 22.56 18.79L18.29 14.52L17.78 15.03Z"
                        fill="#3A3A3A"
                        fill-opacity="1.000000"
                        fill-rule="evenodd"
                      />
                      <path
                        id="Vector"
                        d="M21.65 19.61L21.69 19.66C21.79 19.75 21.87 19.85 21.94 19.96C21.98 20.03 22.02 20.1 22.05 20.18C22.12 20.33 22.16 20.47 22.18 20.62C22.19 20.67 22.19 20.73 22.2 20.78C22.2 20.92 22.19 21.07 22.15 21.2C22.14 21.25 22.12 21.3 22.11 21.35C22.07 21.45 22.01 21.55 21.95 21.64C21.91 21.7 21.86 21.75 21.81 21.81C21.75 21.86 21.7 21.91 21.64 21.95C21.55 22.01 21.45 22.07 21.35 22.11C21.3 22.12 21.25 22.14 21.2 22.15C21.07 22.19 20.92 22.2 20.78 22.2C20.73 22.19 20.67 22.19 20.62 22.18C20.47 22.16 20.33 22.12 20.18 22.05C20.1 22.02 20.03 21.98 19.96 21.94C19.85 21.87 19.75 21.79 19.66 21.69L19.61 21.65C19.65 21.65 19.68 21.66 19.72 21.67C19.8 21.68 19.88 21.69 19.96 21.7C20.11 21.7 20.26 21.69 20.4 21.66C20.48 21.64 20.56 21.62 20.64 21.59C20.76 21.54 20.87 21.48 20.98 21.41C21.06 21.35 21.14 21.29 21.21 21.21C21.29 21.14 21.35 21.06 21.41 20.98C21.48 20.87 21.54 20.76 21.59 20.64C21.62 20.56 21.64 20.48 21.66 20.4C21.69 20.26 21.7 20.11 21.69 19.96C21.69 19.88 21.68 19.8 21.67 19.72C21.66 19.68 21.65 19.64 21.65 19.61ZM17.26 14.84L17.24 14.82C17.11 14.69 16.96 14.57 16.8 14.46C16.68 14.38 16.55 14.31 16.42 14.26C16.22 14.16 16.01 14.1 15.8 14.06C15.69 14.04 15.57 14.03 15.46 14.03C15.24 14.02 15.03 14.04 14.83 14.08C14.71 14.11 14.6 14.14 14.49 14.18C14.32 14.25 14.16 14.33 14.01 14.43C13.89 14.51 13.78 14.6 13.68 14.71C13.58 14.81 13.48 14.92 13.4 15.04C13.3 15.19 13.22 15.35 13.15 15.52C13.11 15.63 13.08 15.74 13.05 15.86C13.01 16.06 12.99 16.27 13 16.49C13 16.6 13.02 16.71 13.03 16.83C13.07 17.04 13.14 17.25 13.23 17.45C13.29 17.58 13.36 17.71 13.43 17.83C13.54 17.99 13.66 18.14 13.79 18.27L18.44 22.91C18.62 23.09 18.81 23.25 19.02 23.39C19.17 23.49 19.34 23.58 19.51 23.66C19.78 23.78 20.05 23.86 20.33 23.91C20.48 23.93 20.62 23.95 20.77 23.95C21.05 23.96 21.33 23.94 21.6 23.88C21.74 23.85 21.88 23.8 22.02 23.75C22.24 23.67 22.45 23.56 22.65 23.43C22.8 23.32 22.94 23.2 23.07 23.07C23.2 22.94 23.32 22.8 23.43 22.65C23.56 22.45 23.67 22.24 23.75 22.02C23.8 21.88 23.85 21.74 23.88 21.6C23.94 21.33 23.96 21.05 23.95 20.77C23.95 20.62 23.93 20.48 23.91 20.33C23.86 20.05 23.78 19.78 23.66 19.51C23.58 19.34 23.49 19.17 23.39 19.02C23.25 18.81 23.09 18.62 22.91 18.44L18.29 13.81L17.26 14.84ZM15.03 17.07L16.04 16.06L16.02 16.04C15.97 15.99 15.92 15.95 15.86 15.91C15.82 15.89 15.79 15.87 15.75 15.86C15.67 15.82 15.59 15.8 15.51 15.79C15.49 15.79 15.47 15.79 15.45 15.78C15.32 15.78 15.21 15.8 15.11 15.85C15.05 15.88 15 15.92 14.94 15.97C14.89 16.02 14.85 16.08 14.82 16.14C14.77 16.24 14.75 16.35 14.76 16.48C14.76 16.5 14.76 16.52 14.76 16.54C14.77 16.62 14.79 16.7 14.83 16.78C14.84 16.82 14.86 16.85 14.89 16.89C14.92 16.95 14.97 17 15.02 17.05L15.03 17.07ZM18.13 15.39L22.05 19.3C22.44 19.7 22.67 20.22 22.7 20.76C22.72 21.29 22.52 21.8 22.16 22.16C21.8 22.52 21.29 22.72 20.76 22.7C20.22 22.67 19.7 22.44 19.3 22.05L14.66 17.4C14.42 17.16 14.27 16.83 14.26 16.5C14.24 16.16 14.36 15.85 14.59 15.62C14.82 15.39 15.13 15.27 15.47 15.28C15.8 15.3 16.13 15.44 16.38 15.69L20.28 19.59C20.37 19.69 20.43 19.82 20.44 19.95C20.44 20.09 20.4 20.21 20.3 20.3C20.21 20.39 20.09 20.44 19.95 20.44C19.82 20.43 19.69 20.37 19.59 20.28L16.06 16.75L15.55 17.26L19.08 20.79C19.32 21.04 19.65 21.18 19.98 21.2C20.32 21.21 20.63 21.09 20.86 20.86C21.09 20.63 21.21 20.32 21.2 19.98C21.18 19.65 21.04 19.32 20.79 19.08L16.89 15.18C16.5 14.78 15.97 14.55 15.44 14.53C14.9 14.51 14.4 14.7 14.03 15.06C13.67 15.43 13.48 15.93 13.5 16.47C13.52 17 13.75 17.52 14.15 17.92L18.79 22.56C19.33 23.1 20.05 23.42 20.79 23.45C21.52 23.48 22.22 23.22 22.72 22.72C23.22 22.22 23.48 21.52 23.45 20.79C23.42 20.05 23.1 19.33 22.56 18.79L18.29 14.52L17.78 15.03L18.13 15.39Z"
                        fill="#FFFFFF"
                        fill-opacity="1.000000"
                        fill-rule="evenodd"
                      />
                    </g>
                  </svg>
                  Создать политику
                </li>
                <li>
                  {" "}
                  <svg
                    width="15.000000"
                    height="15.000000"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={classes.selectImage}
                  >
                    <desc>Created with Pixso.</desc>
                    <defs>
                      <clipPath id="clip8_4771">
                        <rect
                          id="icon / save tmp"
                          width="24.000000"
                          height="24.000000"
                          fill="white"
                          fill-opacity="0"
                        />
                      </clipPath>
                    </defs>
                    <rect
                      id="icon / save tmp"
                      width="24.000000"
                      height="24.000000"
                      fill="#FFFFFF"
                      fill-opacity="0"
                    />
                    <g clip-path="url(#clip8_4771)">
                      <path
                        id="Vector"
                        d="M20.4 13.75L20.4 7.2L16.79 3.6L3.59 3.6L3.59 20.4L13.76 20.4L20.4 13.75ZM15 10.2L6.59 10.2L6.59 6.6L15 6.6L15 10.2ZM14.7 15C14.7 16.48 13.48 17.7 12 17.7C10.51 17.7 9.29 16.48 9.29 15C9.29 13.51 10.51 12.3 12 12.3C13.48 12.3 14.7 13.51 14.7 15ZM20.18 16.52L21.87 18.21L17.29 22.8L15.6 22.8L15.6 21.1L20.18 16.52ZM20.77 15.92L21.94 14.74L23.64 16.44L22.46 17.61L20.77 15.92Z"
                        fill="#3A3A3A"
                        fill-opacity="1.000000"
                        fill-rule="nonzero"
                      />
                    </g>
                  </svg>{" "}
                  Сохранить как заметку для целей
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.main}>
        {isErrorNewGoal ? (
          <HandlerQeury Error={isErrorNewGoal}></HandlerQeury>
        ) : (
          <>
            {isLoadingNewGoal ? (
              <HandlerQeury Loading={isLoadingNewGoal}></HandlerQeury>
            ) : (
              <>
              <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                <Droppable droppableId="editorList">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={classes.droppableContainer}
                    >
                      {editorState.map((item, index) => (
                        <Draggable key={index} draggableId={`item-${index}`} index={index}>
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
                                setEditorState={(newState) => {
                                  // Обновляем только конкретный индекс, который изменился
                                  setEditorState((prevEditors) => {
                                    const updatedState = [...prevEditors];
                                    updatedState[index] = newState;  // Обновляем состояние конкретного редактора
                                    return updatedState;
                                  });
                                }}
                              />
                              <img
                                src={deleteImage}
                                alt="deleteImage"
                                className={classes.deleteIcon}
                                onClick={() => deleteEditor(index)}
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
        
              <HandlerMutation
                Loading={isLoadingPostGoalMutation}
                Error={isErrorPostGoalMutation}
                Success={isSuccessPostGoalMutation}
                textSuccess={"Цель успешно создана."}
                textError={
                  Error?.data?.errors?.[0]?.errors?.[0] 
                    ? Error.data.errors[0].errors[0] 
                    : Error?.data?.message
                }
              />
            </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

