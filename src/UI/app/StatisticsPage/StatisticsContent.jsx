import React, { useState, useEffect, useRef } from "react";
import classes from "./StatisticsContent.module.css";
import icon from "../../image/iconHeader.svg";
import iconBack from "../../image/iconBack.svg";
import { useNavigate, useParams } from "react-router-dom";
import Graphic from "../../Custom/Graphic";
import iconAdd from "../../image/iconAdd.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import statisticsArrowLeft from "../../image/statisticsArrowLeft.svg";
import statisticsArrowLeftWhite from "../../image/statisticsArrowLeftWhite.svg";
import statisticsArrowRight from "../../image/statisticsArrowRight.svg";
import statisticsArrowRightWhite from "../../image/statisticsArrowRightWhite.svg";
import {
  useGetStatisticsIdQuery,
  useGetStatisticsNewQuery,
  useGetStatisticsQuery,
  useUpdateStatisticsMutation,
} from "../../../BLL/statisticsApi";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import styles from "../../Custom/CommonStyles.module.css";
import exit from "../../image/exitModal.svg";
import {
  useGetOrganizationsQuery,
  useUpdateOrganizationsMutation,
} from "../../../BLL/organizationApi.js";
import WaveLetters from "../../Custom/WaveLetters.jsx";

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
  const [description, setDescription] = useState("");
  const [statisticId, setStatisticId] = useState("");
  const [oldReceivedPoints, setOldReceivedPoints] = useState([]);
  const [receivedPoints, setReceivedPoints] = useState([]);
  const [createPoints, setCreatePoints] = useState([]);

  // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  const [day, setDay] = useState("");
  const [typeGraphic, setTypeGraphic] = useState("Ежедневный");
  const [disabledPoints, setDisabledPoints] = useState(false);

  const [arrayPoints, setArrayPoints] = useState([]);
  const [showPoints, setShowPoints] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [count, setCount] = useState(0);

  const [organizationId, setOrganizationId] = useState("");
  const [statisticsToOrganization, setStatisticsToOrganization] = useState([]);
  const [reportDay, setReportDay] = useState("");
  const [reportDayComes, setReportDayComes] = useState("");
  const [postsToOrganization, setPostsToOrganization] = useState([]);

  const [
    disabledReportDayAndSelectStatistics,
    setDisabledReportDayAndSelectStatistics,
  ] = useState(true);

  const [openModaReportDay, setOpenModalReportDay] = useState(false);
  const [showReportDay, setShowReportDay] = useState();
  const [showReportDayComes, setShowReportDayComes] = useState();

  // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
  const [manualSuccessResetOrganization, setManualSuccessResetOrganization] =
    useState(true);
  const [manualErrorResetOrganization, setManualErrorResetOrganization] =
    useState(true);

  const {
    statistics = [],
    isLoadingStatistic,
    isFetchingStatistic,
    isErrorStatistic,
    refetch,
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

  const [
    updateOrganization,
    {
      isLoading: isLoadingUpdateOrganizationMutation,
      isSuccess: isSuccessUpdateOrganizationMutation,
      isError: isErrorUpdateOrganizationMutation,
      error: ErrorOrganization,
    },
  ] = useUpdateOrganizationsMutation();

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

  useEffect(() => {
    console.log("isLoadingOrganizations");
    if (statistics.length > 0) {
      const array = statistics.filter(
        (item) => item?.post?.organization?.id === organizationId
      );
      const report = organizations.filter(
        (item) => item?.id === organizationId
      );

      const arrayPosts = posts.filter(
        (item) => item?.organization?.id === organizationId
      );
      setDisabledReportDayAndSelectStatistics(false);
      setPostsToOrganization(arrayPosts);
      setStatisticsToOrganization(array);

      setStatisticId("");

      setReportDay(report[0]?.reportDay);
      setReportDayComes(report[0]?.reportDay);
    }
  }, [organizationId]);

  useEffect(() => {
    console.log("isLoadingOrganizations");
    const report = organizations.filter((item) => item?.id === organizationId);
    setReportDay(report[0]?.reportDay);
    setReportDayComes(report[0]?.reportDay);
  }, [isLoadingOrganizations, isFetchingOrganizations]);

  // Все для начальной страницы
  useEffect(() => {
    if (typeGraphic !== "Ежедневный") {
      setDisabledPoints(true);
    } else {
      setDisabledPoints(false);
    }
  }, [typeGraphic]);

  useEffect(() => {
    if (statisticDatas.length > 0) {
      reset(currentStatistic.name);
    }
  }, [currentStatistic, isLoadingGetStatisticId, isFetchingGetStatisticId]);

  useEffect(() => {
    if (statisticDatas.length > 0) {
      setReceivedPoints([]);
      setOldReceivedPoints([]);
      setArrayPoints([]);
      setShowPoints([]);
      setCount(0);
      setDay(reportDay);
    }

    if (statisticDatas.length > 0 && typeGraphic === "Ежедневный") {
      const dayNow = new Date();
      const currentWeekday = dayNow.getDay(); // Текущий день недели (0 - Воскресенье, 1 - Понедельник и т.д.)

      // Определяем начальную дату - ближайший предыдущий день `day`, не более 7 дней назад
      const startDate = new Date(dayNow);
      let dayDifference;

      if (currentWeekday >= day) {
        // Если текущий день >= day, включаем текущую дату или ищем ближайший `day` ранее
        dayDifference = currentWeekday - day;
      } else {
        // Если текущий день < day, откатываемся на предыдущую неделю
        dayDifference = 7 - (day - currentWeekday);
      }

      startDate.setDate(dayNow.getDate() - dayDifference - 1);

      // Ограничиваем начальную дату максимум 7 днями назад от текущего дня
      const maxStartDate = new Date(dayNow);
      maxStartDate.setDate(dayNow.getDate() - 7); // Последние 7 дней включают сегодня и 6 предыдущих дней

      if (startDate < maxStartDate) {
        startDate.setTime(maxStartDate.getTime());
      }

      // Фильтруем данные, оставляя записи от `startDate` до `dayNow` включительно
      const updatedPoints = statisticDatas
        .filter((item) => {
          const itemDate = new Date(item.valueDate);
          return (
            startDate <= itemDate &&
            itemDate <= dayNow &&
            item.isCorrelation !== true
          );
        })
        .map((item) => ({
          ...item,
          valueDate: item.valueDate.split("T")[0],
        }))
        .sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate));

      const updatedPoints1 = statisticDatas
        .filter((item) => {
          const itemDate = new Date(item.valueDate);
          return (
            startDate <= itemDate &&
            itemDate <= dayNow &&
            item.isCorrelation !== true
          );
        })
        .map((item) => ({
          ...item,
          valueDate: item.valueDate.split("T")[0],
        }))
        .sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate));

      setOldReceivedPoints(updatedPoints);
      setReceivedPoints(updatedPoints1);
    }

    if (statisticDatas.length > 0 && typeGraphic === "Ежемесячный") {
      // Группируем данные по месяцам и суммируем `valueDate` за каждый месяц
      const monthlyData = statisticDatas.reduce((acc, item) => {
        const itemDate = new Date(item.valueDate);
        const monthKey = `${itemDate.getFullYear()}-${itemDate.getMonth() + 1}`; // Год-месяц как ключ
        if (
          !isNaN(itemDate) &&
          new Date(new Date().setMonth(new Date().getMonth() - 13)) < itemDate
        ) {
          if (item?.isCorrelation === true) {
            acc[monthKey] = {
              id: item.id,
              valueSum: item.value,
              year: itemDate.getFullYear(),
              month: itemDate.getMonth() + 1,
              isCorrelation: true,
            };
          }

          // Если месяца ещё нет в acc, создаем начальный объект с valueSum = 0
          if (!acc[monthKey] || !acc[monthKey]?.isCorrelation) {
            if (!acc[monthKey]) {
              acc[monthKey] = {
                valueSum: 0,
                year: itemDate.getFullYear(),
                month: itemDate.getMonth() + 1,
                isCorrelation: false,
              };
            }
            acc[monthKey].valueSum += item.value;
          }
        }
        return acc;
      }, {});

      // Формируем новый массив, включающий `valueDate` и `date` (последний день месяца)
      const updatedMonthlyPoints = [];

      // Для каждого месяца от 14 месяцев назад до текущего добавляем данные
      for (let i = 0; i < 13; i++) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - i);
        const monthKey = `${monthDate.getFullYear()}-${
          monthDate.getMonth() + 1
        }`;

        // Если данных нет для этого месяца, создаем запись с суммой 0
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            valueSum: 0,
            year: monthDate.getFullYear(),
            month: monthDate.getMonth() + 1,
            isCorrelation: false,
          };
        }

        const lastDayOfMonth = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth() + 1,
          0
        ); // Получаем последний день месяца
        const year = lastDayOfMonth.getFullYear();
        const monthValue = lastDayOfMonth.getMonth() + 1; // Месяцы начинаются с 0
        const date = lastDayOfMonth.getDate(); // Дата

        updatedMonthlyPoints.push({
          id: monthlyData[monthKey]?.id || null, // Если id не найден, присваиваем null
          valueDate: `${year}-${monthValue}-${date}`, // Форматирование в 'год-месяц-день'
          value: monthlyData[monthKey].valueSum, // Сумма за месяц
          isCorrelation: monthlyData[monthKey].isCorrelation,
        });
      }

      // Сортируем данные по дате, от последнего месяца к первому
      updatedMonthlyPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );

      setReceivedPoints(updatedMonthlyPoints);
    }

    if (statisticDatas.length > 0 && typeGraphic === "Ежегодовой") {
      // Группируем данные по годам и суммируем `valueDate` за каждый год
      const yearData = statisticDatas.reduce((acc, item) => {
        const itemDate = new Date(item.valueDate);
        const yearKey = `${itemDate.getFullYear()}`;
        // Проверяем, что дата корректна и меньше чем на 13 лет от текущего года
        if (
          !isNaN(itemDate) &&
          new Date().getFullYear() - 12 < itemDate.getFullYear()
        ) {
          if (item?.isCorrelation === true) {
            acc[yearKey] = {
              id: item.id,
              valueSum: item.value,
              year: itemDate.getFullYear(),
              isCorrelation: true,
            };
          }

          // Если года еще нет в acc, создаем начальный объект с valueSum = 0
          if (!acc[yearKey] || !acc[yearKey]?.isCorrelation) {
            if (!acc[yearKey]) {
              acc[yearKey] = {
                valueSum: 0,
                year: itemDate.getFullYear(),
                isCorrelation: false,
              };
            }
            acc[yearKey].valueSum += item.value;
          }
        }
        return acc;
      }, {});

      // Формируем новый массив, включающий `valueDate` и `date` (первый день года)
      const updatedYearPoints = [];

      // Для каждого года от 13 лет назад до текущего добавляем данные
      for (let i = 0; i < 12; i++) {
        const yearDate = new Date();
        yearDate.setFullYear(yearDate.getFullYear() - i);
        const yearKey = `${yearDate.getFullYear()}`;

        // Если данных нет для этого года, создаем запись с суммой 0
        if (!yearData[yearKey]) {
          yearData[yearKey] = {
            valueSum: 0,
            year: yearDate.getFullYear(),
            isCorrelation: false,
          };
        }

        updatedYearPoints.push({
          id: yearData[yearKey]?.id || null, // Если id не найден, присваиваем null
          valueDate: `${yearDate.getFullYear()}-01-01`, // Форматирование в 'год-01-01'
          value: yearData[yearKey].valueSum, // Сумма за год
          isCorrelation: yearData[yearKey].isCorrelation,
        });
      }

      // Сортируем данные по дате, от последнего года к первому
      updatedYearPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );

      setReceivedPoints(updatedYearPoints);
    }

    if (statisticDatas.length > 0 && typeGraphic === "13") {
      const today = new Date();
      const end = new Date(today);
      const start = new Date();
      start.setDate(today.getDate() - 14 * 7);

      const selectedDayOfWeek = parseInt(day);
      const result = [];
      let currentDate = new Date(start);
      let currentSum = 0;

      // Перемещаем currentDate на первый выбранный день недели
      while (currentDate.getDay() !== selectedDayOfWeek - 1) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Цикл по неделям
      while (currentDate <= end) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 7);

        // Фильтруем и суммируем значения для текущей недели
        currentSum = statisticDatas
          .filter((item) => {
            const itemDate = new Date(item.valueDate);
            if (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true
            ) {
              setArrayPoints((prevState) => [...prevState, item]);
            }
            return (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true
            );
          })
          .reduce((sum, item) => sum + item.value, 0);

        // Создаем новую дату на день позже
        const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

        // Проверяем, что valueDate не позже сегодняшней даты
        if (valueDate <= today) {
          setArrayPoints((prevState) =>
            prevState.map((item) => {
              if (item.myID) {
                return { ...item };
              } else {
                return {
                  ...item,
                  myID: valueDate.toISOString().split("T")[0],
                };
              }
            })
          );

          result.push({
            value: currentSum,
            valueDate: valueDate.toISOString().split("T")[0],
          });
        }

        currentDate = nextDate; // Переходим к следующей неделе
      }

      setReceivedPoints(
        result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
      );
    }

    if (statisticDatas.length > 0 && typeGraphic === "26") {
      const today = new Date();
      const end = new Date(today);
      const start = new Date();
      start.setDate(today.getDate() - 27 * 7);

      const selectedDayOfWeek = parseInt(day);
      const result = [];
      let currentDate = new Date(start);
      let currentSum = 0;

      // Перемещаем currentDate на первый выбранный день недели
      while (currentDate.getDay() !== selectedDayOfWeek - 1) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Цикл по неделям
      while (currentDate <= end) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 7);

        // Фильтруем и суммируем значения для текущей недели
        currentSum = statisticDatas
          .filter((item) => {
            const itemDate = new Date(item.valueDate);
            if (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true
            ) {
              setArrayPoints((prevState) => [...prevState, item]);
            }
            return (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true
            );
          })
          .reduce((sum, item) => sum + item.value, 0);

        // Создаем новую дату на день позже
        const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

        // Проверяем, что valueDate не позже сегодняшней даты
        if (valueDate <= today) {
          setArrayPoints((prevState) =>
            prevState.map((item) => {
              if (item.myID) {
                return { ...item };
              } else {
                return {
                  ...item,
                  myID: valueDate.toISOString().split("T")[0],
                };
              }
            })
          );

          result.push({
            value: currentSum,
            valueDate: valueDate.toISOString().split("T")[0],
          });
        }

        currentDate = nextDate; // Переходим к следующей неделе
      }

      setReceivedPoints(
        result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
      );
    }

    if (statisticDatas.length > 0 && typeGraphic === "52") {
      const today = new Date();
      const end = new Date(today);
      const start = new Date();
      start.setDate(today.getDate() - 53 * 7);

      const selectedDayOfWeek = parseInt(day);
      const result = [];
      let currentDate = new Date(start);
      let currentSum = 0;

      // Перемещаем currentDate на первый выбранный день недели
      while (currentDate.getDay() !== selectedDayOfWeek - 1) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Цикл по неделям
      while (currentDate <= end) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 7);

        // Фильтруем и суммируем значения для текущей недели
        currentSum = statisticDatas
          .filter((item) => {
            const itemDate = new Date(item.valueDate);
            if (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true
            ) {
              setArrayPoints((prevState) => [...prevState, item]);
            }
            return (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true
            );
          })
          .reduce((sum, item) => sum + item.value, 0);

        // Создаем новую дату на день позже
        const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

        // Проверяем, что valueDate не позже сегодняшней даты
        if (valueDate <= today) {
          setArrayPoints((prevState) =>
            prevState.map((item) => {
              if (item.myID) {
                return { ...item };
              } else {
                return {
                  ...item,
                  myID: valueDate.toISOString().split("T")[0],
                };
              }
            })
          );

          result.push({
            value: currentSum,
            valueDate: valueDate.toISOString().split("T")[0],
          });
        }

        currentDate = nextDate; // Переходим к следующей неделе
      }

      setReceivedPoints(
        result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
      );
    }
  }, [
    currentStatistic,
    isLoadingGetStatisticId,
    isFetchingGetStatisticId,
    typeGraphic,
    reportDay,
    type,
  ]);

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
    if (description !== "" && description !== currentStatistic.description) {
      Data.description = description;
    }
    if (createPoints.length > 0) {
      const formatDate = createPoints.map((item) => {
        return {
          value: item.value,
          valueDate: new Date(item.valueDate),
          isCorrelation: false,
        };
      });
      Data.statisticDataCreateDtos = formatDate;
    }
    if (receivedPoints.length > 0) {
      const array = compareArrays(oldReceivedPoints, receivedPoints);
      if (array.length > 0) {
        Data.statisticDataUpdateDtos = [];
        Data.statisticDataUpdateDtos.push(...array);
      }
    }
    if (Object.keys(Data).length > 0) {
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

          setManualSuccessResetOrganization(true);
          setManualErrorResetOrganization(true);
          reset();

          if (Data.name) {
            refetch();
          }

          setOpenModalReportDay(false);
        })
        .catch((error) => {
          setManualErrorReset(false);

          setManualSuccessResetOrganization(true);
          setManualErrorResetOrganization(true);

          console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
        });
    }
  };

  const addPoint = () => {
    setCreatePoints((prevState) => [
      { valueDate: "", value: 0, id: new Date() },
      ...prevState,
    ]);
  };

  const deletePoint = () => {
    setCreatePoints((prevState) => prevState.slice(0, -1));
  };

  const onChangePoints = (nameArrray, value, type, index, id) => {
    if (nameArrray === "received") {
      const updatedPoints = [...receivedPoints];
      if (type === "value") {
        updatedPoints[index][type] = Number(value);
      } else {
        updatedPoints[index][type] = value;
      }
      setReceivedPoints(updatedPoints);
    } else {
      setCreatePoints((prevState) => {
        const updatedPoints = prevState.map((item) => {
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
    }
  };

  const reset = (name) => {
    setType("null");
    setName(name);
    setPostId("null");
    setDescription("");
    setCreatePoints([]);
  };

  const handleArrowLeftClick = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleArrowRightClick = () => {
    setCount((prevCount) => prevCount - 1);
  };

  // Все для модального окна при нажатии на блок координат точек для статистики
  const exitModal = () => {
    setShowPoints([]);
    setActiveIndex(null);
    setOpenModal(false);
  };

  const showCurrentPoint = (id) => {
    setOpenModal(true);

    const end = new Date(id);
    let start = new Date(id);
    if (typeGraphic === "Ежемесячный" || typeGraphic === "Ежегодовой") {
      const elementIsCorrelation = receivedPoints.filter(
        (item) =>
          new Date(item.valueDate).toDateString() === end.toDateString() &&
          item.isCorrelation === true
      );
      if (elementIsCorrelation.length > 0) {
        setShowPoints(elementIsCorrelation);
      } else {
        setShowPoints((prevState) => [
          ...prevState,
          { valueDate: end, value: "", isCorrelation: false },
        ]);
      }
    } else {
      start.setDate(end.getDate() - 7); //Вот тут происходит вычисление количества дат в модальном окне
      const array = arrayPoints
        .filter((item) => item.myID === id)
        .sort((a, b) => new Date(a.valueDate) - new Date(b.valueDate));

      const arrayNew = [];

      if (array.length < 7) {
        // Проходим по всем датам от start до end
        while (start < end) {
          // Ищем элемент, соответствующий текущей дате start
          const foundItem = array.find(
            (item) =>
              new Date(item.valueDate).toDateString() === start.toDateString()
          );

          if (foundItem) {
            // Если нашли, добавляем его в arrayNew
            arrayNew.push(foundItem);
          } else {
            // Если не нашли, добавляем объект с нулевым значением
            arrayNew.push({
              valueDate: start.toISOString(), // Для сохранения даты в правильном формате
              value: "",
            });
          }

          // Переходим к следующему дню
          start.setDate(start.getDate() + 1);
        }
        setShowPoints(arrayNew);
      } else {
        setShowPoints(array);
      }
    }
  };

  const updateModalPoint = (value, index) => {
    const updatedShowPoints = [...showPoints];
    const update = updatedShowPoints.map((item) => ({ ...item }));
    if (typeGraphic === "Ежемесячный" || typeGraphic === "Ежегодовой") {
      update[index]["value"] = Number(value);
      update[index]["isCorrelation"] = true;
      setShowPoints(update);
    } else {
      update[index]["value"] = Number(value);
      setShowPoints(update);
    }
  };

  const saveModalPoints = async (array) => {
    const Data = {};
    if (typeGraphic === "Ежемесячный" || typeGraphic === "Ежегодовой") {
      if (array[0]["id"]) {
        const arrayReceived = array.map((item) => ({
          _id: item.id,
          value: item.value,
          valueDate: item.valueDate,
          isCorrelation: item.isCorrelation,
        }));
        Data.statisticDataUpdateDtos = arrayReceived;
      } else {
        const formatDate = array.map((item) => {
          return {
            ...item,
            valueDate: new Date(item.valueDate),
            isCorrelation: item.isCorrelation,
          };
        });
        Data.statisticDataCreateDtos = formatDate;
      }
    } else {
      const endArray = array.filter((item) => item.value != "");
      const create = endArray.filter((item) => !item.id);
      const received = endArray
        .filter((item) => item.id)
        .map((item) => ({
          _id: item.id,
          value: item.value,
          valueDate: item.valueDate,
          isCorrelation: item.isCorrelation,
        }));

      if (create.length > 0) {
        const formatDate = create.map((item) => {
          return {
            ...item,
            valueDate: new Date(item.valueDate),
            isCorrelation: item.isCorrelation,
          };
        });
        Data.statisticDataCreateDtos = formatDate;
      }
      if (received.length > 0) {
        Data.statisticDataUpdateDtos = received;
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
        setOpenModal(false);
        setActiveIndex(null);
      })
      .catch((error) => {
        setManualErrorReset(false);
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  useEffect(() => {
    updateStatisticsData();
  }, [count]);

  const updateStatisticsData = () => {
    setReceivedPoints([]);
    setArrayPoints([]);
    setShowPoints([]);

    if (statisticDatas.length > 0 && typeGraphic === "Ежедневный") {
      const dayNow = new Date();
      const currentWeekday = dayNow.getDay(); // Текущий день недели (0 - Воскресенье, 1 - Понедельник и т.д.)

      // Определяем начальную дату - ближайший предыдущий день `day`, не более 7 дней назад
      const startDate = new Date(dayNow);
      let dayDifference;

      if (currentWeekday >= day) {
        dayDifference = currentWeekday - day;
      } else {
        dayDifference = 7 - (day - currentWeekday);
      }

      startDate.setDate(dayNow.getDate() - dayDifference - 1);

      // Ограничиваем начальную дату максимум 7 днями назад от текущего дня
      const maxStartDate = new Date(dayNow);
      maxStartDate.setDate(dayNow.getDate() - 7);

      if (startDate < maxStartDate) {
        startDate.setTime(maxStartDate.getTime());
      }

      // Создаем массив всех дат за последние 7 дней
      const last7Days = [];
      for (let i = count; i < 7 + count; i++) {
        const date = new Date(dayNow);
        date.setDate(dayNow.getDate() - i);
        last7Days.push(date.toISOString().split("T")[0]);
      }

      // Группируем данные по дате и фильтруем
      const dataMap = statisticDatas.reduce((acc, item) => {
        const itemDate = item.valueDate.split("T")[0];
        acc[itemDate] = {
          ...item,
          valueDate: itemDate,
        };
        return acc;
      }, {});

      // Создаем массив данных для последних 7 дней, добавляем нулевые значения, если данные отсутствуют
      const updatedPoints = last7Days.map((date) => {
        if (dataMap[date] && dataMap[date].isCorrelation !== true) {
          return dataMap[date];
        } else {
          return {
            valueDate: date,
            value: 0, // Заполняем нулевым значением, если данных за день нет
            isCorrelation: false,
          };
        }
      });

      setOldReceivedPoints(updatedPoints);
      setReceivedPoints(updatedPoints);
    }

    if (statisticDatas.length > 0 && typeGraphic === "Ежемесячный") {
      // Группируем данные по месяцам и суммируем `valueDate` за каждый месяц
      const monthlyData = statisticDatas.reduce((acc, item) => {
        const itemDate = new Date(item.valueDate);
        const monthKey = `${itemDate.getFullYear()}-${itemDate.getMonth() + 1}`; // Год-месяц как ключ
        if (
          !isNaN(itemDate) &&
          new Date(new Date().setMonth(new Date().getMonth() - 14 + count)) <
            itemDate
        ) {
          if (item?.isCorrelation === true) {
            acc[monthKey] = {
              id: item.id,
              valueSum: item.value,
              year: itemDate.getFullYear(),
              month: itemDate.getMonth() + 1,
              isCorrelation: true,
            };
          }

          // Если месяца ещё нет в acc, создаем начальный объект с valueSum = 0
          if (!acc[monthKey] || !acc[monthKey]?.isCorrelation) {
            if (!acc[monthKey]) {
              acc[monthKey] = {
                valueSum: 0,
                year: itemDate.getFullYear(),
                month: itemDate.getMonth() + 1,
                isCorrelation: false,
              };
            }
            acc[monthKey].valueSum += item.value;
          }
        }
        return acc;
      }, {});

      // Формируем новый массив, включающий `valueDate` и `date` (последний день месяца)
      const updatedMonthlyPoints = [];

      // Для каждого месяца от 14 месяцев назад до текущего добавляем данные
      for (let i = count; i < 13 + count; i++) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - i);
        const monthKey = `${monthDate.getFullYear()}-${
          monthDate.getMonth() + 1
        }`;

        // Если данных нет для этого месяца, создаем запись с суммой 0
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            valueSum: 0,
            year: monthDate.getFullYear(),
            month: monthDate.getMonth() + 1,
            isCorrelation: false,
          };
        }

        const lastDayOfMonth = new Date(
          monthDate.getFullYear(),
          monthDate.getMonth() + 1,
          0
        ); // Получаем последний день месяца
        const year = lastDayOfMonth.getFullYear();
        const monthValue = lastDayOfMonth.getMonth() + 1; // Месяцы начинаются с 0
        const date = lastDayOfMonth.getDate(); // Дата

        updatedMonthlyPoints.push({
          id: monthlyData[monthKey]?.id || null, // Если id не найден, присваиваем null
          valueDate: `${year}-${monthValue}-${date}`, // Форматирование в 'год-месяц-день'
          value: monthlyData[monthKey].valueSum, // Сумма за месяц
          isCorrelation: monthlyData[monthKey].isCorrelation,
        });
      }

      // Сортируем данные по дате, от последнего месяца к первому
      updatedMonthlyPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );

      setReceivedPoints(updatedMonthlyPoints);
    }

    if (statisticDatas.length > 0 && typeGraphic === "Ежегодовой") {
      // Группируем данные по годам и суммируем `valueDate` за каждый год
      const yearData = statisticDatas.reduce((acc, item) => {
        const itemDate = new Date(item.valueDate);
        const yearKey = `${itemDate.getFullYear()}`;
        // Проверяем, что дата корректна и меньше чем на 13 лет от текущего года
        if (
          !isNaN(itemDate) &&
          new Date().getFullYear() - 12 < itemDate.getFullYear()
        ) {
          if (item?.isCorrelation === true) {
            acc[yearKey] = {
              id: item.id,
              valueSum: item.value,
              year: itemDate.getFullYear(),
              isCorrelation: true,
            };
          }

          // Если года еще нет в acc, создаем начальный объект с valueSum = 0
          if (!acc[yearKey] || !acc[yearKey]?.isCorrelation) {
            if (!acc[yearKey]) {
              acc[yearKey] = {
                valueSum: 0,
                year: itemDate.getFullYear(),
                isCorrelation: false,
              };
            }
            acc[yearKey].valueSum += item.value;
          }
        }
        return acc;
      }, {});

      // Формируем новый массив, включающий `valueDate` и `date` (первый день года)
      const updatedYearPoints = [];

      // Для каждого года от 13 лет назад до текущего добавляем данные
      for (let i = count; i < 12 + count; i++) {
        const yearDate = new Date();
        yearDate.setFullYear(yearDate.getFullYear() - i);
        const yearKey = `${yearDate.getFullYear()}`;

        // Если данных нет для этого года, создаем запись с суммой 0
        if (!yearData[yearKey]) {
          yearData[yearKey] = {
            valueSum: 0,
            year: yearDate.getFullYear(),
            isCorrelation: false,
          };
        }

        updatedYearPoints.push({
          id: yearData[yearKey]?.id || null, // Если id не найден, присваиваем null
          valueDate: `${yearDate.getFullYear()}-01-01`, // Форматирование в 'год-01-01'
          value: yearData[yearKey].valueSum, // Сумма за год
          isCorrelation: yearData[yearKey].isCorrelation,
        });
      }

      // Сортируем данные по дате, от последнего года к первому
      updatedYearPoints.sort(
        (a, b) => new Date(b.valueDate) - new Date(a.valueDate)
      );

      setReceivedPoints(updatedYearPoints);
    }

    if (statisticDatas.length > 0 && typeGraphic === "13") {
      const today = new Date();
      today.setDate(today.getDate() - count * 7);
      const end = new Date(today);

      const start = new Date(end);
      start.setDate(end.getDate() - 14 * 7);

      const selectedDayOfWeek = parseInt(day);
      const result = [];

      let currentDate = new Date(start);
      let currentSum = 0;

      // Перемещаем currentDate на первый выбранный день недели
      while (currentDate.getDay() !== selectedDayOfWeek - 1) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Цикл по неделям
      while (currentDate <= end) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 7);

        // Фильтруем и суммируем значения для текущей недели
        currentSum = statisticDatas
          .filter((item) => {
            const itemDate = new Date(item.valueDate);
            if (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true
            ) {
              setArrayPoints((prevState) => [...prevState, item]);
            }
            return (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true
            );
          })
          .reduce((sum, item) => sum + item.value, 0);

        // Создаем новую дату на день позже
        const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

        // Проверяем, что valueDate не позже сегодняшней даты
        if (valueDate <= today) {
          setArrayPoints((prevState) =>
            prevState.map((item) => {
              if (item.myID) {
                return { ...item };
              } else {
                return {
                  ...item,
                  myID: valueDate.toISOString().split("T")[0],
                };
              }
            })
          );

          result.push({
            value: currentSum,
            valueDate: valueDate.toISOString().split("T")[0],
          });
        }

        currentDate = nextDate; // Переходим к следующей неделе
      }

      setReceivedPoints(
        result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
      );
    }
    if (statisticDatas.length > 0 && typeGraphic === "26") {
      const today = new Date();
      today.setDate(today.getDate() - count * 7);
      const end = new Date(today);

      const start = new Date(end);
      start.setDate(end.getDate() - 27 * 7);

      const selectedDayOfWeek = parseInt(day);
      const result = [];

      let currentDate = new Date(start);
      let currentSum = 0;

      // Перемещаем currentDate на первый выбранный день недели
      while (currentDate.getDay() !== selectedDayOfWeek - 1) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Цикл по неделям
      while (currentDate <= end) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 7);

        // Фильтруем и суммируем значения для текущей недели
        currentSum = statisticDatas
          .filter((item) => {
            const itemDate = new Date(item.valueDate);
            if (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true
            ) {
              setArrayPoints((prevState) => [...prevState, item]);
            }
            return (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true
            );
          })
          .reduce((sum, item) => sum + item.value, 0);

        // Создаем новую дату на день позже
        const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

        // Проверяем, что valueDate не позже сегодняшней даты
        if (valueDate <= today) {
          setArrayPoints((prevState) =>
            prevState.map((item) => {
              if (item.myID) {
                return { ...item };
              } else {
                return {
                  ...item,
                  myID: valueDate.toISOString().split("T")[0],
                };
              }
            })
          );

          result.push({
            value: currentSum,
            valueDate: valueDate.toISOString().split("T")[0],
          });
        }

        currentDate = nextDate; // Переходим к следующей неделе
      }

      setReceivedPoints(
        result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
      );
    }
    if (statisticDatas.length > 0 && typeGraphic === "52") {
      const today = new Date();
      today.setDate(today.getDate() - count * 7);
      const end = new Date(today);

      const start = new Date(end);
      start.setDate(end.getDate() - 53 * 7);

      const selectedDayOfWeek = parseInt(day);
      const result = [];

      let currentDate = new Date(start);
      let currentSum = 0;

      // Перемещаем currentDate на первый выбранный день недели
      while (currentDate.getDay() !== selectedDayOfWeek - 1) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Цикл по неделям
      while (currentDate <= end) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 7);

        // Фильтруем и суммируем значения для текущей недели
        currentSum = statisticDatas
          .filter((item) => {
            const itemDate = new Date(item.valueDate);
            if (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true
            ) {
              setArrayPoints((prevState) => [...prevState, item]);
            }
            return (
              currentDate <= itemDate &&
              itemDate < nextDate &&
              item.isCorrelation !== true
            );
          })
          .reduce((sum, item) => sum + item.value, 0);

        // Создаем новую дату на день позже
        const valueDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

        // Проверяем, что valueDate не позже сегодняшней даты
        if (valueDate <= today) {
          setArrayPoints((prevState) =>
            prevState.map((item) => {
              if (item.myID) {
                return { ...item };
              } else {
                return {
                  ...item,
                  myID: valueDate.toISOString().split("T")[0],
                };
              }
            })
          );

          result.push({
            value: currentSum,
            valueDate: valueDate.toISOString().split("T")[0],
          });
        }

        currentDate = nextDate; // Переходим к следующей неделе
      }

      setReceivedPoints(
        result.sort((a, b) => new Date(b.valueDate) - new Date(a.valueDate))
      );
    }
  };

  // Все для модального окна при смене отчетного дня
  const dayWeek = (day, type) => {
    if (type === "reportDay") {
      switch (day) {
        case 0:
          setShowReportDay("Воскресенье");
          break;
        case 1:
          setShowReportDay("Понедельник");
          break;
        case 2:
          setShowReportDay("Вторник");
          break;
        case 3:
          setShowReportDay("Среда");
          break;
        case 4:
          setShowReportDay("Четверг");
          break;
        case 5:
          setShowReportDay("Пятница");
          break;
        case 6:
          setShowReportDay("Суббота");
          break;
      }
    } else {
      switch (day) {
        case 0:
          setShowReportDayComes("Воскресенье");
          break;
        case 1:
          setShowReportDayComes("Понедельник");
          break;
        case 2:
          setShowReportDayComes("Вторник");
          break;
        case 3:
          setShowReportDayComes("Среда");
          break;
        case 4:
          setShowReportDayComes("Четверг");
          break;
        case 5:
          setShowReportDayComes("Пятница");
          break;
        case 6:
          setShowReportDayComes("Суббота");
          break;
      }
    }
  };

  const save = () => {
    if (reportDay !== reportDayComes) {
      setOpenModalReportDay(true);
      dayWeek(reportDay, "reportDay");
      dayWeek(reportDayComes, "");
    } else {
      saveUpdateStatistics();
    }
  };

  const btnYes = async () => {
    try {
      await saveUpdateOrganization(); // Сначала выполняем обновление организации

      // Добавляем задержку в 1 секунду
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await saveUpdateStatistics(); // Затем обновляем статистику через секунду
    } catch (error) {
      console.error("Ошибка при выполнении операций:", error);
    }
  };

  const btnNo = () => {
    saveUpdateStatistics();
    setReportDay(reportDayComes);
  };

  const saveUpdateOrganization = async () => {
    await updateOrganization({
      userId,
      organizationId,
      _id: organizationId,
      reportDay: reportDay,
    })
      .unwrap()
      .then(() => {
        setOpenModalReportDay(false);

        setManualSuccessResetOrganization(false);
        setManualErrorResetOrganization(false);
      })
      .catch((error) => {
        setManualErrorResetOrganization(false);
        setManualSuccessResetOrganization(false);
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
          <div className={classes.one}>
            <div className={classes.statisticsArrowLeft}>
              <img
                src={statisticsArrowLeftWhite}
                alt="statisticsArrowLeftWhite"
                onClick={handleArrowLeftClick}
              />
            </div>

            <div className={classes.statisticsArrowLeft}>
              <img
                src={statisticsArrowRightWhite}
                alt="statisticsArrowRightWhite"
                onClick={handleArrowRightClick}
              />
            </div>
          </div>
          <div className={classes.five}>
            <div className={classes.item}>
              <div className={classes.itemName}>
                <span>Организация</span>
              </div>
              <div className={classes.div}>
                <select
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  className={classes.select}
                >
                  <option value="" disabled>
                    Выберите
                  </option>
                  {organizations?.map((item) => (
                    <option value={item.id}>{item.organizationName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={classes.item}>
              <div className={classes.itemName}>
                <span>Отчетный день</span>
              </div>
              <div className={classes.div}>
                <select
                  value={reportDay}
                  onChange={(e) => {
                    setReportDay(Number(e.target.value));
                  }}
                  className={classes.select}
                  disabled={disabledReportDayAndSelectStatistics}
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
                </select>
              </div>
            </div>

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
                // onClick={() => saveUpdateStatistics()}
                onClick={() => save()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.main}>
        {isErrorStatistic && isErrorNewStatistic && isErrorOrganizations ? (
          <>
            <HandlerQeury
              Error={
                isErrorStatistic || isErrorNewStatistic || isErrorOrganizations
              }
            ></HandlerQeury>
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

                <HandlerQeury
                  Loading={isLoadingOrganizations}
                  Fetching={isFetchingOrganizations}
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
                          {statisticId !== "" ? (
                            <Graphic
                              data={[...receivedPoints, ...createPoints]}
                              name={
                                name !== "null" ? name : currentStatistic?.name
                              }
                              setName={setName}
                              typeGraphic={typeGraphic}
                              type={type}
                            ></Graphic>
                          ) : (
                            <></>
                          )}
                        </div>

                        <div className={classes.block2}>
                          <div className={classes.addPoint} onClick={addPoint}>
                            <img
                              src={statisticsArrowLeft}
                              alt="statisticsArrowLeft"
                            />
                          </div>

                          {statisticId !== "" ? (
                            <div className={classes.points}>
                              {createPoints
                                ?.sort(
                                  (a, b) =>
                                    Date.parse(b.valueDate) -
                                    Date.parse(a.valueDate)
                                )
                                ?.map((item, index) => {
                                  if (item.valueDate === "") {
                                    item.valueDate = new Date()
                                      .toISOString()
                                      .split("T")[0];
                                  }
                                  return (
                                    <div key={index} className={classes.item}>
                                      <input
                                        type="date"
                                        value={item.valueDate}
                                        onChange={(e) => {
                                          onChangePoints(
                                            "",
                                            e.target.value,
                                            "valueDate",
                                            null,
                                            item.id
                                          );
                                        }}
                                        className={classes.date}
                                      />
                                      <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) => {
                                          const newValue =
                                            e.target.value.replace(
                                              /[^0-9]/g,
                                              ""
                                            );
                                          onChangePoints(
                                            "",
                                            newValue,
                                            "value",
                                            null,
                                            item.id
                                          );
                                        }}
                                        className={classes.number}
                                      />
                                    </div>
                                  );
                                })}

                              {receivedPoints?.map((item, index) => {
                                if (typeGraphic === "Ежедневный") {
                                  return (
                                    <div key={index} className={classes.item}>
                                      <input
                                        type="date"
                                        value={item.valueDate}
                                        onChange={(e) => {
                                          onChangePoints(
                                            "received",
                                            e.target.value,
                                            "valueDate",
                                            index,
                                            null
                                          );
                                        }}
                                        className={`${classes.date}`}
                                        disabled={disabledPoints}
                                      />

                                      <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) => {
                                          const newValue =
                                            e.target.value.replace(
                                              /[^0-9]/g,
                                              ""
                                            );
                                          onChangePoints(
                                            "received",
                                            newValue,
                                            "value",
                                            index,
                                            null
                                          );
                                        }}
                                        className={classes.number}
                                        disabled={disabledPoints}
                                      />
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div
                                      key={index}
                                      className={`${classes.item}  ${
                                        classes.itemHover
                                      }  ${
                                        activeIndex === index
                                          ? classes.active
                                          : ""
                                      }`}
                                      onClick={() => {
                                        setActiveIndex(index);
                                        showCurrentPoint(item.valueDate);
                                      }}
                                    >
                                      <span
                                        disabled={disabledPoints}
                                        className={`${classes.date} ${classes.textGrey}`}
                                      >
                                        {new Date(
                                          item.valueDate
                                        ).toLocaleDateString("ru-RU", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "2-digit",
                                        })}
                                      </span>

                                      <span
                                        className={`${classes.number} ${classes.textGrey}`}
                                        disabled={disabledPoints}
                                      >
                                        {item.value}
                                      </span>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          ) : (
                            <></>
                          )}

                          <div
                            className={classes.deletePoint}
                            onClick={deletePoint}
                          >
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
                                if (e.target.value !== "") {
                                  setStatisticId(e.target.value);
                                  setManualSuccessReset(true);
                                  setManualErrorReset(true);
                                }
                              }}
                              className={classes.element}
                            >
                              <option value="" disabled>
                                Выберите статистику
                              </option>
                              {statisticsToOrganization?.map((item) => {
                                return (
                                  <option value={item.id}>{item.name}</option>
                                );
                              })}
                            </select>

                            {statisticId !== "" ? (
                              <>
                                <select
                                  value={
                                    type !== "null"
                                      ? type
                                      : currentStatistic.type
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
                                  }
                                  onChange={(e) => {
                                    setPostId(e.target.value);
                                  }}
                                  className={classes.element}
                                >
                                  <option value="null" disabled>
                                    Выберите пост
                                  </option>
                                  {postsToOrganization?.map((item) => {
                                    return (
                                      <option value={item.id}>
                                        {item.postName}
                                      </option>
                                    );
                                  })}
                                </select>

                                <select
                                  value={typeGraphic}
                                  onChange={(e) =>
                                    setTypeGraphic(e.target.value)
                                  }
                                  className={classes.element}
                                >
                                  <option value="" disabled>
                                    Выберите тип отображения графика
                                  </option>
                                  <option value="Ежедневный">
                                    {" "}
                                    Ежедневный (за один день)
                                  </option>
                                  <option value="Ежемесячный">
                                    Ежемесячный (сумма за календарный месяц)
                                  </option>
                                  <option value="Ежегодовой">
                                    Ежегодовой (сумма за календарный год)
                                  </option>
                                  <option value="13">13 недель</option>
                                  <option value="26">26 недель</option>
                                  <option value="52">52 недели</option>
                                </select>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>

                          {statisticId !== "" ? (
                            <div className={classes.row2}>
                              <textarea
                                placeholder="Описание статистики: что и как считать"
                                value={
                                  description || currentStatistic.description
                                }
                                onChange={(e) => setDescription(e.target.value)}
                              ></textarea>
                            </div>
                          ) : (
                            <></>
                          )}
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

                        <HandlerMutation
                          Loading={isLoadingUpdateOrganizationMutation}
                          Error={
                            isErrorUpdateOrganizationMutation &&
                            !manualErrorResetOrganization
                          }
                          Success={
                            isSuccessUpdateOrganizationMutation &&
                            !manualSuccessResetOrganization
                          }
                          textSuccess={"Организация обновлена"}
                          textError={
                            ErrorOrganization?.data?.errors?.[0]?.errors?.[0]
                              ? ErrorOrganization.data.errors[0].errors[0]
                              : ErrorOrganization?.data?.message
                          }
                        ></HandlerMutation>

                        {openModal && (
                          <>
                            <div className={classes.modal}>
                              <table className={classes.modalTable}>
                                <div className={classes.tableHeader}>
                                  {typeGraphic === "Ежемесячный" ||
                                  typeGraphic === "Ежегодовой" ? (
                                    <>
                                      <span>Коррекционное число</span>
                                    </>
                                  ) : (
                                    <div className=""></div>
                                  )}

                                  <div className={classes.iconSaveModal}>
                                    <img
                                      src={Blacksavetmp}
                                      alt="Blacksavetmp"
                                      className={classes.image}
                                      onClick={() => {
                                        saveModalPoints(showPoints);
                                      }}
                                    />
                                  </div>
                                </div>

                                <img
                                  src={exit}
                                  alt="exit"
                                  onClick={exitModal}
                                  className={classes.exitImage}
                                />

                                <thead>
                                  <tr>
                                    <th>Дата</th>
                                    <th>Значение</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      {showPoints?.map((item) => (
                                        <div
                                          key={item.id}
                                          className={classes.row}
                                        >
                                          <span
                                            className={`${classes.date} ${classes.textGrey}`}
                                          >
                                            {new Date(
                                              item.valueDate
                                            ).toLocaleDateString("ru-RU", {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "2-digit",
                                            })}
                                          </span>
                                        </div>
                                      ))}
                                    </td>

                                    <td>
                                      {showPoints?.map((item, index) => (
                                        <div
                                          key={item.id}
                                          className={classes.row}
                                        >
                                          <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="—"
                                            value={item.value || ""}
                                            onChange={(e) => {
                                              const newValue =
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  ""
                                                );
                                              updateModalPoint(newValue, index);
                                            }}
                                          />
                                        </div>
                                      ))}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {openModaReportDay ? (
                          <>
                            <div className={classes.modalDelete}>
                              <div className={classes.modalDeleteElement}>
                                <img
                                  src={exit}
                                  alt="exit"
                                  className={classes.exitImage}
                                  onClick={() => setOpenModalReportDay(false)}
                                />
                                <div className={classes.modalRow1}>
                                  <span className={classes.text}>
                                    Вы поменяли отчетный день с <span> </span>
                                    <span style={{ fontWeight: "700" }}>
                                      {showReportDayComes}
                                    </span>
                                    <span> на </span>
                                    <span style={{ fontWeight: "700" }}>
                                      {showReportDay}
                                    </span>
                                    . Если нажмете на{" "}
                                    <span
                                      style={{
                                        color: "red",
                                        fontWeight: "700",
                                      }}
                                    >
                                      Да
                                    </span>
                                    , то отчетный день поменяется у всей
                                    организации.
                                  </span>
                                </div>

                                <div className={classes.modalRow2}>
                                  <button
                                    className={`${classes.btnYes} ${classes.text}`}
                                    onClick={btnYes}
                                  >
                                    Да
                                  </button>
                                  <button
                                    className={`${classes.btnNo} ${classes.text}`}
                                    onClick={btnNo}
                                  >
                                    Нет
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        <WaveLetters
                          letters={"Выберите статистику"}
                        ></WaveLetters>
                        <div className={classes.block1}></div>
                        <div className={classes.block2}></div>
                        <div className={classes.block3}>
                          <div className={classes.row1}>
                            <select
                              value={statisticId}
                              onChange={(e) => {
                                if (e.target.value !== "") {
                                  setStatisticId(e.target.value);
                                  setManualSuccessReset(true);
                                  setManualErrorReset(true);
                                }
                              }}
                              className={classes.element}
                              disabled={disabledReportDayAndSelectStatistics}
                            >
                              <option value="" disabled>
                                Выберите статистику
                              </option>
                              {statisticsToOrganization?.map((item) => {
                                return (
                                  <option value={item.id}>{item.name}</option>
                                );
                              })}
                            </select>

                            <select
                              disabled
                              value={
                                type !== "null" ? type : currentStatistic.type
                              }
                              onChange={(e) => {
                                setType(e.target.value);
                              }}
                              className={classes.element}
                            >
                              <option value="null" disabled>
                                Выберите тип
                              </option>
                            </select>

                            <select
                              disabled
                              value={
                                postId !== "null"
                                  ? postId
                                  : currentStatistic?.post?.id
                              }
                              onChange={(e) => {
                                setPostId(e.target.value);
                              }}
                              className={classes.element}
                            >
                              <option value="null" disabled>
                                Выберите пост
                              </option>
                            </select>

                            <select
                              value={typeGraphic}
                              onChange={(e) => setTypeGraphic(e.target.value)}
                              className={classes.element}
                            >
                              <option value="" disabled>
                                Выберите тип отображения графика
                              </option>
                              <option value="Ежедневный">
                                {" "}
                                Ежедневный (за один день)
                              </option>
                              <option value="Ежемесячный">
                                Ежемесячный (сумма за календарный месяц)
                              </option>
                              <option value="Ежегодовой">
                                Ежегодовой (сумма за календарный год)
                              </option>
                              <option value="13">13 недель</option>
                              <option value="26">26 недель</option>
                              <option value="52">52 недели</option>
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
