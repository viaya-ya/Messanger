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

export default function PostNew() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate(`/${userId}/posts`);
  };
  const [postName, setPostName] = useState();
  const [divisionName, setDivisionName] = useState();
  const [disabledDivisionName, setDisabledDivisionName] = useState(false);
  const [product, setProduct] = useState();
  const [purpose, setPurpose] = useState();
  const [policy, setPolicy] = useState();
  const [worker, setWorker] = useState("");
  const [parentId, setParentId] = useState("null");
  const [organization, setOrganization] = useState();

  useEffect(() => {
    if (parentId !== "null") {
      setDisabledDivisionName(true);
    } else {
      setDisabledDivisionName(false);
      setDivisionName("");
    }
  }, [parentId]);

  const {
    workers = [],
    policies = [],
    postsWithoutParentId = [],
    organizations = [],
    isLoadingGetNew,
    isErrorGetNew,
  } = useGetPostNewQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      workers: data?.workers || [],
      policies: data?.policies || [],
      postsWithoutParentId: data?.postsWithoutParentId || [],
      organizations: data?.organizations || [],
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
    },
  ] = usePostPostsMutation();

  const reset = () => {
    setPostName("");
    setDivisionName("");
    setProduct("");
    setPurpose("");
    setPolicy("");
    setWorker("");
    setParentId("null");
    setOrganization("");
  };
  const savePosts = async () => {
    console.log(`worker ${worker}`);
    await postPosts({
      userId: userId,
      addPolicyId: policy,
      postName: postName,
      divisionName: divisionName,
      parentId: parentId === "null" ? null : parentId,
      product: product,
      purpose: purpose,
      responsibleUserId: worker,
      organizationId: organization,
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
              />
              {/* <select name="mySelect" className={classes.select}>
                <option value="">Выберите опцию</option>
                <option value="option1">Опция 1</option>
                <option value="option2">Опция 2</option>
              </select> */}
            </div>
          </div>

          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>
                {" "}
                Название подразделения <span style={{ color: "red" }}>*</span>
              </span>
            </div>
            <div className={classes.div}>
              <input
                type="text"
                value={divisionName}
                onChange={(e) => {
                  setDivisionName(e.target.value);
                }}
                disabled={disabledDivisionName}
              />
              {/* <select name="mySelect" className={classes.select}>
                <option value="">Выберите опцию</option>
                <option value="option1">Опция 1</option>
                <option value="option2">Опция 2</option>
              </select> */}
            </div>
          </div>

          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>Руководствующий пост</span>
            </div>
            <div className={classes.div}>
              <select
                name="mySelect"
                className={classes.select}
                value={parentId}
                onChange={(e) => {
                  setParentId(e.target.value);
                  const obj = postsWithoutParentId.find(
                    (item) => item.id === e.target.value
                  );
                  setDivisionName(obj?.divisionName);
                }}
              >
                <option value="" disabled>
                  Выберите опцию
                </option>
                <option value="null"> — </option>
                {postsWithoutParentId?.map((item) => {
                  return <option value={item.id}>{item.postName}</option>;
                })}
              </select>
            </div>
          </div>

          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>
                Руководитель поста <span style={{ color: "red" }}>*</span>
              </span>
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
                <option value="" disabled>
                  Выберите опцию
                </option>
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
              <span>Прикрепить политику</span>
            </div>
            <div className={classes.div}>
              <select
                name="mySelect"
                className={classes.select}
                value={policy}
                onChange={(e) => {
                  setPolicy(e.target.value);
                }}
              >
                <option value="null"> — </option>
                {policies?.map((item) => {
                  return <option value={item.id}>{item.policyName}</option>;
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
                <option value="">Выберите опцию</option>
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
                <div className={classes.post}>
                  <img src={blackStatistic} alt="blackStatistic" />
                  <div>
                    <span className={classes.nameButton}>
                      Выбрать или создать статистику для поста
                    </span>
                  </div>
                </div>
                <HandlerMutation
                  Loading={isLoadingPostMutation}
                  Error={isErrorPostMutation}isErrorPostMutation
                  Success={isSuccessPostMutation}
                  textSuccess={"Пост успешно создан."}
                ></HandlerMutation>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

{
  /* <div className={classes.post}>
          <img src={greyPolicy} alt="greyPolicy" />
          <div>
            <span className={classes.nameButton}>
              Прикрепить политику с описанием образцового положения дел поста
            </span>
          </div>
        </div> */
}
