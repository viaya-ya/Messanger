import React, { useState, useEffect } from "react";
import classes from "./GoalContent.module.css";
import styles from "../../Custom/CommonStyles.module.css";
import icon from "../../image/iconHeader.svg";
import Select from "../../image/Select.svg";
import iconBack from "../../image/iconBack.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import print from "../../image/print.svg";
import drag from "../../image/drag.svg";
import MyEditor from "../../Custom/MyEditor";
import deleteImage from "../../image/delete.svg";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetGoalIdQuery,
  useGetGoalQuery,
  usePostGoalMutation,
  useUpdateGoalMutation,
} from "../../../BLL/goalApi";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import WaveLetters from "../../Custom/WaveLetters.jsx";

export default function GoalContent() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/start`);
  };

  const [editorState, setEditorState] = useState([]);
  const [htmlContent, setHtmlContent] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  const [
    organizationIdForRequestingCreateGoal,
    setOrganizationIdForRequestingCreateGoal,
  ] = useState(null);

  const {
    organizationsWithGoal = [],
    organizationsWithoutGoal = [],
    goals = [],
    isErrorGetGoal,
    isLoadingGetGoal,
    isFetchingGetGoal,
  } = useGetGoalQuery(userId, {
    selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
      organizationsWithGoal: data?.organizationsWithGoal || [],
      organizationsWithoutGoal: data?.organizationsWithoutGoal || [],
      goals: data?.goals || [],
      isErrorGetGoal: isError,
      isLoadingGetGoal: isLoading,
      isFetchingGetGoal: isFetching,
    }),
  });

  const {
    currentGoal = {},
    organizations = [],
    isLoadingGetGoalId,
    isErrorGetGoalId,
    isFetchingGetGoalId,
  } = useGetGoalIdQuery(
    { userId, goalId: selectedGoalId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentGoal: data?.currentGoal || {},
        organizations: data?.organizations || [],
        isLoadingGetGoalId: isLoading,
        isErrorGetGoalId: isError,
        isFetchingGetGoalId: isFetching,
      }),
      skip: !selectedGoalId,
    }
  );

  const [
    updateGoal,
    {
      isLoading: isLoadingUpdateGoalMutation,
      isSuccess: isSuccessUpdateGoalMutation,
      isError: isErrorUpdateGoalMutation,
      error: Error,
    },
  ] = useUpdateGoalMutation();

  useEffect(() => {
    if (Array.isArray(currentGoal.content)) {
      const editorState = currentGoal.content.map((item) => {
        if (typeof item === "string" && item.trim()) {
          const contentBlocks = convertFromHTML(item);
          return EditorState.createWithContent(
            ContentState.createFromBlockArray(contentBlocks)
          );
        }
        return EditorState.createEmpty();
      });
      setEditorState(editorState);
    }
  }, [currentGoal]);

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

  useEffect(() => {
    if (!selectedGoalId && organizationsWithGoal.length > 0) {
      setSelectedGoalId(organizationsWithGoal[0]?.goal?.id);
    }
  }, [organizationsWithGoal]);

  useEffect(() => {
    if (organizationIdForRequestingCreateGoal !== null) {
      const currentOrganization = organizationsWithGoal.find(
        (item) => item.id === organizationIdForRequestingCreateGoal
      );
      if (currentOrganization) {
        setOrganizationIdForRequestingCreateGoal(null);
        selectGoal(currentOrganization?.goal?.id);
      } else console.error("Для выбранной организации не найдена цель");
    }
  }, [organizationsWithGoal]);

  const addEditor = () => {
    setEditorState((prevEditors) => [
      ...prevEditors,
      EditorState.createEmpty(),
    ]);
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

    // Создаем новый массив состояний
    const updatedState = editorState.map((state) => {
      // Создаем новый экземпляр редактора для каждого состояния
      return EditorState.createWithContent(state.getCurrentContent());
    });

    // Перемещаем редактор
    const [movedItem] = updatedState.splice(source.index, 1);
    updatedState.splice(destination.index, 0, movedItem);

    setEditorState(updatedState);
  };

  const saveUpdateGoal = async () => {
    await updateGoal({
      userId,
      goalId: selectedGoalId,
      _id: userId,
      content: htmlContent,
    })
      .unwrap()
      .then(() => {
        // После успешного обновления сбрасываем флаги
        setManualSuccessReset(false);
        setManualErrorReset(false);
      })
      .catch((error) => {
        // При ошибке также сбрасываем флаги
        setManualErrorReset(false);
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const [
    postGoal,
    {
      isLoading: isLoadingPostGoalMutation,
      isSuccess: isSuccessPostGoalMutation,
      isError: isErrorPostGoalMutation,
      error: ErrorPostGoal,
    },
  ] = usePostGoalMutation();

  const saveGoal = async (organization) => {
    await postGoal({
      userId,
      content: [],
      organizationId: organization,
    })
      .unwrap()
      .then(() => {
        // reset();
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const selectGoal = (target) => {
    if (goals.some((goal) => goal.id === target)) {
      setSelectedGoalId(target);
      setManualSuccessReset(true);
      setManualErrorReset(true);
    } else {
      setOrganizationIdForRequestingCreateGoal(target);
      saveGoal(target);
    }
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
          <div className={classes.four}>
            <select
              name={"organizations"}
              value={selectedGoalId}
              onChange={(e) => selectGoal(e.target.value)}
              className={classes.select}
            >
              {!organizationsWithGoal.length > 0 && (
                <option>Выберите организацию</option>
              )}
              {organizationsWithGoal?.map((item, index) => (
                <>
                  <option key={index} value={item?.goal?.id}>
                    {item?.organizationName}
                  </option>
                </>
              ))}
              {organizationsWithoutGoal?.map((item, index) => (
                <>
                  <option key={index} value={item?.id}>
                    {item?.organizationName}
                  </option>
                </>
              ))}
            </select>
          </div>

          <div className={classes.five}>
            <div className={classes.iconSave}>
              <img
                src={Blacksavetmp}
                alt="Blacksavetmp"
                className={classes.image}
                onClick={() => saveUpdateGoal()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.main}>
        {isErrorGetGoal ? (
          <>
            <HandlerQeury Error={isErrorGetGoal}></HandlerQeury>
          </>
        ) : (
          <>
            {isErrorGetGoalId ? (
              <HandlerQeury Error={isErrorGetGoalId}></HandlerQeury>
            ) : (
              <>
                <HandlerQeury
                  Loading={isLoadingGetGoal}
                  Fetching={isFetchingGetGoal}
                ></HandlerQeury>

                {isFetchingGetGoalId || isLoadingGetGoalId ? (
                  <HandlerQeury
                    Loading={isLoadingGetGoalId}
                    Fetching={isFetchingGetGoalId}
                  ></HandlerQeury>
                ) : (
                  <>
                    {currentGoal.content ? (
                      <>
                        <DragDropContext onDragEnd={onDragEnd}>
                          <Droppable droppableId="editorList">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={classes.droppableContainer}
                              >
                                {editorState.map((item, index) => (
                                  <Draggable
                                    key={index}
                                    draggableId={`item-${index}`}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={classes.editorContainer}
                                      >
                                        <div
                                          {...provided.dragHandleProps}
                                          className={classes.dragHandle}
                                        >
                                          <img src={drag} alt="drag" />
                                        </div>

                                        <MyEditor
                                          key={index}
                                          editorState={item}
                                          setEditorState={(newState) => {
                                            const updatedState = [
                                              ...editorState,
                                            ];
                                            updatedState[index] = newState;
                                            setEditorState(updatedState);
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

                        <button
                          className={classes.add}
                          onClick={() => addEditor()}
                        >
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
                              Добавить еще одну часть цели (Ctrl+Enter)
                            </span>
                          </div>
                        </button>

                        <HandlerMutation
                          Loading={isLoadingUpdateGoalMutation}
                          Error={isErrorUpdateGoalMutation && !manualErrorReset} // Учитываем ручной сброс
                          Success={
                            isSuccessUpdateGoalMutation && !manualSuccessReset
                          } // Учитываем ручной сброс
                          textSuccess={"Цель обновлена"}
                          textError={
                            Error?.data?.errors?.[0]?.errors?.[0]
                              ? Error.data.errors[0].errors[0]
                              : Error?.data?.message
                          }
                        ></HandlerMutation>
                      </>
                    ) : (
                      <>
                        <WaveLetters letters={"Выберите цель"}></WaveLetters>
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
