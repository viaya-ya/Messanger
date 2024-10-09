import React, { useState, useEffect } from "react";
import classes from "./PostContent.module.css";
import icon from "../../image/iconHeader.svg";
import iconBack from "../../image/iconBack.svg";
import greyPolicy from "../../image/greyPolicy.svg";
import blackStatistic from "../../image/blackStatistic.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import iconAdd from "../../image/iconAdd.svg";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPostIdQuery,
  useGetPostsQuery,
  useUpdatePostsMutation,
} from "../../../BLL/postApi";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";

export default function PostContent() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const back = () => {
    navigate("/start");
  };
  const newPost = () => {
    navigate("new");
  };
  const [postName, setPostName] = useState(null);
  const [postNameChanges, setPostNameChanges] = useState(false);
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
    policyGet = {},
    parentPost = {},
    isLoadingGetPostId,
    isErrorGetPostId,
    isFetchingGetPostId,
  } = useGetPostIdQuery(
    { userId, postId: selectedPostId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentPost: data?.currentPost || {},
        workers: data?.workers || [],
        organizations: data?.organizations || [],
        parentPost: data?.parentPost || {},
        policyGet: data?.policyGet || {},
        isLoadingGetPostId: isLoading,
        isErrorGetPostId: isError,
        isFetchingGetPostId: isFetching,
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
      error: ErrorUpdatePostMutation
    },
  ] = useUpdatePostsMutation();
  
const reset = () => {
  setPostName(null);
  setDivisionName(null);
  setProduct(null);
  setPurpose(null);
  setWorker(null);
  setOrganization(null);
  setIsProductChanges(false);
  setIsPurposeChanges(false);
  setPostNameChanges(false);
}
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
    if (isProductChanges || ( product !== currentPost.product && product !== null)) {
      updatedData.product = product;
    }
    if (isPurposeChanges || (purpose !== currentPost.purpose && purpose !== null)) {
      updatedData.purpose = purpose;
    }
    if (worker !== currentPost?.user?.id && worker !== null) {
      updatedData.responsibleUserId = worker;
    }
    if (
      organization !== currentPost?.organization?.id &&
      organization !== null
    ) {
      updatedData.organizationId = organization;
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
  console.log(ErrorUpdatePostMutation);
  console.log(ErrorUpdatePostMutation?.data?.errors[0]?.errors);
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
              <span>Пост</span>
            </div>
            <div className={classes.div}>
              <select
                className={classes.select}
                value={selectedPostId || ""}
                onChange={(e) => {
                  setManualSuccessReset(true);
                  setManualErrorReset(true);
                  setSelectedPostId(e.target.value);
                  console.log(e.target.value);
                }}
              >
                <option value="" disabled>
                  Выберите пост
                </option>
                {data?.map((item) => {
                  return <option value={item.id}>{item.postName}</option>;
                })}
              </select>
            </div>
          </div>

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
                value={ postNameChanges ? postName : (postName || currentPost.postName)}
                onChange={(e) => {
                  setPostName(e.target.value);
                  setPostNameChanges(true);
                }}
              />
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
                value={divisionName || currentPost.divisionName}
                onChange={(e) => {
                  setDivisionName(e.target.value);
                }}
                disabled={parentPost?.divisionName}
              />
            </div>
          </div>

          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>Руководствующий пост</span>
            </div>
            <div className={classes.div}>
              <input type="text" value={parentPost?.divisionName} disabled />
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
                value={worker || currentPost?.user?.id}
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
              <span>
                Организация <span style={{ color: "red" }}>*</span>
              </span>
            </div>
            <div className={classes.div}>
              <select
                name="mySelect"
                className={classes.select}
                value={organization || currentPost?.organization?.id}
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

          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>Прикрепить политику</span>
            </div>
            <div className={classes.div}>
              <input type="text" value={policyGet?.policyName} disabled />
            </div>
          </div>

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
                <HandlerQeury
                  Loading={isLoadingGetPosts}
                ></HandlerQeury>

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
                            value={ isProductChanges ? product : (product || currentPost.product)}
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
                            value={ isPurposeChanges ? purpose : (purpose  || currentPost.purpose)}
                            onChange={(e) => {
                              setPurpose(e.target.value);
                              setIsPurposeChanges(true);
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
                          Loading={isLoadingUpdatePostMutation}
                          Error={isErrorUpdatePostMutation && !manualErrorReset} // Учитываем ручной сброс
                          Success={
                            isSuccessUpdatePostMutation && !manualSuccessReset
                          } // Учитываем ручной сброс
                          textSuccess={"Пост обновлен"}
                          textError={ErrorUpdatePostMutation?.data?.errors[0]?.errors}
                        ></HandlerMutation>
                      </>
                    ) : (
                      <> Выберите пост </>
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
// const [policy, setPolicy] = useState();
// useEffect(() => {
//   if (policyGet.id) {
//     setPolicy(policyGet.id);
//   }
// }, [policyGet]);
// const {
//   workersNew = [],
//   policies = [],
//   postsWithoutParentId = [],
//   organizations = [],
//   isLoadingGetNew,
//   isErrorGetNew,
//   refetch
// } = useGetPostNewQuery(userId, {
//   selectFromResult: ({ data, isLoading, isError }) => ({
//     workersNew: data?.workers || [],
//     policies: data?.policies || [],
//     postsWithoutParentId: data?.postsWithoutParentId || [],
//     organizations: data?.organizations || [],
//     isLoadingGetNew: isLoading,
//     isErrorGetNew: isError,
//   }),
// });

// <div className={classes.item}>
//             <div className={classes.itemName}>
//               <span>Прикрепить политику</span>
//             </div>
//             <div className={classes.div}>
//               <select
//                 name="mySelect"
//                 className={classes.select}
//                 value={ policyGet.id || policy}
//                 onChange={(e) => {
//                   setPolicy(e.target.value);
//                 }}
//               >
//                 <option value="">Выберите опцию</option>
//                 {policies?.map((item) => {
//                   return <option value={item.id}>{item.policyName}</option>;
//                 })}
//               </select>
//             </div>
//           </div>
