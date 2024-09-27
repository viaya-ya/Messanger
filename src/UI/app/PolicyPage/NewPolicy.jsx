import React, { useState, useEffect } from "react";
import classes from "./NewPolicy.module.css";
import icon from "../../image/iconHeader.svg";
import add from "../../image/add.svg";
import L from "../../image/L.svg";
import E from "../../image/E.svg";
import R from "../../image/R.svg";
import J from "../../image/J.svg";
import numeration from "../../image/numeration.svg";
import bulet from "../../image/bulet.svg";
import Bold from "../../image/Bold.svg";
import Italic from "../../image/Italic.svg";
import Underline from "../../image/Underline.svg";
import Crosed from "../../image/Crosed.svg";
import Select from "../../image/Select.svg";
import iconBack from "../../image/iconBack.svg";
import mountain from "../../image/mountain.svg";
import oval from "../../image/oval.svg";
import subbarSearch from "../../image/subbarSearch.svg";
import iconSavetmp from "../../image/iconSavetmp.svg";
import email from "../../image/email.svg";
import iconGroup from "../../image/iconGroup.svg";
import greySavetmp from "../../image/greySavetmp.svg";
import error from "../../image/error.svg";
import iconAdd from "../../image/iconAdd.svg";
import success from "../../image/success.svg";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  usePostPoliciesMutation,
  useGetPoliciesNewQuery,
} from "../../../BLL/policyApi";
import MyEditor from "../../Custom/MyEditor";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import CustomSelect from "../../Custom/CustomSelect.jsx";

export default function NewPolicy() {
  const navigate = useNavigate();
  const back = () => {
    navigate(`/${userId}/policy`);
  };

  const { userId } = useParams();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlContent, setHtmlContent] = useState();
  const [policyName, setPolicyName] = useState("Политика");
  const [type, setType] = useState("Директива");
  const [state, setState] = useState("Черновик");
  const [policyToOrganizations, setPolicyToOrganizations] = useState([]);
  const [isPolicyToOrganizations, setIsPolicyToOrganizations] = useState(false);
  const [showSuccessMutation, setShowSuccessMutation] = useState(false);
  const [showErrorMutation, setShowErrorMutation] = useState(false);

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
    },
  ] = usePostPoliciesMutation();

  useEffect(() => {
    const rawContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setHtmlContent(rawContent);
    console.log(rawContent);
  }, [editorState]);

  // Используем useEffect для отслеживания успешного завершения запроса
  useEffect(() => {
    if (isSuccessPostPoliciesMutation) {
      setShowSuccessMutation(true);

      // Убираем сообщение через 1 секунду
      const timer = setTimeout(() => {
        setShowSuccessMutation(false);
      }, 1500);

      // Чистим таймер при размонтировании компонента или повторном запуске
      return () => clearTimeout(timer);
    }
  }, [isSuccessPostPoliciesMutation]);

  // Используем useEffect для отслеживания успешного завершения запроса
  useEffect(() => {
    if (isErrorPostPoliciesMutation) {
      setShowErrorMutation(true);

      // Убираем сообщение через 1 секунду
      const timer = setTimeout(() => {
        setShowErrorMutation(false);
      }, 1500);

      // Чистим таймер при размонтировании компонента или повторном запуске
      return () => clearTimeout(timer);
    }
  }, [isErrorPostPoliciesMutation]);
  
const reset = () => {
  setPolicyName("Политика");
  setType("Директива");
  setState("Черновик");
  setIsPolicyToOrganizations(true);
  setEditorState(EditorState.createEmpty());
}
  const savePolicy = async () => {
    await postPolicy({
      userId,
      policyName: policyName,
      state: state,
      type: type,
      content: htmlContent,
      policyToOrganizations: policyToOrganizations,
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
          {/* <input
            type="search"
            placeholder="Поиск"
            className={classes.search}
            // value={searchTerm}
            // onChange={handleSearchChange}
          /> */}
        </div>

        <div className={classes.editText}>
          <div className={classes.five}>
            <select name="type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Директива">Директива</option>
              <option value="Инструкция">Инструкция</option>
            </select>
          </div>
          <div className={classes.five}>
            <select name="state" value={state} onChange={(e) => setState(e.target.value)}>
              <option value="Черновик">Черновик</option>
              <option value="Активный">Активный</option>
            </select>
          </div>
          <div className={classes.five}>
            <CustomSelect
              organizations={organizations}
              setPolicyToOrganizations={setPolicyToOrganizations}
              isPolicyToOrganizations={isPolicyToOrganizations}
            ></CustomSelect>
          </div>
          <div className={classes.sixth}>
            <img src={subbarSearch} alt="subbarSearch" />
            <div>
              <input
                type="text"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                title="Название политики"
              ></input>
            </div>
          </div>

          <div className={classes.imageButton}>
            <div className={classes.blockSelect}>
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
            </div>
            <div className={classes.blockIconSavetmp}>
              <img
                src={iconSavetmp}
                alt="iconSavetmp"
                className={classes.iconSavetmp}
                style={{ marginLeft: "0.5%" }}
                onClick={() => savePolicy()}
              />
            </div>
          </div>
        </div>
      </div>

      {isErrorNewPolicies ? (
        <div className={classes.error}>
          <img src={error} alt="Error" className={classes.errorImage} />
          <span className={classes.spanError}>Ошибка</span>
        </div>
      ) : (
        <>
          {isLoadingNewPolicies ? (
            <div className={classes.load}>
              <img src={icon} alt="Loading..." className={classes.loadImage} />
              <div>
                <span className={classes.spanLoad}>Идет загрузка...</span>
              </div>
            </div>
          ) : (
            <div className={classes.main}>
              <MyEditor
                editorState={editorState}
                setEditorState={setEditorState}
              />
            </div>
          )}
        </>
      )}

      {isLoadingPostPoliciesMutation && (
        <div className={classes.load}>
          <img src={icon} alt="Loading..." className={classes.loadImage} />
          <div>
            <span className={classes.spanLoad}>Идет загрузка...</span>
          </div>
        </div>
      )}

      {showSuccessMutation && (
        <div className={classes.success}>
        <img src={success} alt="success" className={classes.successImage} />
        <span className={classes.spanSuccess}>
         Политика успешно создана.
        </span>
      </div>
      )}

      {showErrorMutation && (
        <div className={classes.error}>
          <img src={error} alt="Error" className={classes.errorImage} />
          <span className={classes.spanError}>
            Произошла ошибка при создании политики.
          </span>
        </div>
      )}
    </div>
  );
}
