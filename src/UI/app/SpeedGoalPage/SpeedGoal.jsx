import React, { useState, useEffect } from "react";
import classes from "./SpeedGoal.module.css";
import classNames from "classnames";
import {
  useGetSpeedGoalIdQuery,
  useUpdateSpeedGoalMutation,
} from "../../../BLL/speedGoalApi.js";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import WaveLetters from "../../Custom/WaveLetters.jsx";
import TextArea from "../../Custom/TextArea/TextArea.jsx";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import SelectBorder from "@Custom/SelectBorder/SelectBorder";
import { useGetStrategies } from "BLL/strategy/hooks/useGetStrategies";

export default function SpeedGoal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedStrategId, setSelectedStrategId] = useState("");

  const [contentEditors, setContentEditors] = useState([]);
  const [situationEditors, setSituationEditors] = useState([]);
  const [rootCauseEditors, setRootCauseEditors] = useState([]);

  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  const { completedStrategies, draftAndActiveStrategies } = useGetStrategies();

  const {
    currentSpeedGoal = {},
    isLoadingGetSpeedGoalId,
    isErrorGetSpeedGoalId,
    isFetchingGetSpeedGoalId,
  } = useGetSpeedGoalIdQuery(
    { strategId: selectedStrategId },
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

  const saveUpdateSpeedGoal = async () => {
    await updateSpeedGoal({
      _id: currentSpeedGoal.id,
      situation: situationEditors,
      content: contentEditors,
      rootCause: rootCauseEditors,
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

  const changeStrategyId = (id) => {
    setSelectedStrategId(id);
    setManualSuccessReset(true);
    setManualErrorReset(true);
  };

  useEffect(() => {
    if (Array.isArray(currentSpeedGoal.content)) {
      setContentEditors(currentSpeedGoal.content);
    }

    if (Array.isArray(currentSpeedGoal.situation)) {
      setSituationEditors(currentSpeedGoal.situation);
    }

    if (Array.isArray(currentSpeedGoal.rootCause)) {
      setRootCauseEditors(currentSpeedGoal.rootCause);
    }
  }, [currentSpeedGoal]);

  return (
    <div className={classes.dialog}>
      <Headers name={"Краткосрочная цель"} speedGoal={"speedGoal"}>
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
        <BottomHeaders update={saveUpdateSpeedGoal}>
          <SelectBorder
            value={selectedStrategId}
            onChange={changeStrategyId}
            array={draftAndActiveStrategies}
            array1={completedStrategies}
            arrayItem={"strategyNumber"}
            prefix={"Стратегия №"}
            styleSelected={currentSpeedGoal?.strategy?.state}
          ></SelectBorder>
        </BottomHeaders>
      </Headers>

      <div className={classes.main}>
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
                      <TextArea
                        key={index}
                        value={item}
                        onChange={(newState) =>
                          handleEditorChange(index, newState, "content")
                        }
                      ></TextArea>
                    ))}
                  </>
                )}

                {activeIndex === 1 && (
                  <>
                    {situationEditors.map((item, index) => (
                      <TextArea
                        key={index}
                        value={item}
                        onChange={(newState) =>
                          handleEditorChange(index, newState, "situation")
                        }
                      ></TextArea>
                    ))}
                  </>
                )}

                {activeIndex === 2 && (
                  <>
                    {rootCauseEditors.map((item, index) => (
                      <TextArea
                        key={index}
                        value={item}
                        onChange={(newState) =>
                          handleEditorChange(index, newState, "rootCause")
                        }
                      ></TextArea>
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
