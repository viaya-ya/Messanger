import React, { useState, useEffect } from "react";
import classes from "./Goal.module.css";
import drag from "../../image/drag.svg";
import deleteImage from "../../image/delete.svg";
import {
  useGetGoalQuery,
  useUpdateGoalMutation,
  usePostGoalMutation,
} from "../../../BLL/goalApi.js";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TextArea from "../../Custom/TextArea/TextArea.jsx";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import useGetOldAndNewOrganizationId from "UI/hooks/useGetOrganizationId";



export default function Goal() {
  const [editorState, setEditorState] = useState([]);

  // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

 const {reduxNewSelectedOrganizationId } =
    useGetOldAndNewOrganizationId();

  const {
    currentGoal = [],
    isErrorGetGoal,
    isLoadingGetGoal,
    isFetchingGetGoal,
  } = useGetGoalQuery({organizationId: reduxNewSelectedOrganizationId}, {
    selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
      currentGoal: data?.currentGoal || [],
      isErrorGetGoal: isError,
      isLoadingGetGoal: isLoading,
      isFetchingGetGoal: isFetching,
    }),
  });



  const [
    postGoal,
    {
      isLoading: isLoadingPostPoliciesMutation,
      isSuccess: isSuccessPostPoliciesMutation,
      isError: isErrorPostPoliciesMutation,
    },
  ] = usePostGoalMutation();

  const [
    updateGoal,
    {
      isLoading: isLoadingUpdateGoalMutation,
      isSuccess: isSuccessUpdateGoalMutation,
      isError: isErrorUpdateGoalMutation,
      error: Error,
    },
  ] = useUpdateGoalMutation();

  const saveGoal = async () => {
    await postGoal({
      content: [""],
      organizationId: reduxNewSelectedOrganizationId,
    })
      .unwrap()
      .then()
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2));
      });
  };

  const saveUpdateGoal = async () => {
    await updateGoal({
      _id: currentGoal.id,
      content: editorState,
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

  const addEditor = () => {
    if (Object.keys(currentGoal).length > 0) {
      setEditorState((prevEditors) => [...prevEditors, []]);
    } else {
      saveGoal();
    }
  };

  const deleteEditor = (index) => {
    setEditorState((prevEditors) => {
      const updated = [...prevEditors];
      updated.splice(index, 1);
      return updated;
    });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    // Создаем новый массив состояний
    const updatedState = Array.from(editorState);

    // Перемещаем редактор
    const [movedItem] = updatedState.splice(source.index, 1);
    updatedState.splice(destination.index, 0, movedItem);

    setEditorState(updatedState);
  };

  useEffect(() => {
    if (currentGoal.id) {
      setEditorState(currentGoal.content);
    }
  }, [currentGoal]);

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

  return (
    <div className={classes.dialog}>
      <Headers name={"цели"}>
        <BottomHeaders update={saveUpdateGoal}></BottomHeaders>
      </Headers>

      <div className={classes.main}>
        {isErrorGetGoal ? (
          <>
            <HandlerQeury Error={isErrorGetGoal}></HandlerQeury>
          </>
        ) : (
          <>
            <HandlerQeury
              Loading={isLoadingGetGoal}
              Fetching={isFetchingGetGoal}
            ></HandlerQeury>

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

                            <TextArea
                              key={index}
                              value={item}
                              onChange={(newState) => {
                                const updatedState = [...editorState];
                                updatedState[index] = newState;
                                setEditorState(updatedState);
                              }}
                            ></TextArea>

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

            <button className={classes.add} onClick={() => addEditor()}>
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
              Error={isErrorUpdateGoalMutation && !manualErrorReset}
              Success={isSuccessUpdateGoalMutation && !manualSuccessReset}
              textSuccess={"Цель обновлена"}
              textError={
                Error?.data?.errors?.[0]?.errors?.[0]
                  ? Error.data.errors[0].errors[0]
                  : Error?.data?.message
              }
            ></HandlerMutation>
          </>
        )}
      </div>
    </div>
  );
}
