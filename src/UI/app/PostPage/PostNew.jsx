import React, { useState, useEffect } from "react";
import classes from "./PostNew.module.css";
import icon from "../../image/iconHeader.svg";
import iconBack from "../../image/iconBack.svg";
import greyPolicy from "../../image/greyPolicy.svg";
import blackStatistic from "../../image/blackStatistic.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPostNewQuery, usePostPostsMutation } from "../../../BLL/postApi";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import exitModal from "../../image/exitModal.svg";
import { useDispatch } from "react-redux";
import { setPostCreatedId } from "../../../BLL/postSlice.js";
import ModalWindow from "../../Custom/ModalWindow.jsx";

export default function PostNew() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/posts`);
  };
  const dispatch = useDispatch();
  const [postName, setPostName] = useState();
  const [divisionName, setDivisionName] = useState();
  const [divisionNameDB, setDivisionNameDB] = useState();
  const [product, setProduct] = useState();
  const [purpose, setPurpose] = useState();
  const [policy, setPolicy] = useState("null");
  const [policyName, setPolicyName] = useState(null);
  const [worker, setWorker] = useState("null");
  const [parentId, setParentId] = useState("null");
  const [organization, setOrganization] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [openModalStatistic, setOpenModalStatistic] = useState(false);
  const [filterArraySearchModalPolicy, setFilterArraySearchModalPolicy] =
    useState([]);
  const [inputSearchModalDirectory, setInputSearchModalDirectory] =
    useState("");

  const {
    workers = [],
    policies = [],
    posts = [],
    organizations = [],
    maxDivisionNumber,
    isLoadingGetNew,
    isErrorGetNew,
  } = useGetPostNewQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      workers: data?.workers || [],
      policies: data?.policies || [],
      posts: data?.posts || [],
      organizations: data?.organizations || [],
      maxDivisionNumber: data?.maxDivisionNumber,
      isLoadingGetNew: isLoading,
      isErrorGetNew: isError,
    }),
  });

  const [
    postPosts,
    {
      isLoading: isLoadingPostMutation,
      isSuccess: isSuccessPostMutation,
      isError: isErrorPostMutation,
      error: Error,
    },
  ] = usePostPostsMutation();

  const reset = () => {
    setPostName("");
    setDivisionName(null);
    setProduct("");
    setPurpose("");
    setPolicy("null");
    setWorker("null");
    setParentId("null");
    setOrganization("");
  };

  const successCreatePost = (id) => {
    dispatch(setPostCreatedId(id));
    navigate(`/${userId}/posts`);
  };

  const savePosts = async () => {
    const Data = {};
    if (policy !== "null") {
      Data.addPolicyId = policy;
    }
    if (divisionName !== divisionNameDB) {
      Data.divisionName = divisionName;
    }
    if (parentId !== "null") {
      Data.parentId = parentId;
    }
    if (worker !== "null") {
      Data.responsibleUserId = worker;
    }
    await postPosts({
      userId: userId,
      ...Data,
      postName: postName,
      product: product,
      purpose: purpose,
      organizationId: organization,
    })
      .unwrap()
      .then((result) => {
        reset();
        setTimeout(() => {
          successCreatePost(result?.id);
        }, 2000);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const intsallPolicy = () => {
    setOpenModal(true);
  };

  const exit = () => {
    setOpenModal(false);
  };

  const handleRadioChangePolicy = (id, element) => {
    setPolicy((prevPolicy) => {
      const newPolicy = prevPolicy === id ? "null" : id;
      setPolicyName(newPolicy === "null" ? null : element.policyName);
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

  useEffect(() => {
    setDivisionName(`Подразделение №${maxDivisionNumber + 1}`);
    setDivisionNameDB(`Подразделение №${maxDivisionNumber + 1}`);
  }, [maxDivisionNumber]);

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
                {" "}
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
            </div>
          </div>

          <div className={classes.item}>
            <div className={classes.itemName}>
              <span> Название подразделения</span>
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
                value={parentId}
                onChange={(e) => {
                  setParentId(e.target.value);
                }}
              >
                <option value="null"> — </option>
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
                <option value="null"> — </option>
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

          <div className={classes.iconSave}>
            <img
              src={Blacksavetmp}
              alt="Blacksavetmp"
              className={classes.image}
              onClick={() => savePosts()}
            />
          </div>
        </div>
      </div>

      <div className={classes.main}>
        {isErrorGetNew ? (
          <HandlerQeury Error={isErrorGetNew}></HandlerQeury>
        ) : (
          <>
            {isLoadingGetNew ? (
              <HandlerQeury Loading={isLoadingGetNew}></HandlerQeury>
            ) : (
              <>
                <div className={classes.productTeaxtaera}>
                  <textarea
                    className={classes.Teaxtaera}
                    placeholder="описание продукта поста"
                    value={product}
                    onChange={(e) => {
                      setProduct(e.target.value);
                    }}
                  />
                </div>

                <div className={classes.destinyTeaxtaera}>
                  <textarea
                    className={classes.Teaxtaera}
                    placeholder="описнаие предназначения поста"
                    value={purpose}
                    onChange={(e) => {
                      setPurpose(e.target.value);
                    }}
                  />
                </div>

                <div className={classes.post} onClick={() => intsallPolicy()}>
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
                  onClick={() => setOpenModalStatistic(true)}
                >
                  <img src={blackStatistic} alt="blackStatistic" />
                  <div>
                    <span className={classes.nameButton}>
                      Выбрать или создать статистику для поста
                    </span>
                  </div>
                </div>
                {openModalStatistic && (
                  <ModalWindow
                    text={"Выбрать или создать статистику для поста, можно после создания поста."}
                    close={setOpenModalStatistic}
                    exitBtn = {true}
                  ></ModalWindow>
                )}

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
                              <div className={classes.iconSave}>
                                <img
                                  src={Blacksavetmp}
                                  alt="Blacksavetmp"
                                  className={classes.image}
                                  style={{ marginLeft: "0.5%" }}
                                  onClick={() => {
                                    // saveFolder();
                                  }}
                                />
                              </div>
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
                                  {filterArraySearchModalPolicy?.map((item) => (
                                    <div
                                      key={item.id}
                                      className={classes.row}
                                      onClick={() =>
                                        handleRadioChangePolicy(item.id, item)
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
                          ) : (
                            <tbody>
                              <tr>
                                <td>
                                  {policies?.map((item) => (
                                    <div
                                      key={item.id}
                                      className={classes.row}
                                      onClick={() =>
                                        handleRadioChangePolicy(item.id, item)
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

                <HandlerMutation
                  Loading={isLoadingPostMutation}
                  Error={isErrorPostMutation}
                  Success={isSuccessPostMutation}
                  textSuccess={"Пост успешно создан."}
                  textError={
                    Error?.data?.errors?.[0]?.errors?.[0]
                      ? Error.data.errors[0].errors[0]
                      : Error?.data?.message
                  }
                ></HandlerMutation>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
