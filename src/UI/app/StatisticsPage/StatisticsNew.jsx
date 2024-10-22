import React, { useState, useEffect } from "react";
import classes from "./StatisticsNew.module.css";
import icon from "../../image/iconHeader.svg";
import iconBack from "../../image/iconBack.svg";
import { useNavigate, useParams } from "react-router-dom";
import Graphic from "../../Custom/Graphic";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import statisticsArrowLeft from "../../image/statisticsArrowLeft.svg";
import statisticsArrowRight from "../../image/statisticsArrowRight.svg";
import {
  useGetStatisticsNewQuery,
  usePostStatisticsMutation,
} from "../../../BLL/statisticsApi";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";

export default function StatisticsNew() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/statistics`);
  };

  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [postId, setPostId] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState([{ valueDate: "", value: 0 }]);

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

  const [postStatistics,
    {
      isLoading: isLoadingPostStatisticMutation,
      isSuccess: isSuccessPostStatisticMutation,
      isError: isErrorPostStatisticMutation,
      error: Error,
    },] = usePostStatisticsMutation();

  const addPoint = () => {
    setPoints((prevState) => [...prevState, { valueDate: "", value: 0 }]);
  };

  const deletePoint = () => {
    setPoints((prevState) => prevState.slice(0, -1));
  };

  const onChangePoints = (value, type, index) => {
    const updatedPoints = [...points];
    if (type === "value") {
      updatedPoints[index][type] = Number(value);
    } else {
      updatedPoints[index][type] = value;
    }
    setPoints(updatedPoints);
  };

  const reset = () => {
    setType("");
    setName("");
    setPostId("");
    setDescription("");
    setPoints([]);
  };

  const saveStatistics = async () => {
    const formatDate = points.map((item) => {
      return {
        ...item,
        valueDate: new Date(item.valueDate),
      };
    });
    await postStatistics({
      userId,
      type: type,
      name: name,
      description: description,
      postId: postId,
      statisticDataCreateDtos: formatDate,
    })
      .unwrap()
      .then(() => {
        reset();
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
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
            <div className={classes.iconSave}>
              <img
                src={Blacksavetmp}
                alt="Blacksavetmp"
                className={classes.image}
                onClick={() => saveStatistics()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.main}>

      {isErrorNewStatistic ? (
          <HandlerQeury Error={isErrorNewStatistic}></HandlerQeury>
        ) : (
          <>
            {isLoadingNewStatistic ? (
              <HandlerQeury Loading={isLoadingNewStatistic}></HandlerQeury>
            ) : (
              <>
        
        <div className={classes.block1}>
          <Graphic data={points} name="Статистика"></Graphic>
        </div>

        <div className={classes.block2}>
          <div className={classes.deletePoint} onClick={deletePoint}>
            <img src={statisticsArrowLeft} alt="statisticsArrowLeft" />
          </div>

          <div className={classes.points}>
            {points.map((_, index) => {
              return (
                <div className={classes.item}>
                  <input
                    type="date"
                    onChange={(e) => {
                      onChangePoints(e.target.value, "valueDate", index);
                    }}
                    className={classes.date}
                  />
                  <input
                    type="number"
                    onChange={(e) => {
                      onChangePoints(e.target.value, "value", index);
                    }}
                    className={classes.number}
                  />
                </div>
              );
            })}
          </div>

          <div className={classes.addPoint} onClick={addPoint}>
            <img src={statisticsArrowRight} alt="statisticsArrowRight" />
          </div>
        </div>

        <div className={classes.block3}>
          <div className={classes.row1}>
            <input
              type="text"
              value={name}
              className={classes.element}
              onChange={(e) => setName(e.target.value)}
              placeholder="Название статистики"
            />

            <select
              value={type} // Устанавливаем ID, по умолчанию пустая строка
              onChange={(e) => {
                setType(e.target.value);
              }}
              className={classes.element}
            >
              <option value="" disabled>
                Выберите тип
              </option>

              <option value="Прямая">Прямая</option>
              <option value="Обратная">Обратная</option>
            </select>

            <select
              value={postId} // Устанавливаем ID, по умолчанию пустая строка
              onChange={(e) => {
                setPostId(e.target.value);
              }}
              className={classes.element}
            >
              <option value="" disabled>
                Выберите пост
              </option>
              {posts.map((item) => {
                return <option value={item.id}>{item.postName}</option>;
              })}
            </select>
          </div>
          <div className={classes.row2}>
            <textarea
              placeholder="Описание статистики: что и как считать"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
              <HandlerMutation
                Loading={isLoadingPostStatisticMutation}
                Error={isErrorPostStatisticMutation}
                Success={isSuccessPostStatisticMutation}
                textSuccess={"Статистика успешно создана."}
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
