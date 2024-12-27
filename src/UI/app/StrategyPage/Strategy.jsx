import React, { useState, useEffect } from "react";
import classes from "./Strategy.module.css";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import {
  useGetStrategIdQuery,
  useUpdateStrategMutation,
  usePostStrategMutation,
} from "../../../BLL/strategy/strategApi.js";
import WaveLetters from "../../Custom/WaveLetters.jsx";
import ModalWindow from "../../Custom/ModalWindow.jsx";
import TextArea from "../../Custom/TextArea/TextArea.jsx";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import SelectBorder from "@Custom/SelectBorder/SelectBorder";
import Select from "@Custom/Select/Select";
import { useGetStrategies } from "BLL/strategy/hooks/useGetStrategies";

export default function Strategy() {

  const [number, setNumber] = useState("");
  const [state, setState] = useState("");
  const [editorState, setEditorState] = useState("");


  const [postId, setPostId] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [openModalDraft, setOpenModalDraft] = useState(false);

  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  const [manualPostSuccessReset, setManualPostSuccessReset] = useState(false);
  const [manualPostErrorReset, setManualPostErrorReset] = useState(false);


  const {
    hasDraftStrategy,
    completedStrategies,
    draftAndActiveStrategies,
    activeStrategyId,
    isLoadingStrategies,
    isErrorStrategies,
    isFetchingStrategies,
  } = useGetStrategies();

  const {
    currentStrategy = {},
    currentStrategyState = "",
    isLoadingGetStrategId,
    isErrorGetStrategId,
    isFetchingGetStrategId,
  } = useGetStrategIdQuery(
    { strategyId: number },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentStrategy: data?.currentStrategy || {},
        currentStrategyState: data?.currentStrategyState || "",
        isLoadingGetStrategId: isLoading,
        isErrorGetStrategId: isError,
        isFetchingGetStrategId: isFetching,
      }),
      skip: !number,
    }
  );

  const [
    postStarteg,
    {
      isLoading: isLoadingPostStrateg,
      isError: isErrorPostStrateg,
      isSuccess: isSuccessPostStrateg,
      error: ErrorPostStrateg,
    },
  ] = usePostStrategMutation();

  const [
    updateStrateg,
    {
      isLoading: isLoadingUpdateStrategMutation,
      isSuccess: isSuccessUpdateStrategMutation,
      isError: isErrorUpdateStrategMutation,
      error: ErrorUpdateStrategMutation,
    },
  ] = useUpdateStrategMutation();

  const stateMapping = {
    Черновик: ["Активный", "Черновик"],
    Активный: ["Активный", "Завершено"],
    Завершено: ["Завершено"],
  };

  const filteredArrayState = (stateMapping[currentStrategy.state] || []).map(
    (id) => ({
      id,
      value: id,
    })
  );


  const handleNumberOnChange = (e) => {
    setNumber(e);
    resetSelect();
  }


  const newStrateg = () => {
    if (hasDraftStrategy === true) {
      setOpenModalDraft(true);
    } else {
      setManualPostSuccessReset(true);
      setManualPostErrorReset(true);
      savePostStarteg();
    }
  };

  const savePostStarteg = async () => {
    await postStarteg({
      content: " ",
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


  const save = () => {
    console.log("activeStrategyId");
    console.log(activeStrategyId);
    if (
      state === "Активный" &&
      currentStrategy.state === "Черновик" &&
      activeStrategyId
    ) {
      setOpenModal(true);
    } else {
      saveUpdateStrateg();
    }
  };

  const saveUpdateStrateg = async () => {
    const Data = [];
    if (state !== "" && state !== currentStrategy.state) {
      Data.state = state;
    }
    if (editorState !== currentStrategy.content) {
      Data.content = editorState;
    }
    await updateStrateg({
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


  const btnYes = async () => {
    await updateStrateg({
      _id: activeStrategyId,
      state: "Завершено",
    })
      .unwrap()
      .then(() => {
        saveUpdateStrateg();
      })
      .catch((error) => {
        setManualErrorReset(false);
        console.error("Ошибка:", JSON.stringify(error, null, 2)); 
      });
  };

  const btnNo = async () => {
    const Data = [];
    if (editorState !== currentStrategy.content) {
      Data.content = editorState;
    }
    if (Data.content) {
      await updateStrateg({
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


  const resetRequest = () => {
    setManualSuccessReset(false);
    setManualErrorReset(false);
    setOpenModal(false);
  };

  const resetSelect = () => {
    setManualSuccessReset(true);
    setManualErrorReset(true);

    setManualPostSuccessReset(true);
    setManualPostErrorReset(true);
  };


  useEffect(() => {
    if (postId !== null) {
      setNumber(postId);
    }
  }, [postId]);

  useEffect(() => {

    if (currentStrategy.content) {
      setEditorState(currentStrategy.content);
    }

    if (currentStrategy.state) {
      setState(currentStrategy.state);
    }
  }, [currentStrategy.id, isLoadingGetStrategId, isFetchingGetStrategId]);

  
  return (
    <div className={classes.dialog}>
      <Headers name={"стратегия"}>
        <BottomHeaders create={newStrateg} update={save}>
          <SelectBorder
            value={number}
            onChange={handleNumberOnChange}
            array={draftAndActiveStrategies}
            array1={completedStrategies}
            arrayItem={"strategyNumber"}
            prefix={"Стратегия №"}
            styleSelected={currentStrategyState}
          ></SelectBorder>
          {number && (
            <Select
              name={"Состояние"}
              value={state}
              onChange={setState}
              array={filteredArrayState}
              arrayItem={"value"}
              disabledPole={currentStrategy.state === "Завершено"}
            ></Select>
          )}
        </BottomHeaders>
      </Headers>

      <div className={classes.main}>
        {isErrorStrategies ? (
          <>
            <HandlerQeury Error={true}></HandlerQeury>
          </>
        ) : (
          <>
            {isErrorGetStrategId ? (
              <HandlerQeury Error={isErrorGetStrategId}></HandlerQeury>
            ) : (
              <>
                <HandlerQeury Loading={isLoadingStrategies}></HandlerQeury>

                {isLoadingGetStrategId || isFetchingGetStrategId ? (
                  <HandlerQeury
                    Loading={isLoadingGetStrategId}
                    Fetching={isFetchingGetStrategId}
                  ></HandlerQeury>
                ) : (
                  <>
                    {currentStrategy.id ? (
                      <>
                        <TextArea
                          key={currentStrategy.id}
                          value={editorState}
                          onChange={setEditorState}
                          readOnly={currentStrategy.state === "Завершено"}
                        ></TextArea>

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
                          Error={isErrorPostStrateg && !manualPostErrorReset}
                          Success={
                            isSuccessPostStrateg && !manualPostSuccessReset
                          }
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
