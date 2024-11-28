import React, { useState, useEffect } from "react";
import classes from "./StatisticsNew.module.css";
import icon from "../../image/iconHeader.svg";
import iconBack from "../../image/iconBack.svg";
import { useNavigate, useParams } from "react-router-dom";
import Graphic from "../../Custom/Graphic";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import statisticsArrowLeft from "../../image/statisticsArrowLeft.svg";
import statisticsArrowRight from "../../image/statisticsArrowRight.svg";
import trash from "../../image/trash.svg";
import addBlock from "../../image/iconAdd.svg";
import {
  useGetStatisticsNewQuery,
  usePostStatisticsMutation,
} from "../../../BLL/statisticsApi";
import { useGetOrganizationsQuery } from "../../../BLL/organizationApi.js";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import styles from "../../Custom/CommonStyles.module.css";
import { useDispatch } from "react-redux";
import { setStatisticCreatedId } from "../../../BLL/statisticsSlice.js";

export default function StatisticsNew() {
  const navigate = useNavigate();
  const { userId, paramPostID } = useParams();
  const back = () => {
    paramPostID ? navigate(`/${userId}/posts/${paramPostID}`) : navigate(`/${userId}/statistics`);
  };

  const [type, setType] = useState("");
  const [name, setName] = useState("Статистика");
  const [postId, setPostId] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState([
    { valueDate: "", value: 0, id: new Date() },
  ]);

  const [organization, setOrganization] = useState("");
  const [postsToOrganization, setPostsToOrganization] = useState([]);
  const [disabledPosts, setDisabledPosts] = useState(true);

  const dispatch = useDispatch();

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
    organizations = [],
    isLoadingOrganizations,
    isFetchingOrganizations,
    isErrorOrganizations,
  } = useGetOrganizationsQuery(userId, {
    selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
      organizations: data || [],
      isLoadingOrganizations: isLoading,
      isFetchingOrganizations: isFetching,
      isErrorOrganizations: isError,
    }),
  });

  const [
    postStatistics,
    {
      isLoading: isLoadingPostStatisticMutation,
      isSuccess: isSuccessPostStatisticMutation,
      isError: isErrorPostStatisticMutation,
      error: Error,
    },
  ] = usePostStatisticsMutation();
  
// Для создания статистики через страницу пост
  useEffect(() => {
    if (paramPostID) {
      const obj = posts.find((item) => item.id === paramPostID);
      setOrganization(obj?.organization.id);
      setPostId(paramPostID);
    }
  }, []);
// Конец

  useEffect(() => {
    if (organization !== "") {
      const array = posts.filter(
        (item) => item?.organization?.id === organization
      );
      setPostsToOrganization(array);
      setDisabledPosts(false);
    }
  }, [organization]);

  const addPoint = () => {
    setPoints((prevState) => [
      { valueDate: "", value: 0, id: new Date() },
      ...prevState,
    ]);
  };

  const deletePoint = () => {
    setPoints((prevState) => prevState.slice(0, -1));
  };

  const onChangePoints = (value, type, id) => {
    setPoints((prevPoints) => {
      const updatedPoints = prevPoints.map((item) => {
        if (item.id === id) {
          return type === "value"
            ? { ...item, value: Number(value) }
            : { ...item, valueDate: value };
        }
        return item;
      });

      updatedPoints.sort(
        (a, b) => Date.parse(b.valueDate) - Date.parse(a.valueDate)
      );
      return updatedPoints;
    });
  };

  const reset = () => {
    setType("");
    setName("");
    setPostId("");
    setDescription("");
    setPoints([]);
    setOrganization("");
  };

  const createStatisticNavigate = (id) => {
    dispatch(setStatisticCreatedId(id));
    navigate(`/${userId}/statistics`);
  };

  const saveStatistics = async () => {
    const formatDate = points.map((item) => {
      return {
        value: item.value,
        valueDate: new Date(item.valueDate),
        isCorrelation: false,
      };
    });
    const Data = [];

    if (description !== "") {
      Data.description = description;
    }
    await postStatistics({
      userId,
      type: type,
      name: name,
      ...Data,
      postId: postId,
      statisticDataCreateDtos: formatDate,
    })
      .unwrap()
      .then((result) => {
        reset();
        createStatisticNavigate(result.id);
        console.log("result.id");
        console.log(result.id);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
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
                  <Graphic
                    data={points}
                    name={name}
                    setName={setName}
                    type={type}
                  ></Graphic>
                </div>

                <div className={classes.block2}>
                  <div className={classes.addPoint} onClick={addPoint}>
                    <img src={addBlock} alt="addBlock" />
                  </div>

                  <div className={classes.points}>
                    {points
                      .sort(
                        (a, b) =>
                          Date.parse(b.valueDate) - Date.parse(a.valueDate)
                      )
                      .map((item, index) => (
                        <div key={index} className={classes.item}>
                          <input
                            type="date"
                            value={item.valueDate} // привязка к текущему состоянию
                            onChange={(e) => {
                              onChangePoints(
                                e.target.value,
                                "valueDate",
                                item.id
                              );
                            }}
                            className={classes.date}
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            value={item.value} // привязка к текущему состоянию
                            onChange={(e) => {
                              const newValue = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                              onChangePoints(newValue, "value", item.id);
                            }}
                            className={classes.number}
                          />
                        </div>
                      ))}
                  </div>

                  <div className={classes.deletePoint} onClick={deletePoint}>
                    <img src={trash} alt="trash" />
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
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className={classes.element}
                    >
                      <option value="" disabled>
                        Выберите организацию
                      </option>
                      {organizations?.map((item) => (
                        <option value={item.id}>{item.organizationName}</option>
                      ))}
                    </select>

                    <select
                      value={postId} // Устанавливаем ID, по умолчанию пустая строка
                      onChange={(e) => {
                        setPostId(e.target.value);
                      }}
                      className={classes.element}
                      disabled={disabledPosts}
                    >
                      <option value="" disabled>
                        Выберите пост
                      </option>
                      {postsToOrganization.map((item) => {
                        return <option value={item.id}>{item.postName}</option>;
                      })}
                    </select>

                    {/* <select
                      name=""
                      id=""
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className={classes.element}
                    >
                      <option value="" disabled>
                        Отчетный день
                      </option>
                      <option value={1}>Пн</option>
                      <option value={2}>Вт</option>
                      <option value={3}>Ср</option>
                      <option value={4}>Чт</option>
                      <option value={5}>Пт</option>
                      <option value={6}>Сб</option>
                      <option value={0}>Вс</option>
                    </select> */}
                  </div>
                  <div className={classes.row2}>
                    <textarea
                      placeholder="Описание статистики: что и как считать"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={classes.textMontserrat}
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
