import React, { useState, useEffect } from "react";
import classes from "./NewPolicy.module.css";
import icon from "../../image/iconHeader.svg";
import Select from "../../image/Select.svg";
import iconBack from "../../image/iconBack.svg";
import subbarSearch from "../../image/subbarSearch.svg";
import iconSavetmp from "../../image/iconSavetmp.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import email from "../../image/email.svg";
import iconGroup from "../../image/iconGroup.svg";
import greySavetmp from "../../image/greySavetmp.svg";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  usePostPoliciesMutation,
  useGetPoliciesNewQuery,
} from "../../../BLL/policyApi";
import MyEditor from "../../Custom/MyEditor";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import styles from "../../Custom/CommonStyles.module.css";
import { useDispatch } from "react-redux";
import { setPolicyCreatedId } from "../../../BLL/policySlice.js";
import Mdxeditor from "../../Custom/Mdxeditor/Mdxeditor.jsx";

export default function NewPolicy() {
  const navigate = useNavigate();
  const back = () => {
    navigate(`/${userId}/policy`);
  };

  const { userId } = useParams();
  const [editorState, setEditorState] = useState("");
  // const [htmlContent, setHtmlContent] = useState();
  const [policyName, setPolicyName] = useState("Политика");
  const [type, setType] = useState("Директива");
  const [state, setState] = useState("Черновик");
  const [organizationId, setOrganizationId] = useState("");

  const dispatch = useDispatch();
  
  const {
    organizations = [],
    isLoadingNewPolicies,
    isErrorNewPolicies,
  } = useGetPoliciesNewQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      organizations: data?.organizations || [], // Если нет данных или organizations, вернем пустой массив
      isLoadingNewPolicies: isLoading,
      isErrorNewPolicies: isError,
    }),
  });

  const [
    postPolicy,
    {
      isLoading: isLoadingPostPoliciesMutation,
      isSuccess: isSuccessPostPoliciesMutation,
      isError: isErrorPostPoliciesMutation,
      error: Error,
    },
  ] = usePostPoliciesMutation();

  const successCreatePolicy = (id) => {
    dispatch(setPolicyCreatedId(id));
    navigate(`/${userId}/policy`);
  };

  const reset = () => {
    setPolicyName("Политика");
    setType("Директива");
    setState("Черновик");
    setOrganizationId("");
  };

  const savePolicy = async () => {
    const Data = {};

    if (state !== "null") {
      Data.state = state;
    }
    if (type !== "null") {
      Data.type = type;
    }

    await postPolicy({
      userId,
      policyName: policyName,
      // content: htmlContent,
      content: editorState,
      ...Data,
      organizationId: organizationId,
    })
      .unwrap()
      .then((result) => {
        successCreatePolicy(result?.id);
        reset();
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
          {/* <input
            type="search"
            placeholder="Поиск"
            className={classes.search}
            // value={searchTerm}
            // onChange={handleSearchChange}
          /> */}
        </div>

        <div className={classes.editText}>
          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>
                Название политики <span style={{ color: "red" }}>*</span>
              </span>
            </div>
            <div className={classes.div}>
              <input
                type="text"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                title="Название политики"
                className={classes.select}
              ></input>
            </div>
          </div>

          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>Тип</span>
            </div>
            <div className={classes.div}>
              <select
                className={classes.select}
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {/* <option value="null"> — </option> */}
                <option value="Директива">Директива</option>
                <option value="Инструкция">Инструкция</option>
              </select>
            </div>
          </div>

          <div className={classes.item}>
            <div className={classes.itemName}>
              <span>
                Состояние<span style={{ color: "red" }}>*</span>
              </span>
            </div>
            <div className={classes.div}>
              <select
                className={classes.select}
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                {/* <option value="null"> — </option> */}
                <option value="Черновик">Черновик</option>
                <option value="Активный">Активный</option>
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
                value={organizationId}
                onChange={(e) => {
                  setOrganizationId(e.target.value);
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


          <div className={classes.imageButton}>
            {/* <div className={classes.blockSelect}>
              <img src={Select} alt="Select" className={classes.select} />
              <ul className={classes.option}>
                <li>
                  <img src={email} alt="email" /> Отправить сотруднику для
                  прочтения
                </li>
                <li>
                  <img src={iconGroup} alt="iconGroup" /> В должностную
                  инструкцию постам
                </li>
                <li>
                  <img src={greySavetmp} alt="greySavetmp" /> Сохранить и издать{" "}
                </li>
              </ul>
            </div> */}
            <div className={classes.blockIconSavetmp}>
              <img
                src={Blacksavetmp}
                alt="Blacksavetmp"
                className={classes.iconSavetmp}
                style={{ marginLeft: "0.5%" }}
                onClick={() => savePolicy()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.main}>
        {isErrorNewPolicies ? (
          <HandlerQeury Error={isErrorNewPolicies}></HandlerQeury>
        ) : (
          <>
            {isLoadingNewPolicies ? (
              <HandlerQeury Loading={isLoadingNewPolicies}></HandlerQeury>
            ) : (
              <>
              <Mdxeditor
               editorState={editorState}
               setEditorState={setEditorState}
              ></Mdxeditor>

                <HandlerMutation
                  Loading={isLoadingPostPoliciesMutation}
                  Error={isErrorPostPoliciesMutation}
                  Success={isSuccessPostPoliciesMutation}
                  textSuccess={"Политика успешно создана."}
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
