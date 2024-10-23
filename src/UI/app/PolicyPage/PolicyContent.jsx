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
import deleteGrey from "../../image/deleteGrey.svg";
import { useNavigate, useParams } from "react-router-dom";
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
import addCircleBlue from "../../image/addCircleBlue.svg";
import exitModal from "../../image/exitModal.svg";
import {
  useDeletePolicyDirectoriesMutation,
  useGetPolicyDirectoriesQuery,
  usePostPolicyDirectoriesMutation,
  useUpdatePolicyDirectoriesMutation,
} from "../../../BLL/policyDirectoriesApi.js";
import Blacksavetmp from "../../image/Blacksavetmp.svg";

export default function PolicyContent() {
  const navigate = useNavigate();
  const back = () => {
    navigate("/start");
  };
  const pathNewPolicy = () => {
    navigate("new");
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
  // СОздание папок
  const [policyToPolicyDirectories, setPolicyToPolicyDirectories] = useState(
    []
  );
  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [directoryName, setDirectoryName] = useState();

  const [currentDirectoryName, setCurrentDirectoryName] = useState();
  const [currentDirectoryId, setCurrentDirectoryId] = useState();
  const [currentDirectoryInstructions, setCurrentDirectoryInstructions] =
    useState();
  const [currentDirectoryDirectives, setCurrentDirectoryDirectives] =
    useState();
  const [policyToPolicyDirectoriesUpdate, setPolicyToPolicyDirectoriesUpdate] =
    useState();

  const [manualSuccessResetDirectory, setManualSuccessResetDirectory] =
    useState(false);
  const [manualErrorResetDirectory, setManualErrorResetDirectory] =
    useState(false);

    const [manualDeleteSuccessResetDirectory, setManualDeleteSuccessResetDirectory] =
    useState(false);
  const [manualDeleteErrorResetDirectory, setManualDeleteErrorResetDirectory] =
    useState(false);

    const [openModalDelete, setOpenModalDelete] = useState(false);
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
      error: Error,
    },
  ] = useUpdatePoliciesMutation();


  const {
    folders = [],
    isLoadingGetPolicyDirectoriesMutation,
    isErrorGetPolicyDirectoriesMutation,
    isFetchingGetPolicyDirectoriesMutation,
  } = useGetPolicyDirectoriesQuery(userId, {
    selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
      isLoadingGetPolicyDirectoriesMutation: isLoading,
      isErrorGetPolicyDirectoriesMutation: isError,
      isFetchingGetPolicyDirectoriesMutation: isFetching,
      folders: data?.folders || [],
    }),
  });

  const [
    postPolicyDirectories,
    {
      isLoading: isLoadingPostPolicyDirectoriesMutation,
      isSuccess: isSuccessPostPolicyDirectoriesMutation,
      isError: isErrorPostPolicyDirectoriesMutation,
      error: ErrorPolicyDirectories,
    },
  ] = usePostPolicyDirectoriesMutation();

  const [
    updatePolicyDirectories,
    {
      isLoading: isLoadingUpdatePolicyDirectoriesMutation,
      isSuccess: isSuccessUpdatePolicyDirectoriesMutation,
      isError: isErrorUpdatePolicyDirectoriesMutation,
      error: ErrorUpdateDirectories,
    },
  ] = useUpdatePolicyDirectoriesMutation();

  const [
    deletePolicyDirectories,
    {
      isLoading: isLoadingDeletePolicyDirectoriesMutation,
      isSuccess: isSuccessDeletePolicyDirectoriesMutation,
      isError: isErrorDeletePolicyDirectoriesMutation,
      error: ErrorDeleteDirectories,
    },
  ] = useDeletePolicyDirectoriesMutation();

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

  const reset = () => {
    setType(null);
    setState(null);
  };
  const saveUpdatePolicy = async () => {
    const Data = {};

    if (policyName !== null && currentPolicy.policyName !== policyName) {
      Data.policyName = policyName;
    }
    if (state !== null && currentPolicy.state !== state) {
      Data.state = state;
    }
    if (type !== null && currentPolicy.type !== type) {
      Data.type = type;
    }
    if (htmlContent !== null && currentPolicy.content !== htmlContent) {
      Data.content = htmlContent;
    }
    await updatePolicy({
      userId,
      policyId: selectedPolicyId,
      _id: userId,
      ...Data,
      policyToOrganizations: policyToOrganizations,
    })
      .unwrap()
      .then(() => {
        // После успешного обновления сбрасываем флаги
        reset();
        setManualSuccessReset(false);
        setManualErrorReset(false);
      })
      .catch((error) => {
        setManualErrorReset(false);
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const getPolicyId = (id) => {
    setSelectedPolicyId(id);
    setManualSuccessReset(true);
    setManualErrorReset(true);
  };

  const open = () => {
    setOpenModal(true);
  };
  const exit = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (instructions.length > 0) {
      const update = instructions.map((item) => ({
        id: item.id,
        policyName: item.policyName,
        checked: false,
      }));
      setCurrentDirectoryInstructions(update);
    }
    if (directives.length > 0) {
      const update = directives.map((item) => ({
        id: item.id,
        policyName: item.policyName,
        checked: false,
      }));
      setCurrentDirectoryDirectives(update);
    }
  }, [isLoadingGetPolicies, isFetchingGetPolicies]);

  const openUpdate = (element) => {
    setManualSuccessResetDirectory(true);
    setManualErrorResetDirectory(true);
    const obj = folders?.filter((item) => item.id === element.id);
    if (obj?.length > 0) {
      const { id, directoryName, policyToPolicyDirectories } = obj[0];
      const policyIds = policyToPolicyDirectories.map(
        (element) => element.policy.id
      );
      setPolicyToPolicyDirectoriesUpdate(policyIds);
      const filterArray = instructions
        .filter((item) => policyIds.includes(item.id))
        .map((item) => ({
          id: item.id,
          policyName: item.policyName,
          checked: true,
        }));
      const filterArray1 = directives
        .filter((item) => policyIds.includes(item.id))
        .map((item) => ({
          id: item.id,
          policyName: item.policyName,
          checked: true,
        }));
      const update = currentDirectoryInstructions?.map((item) => {
        const foundItem = filterArray?.find(
          (element) => item.id === element.id
        );
        return {
          id: item.id,
          policyName: item.policyName,
          checked: foundItem ? true : false,
        };
      });
      const update1 = currentDirectoryDirectives?.map((item) => {
        const foundItem = filterArray1?.find(
          (element) => item.id === element.id
        );
        return {
          id: item.id,
          policyName: item.policyName,
          checked: foundItem ? true : false,
        };
      });
      setCurrentDirectoryInstructions(update);
      setCurrentDirectoryDirectives(update1);
      setCurrentDirectoryName(directoryName);
      setCurrentDirectoryId(id);
      setOpenModalUpdate(true);
    }
  };

  const exitUpdate = () => {
    setOpenModalUpdate(false);
  };

  const handleCheckboxChange = (id) => {
    setPolicyToPolicyDirectories((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCheckboxChangeUpdate = (id, type) => {
    setPolicyToPolicyDirectoriesUpdate((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });

    if (type === "directives") {
      setCurrentDirectoryDirectives((prev) => {
        return prev.map((item) => {
          if (item.id === id) {
            return { ...item, checked: !item.checked };
          }
          return item;
        });
      });
    }

    if (type === "instructions") {
      setCurrentDirectoryInstructions((prev) => {
        return prev.map((item) => {
          if (item.id === id) {
            return { ...item, checked: !item.checked };
          }
          return item;
        });
      });
    }
  };

  const saveFolder = async () => {
    await postPolicyDirectories({
      userId,
      directoryName: directoryName,
      policyToPolicyDirectories: policyToPolicyDirectories,
    })
      .unwrap()
      .then(() => {
        setOpenModal(false);
        setDirectoryName("");
        setPolicyToPolicyDirectories([]);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };
  const saveUpdateFolder = async () => {
    await updatePolicyDirectories({
      userId,
      policyDirectoryId: currentDirectoryId,
      directoryName: currentDirectoryName,
      policyToPolicyDirectories: policyToPolicyDirectoriesUpdate,
    })
      .unwrap()
      .then(() => {
        setManualSuccessResetDirectory(false);
        setManualErrorResetDirectory(false);
      })
      .catch((error) => {
        setManualSuccessResetDirectory(false);
        setManualErrorResetDirectory(false);
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };
  const saveDeleteFolder = async () => {
    await deletePolicyDirectories({
      userId,
      policyDirectoryId: currentDirectoryId,
    })
      .unwrap()
      .then(() => {
        setOpenModalDelete(false);
        setOpenModalUpdate(false);
        setManualDeleteSuccessResetDirectory(false);
        setManualDeleteErrorResetDirectory(false);
      })
      .catch((error) => {
        setManualDeleteSuccessResetDirectory(false);
        setManualDeleteErrorResetDirectory(false);
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
          {currentPolicy.id ? (
            <>
              <div className={classes.item}>
                <div className={classes.itemName}>
                  <span>Тип</span>
                </div>
                <div className={classes.div}>
                  <select
                    className={classes.select}
                    name="type"
                    value={type || currentPolicy.type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Директива">Директива</option>
                    <option value="Инструкция">Инструкция</option>
                  </select>
                </div>
              </div>

              <div className={classes.item}>
                <div className={classes.itemName}>
                  <span>Состояние</span>
                </div>
                <div className={classes.div}>
                  <select
                    className={classes.select}
                    name="state"
                    value={state || currentPolicy.state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="Черновик">Черновик</option>
                    <option value="Активный">Активный</option>
                    <option value="Отменён">Отменён</option>
                  </select>
                </div>
              </div>

              <div className={classes.five}>
                <CustomSelect
                  organizations={organizations}
                  selectOrganizations={currentPolicy.policyToOrganizations}
                  setPolicyToOrganizations={setPolicyToOrganizations}
                ></CustomSelect>
              </div>
            </>
          ) : (
            <></>
          )}

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
                      style={{ marginLeft: "auto" }}
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
                      style={{ marginLeft: "auto" }}
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

                {folders?.map((item) => {
                  return (
                    <li className={classes.policySearchItem}>
                      <div
                        className={classes.listUL}
                        onClick={() => openUpdate(item)}
                      >
                        <img src={folder} alt="folder" />
                        <div className={classes.listText}>
                          {item.directoryName}
                        </div>
                        <img
                          src={iconSublist}
                          alt="iconSublist"
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                      <ul className={classes.listULElement}>
                        {item.policyToPolicyDirectories?.map((element) => (
                          <li
                            key={element.policy.id}
                            onClick={() => getPolicyId(element.policy.id)}
                          >
                            {element.policy.policyName}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}

                <li className={classes.policySearchItem}>
                  <div className={classes.listUL} onClick={open}>
                    <img src={addCircleBlue} alt="addCircleBlue" />
                    <div className={classes.listText}>Создать папку</div>
                  </div>
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
        {isErrorGetPolicies && isErrorGetPolicyDirectoriesMutation ? (
          <>
            <HandlerQeury
              Error={
                isErrorGetPolicies
                  ? isErrorGetPolicies
                  : isErrorGetPolicyDirectoriesMutation
              }
            ></HandlerQeury>
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

                <HandlerQeury
                  Loading={isLoadingGetPolicyDirectoriesMutation}
                  Fetching={isFetchingGetPolicyDirectoriesMutation}
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
                          userId={userId}
                          policyId={selectedPolicyId}
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
                          textError={
                            Error?.data?.errors?.[0]?.errors?.[0]
                              ? Error.data.errors[0].errors[0]
                              : Error?.data?.message
                          }
                        ></HandlerMutation>
                      </>
                    ) : (
                      <>Выберите политику</>
                    )}

                    {openModal ? (
                      <div className={classes.modal}>
                        <table className={classes.modalTable}>
                          <div className={classes.modalTableRow}>
                            <div className={classes.item}>
                              <div className={classes.itemName}>
                                <span>
                                  {" "}
                                  <span style={{ color: "red" }}>*</span>{" "}
                                  Название папки
                                </span>
                              </div>
                              <div className={classes.div}>
                                <input
                                  type="text"
                                  placeholder="Название папки"
                                  value={directoryName}
                                  onChange={(e) =>
                                    setDirectoryName(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className={classes.blockIconSavetmp}>
                              <img
                                src={Blacksavetmp}
                                alt="Blacksavetmp"
                                className={classes.iconSavetmp}
                                style={{ marginLeft: "0.5%" }}
                                onClick={() => saveFolder()}
                              />
                            </div>
                          </div>

                          <img
                            src={exitModal}
                            alt="exitModal"
                            onClick={exit}
                            className={classes.exitImage}
                          />

                          <thead>
                            <tr>
                              <th>Директивы</th>
                              <th>Инструкции</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                {directives?.map((item) => (
                                  <div key={item.id} className={classes.row}>
                                    <input
                                      type="checkbox"
                                      checked={policyToPolicyDirectories.includes(
                                        item.id
                                      )}
                                      onChange={() =>
                                        handleCheckboxChange(item.id)
                                      }
                                    />
                                    {item.policyName}
                                  </div>
                                ))}
                              </td>

                              <td>
                                {instructions?.map((item) => (
                                  <div key={item.id} className={classes.row}>
                                    <input
                                      type="checkbox"
                                      checked={policyToPolicyDirectories.includes(
                                        item.id
                                      )}
                                      onChange={() =>
                                        handleCheckboxChange(item.id)
                                      }
                                    />
                                    {item.policyName}
                                  </div>
                                ))}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <></>
                    )}
                    {openModalUpdate ? (
                      <>
                        <div className={classes.modal}>
                          <table className={classes.modalTable}>
                            <div className={classes.modalTableRow}>
                              <div className={classes.item}>
                                <div className={classes.itemName}>
                                  <span>
                                    <span style={{ color: "red" }}>*</span>
                                    Название папки
                                  </span>
                                </div>
                                <div className={classes.div}>
                                  <input
                                    type="text"
                                    placeholder="Название папки"
                                    value={currentDirectoryName}
                                    onChange={(e) =>
                                      setCurrentDirectoryName(e.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className={classes.modalTableRowIcon}>
                                <div className={classes.blockIconSavetmp}>
                                  <img
                                    src={Blacksavetmp}
                                    alt="Blacksavetmp"
                                    className={classes.iconSavetmp}
                                    onClick={() => saveUpdateFolder()}
                                  />
                                </div>

                                <div className={classes.blockIconDeletetmp}>
                                  <img
                                    src={deleteGrey}
                                    alt="deleteGrey"
                                    className={classes.iconSavetmp}
                                    onClick={() => {
                                      setManualDeleteSuccessResetDirectory(true);
                                      setManualDeleteErrorResetDirectory(true);
                                      setOpenModalDelete(true)}}
                                  />
                                </div>
                              </div>
                            </div>

                            <img
                              src={exitModal}
                              alt="exitModal"
                              onClick={exitUpdate}
                              className={classes.exitImage}
                            />

                            <thead>
                              <tr>
                                <th>Директивы</th>
                                <th>Инструкции</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  {currentDirectoryDirectives?.map((item) => (
                                    <div key={item.id} className={classes.row}>
                                      <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() =>
                                          handleCheckboxChangeUpdate(
                                            item.id,
                                            "directives"
                                          )
                                        }
                                      />
                                      {item.policyName}
                                    </div>
                                  ))}
                                </td>

                                <td>
                                  {currentDirectoryInstructions?.map((item) => (
                                    <div key={item.id} className={classes.row}>
                                      <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() =>
                                          handleCheckboxChangeUpdate(
                                            item.id,
                                            "instructions"
                                          )
                                        }
                                      />
                                      {item.policyName}
                                    </div>
                                  ))}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <HandlerMutation
                          Loading={isLoadingUpdatePolicyDirectoriesMutation}
                          Error={
                            isErrorUpdatePolicyDirectoriesMutation &&
                            !manualErrorResetDirectory
                          }
                          Success={
                            isSuccessUpdatePolicyDirectoriesMutation &&
                            !manualSuccessResetDirectory
                          }
                          textSuccess={"Папка обновлена"}
                          textError={
                            ErrorUpdateDirectories?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorUpdateDirectories.data.errors[0].errors[0]
                              : ErrorUpdateDirectories?.data?.message
                          }
                        ></HandlerMutation>

                        <HandlerMutation
                          Loading={isLoadingDeletePolicyDirectoriesMutation}
                          Error={isErrorDeletePolicyDirectoriesMutation &&
                            !manualDeleteErrorResetDirectory}

                          Success={isSuccessDeletePolicyDirectoriesMutation &&
                            !manualDeleteSuccessResetDirectory}
                          textSuccess={"Папка удалена"}
                          textError={
                            ErrorDeleteDirectories?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorDeleteDirectories.data.errors[0].errors[0]
                              : ErrorDeleteDirectories?.data?.message
                          }
                        ></HandlerMutation>

                        <HandlerMutation
                          Loading={isLoadingPostPolicyDirectoriesMutation}
                          Error={isErrorPostPolicyDirectoriesMutation}
                          Success={isSuccessPostPolicyDirectoriesMutation}
                          textSuccess={"Папка создана"}
                          textError={
                            ErrorPolicyDirectories?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorPolicyDirectories.data.errors[0].errors[0]
                              : ErrorPolicyDirectories?.data?.message
                          }
                        ></HandlerMutation>
                      </>
                    ) : (
                      <></>
                    )}
                    {openModalDelete ? (
                      <>
                      <div className={classes.modalDelete}>
                       
                        <div className={classes.modalDeleteElement}>
                          <img src={exitModal} alt="exitModal" className={classes.exitImage} onClick={() => setOpenModalDelete(false)}/>
                          <div className={classes.row1}>
                            <span className={classes.text}>Вы точно хотите удалить папку <span style = {{fontWeight:'700'}}>{currentDirectoryName}</span></span>
                          </div>

                          <div className={classes.row2}>
                            <button className = {`${classes.btnYes} ${classes.text}`} onClick={() => {
                                setManualDeleteSuccessResetDirectory(true);
                                setManualDeleteErrorResetDirectory(true);
                                saveDeleteFolder();
                            }}>Да</button>
                            <button className = {`${classes.btnNo} ${classes.text}`}  onClick={() => {setOpenModalDelete(false)}}>Нет</button>
                          </div>
                        </div>
                      </div>
                      </>
                  ) : (<></>)}
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
