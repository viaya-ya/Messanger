import React, { useState, useEffect } from "react";
import classes from "./StatisticsContent.module.css";
import icon from "../../image/iconHeader.svg";
import iconBack from "../../image/iconBack.svg";
import { useNavigate, useParams } from "react-router-dom";
import Graphic from "../../Custom/Graphic";
import iconAdd from "../../image/iconAdd.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import statisticsArrowLeft from "../../image/statisticsArrowLeft.svg";
import statisticsArrowRight from "../../image/statisticsArrowRight.svg";
import {
  useGetStatisticsIdQuery,
  useGetStatisticsNewQuery,
  useGetStatisticsQuery,
  useUpdateStatisticsMutation,
} from "../../../BLL/statisticsApi";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";

export default function StatisticsContent() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/start`);
  };
  const newStatistics = () => {
    navigate("new");
  };

  const [type, setType] = useState("null");
  const [name, setName] = useState("null");
  const [postId, setPostId] = useState("null");
  const [description, setDescription] = useState();
  const [statisticId, setStatisticId] = useState();
  const [oldReceivedPoints, setOldReceivedPoints] = useState([]);
  const [receivedPoints, setReceivedPoints] = useState([]);
  const [createPoints, setCreatePoints] = useState([]);

  // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  const {
    statistics = [],
    isLoadingStatistic,
    isFetchingStatistic,
    isErrorStatistic,
  } = useGetStatisticsQuery(userId, {
    selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
      statistics: data || [],
      isLoadingStatistic: isLoading,
      isFetchingStatistic: isFetching,
      isErrorStatistic: isError,
    }),
  });

  const {
    posts = [],
    isLoadingNewStatistic,
    isErrorNewStatistic,
  } = useGetStatisticsNewQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      posts: data?.posts || [],
      isLoadingNewStatistic: isLoading,
      isErrorNewStatistic: isError,
    }),
  });

  const {
    currentStatistic = {},
    statisticDatas = [],
    isLoadingGetStatisticId,
    isErrorGetStatisticId,
    isFetchingGetStatisticId,
  } = useGetStatisticsIdQuery(
    { userId, statisticId: statisticId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentStatistic: data?.currentStatistic || {},
        statisticDatas: data?.statisticDatas || [],
        isLoadingGetStatisticId: isLoading,
        isErrorGetStatisticId: isError,
        isFetchingGetStatisticId: isFetching,
      }),
      skip: !statisticId,
    }
  );

  const [
    updateStatistics,
    {
      isLoading: isLoadingUpdateStatisticMutation,
      isSuccess: isSuccessUpdateStatisticMutation,
      isError: isErrorUpdateStatisticMutation,
      error: Error,
    },
  ] = useUpdateStatisticsMutation();

  useEffect(() => {
    if (statisticDatas.length > 0) {
      const updatedPoints = statisticDatas.map((item) => ({
        ...item,
        valueDate: item.valueDate.split("T")[0],
      }));
      const updatedPoints1 = statisticDatas.map((item) => ({
        ...item,
        valueDate: item.valueDate.split("T")[0],
      }));

      if (JSON.stringify(oldReceivedPoints) !== JSON.stringify(updatedPoints)) {
        setOldReceivedPoints(updatedPoints);
        setReceivedPoints(updatedPoints1);
      }
    }
  }, [currentStatistic, isLoadingGetStatisticId, isFetchingGetStatisticId]);

  function compareArrays(oldArray, newArray) {
    const changes = [];
    newArray.forEach((newItem) => {
      const oldItem = oldArray.find((item) => item.id === newItem.id);

      if (oldItem) {
        const itemChanges = {};

        ["value", "valueDate"].forEach((key) => {
          if (newItem[key] !== oldItem[key]) {
            if (key == "valueDate") {
              itemChanges[key] = new Date(newItem[key]);
            } else {
              itemChanges[key] = newItem[key];
            }
          }
        });

        if (Object.keys(itemChanges).length > 0) {
          changes.push({ _id: newItem.id, ...itemChanges });
        }
      }
    });

    return changes;
  }

  const saveUpdateStatistics = async () => {
    const Data = {};

    if (type !== "null" && type !== currentStatistic.type) {
      Data.type = type;
    }
    if (name !== "null" && name !== currentStatistic.name) {
      Data.name = name;
    }
    if (postId !== "null" && postId !== currentStatistic?.post?.id) {
      Data.postId = postId;
    }
    if (description !== null && description !== currentStatistic.description) {
      Data.description = description;
    }
    if (createPoints.length > 0) {
      Data.statisticDataCreateDtos = createPoints;
    }
    if (receivedPoints.length > 0) {
      const array = compareArrays(oldReceivedPoints, receivedPoints);
      if (array.length > 0) {
        Data.statisticDataUpdateDtos = [];
        Data.statisticDataUpdateDtos.push(...array);
      }
    }
    await updateStatistics({
      userId,
      statisticId,
      _id: statisticId,
      ...Data,
    })
      .unwrap()
      .then(() => {
        setManualSuccessReset(false);
        setManualErrorReset(false);
        reset();
      })
      .catch((error) => {
        setManualErrorReset(false);
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const addPoint = () => {
    setCreatePoints((prevState) => [...prevState, { valueDate: "", value: 0 }]);
  };

  const deletePoint = () => {
    setCreatePoints((prevState) => prevState.slice(0, -1));
  };

  const onChangePoints = (nameArrray, value, type, index) => {
    if (nameArrray === "received") {
      const updatedPoints = [...receivedPoints];
      if (type === "value") {
        updatedPoints[index][type] = Number(value);
      } else {
        updatedPoints[index][type] = value;
      }
      setReceivedPoints(updatedPoints);
    } else {
      const updatedPoints = [...createPoints];
      if (type === "value") {
        updatedPoints[index][type] = Number(value);
      } else {
        updatedPoints[index][type] = value;
      }
      setCreatePoints(updatedPoints);
    }
  };

  const reset = () => {
    setType("");
    setName("");
    setPostId("");
    setDescription("");
    setCreatePoints([]);
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
          <input
            type="search"
            placeholder="Поиск"
            className={classes.search}
            // value={searchTerm}
            // onChange={handleSearchChange}
          />
        </div>
        <div className={classes.editText}>
          <div className={classes.five}>
            <div className={classes.iconAdd}>
              <img
                src={iconAdd}
                alt="iconAdd"
                className={classes.image}
                onClick={() => newStatistics()}
              />
            </div>
            <div className={classes.iconSave}>
              <img
                src={Blacksavetmp}
                alt="Blacksavetmp"
                className={classes.image}
                onClick={() => saveUpdateStatistics()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.main}>
        {isErrorStatistic && isErrorNewStatistic ? (
          <>
            <HandlerQeury Error={isErrorStatistic}></HandlerQeury>
          </>
        ) : (
          <>
            {isErrorGetStatisticId ? (
              <HandlerQeury Error={isErrorGetStatisticId}></HandlerQeury>
            ) : (
              <>
                <HandlerQeury
                  Loading={isLoadingStatistic}
                  Fetching={isFetchingStatistic}
                ></HandlerQeury>
                <HandlerQeury Loading={isLoadingNewStatistic}></HandlerQeury>
                {isFetchingGetStatisticId || isLoadingGetStatisticId ? (
                  <HandlerQeury
                    Loading={isLoadingGetStatisticId}
                    Fetching={isFetchingGetStatisticId}
                  ></HandlerQeury>
                ) : (
                  <>
                    {currentStatistic.id ? (
                      <>
                        <div className={classes.block1}>
                          <Graphic
                            data={[...receivedPoints, ...createPoints]}
                            name="Статистика"
                          ></Graphic>
                        </div>

                        <div className={classes.block2}>
                          <div
                            className={classes.deletePoint}
                            onClick={deletePoint}
                          >
                            <img
                              src={statisticsArrowLeft}
                              alt="statisticsArrowLeft"
                            />
                          </div>

                          <div className={classes.points}>
                            {receivedPoints?.map((item, index) => {
                              return (
                                <div className={classes.item}>
                                  <input
                                    type="date"
                                    value={item.valueDate}
                                    onChange={(e) => {
                                      onChangePoints(
                                        "received",
                                        e.target.value,
                                        "valueDate",
                                        index
                                      );
                                    }}
                                    className={classes.date}
                                  />
                                  <input
                                    type="number"
                                    value={item.value}
                                    onChange={(e) => {
                                      onChangePoints(
                                        "received",
                                        e.target.value,
                                        "value",
                                        index
                                      );
                                    }}
                                    className={classes.number}
                                  />
                                </div>
                              );
                            })}
                            {createPoints?.map((item, index) => {
                              return (
                                <div className={classes.item}>
                                  <input
                                    type="date"
                                    value={item.valueDate}
                                    onChange={(e) => {
                                      onChangePoints(
                                        "",
                                        e.target.value,
                                        "valueDate",
                                        index
                                      );
                                    }}
                                    className={classes.date}
                                  />
                                  <input
                                    type="number"
                                    value={item.value}
                                    onChange={(e) => {
                                      onChangePoints(
                                        "",
                                        e.target.value,
                                        "value",
                                        index
                                      );
                                    }}
                                    className={classes.number}
                                  />
                                </div>
                              );
                            })}
                          </div>

                          <div className={classes.addPoint} onClick={addPoint}>
                            <img
                              src={statisticsArrowRight}
                              alt="statisticsArrowRight"
                            />
                          </div>
                        </div>

                        <div className={classes.block3}>
                          <div className={classes.row1}>
                            <select
                              value={statisticId}
                              onChange={(e) => {
                                setStatisticId(e.target.value);
                                setManualSuccessReset(true);
                                setManualErrorReset(true);
                              }}
                              className={classes.element}
                            >
                              <option value="null" disabled>
                                Выберите статистику
                              </option>
                              {statistics.map((item) => {
                                return (
                                  <option value={item.id}>{item.name}</option>
                                );
                              })}
                            </select>

                            <select
                              value={
                                type !== "null" ? type : currentStatistic.type
                              } // Устанавливаем ID, по умолчанию пустая строка
                              onChange={(e) => {
                                setType(e.target.value);
                              }}
                              className={classes.element}
                            >
                              <option value="null" disabled>
                                Выберите тип
                              </option>

                              <option value="Прямая">Прямая</option>
                              <option value="Обратная">Обратная</option>
                            </select>

                            <select
                              value={
                                postId !== "null"
                                  ? postId
                                  : currentStatistic?.post?.id
                              } // Устанавливаем ID, по умолчанию пустая строка
                              onChange={(e) => {
                                setPostId(e.target.value);
                              }}
                              className={classes.element}
                            >
                              <option value="null" disabled>
                                Выберите пост
                              </option>
                              {posts.map((item) => {
                                return (
                                  <option value={item.id}>
                                    {item.postName}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className={classes.row2}>
                            <textarea
                              placeholder="Описание статистики: что и как считать"
                              value={
                                description || currentStatistic.description
                              }
                              onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                          </div>
                        </div>
                        <HandlerMutation
                          Loading={isLoadingUpdateStatisticMutation}
                          Error={
                            isErrorUpdateStatisticMutation && !manualErrorReset
                          } // Учитываем ручной сброс
                          Success={
                            isSuccessUpdateStatisticMutation &&
                            !manualSuccessReset
                          } // Учитываем ручной сброс
                          textSuccess={"Статистика обновлена"}
                          textError={
                            Error?.data?.errors?.[0]?.errors?.[0] 
                              ? Error.data.errors[0].errors[0] 
                              : Error?.data?.message
                          }
                        ></HandlerMutation>
                      </>
                    ) : (
                      <>
                        Выберите статистику
                        <div className={classes.block1}></div>
                        <div className={classes.block2}></div>
                        <div className={classes.block3}>
                          <div className={classes.row1}>
                            <select
                              value={statisticId}
                              onChange={(e) => {
                                setStatisticId(e.target.value);
                                setManualSuccessReset(true);
                                setManualErrorReset(true);
                              }}
                              className={classes.element}
                            >
                              <option value="null" disabled>
                                Выберите статистику
                              </option>
                              {statistics.map((item) => {
                                return (
                                  <option value={item.id}>{item.name}</option>
                                );
                              })}
                            </select>

                            <select
                              disabled
                              value={
                                type !== "null" ? type : currentStatistic.type
                              } // Устанавливаем ID, по умолчанию пустая строка
                              onChange={(e) => {
                                setType(e.target.value);
                              }}
                              className={classes.element}
                            >
                              <option value="null" disabled>
                                Выберите тип
                              </option>

                              <option value="Прямая">Прямая</option>
                              <option value="Обратная">Обратная</option>
                            </select>

                            <select
                              disabled
                              value={
                                postId !== "null"
                                  ? postId
                                  : currentStatistic?.post?.id
                              } // Устанавливаем ID, по умолчанию пустая строка
                              onChange={(e) => {
                                setPostId(e.target.value);
                              }}
                              className={classes.element}
                            >
                              <option value="null" disabled>
                                Выберите пост
                              </option>
                              {posts.map((item) => {
                                return (
                                  <option value={item.id}>
                                    {item.postName}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className={classes.row2}>
                            <textarea
                              disabled
                              placeholder="Описание статистики: что и как считать"
                              value={
                                description || currentStatistic.description
                              }
                              onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                          </div>
                        </div>
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
