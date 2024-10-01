import React, { useState, useEffect, useRef } from "react";
import classes from "./PolicyContent.module.css";
import icon from "../../image/iconHeader.svg";
import Select from "../../image/Select.svg";
import iconBack from "../../image/iconBack.svg";
import subbarSearch from "../../image/subbarSearch.svg";
import iconSavetmp from "../../image/iconSavetmp.svg";
import email from "../../image/email.svg";
import iconGroup from "../../image/iconGroup.svg";
import greySavetmp from "../../image/greySavetmp.svg";
import iconAdd from "../../image/iconAdd.svg";
import folder from "../../image/folder.svg";
import iconSublist from "../../image/iconSublist.svg";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  useGetPoliciesQuery,
  useGetPoliciesIdQuery,
  useUpdatePoliciesMutation,
} from "../../../BLL/policyApi";
import MyEditor from "../../Custom/MyEditor";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import CustomSelect from "../../Custom/CustomSelect.jsx";
import HandlerMutation from "../../Custom/HandlerMutation.jsx";
import HandlerQeury from "../../Custom/HandlerQeury.jsx";

export default function PolicyContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const back = () => {
    navigate("/start");
  };
  const pathNewPolicy = () => {
    navigate(`${location.pathname}/newPolicy`);
  };
  const { userId } = useParams();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlContent, setHtmlContent] = useState();
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [policyName, setPolicyName] = useState(null);
  const [type, setType] = useState(null);
  const [state, setState] = useState(null);
  const [policyToOrganizations, setPolicyToOrganizations] = useState([]);
  const selectRef = useRef(null); // Для отслеживания кликов вне компонента
  // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
  const [manualSuccessReset, setManualSuccessReset] = useState(false);
  const [manualErrorReset, setManualErrorReset] = useState(false);

  const {
    instructions = [],
    directives = [],
    isLoadingGetPolicies,
    isErrorGetPolicies,
    isFetchingGetPolicies,
  } = useGetPoliciesQuery(userId, {
    selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
      isLoadingGetPolicies: isLoading,
      isErrorGetPolicies: isError,
      isFetchingGetPolicies: isFetching,
      instructions: data?.instructions || [],
      directives: data?.directives || [],
    }),
  });

  const {
    currentPolicy = {},
    organizations = [],
    isLoadingGetPoliciesId,
    isFetchingGetPoliciesId,
    isErrorGetPoliciesId,
  } = useGetPoliciesIdQuery(
    { userId, policyId: selectedPolicyId },
    {
      selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
        currentPolicy: data?.currentPolicy || {},
        organizations: data?.organizations || [],
        isLoadingGetPoliciesId: isLoading,
        isErrorGetPoliciesId: isError,
        isFetchingGetPoliciesId: isFetching,
      }),
      skip: !selectedPolicyId,
    }
  );

  const [
    updatePolicy,
    {
      isLoading: isLoadingUpdatePoliciesMutation,
      isSuccess: isSuccessUpdatePoliciesMutation,
      isError: isErrorUpdatePoliciesMutation,
    },
  ] = useUpdatePoliciesMutation();

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
    const rawContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setHtmlContent(rawContent);
    console.log(rawContent);
  }, [editorState]);

  useEffect(() => {
    if (currentPolicy.content) {
      const { contentBlocks, entityMap } = convertFromHTML(
        currentPolicy.content
      );
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const oldEditorState = EditorState.createWithContent(contentState);
      setEditorState(oldEditorState);
    }
  }, [currentPolicy.content]); // This effect runs only when currentPolicy.content changes

  const saveUpdatePolicy = async () => {
    await updatePolicy({
      userId,
      policyId: selectedPolicyId,
      id: userId,
      policyName: policyName,
      state: state,
      type: type,
      content: htmlContent,
      policyToOrganizations: policyToOrganizations,
    })
      .unwrap()
      .then(() => {
        // После успешного обновления сбрасываем флаги
        setManualSuccessReset(false);
        setManualErrorReset(false);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const getPolicyId = (id) => {
    setSelectedPolicyId(id);
    setManualSuccessReset(true);
    setManualErrorReset(true);
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
            <select
              name="type"
              value={type || currentPolicy.type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Директива">Директива</option>
              <option value="Инструкция">Инструкция</option>
            </select>
          </div>
          <div className={classes.five}>
            <select
              name="state"
              value={state || currentPolicy.state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="Черновик">Черновик</option>
              <option value="Активный">Активный</option>
            </select>
          </div>
          <div className={classes.five}>
            <CustomSelect
              organizations={organizations}
              selectOrganizations={currentPolicy.policyToOrganizations}
              setPolicyToOrganizations={setPolicyToOrganizations}
            ></CustomSelect>
          </div>

          <div className={classes.sixth} ref={selectRef}>
            <img
              src={subbarSearch}
              alt="subbarSearch"
              onClick={() => setIsOpenSearch(true)}
            />
            {isOpenSearch && (
              <ul className={classes.policySearch}>
                <li className={classes.policySearchItem}>
                  <div className={classes.listUL}>
                    <img src={folder} alt="folder" />
                    <div className={classes.listText}>Директивы</div>
                    <img
                      src={iconSublist}
                      alt="iconSublist"
                      style={{ marginLeft: "50px" }}
                    />
                  </div>
                  <ul className={classes.listULElement}>
                    {directives?.map((item) => (
                      <li key={item.id} onClick={() => getPolicyId(item.id)}>
                        {item.policyName}
                      </li>
                    ))}
                  </ul>
                </li>

                <li className={classes.policySearchItem}>
                  <div className={classes.listUL}>
                    <img src={folder} alt="folder" />
                    <div className={classes.listText}>Инструкции</div>
                    <img
                      src={iconSublist}
                      alt="iconSublist"
                      style={{ marginLeft: "45px" }}
                    />
                  </div>
                  <ul className={classes.listULElement}>
                    {instructions?.map((item) => (
                      <li key={item.id} onClick={() => getPolicyId(item.id)}>
                        {item.policyName}
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            )}
            <div>
              <input
                type="text"
                value={
                  policyName
                    ? policyName
                    : currentPolicy.policyName || "Название политики"
                }
                onChange={(e) => setPolicyName(e.target.value)}
                title="Название политики"
              ></input>
            </div>
          </div>

          <div className={classes.imageButton}>
            <div className={classes.blockIconAdd}>
              <img
                src={iconAdd}
                alt="iconAdd"
                className={classes.iconAdd}
                onClick={() => pathNewPolicy()}
              />
            </div>
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
                onClick={() => saveUpdatePolicy()}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={classes.main}>
        {isErrorGetPolicies ? (
          <>
            <HandlerQeury Error={isErrorGetPolicies}></HandlerQeury>
          </>
        ) : (
          <>
            {isErrorGetPoliciesId ? (
              <HandlerQeury Error={isErrorGetPoliciesId}></HandlerQeury>
            ) : (
              <>
                <HandlerQeury
                  Loading={isLoadingGetPolicies}
                  Fetching={isFetchingGetPolicies}
                ></HandlerQeury>

                {isFetchingGetPoliciesId || isLoadingGetPoliciesId ? (
                  <HandlerQeury
                    Loading={isLoadingGetPoliciesId}
                    Fetching={isFetchingGetPoliciesId}
                  ></HandlerQeury>
                ) : (
                  <>
                    {currentPolicy.content ? (
                      <>
                        <MyEditor
                          key={currentPolicy.id}
                          editorState={editorState}
                          setEditorState={setEditorState}
                        />
                        <HandlerMutation
                          Loading={isLoadingUpdatePoliciesMutation}
                          Error={
                            isErrorUpdatePoliciesMutation && !manualErrorReset
                          }
                          Success={
                            isSuccessUpdatePoliciesMutation &&
                            !manualSuccessReset
                          }
                          textSuccess={"Политика обновлена"}
                        ></HandlerMutation>
                      </>
                    ) : (
                      <> Выберите политику </>
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
