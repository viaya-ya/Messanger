import React, { useState, useEffect, useRef } from "react";
import classes from "./PostContent.module.css";
import icon from "../../image/iconHeader.svg";
import iconBack from "../../image/iconBack.svg";
import greyPolicy from "../../image/greyPolicy.svg";
import blackStatistic from "../../image/blackStatistic.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import iconAdd from "../../image/iconAdd.svg";
import subbarSearch from "../../image/subbarSearch.svg";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPostIdQuery,
  useGetPostsQuery,
  useUpdatePostsMutation,
} from "../../../BLL/postApi";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import WaveLetters from "../../Custom/WaveLetters.jsx";
import exitModal from "../../image/exitModal.svg";
import { useSelector } from "react-redux";
import {
  useGetStatisticsQuery,
  useUpdateStatisticsToPostIdMutation,
} from "../../../BLL/statisticsApi.js";
export default function PostContent() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/start`);
  };
  const newPost = () => {
    navigate("new");
  };
  const createdId = useSelector((state) => state.post.postCreatedId);
  const [postName, setPostName] = useState(null);
  const [divisionName, setDivisionName] = useState(null);
  const [product, setProduct] = useState(null);
  const [isProductChanges, setIsProductChanges] = useState(false);
  const [purpose, setPurpose] = useState(null);
  const [isPurposeChanges, setIsPurposeChanges] = useState(false);
  const [worker, setWorker] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const selectRef = useRef(null); // Для отслеживания кликов вне компонента

  const [openModal, setOpenModal] = useState(false);
  const [filterArraySearchModalPolicy, setFilterArraySearchModalPolicy] =
    useState([]);
  const [inputSearchModalDirectory, setInputSearchModalDirectory] =
    useState("");
  const [policy, setPolicy] = useState(null);
  const [policyName, setPolicyName] = useState(null);
  const [parentPostId, setParentPostId] = useState(null);
  const [openModalStatistic, setOpenModalStatistic] = useState(false);
  const [
    filterArraySearchModalStatistics,
    setFilterArraySearchModalStatistics,
  ] = useState([]);
  const [inputSearchModalStatistics, setInputSearchModalStatistics] =
    useState("");

  const [statisticsChecked, setStatisticsChecked] = useState([]);
  const [disabledStatisticsChecked, setDisabledStatisticsChecked] = useState(
    []
  );

  const {
    data = [],
    isLoadingGetPosts,
    isErrorGetPosts,
  } = useGetPostsQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      data: data || [],
      isLoadingGetPosts: isLoading,
      isErrorGetPosts: isError,
    }),
  });

  const {
    currentPost = {},
    workers = [],
    organizations = [],
    policies = [],
    policyDB = null,
    posts = [],
    parentPost = {},
    statisticsIncludedPost = [],
    isLoadingGetPostId,
    isErrorGetPostId,
    isFetchingGetPostId,
    refetchPostId,
  } = useGetPostIdQuery(
    { userId, postId: selectedPostId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching, refetch }) => ({
        currentPost: data?.currentPost || {},
        workers: data?.workers || [],
        organizations: data?.organizations || [],
        policies: data?.policies || [],
        posts: data?.posts || [],
        parentPost: data?.parentPost || {},
        policyDB: data?.policyDB || null,
        statisticsIncludedPost: data?.statisticsIncludedPost || [],
        isLoadingGetPostId: isLoading,
        isErrorGetPostId: isError,
        isFetchingGetPostId: isFetching,
        refetchPostId: refetch,
      }),
      skip: !selectedPostId,
    }
  );

  const [
    updatePost,
    {
      isLoading: isLoadingUpdatePostMutation,
      isSuccess: isSuccessUpdatePostMutation,
      isError: isErrorUpdatePostMutation,
      error: ErrorUpdatePostMutation,
    },
  ] = useUpdatePostsMutation();

  const [
    updateStatisticsToPostId,
    {
      isLoading: isLoadingStatisticsToPostIdMutation,
      isSuccess: isSuccessUpdateStatisticsToPostIdMutation,
      isError: isErrorUpdateStatisticsToPostIdMutation,
      error: ErrorUpdateStatisticsToPostIdMutation,
    },
  ] = useUpdateStatisticsToPostIdMutation();

  const {
    statistics = [],
    isLoadingStatistic,
    isFetchingStatistic,
    isErrorStatistic,
  } = useGetStatisticsQuery(
    { userId, statisticData: false },
    {
      selectFromResult: ({
        data,
        isLoading,
        isError,
        isFetching,
      }) => ({
        statistics: data || [],
        isLoadingStatistic: isLoading,
        isFetchingStatistic: isFetching,
        isErrorStatistic: isError,
      }),
      skip: !openModalStatistic,
    }
  );

  useEffect(() => {
    if (createdId) {
      setSelectedPostId(createdId);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpenSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (policyDB !== null) {
      setPolicy(policyDB);
      const element = policies.find((item) => item.id === policyDB);
      setPolicyName(element?.policyName);
    }
  }, [policyDB, isLoadingGetPostId]);

  useEffect(() => {
    if (currentPost.postName) {
      setPostName(currentPost.postName);
    }

    if (currentPost.divisionName) {
      setDivisionName(currentPost.divisionName);
    }

    if (currentPost?.user?.id) {
      setWorker(currentPost?.user?.id);
    } else {
      setWorker("");
    }

    if (parentPost?.id) {
      setParentPostId(parentPost?.id);
    } else {
      setParentPostId("");
    }

    if (currentPost?.organization?.id) {
      setOrganization(currentPost?.organization?.id);
    } else {
      setOrganization("");
    }
    if (statisticsIncludedPost) {
      const ids = statisticsIncludedPost.map((item) => item.id);
      setStatisticsChecked(ids);
      setDisabledStatisticsChecked(ids);
    } else {
      setStatisticsChecked([]);
    }
  }, [currentPost.id, isLoadingGetPostId, isFetchingGetPostId]);

  const reset = () => {
    setPostName(null);
    setDivisionName(null);
    setProduct(null);
    setPurpose(null);
    setWorker(null);
    setOrganization(null);
    setIsProductChanges(false);
    setIsPurposeChanges(false);
  };

  const saveUpdatePost = async () => {
    // Создаем объект с измененными полями
    const updatedData = {};

    // Проверки на изменения и отсутствие null
    if (postName !== currentPost.postName && postName !== null) {
      updatedData.postName = postName;
    }
    if (divisionName !== currentPost.divisionName && divisionName !== null) {
      updatedData.divisionName = divisionName;
    }
    if (
      isProductChanges ||
      (product !== currentPost.product && product !== null)
    ) {
      updatedData.product = product;
    }
    if (
      isPurposeChanges ||
      (purpose !== currentPost.purpose && purpose !== null)
    ) {
      updatedData.purpose = purpose;
    }
    if (parentPostId !== parentPost?.id && parentPostId !== null) {
      updatedData.parentId = parentPostId === "" ? null : parentPostId;
    }

    if (worker !== currentPost?.user?.id && worker !== null) {
      updatedData.responsibleUserId = worker === "" ? null : worker;
    }
    if (
      organization !== currentPost?.organization?.id &&
      organization !== null
    ) {
      updatedData.organizationId = organization;
    }
    if (policy !== policyDB) {
      updatedData.policyId = policy === null ? null : policy;
    }
    console.log(JSON.stringify(updatedData));
    // Проверяем, если есть данные для обновления
    if (Object.keys(updatedData).length > 0) {
      await updatePost({
        userId,
        postId: selectedPostId,
        _id: selectedPostId,
        ...updatedData, // отправляем только измененные поля
      })
        .unwrap()
        .then(() => {
          setManualSuccessReset(false);
          setManualErrorReset(false);
          // После успешного обновления сбрасываем состояние
          reset();
        })
        .catch((error) => {
          reset();
          setManualErrorReset(false);
          console.error("Ошибка:", JSON.stringify(error, null, 2));
        });
    } else {
      console.log("Нет изменений для обновления");
    }
  };

  const selectPost = (id) => {
    setManualSuccessReset(true);
    setManualErrorReset(true);
    setSelectedPostId(id);
    setIsOpenSearch(false);
  };

  // Политика
  const intsallPolicy = () => {
    setOpenModal(true);
  };

  const exit = () => {
    setOpenModal(false);
  };

  const handleRadioChangePolicy = (id, element) => {
    setPolicy((prevPolicy) => {
      const newPolicy = prevPolicy === id ? null : id;
      setPolicyName(newPolicy === null ? null : element.policyName);
      return newPolicy;
    });
  };

  const handleInputChangeModalSearch = (e) => {
    setInputSearchModalDirectory(e.target.value);
  };

  useEffect(() => {
    if (inputSearchModalDirectory !== "") {
      const filteredDirectives = policies.filter((item) =>
        item.policyName
          .toLowerCase()
          .includes(inputSearchModalDirectory.toLowerCase())
      );

      setFilterArraySearchModalPolicy(filteredDirectives);
    } else {
      setFilterArraySearchModalPolicy([]);
    }
  }, [inputSearchModalDirectory]);

  // Статистика
  const intsallStatistics = () => {
    setOpenModalStatistic(true);
  };

  const exitStatistic = () => {
    setOpenModalStatistic(false);
  };

  const handleChecboxChangeStatistics = (id) => {
    setStatisticsChecked((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const searchStatistics = (e) => {
    setInputSearchModalStatistics(e.target.value);
  };

  useEffect(() => {
    if (inputSearchModalStatistics !== "") {
      const filtered = statistics.filter((item) =>
        item.name
          .toLowerCase()
          .includes(inputSearchModalStatistics.toLowerCase())
      );
      setFilterArraySearchModalStatistics(filtered);
    } else {
      setFilterArraySearchModalStatistics([]);
    }
  }, [inputSearchModalStatistics]);

  const resetStatisticsId = () => {
    setInputSearchModalStatistics("");
    setStatisticsChecked([]);
    setDisabledStatisticsChecked([]);
    setFilterArraySearchModalStatistics([]);
  };

  const saveStatisticsId = async () => {
    const data = statisticsChecked.filter((item) => {
      return !disabledStatisticsChecked
        .map((disabled) => disabled)
        .includes(item);
    });
    if (data.length > 0) {
      await updateStatisticsToPostId({
        userId,
        postId: selectedPostId,
        ids: data,
      })
        .unwrap()
        .then(() => {
          resetStatisticsId();
          refetchPostId();
        })
        .catch((error) => {
          console.error("Ошибка:", JSON.stringify(error, null, 2));
        });
    }
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
          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>
                Название поста <span style={{ color: "red" }}>*</span>
              </span>
            </div>
            <div className={classes.div}>
              <input
                type="text"
                value={postName}
                onChange={(e) => {
                  setPostName(e.target.value);
                }}
                className={classes.select}
              />
              <div className={classes.sixth} ref={selectRef}>
                <img
                  src={subbarSearch}
                  alt="subbarSearch"
                  onClick={() => setIsOpenSearch(true)}
                />
                {isOpenSearch && (
                  <ul className={classes.policySearch}>
                    {data?.map((item) => {
                      return (
                        <li
                          className={classes.policySearchItem}
                          onClick={() => selectPost(item.id)}
                          key={item.id}
                        >
                          {item.postName}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {currentPost.id ? (
            <>
              <div className={classes.item}>
                <div className={classes.itemName}>
                  <span> Название подразделения </span>
                </div>
                <div className={classes.div}>
                  <input
                    type="text"
                    value={divisionName}
                    onChange={(e) => {
                      setDivisionName(e.target.value);
                    }}
                    className={classes.select}
                  />
                </div>
              </div>

              <div className={classes.item}>
                <div className={classes.itemName}>
                  <span>Руководитель</span>
                </div>
                <div className={classes.div}>
                  <select
                    name="mySelect"
                    className={classes.select}
                    value={parentPostId}
                    onChange={(e) => {
                      setParentPostId(e.target.value);
                    }}
                  >
                    <option value=""> — </option>
                    {posts?.map((item) => {
                      return <option value={item.id}>{item.postName}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className={classes.item}>
                <div className={classes.itemName}>
                  <span>Сотрудник</span>
                </div>
                <div className={classes.div}>
                  <select
                    name="mySelect"
                    className={classes.select}
                    value={worker}
                    onChange={(e) => {
                      setWorker(e.target.value);
                    }}
                  >
                    <option value="">—</option>
                    {workers?.map((item) => {
                      return (
                        <option value={item.id}>
                          {`${item.firstName} ${item.lastName}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className={classes.item}>
                <div className={classes.itemName}>
                  <span>
                    Организация <span style={{ color: "red" }}>*</span>
                  </span>
                </div>
                <div className={classes.div}>
                  <select
                    name="mySelect"
                    className={classes.select}
                    value={organization}
                    onChange={(e) => {
                      setOrganization(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Выберите организацию
                    </option>
                    {organizations?.map((item) => {
                      return (
                        <option value={item.id}>{item.organizationName}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          <div className={classes.actionButton}>
            <div className={classes.iconAdd}>
              <img
                src={iconAdd}
                alt="iconAdd"
                className={classes.image}
                onClick={() => newPost()}
              />
            </div>
            <div className={classes.iconSave}>
              <img
                src={Blacksavetmp}
                alt="Blacksavetmp"
                className={classes.image}
                onClick={() => saveUpdatePost()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.main}>
        {isErrorGetPosts ? (
          <>
            <HandlerQeury Error={isErrorGetPosts}></HandlerQeury>
          </>
        ) : (
          <>
            {isErrorGetPostId ? (
              <HandlerQeury Error={isErrorGetPostId}></HandlerQeury>
            ) : (
              <>
                <HandlerQeury Loading={isLoadingGetPosts}></HandlerQeury>

                {isLoadingGetPostId || isFetchingGetPostId ? (
                  <HandlerQeury
                    Loading={isLoadingGetPostId}
                    Fetching={isFetchingGetPostId}
                  ></HandlerQeury>
                ) : (
                  <>
                    {currentPost.id ? (
                      <>
                        <div className={classes.productTeaxtaera}>
                          <textarea
                            className={classes.Teaxtaera}
                            placeholder="описание продукта поста"
                            value={
                              isProductChanges
                                ? product
                                : product || currentPost.product
                            }
                            onChange={(e) => {
                              setProduct(e.target.value);
                              setIsProductChanges(true);
                            }}
                          />
                        </div>

                        <div className={classes.destinyTeaxtaera}>
                          <textarea
                            className={classes.Teaxtaera}
                            placeholder="описнаие предназначения поста"
                            value={
                              isPurposeChanges
                                ? purpose
                                : purpose || currentPost.purpose
                            }
                            onChange={(e) => {
                              setPurpose(e.target.value);
                              setIsPurposeChanges(true);
                            }}
                          />
                        </div>

                        <div
                          className={classes.post}
                          onClick={() => intsallPolicy()}
                        >
                          <img src={greyPolicy} alt="greyPolicy" />
                          <div>
                            {policyName ? (
                              <span className={classes.nameButton}>
                                Политика: {policyName}
                              </span>
                            ) : (
                              <span className={classes.nameButton}>
                                Прикрепить политику
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          className={classes.post}
                          onClick={() => intsallStatistics()}
                        >
                          <img src={blackStatistic} alt="blackStatistic" />
                          <div>
                            <span className={classes.nameButton}>
                              Выбрать или создать статистику для поста
                            </span>
                          </div>
                        </div>

                        {openModal ? (
                          <>
                            <div className={classes.modal}>
                              <div className={classes.modalWindow}>
                                <div className={classes.modalTableRow}>
                                  <div className={classes.itemTable}>
                                    <div className={classes.itemRow1}>
                                      <input
                                        type="search"
                                        placeholder="Найти"
                                        value={inputSearchModalDirectory}
                                        onChange={handleInputChangeModalSearch}
                                        className={classes.searchModal}
                                      />
                                    </div>

                                    <div className={classes.itemRow2}>
                                      {/* <div className={classes.iconSave}>
                                        <img
                                          src={Blacksavetmp}
                                          alt="Blacksavetmp"
                                          className={classes.image}
                                          style={{ marginLeft: "0.5%" }}
                                          onClick={() => {
                                            // saveFolder();
                                          }}
                                        />
                                      </div> */}
                                    </div>
                                  </div>
                                </div>

                                <table className={classes.modalTable}>
                                  <img
                                    src={exitModal}
                                    alt="exitModal"
                                    onClick={exit}
                                    className={classes.exitImage}
                                  />

                                  <thead>
                                    <tr>
                                      <th>Название политики</th>
                                    </tr>
                                  </thead>

                                  {filterArraySearchModalPolicy.length > 0 ? (
                                    <tbody>
                                      <tr>
                                        <td>
                                          {filterArraySearchModalPolicy?.map(
                                            (item) => (
                                              <div
                                                key={item.id}
                                                className={classes.row}
                                                onClick={() =>
                                                  handleRadioChangePolicy(
                                                    item.id,
                                                    item
                                                  )
                                                }
                                              >
                                                <input
                                                  type="radio"
                                                  checked={policy === item.id}
                                                />
                                                {item.policyName}
                                              </div>
                                            )
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  ) : (
                                    <tbody>
                                      <tr>
                                        <td>
                                          {policies?.map((item) => (
                                            <div
                                              key={item.id}
                                              className={classes.row}
                                              onClick={() =>
                                                handleRadioChangePolicy(
                                                  item.id,
                                                  item
                                                )
                                              }
                                            >
                                              <input
                                                type="radio"
                                                checked={policy === item.id}
                                              />
                                              {item.policyName}
                                            </div>
                                          ))}
                                        </td>
                                      </tr>
                                    </tbody>
                                  )}
                                </table>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}

                        {openModalStatistic ? (
                          <>
                            <div className={classes.modal}>
                              <div className={classes.modalWindow}>
                                <div className={classes.modalTableRow}>
                                  <div className={classes.itemTable}>
                                    <div className={classes.itemRow1}>
                                      <input
                                        type="search"
                                        placeholder="Найти"
                                        value={inputSearchModalStatistics}
                                        onChange={searchStatistics}
                                        className={classes.searchModal}
                                      />
                                    </div>

                                    <div className={classes.itemRow2}>
                                      <div className={classes.iconSave}>
                                        <img
                                          src={Blacksavetmp}
                                          alt="Blacksavetmp"
                                          className={classes.image}
                                          style={{ marginLeft: "0.5%" }}
                                          onClick={() => {
                                            saveStatisticsId();
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <table className={classes.modalTable}>
                                  <img
                                    src={exitModal}
                                    alt="exitStatistic"
                                    onClick={exitStatistic}
                                    className={classes.exitImage}
                                  />

                                  <thead>
                                    <tr>
                                      <th>Название статистики</th>
                                    </tr>
                                  </thead>

                                  {filterArraySearchModalStatistics.length >
                                  0 ? (
                                    <tbody>
                                      <tr>
                                        <td>
                                          {filterArraySearchModalStatistics?.map(
                                            (item) => (
                                              <div
                                                key={item.id}
                                                className={classes.row}
                                                onClick={() =>
                                                  handleChecboxChangeStatistics(
                                                    item.id,
                                                    item
                                                  )
                                                }
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={statisticsChecked.includes(
                                                    item.id
                                                  )}
                                                  disabled={disabledStatisticsChecked.includes(
                                                    item.id
                                                  )}
                                                />
                                                {item.name}
                                              </div>
                                            )
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  ) : (
                                    <tbody>
                                      <tr>
                                        <td>
                                          {statistics?.map((item) => (
                                            <div
                                              key={item.id}
                                              className={classes.row}
                                              onClick={() =>
                                                handleChecboxChangeStatistics(
                                                  item.id,
                                                  item
                                                )
                                              }
                                            >
                                              <input
                                                type="checkbox"
                                                checked={statisticsChecked.includes(
                                                  item.id
                                                )}
                                                disabled={disabledStatisticsChecked.includes(
                                                  item.id
                                                )}
                                              />
                                              {item.name}
                                            </div>
                                          ))}
                                        </td>
                                      </tr>
                                    </tbody>
                                  )}
                                </table>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}

                        <HandlerMutation
                          Loading={isLoadingUpdatePostMutation}
                          Error={isErrorUpdatePostMutation && !manualErrorReset} // Учитываем ручной сброс
                          Success={
                            isSuccessUpdatePostMutation && !manualSuccessReset
                          } // Учитываем ручной сброс
                          textSuccess={"Пост обновлен"}
                          textError={
                            ErrorUpdatePostMutation?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorUpdatePostMutation.data.errors[0].errors[0]
                              : ErrorUpdatePostMutation?.data?.message
                          }
                        ></HandlerMutation>
                      </>
                    ) : (
                      <>
                        <WaveLetters letters={"Выберите пост"}></WaveLetters>
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
