import React, { useState, useEffect } from "react";
import classes from "./StrategNew.module.css";
import icon from "../../image/iconHeader.svg";
import Select from "../../image/Select.svg";
import iconBack from "../../image/iconBack.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import iconAdd from "../../image/iconAdd.svg";
import email from "../../image/email.svg";
import iconGroup from "../../image/iconGroup.svg";
import greySavetmp from "../../image/greySavetmp.svg";
import CustomSelect from "../../Custom/CustomSelect.jsx";
import MyEditor from "../../Custom/MyEditor";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import { useNavigate, useParams } from "react-router-dom";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";
import {
  useGetStrategNewQuery,
  usePostStrategMutation,
} from "../../../BLL/strategApi.js";
import styles from '../../Custom/CommonStyles.module.css';

export default function StrategNew() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const back = () => {
    navigate(`/${userId}/strateg`);
  };

  // const [state, setState] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlContent, setHtmlContent] = useState();
  const [organizationId, setOrganizationId] = useState("");
  const [isStrategToOrganizations, setIsStrategToOrganizations] = useState(false);

    
  const {
    organizations = [],
    isLoadingNewStrateg,
    isErrorNewStrateg,
  } = useGetStrategNewQuery(userId, {
    selectFromResult: ({ data, isLoading, isError }) => ({
      organizations: data?.organizations || [],
      isLoadingNewStrateg: isLoading,
      isErrorNewStrateg: isError,
    }),
  });
  useEffect(() => {
    const rawContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setHtmlContent(rawContent);
    console.log(rawContent);
  }, [editorState]);
  const [
    postStarteg,
    {
      isLoading: isLoadingPostStrateg,
      isError: isErrorPostStrateg,
      isSuccess: isSuccessPostStrateg,
      error: ErrorPostStrateg
    },
  ] = usePostStrategMutation();

  const reset = () => {
    setOrganizationId("");
    setEditorState(EditorState.createEmpty());
  };
  const savePostStarteg = async () => {
    await postStarteg({
      userId,
      content: htmlContent,
      organizationId: organizationId,
    })
      .unwrap()
      .then(() => {
        reset();
      })
      .catch((error) => {
        // При ошибке также сбрасываем флаги
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
          <div className={classes.date}>
          <select
              value={organizationId}
              onChange={(e) => {
                setOrganizationId(e.target.value);
              }}
            >
              <option value=""> Выберите организацию</option>
              {organizations.map((item) => {
                return <option value={item.id}>{item.organizationName}</option>;
              })}
            </select>
          </div>

          <div className={classes.two}>
            <div className={classes.blockSelect}>
              <img src={Select} alt="Select" className={classes.select} />
              <ul className={classes.option}>
                <li>
                  {" "}
                  <img src={email} alt="email" /> Отправить сотруднику для
                  прочтения
                </li>
                <li>
                  {" "}
                  <img src={iconGroup} alt="iconGroup" /> В должностную
                  инструкцию постам
                </li>
                <li>
                  {" "}
                  <img src={greySavetmp} alt="greySavetmp" /> Сохранить и издать{" "}
                </li>
              </ul>
            </div>
          </div>

          <div className={classes.actionButton}>
            <div className={classes.iconSave}>
              <img
                src={Blacksavetmp}
                alt="Blacksavetmp"
                className={classes.image}
                onClick={() => savePostStarteg()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.main}>
      {isErrorNewStrateg ? (
          <HandlerQeury Error={isErrorNewStrateg}></HandlerQeury>
        ) : (
          <>
            {isLoadingNewStrateg ? (
              <HandlerQeury Loading={isLoadingNewStrateg}></HandlerQeury>
            ) : (
              <>
              <MyEditor editorState={editorState} setEditorState={setEditorState} />
                <HandlerMutation
                  Loading={isLoadingPostStrateg}
                  Error={isErrorPostStrateg}
                  Success={isSuccessPostStrateg}
                  textSuccess={"Пост успешно создан."}
                  textError={
                    ErrorPostStrateg?.data?.errors?.[0]?.errors?.[0] 
                      ? ErrorPostStrateg.data.errors[0].errors[0] 
                      : ErrorPostStrateg?.data?.message
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
