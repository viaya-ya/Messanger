import React, { useState, useEffect, useRef } from "react";
import classes from "./PolicyContent.module.css";
import icon from "../../image/iconHeader.svg";
import Select from "../../image/Select.svg";
import iconBack from "../../image/iconBack.svg";
import subbarSearch from "../../image/subbarSearch.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
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
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
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
import styles from "../../Custom/CommonStyles.module.css";
import WaveLetters from "../../Custom/WaveLetters.jsx";
import { useSelector } from "react-redux";
import Mdxeditor from "../../Custom/Mdxeditor/Mdxeditor.jsx";

export default function PolicyContent() {
  const navigate = useNavigate();
  const back = () => {
    navigate(`/${userId}/start`);
  };
  const pathNewPolicy = () => {
    navigate("new");
  };
  const { userId } = useParams();
  const policyCreatedId = useSelector((state) => state.policy.policyCreatedId);

  const [editorState, setEditorState] = useState("");


  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [policyName, setPolicyName] = useState(null);
  const [type, setType] = useState(null);
  const [state, setState] = useState(null);
  // const [policyToOrganizations, setPolicyToOrganizations] = useState([]);
  const [organizationId, setOrganizationId] = useState("");
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

  const [
    manualCreateSuccessResetDirectory,
    setManualCreateSuccessResetDirectory,
  ] = useState(true);
  const [manualCreateErrorResetDirectory, setManualCreateErrorResetDirectory] =
    useState(true);

  const [
    manualUpdateSuccessResetDirectory,
    setManualUpdateSuccessResetDirectory,
  ] = useState(true);
  const [manualUpdateErrorResetDirectory, setManualUpdateErrorResetDirectory] =
    useState(true);

  const [
    manualDeleteSuccessResetDirectory,
    setManualDeleteSuccessResetDirectory,
  ] = useState(true);
  const [manualDeleteErrorResetDirectory, setManualDeleteErrorResetDirectory] =
    useState(true);

  const [openModalDelete, setOpenModalDelete] = useState(false);

  const [inputSearchModalDirectory, setInputSearchModalDirectory] =
    useState("");

  const [
    filterArraySearchModalDirectives,
    setFilterArraySearchModalDirectives,
  ] = useState([]);

  const [
    filterArraySearchModalInstructions,
    setFilterArraySearchModalInstructions,
  ] = useState([]);

  const {
    instructions = [],
    instructionsActive = [],
    instructionsDraft = [],
    instructionsCompleted = [],

    directives = [],
    directivesActive = [],
    directivesDraft = [],
    directivesCompleted = [],

    isLoadingGetPolicies,
    isErrorGetPolicies,
    isFetchingGetPolicies,
  } = useGetPoliciesQuery(userId, {
    selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
      isLoadingGetPolicies: isLoading,
      isErrorGetPolicies: isError,
      isFetchingGetPolicies: isFetching,
      directives: data?.directives || [],
      instructions: data?.instructions || [],

      instructionsActive: data?.instructionsActive || [],
      instructionsDraft: data?.instructionsDraft || [],
      instructionsCompleted: data?.instructionsCompleted || [],

      directivesActive: data?.directivesActive || [],
      directivesDraft: data?.directivesDraft || [],
      directivesCompleted: data?.directivesCompleted || [],
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
    foldersSort = [],
    isLoadingGetPolicyDirectoriesMutation,
    isErrorGetPolicyDirectoriesMutation,
    isFetchingGetPolicyDirectoriesMutation,
  } = useGetPolicyDirectoriesQuery(userId, {
    selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
      isLoadingGetPolicyDirectoriesMutation: isLoading,
      isErrorGetPolicyDirectoriesMutation: isError,
      isFetchingGetPolicyDirectoriesMutation: isFetching,
      folders: data?.folders || [],
      foldersSort: data?.foldersSort || [],
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
    if (policyCreatedId) {
      getPolicyId(policyCreatedId);
    }
  }, []);

  useEffect(() => {
    if(currentPolicy.policyName){
      setPolicyName(currentPolicy.policyName);
    }
    if(currentPolicy.type){
      setType(currentPolicy.type);
    }
    if(currentPolicy.state){
      setState(currentPolicy.state);
    }
    if (currentPolicy.content && currentPolicy.content !== editorState) {
      setEditorState(currentPolicy.content); 
    }
  }, [currentPolicy.id]);

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
    if (editorState !== null && currentPolicy.content !== editorState) {
      Data.content = editorState;
    }
    if (
      organizationId !== "" &&
      currentPolicy?.organization?.id !== organizationId
    ) {
      Data.organizationId = organizationId;
    }
    await updatePolicy({
      userId,
      policyId: selectedPolicyId,
      _id: userId,
      ...Data,
    })
      .unwrap()
      .then(() => {
        setManualSuccessReset(false);
        setManualErrorReset(false);          
      })
      .catch((error) => {
        setManualErrorReset(false);
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });
  };

  const getPolicyId = (id) => {
    setManualUpdateSuccessResetDirectory(true);
    setManualUpdateErrorResetDirectory(true);

    setManualCreateSuccessResetDirectory(true);
    setManualCreateErrorResetDirectory(true);

    setManualDeleteSuccessResetDirectory(true);
    setManualDeleteErrorResetDirectory(true);

    setSelectedPolicyId(id);
    setManualSuccessReset(true);
    setManualErrorReset(true);
  };

  const open = () => {
    // setManualCreateSuccessResetDirectory(true);
    // setManualCreateErrorResetDirectory(true);
    setOpenModal(true);
  };
  const exit = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (instructionsActive.length > 0) {
      const update = instructionsActive.map((item) => ({
        id: item.id,
        policyName: item.policyName,
        checked: false,
      }));
      setCurrentDirectoryInstructions(update);
    }
    if (directivesActive.length > 0) {
      const update = directivesActive.map((item) => ({
        id: item.id,
        policyName: item.policyName,
        checked: false,
      }));
      setCurrentDirectoryDirectives(update);
    }
  }, [isLoadingGetPolicies, isFetchingGetPolicies]);

  const openUpdate = (element) => {
    // setManualUpdateSuccessResetDirectory(false);
    // setManualUpdateErrorResetDirectory(false);
    const obj = folders?.filter((item) => item.id === element.id);
    if (obj?.length > 0) {
      const { id, directoryName, policyToPolicyDirectories } = obj[0];
      const policyIds = policyToPolicyDirectories.map(
        (element) => element.policy.id
      );
      setPolicyToPolicyDirectoriesUpdate(policyIds);
      const filterArray = instructionsActive
        .filter((item) => policyIds.includes(item.id))
        .map((item) => ({
          id: item.id,
          policyName: item.policyName,
          checked: true,
        }));
      const filterArray1 = directivesActive
        .filter((item) => policyIds.includes(item.id))
        .map((item) => ({
          id: item.id,
          policyName: item.policyName,
          checked: true,
        }));

      const update = currentDirectoryInstructions
        ?.map((item) => {
          const foundItem = filterArray?.find(
            (element) => item.id === element.id
          );
          return {
            id: item.id,
            policyName: item.policyName,
            checked: foundItem ? true : false,
          };
        })
        ?.sort((a, b) => {
          // Сначала сортируем по checked: true должны быть выше
          if (a.checked === b.checked) {
            // Если оба элемента имеют одинаковое значение checked, сортируем по policyName (алфавитно)
            return a.policyName.localeCompare(b.policyName);
          }
          return b.checked - a.checked; // true (1) должно быть выше false (0)
        });

      const update1 = currentDirectoryDirectives
        ?.map((item) => {
          const foundItem = filterArray1?.find(
            (element) => item.id === element.id
          );
          return {
            id: item.id,
            policyName: item.policyName,
            checked: foundItem ? true : false,
          };
        })
        ?.sort((a, b) => {
          // Сначала сортируем по checked: true должны быть выше
          if (a.checked === b.checked) {
            // Если оба элемента имеют одинаковое значение checked, сортируем по policyName (алфавитно)
            return a.policyName.localeCompare(b.policyName);
          }
          return b.checked - a.checked; // true (1) должно быть выше false (0)
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
        setDirectoryName("");
        setPolicyToPolicyDirectories([]);
        setManualCreateSuccessResetDirectory(false);
        setManualCreateErrorResetDirectory(false);
        setOpenModal(false);
      })
      .catch((error) => {
        setManualCreateSuccessResetDirectory(false);
        setManualCreateErrorResetDirectory(false);
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
        setManualUpdateSuccessResetDirectory(false);
        setManualUpdateErrorResetDirectory(false);
        exitUpdate();
      })
      .catch((error) => {
        setManualUpdateSuccessResetDirectory(false);
        setManualUpdateErrorResetDirectory(false);
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

  // Поиск в папке
  useEffect(() => {
    if (inputSearchModalDirectory !== "") {
      const arrayDirectives = [...directivesActive];
      const arrayInstructions = [...instructionsActive];
      const filteredDirectives = arrayDirectives.filter((item) =>
        item.policyName
          .toLowerCase()
          .includes(inputSearchModalDirectory.toLowerCase())
      );
      const filteredInstructions = arrayInstructions.filter((item) =>
        item.policyName
          .toLowerCase()
          .includes(inputSearchModalDirectory.toLowerCase())
      );
      setFilterArraySearchModalDirectives(filteredDirectives);
      setFilterArraySearchModalInstructions(filteredInstructions);
    } else {
      setFilterArraySearchModalDirectives([]);
      setFilterArraySearchModalInstructions([]);
    }
  }, [inputSearchModalDirectory]);

  useEffect(() => {
    if (openModalUpdate === false) {
      setInputSearchModalDirectory("");
      setFilterArraySearchModalDirectives([]);
      setFilterArraySearchModalInstructions([]);
    }
  }, [openModalUpdate]);

  useEffect(() => {
    if (openModal === false) {
      setInputSearchModalDirectory("");
      setFilterArraySearchModalDirectives([]);
      setFilterArraySearchModalInstructions([]);
    }
  }, [openModal]);

  const handleInputChangeModalSearch = (e) => {
    setInputSearchModalDirectory(e.target.value);
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
                // value={policyName ? policyName : currentPolicy.policyName}
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                title="Название политики"
                className={classes.textMontserrat14}
              ></input>
              <div className={classes.sixth} ref={selectRef}>
                <img
                  src={subbarSearch}
                  alt="subbarSearch"
                  onClick={() => setIsOpenSearch(true)}
                />
                {isOpenSearch && (
                  <ul className={classes.policySearch}>
                    <li className={classes.policySearchItemNested}>
                      <div className={classes.listUL}>
                        <img src={folder} alt="folder" />
                        <div className={classes.listText}>Директивы</div>
                        <img
                          src={iconSublist}
                          alt="iconSublist"
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                      <ul className={classes.listULElementNested}>
                        <li className={classes.policySearchItemNestedNested}>
                          <div className={classes.listULNested}>
                            <img src={folder} alt="folder" />
                            <div
                              className={`${classes.listText} ${classes.activeText}`}
                            >
                              Активные
                            </div>
                            <img
                              src={iconSublist}
                              alt="iconSublist"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                          <ul className={classes.listULElementNestedTwo}>
                            {directivesActive?.map((item) => (
                              <li
                                key={item.id}
                                onClick={() => getPolicyId(item.id)}
                                className={classes.textMontserrat}
                              >
                                {item.policyName}
                              </li>
                            ))}
                          </ul>
                        </li>

                        <li className={classes.policySearchItemNestedNested}>
                          <div className={classes.listULNested}>
                            <img src={folder} alt="folder" />
                            <div
                              className={`${classes.listText} ${classes.draftText}`}
                            >
                              Черновики
                            </div>
                            <img
                              src={iconSublist}
                              alt="iconSublist"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                          <ul className={classes.listULElementNestedTwo}>
                            {directivesDraft?.map((item) => (
                              <li
                                key={item.id}
                                onClick={() => getPolicyId(item.id)}
                                className={classes.textMontserrat}
                              >
                                {item.policyName}
                              </li>
                            ))}
                          </ul>
                        </li>

                        <li className={classes.policySearchItemNestedNested}>
                          <div className={classes.listULNested}>
                            <img src={folder} alt="folder" />
                            <div
                              className={`${classes.listText} ${classes.completedText}`}
                            >
                              Завершенные
                            </div>
                            <img
                              src={iconSublist}
                              alt="iconSublist"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                          <ul className={classes.listULElementNestedTwo}>
                            {directivesCompleted?.map((item) => (
                              <li
                                key={item.id}
                                onClick={() => getPolicyId(item.id)}
                                className={classes.textMontserrat}
                              >
                                {item.policyName}
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </li>

                    <li className={classes.policySearchItemNested}>
                      <div className={classes.listUL}>
                        <img src={folder} alt="folder" />
                        <div className={classes.listText}>Инструкции</div>
                        <img
                          src={iconSublist}
                          alt="iconSublist"
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                      <ul className={classes.listULElementNested}>
                        <li className={classes.policySearchItemNestedNested}>
                          <div className={classes.listULNested}>
                            <img src={folder} alt="folder" />
                            <div
                              className={`${classes.listText} ${classes.activeText}`}
                            >
                              Активные
                            </div>
                            <img
                              src={iconSublist}
                              alt="iconSublist"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                          <ul className={classes.listULElementNestedTwo}>
                            {instructionsActive?.map((item) => (
                              <li
                                key={item.id}
                                onClick={() => getPolicyId(item.id)}
                                className={classes.textMontserrat}
                              >
                                {item.policyName}
                              </li>
                            ))}
                          </ul>
                        </li>

                        <li className={classes.policySearchItemNestedNested}>
                          <div className={classes.listULNested}>
                            <img src={folder} alt="folder" />
                            <div
                              className={`${classes.listText} ${classes.draftText}`}
                            >
                              Черновики
                            </div>
                            <img
                              src={iconSublist}
                              alt="iconSublist"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                          <ul className={classes.listULElementNestedTwo}>
                            {instructionsDraft?.map((item) => (
                              <li
                                key={item.id}
                                onClick={() => getPolicyId(item.id)}
                                className={classes.textMontserrat}
                              >
                                {item.policyName}
                              </li>
                            ))}
                          </ul>
                        </li>

                        <li className={classes.policySearchItemNestedNested}>
                          <div className={classes.listULNested}>
                            <img src={folder} alt="folder" />
                            <div
                              className={`${classes.listText} ${classes.completedText}`}
                            >
                              Завершенные
                            </div>
                            <img
                              src={iconSublist}
                              alt="iconSublist"
                              style={{ marginLeft: "auto" }}
                            />
                          </div>
                          <ul className={classes.listULElementNestedTwo}>
                            {instructionsCompleted?.map((item) => (
                              <li
                                key={item.id}
                                onClick={() => getPolicyId(item.id)}
                                className={classes.textMontserrat}
                              >
                                {item.policyName}
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </li>

                    {foldersSort?.map((item) => {
                      let hasInstruction = false;
                      let hasDirective = false;
                      return (
                        <li className={classes.policySearchItem} key={item.id}>
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
                            {item.policyToPolicyDirectories?.map((element) => {
                              const isInstruction =
                                element.policy.type === "Инструкция";

                              let instructionHeader = null;

                              if (isInstruction && !hasInstruction) {
                                hasInstruction = true;
                                instructionHeader = (
                                  <li
                                    key="instruction-header"
                                    className={`${classes.headerText}`}
                                  >
                                    Инструкции
                                  </li>
                                );
                              }

                              const isDirective =
                                element.policy.type === "Директива";

                              let directiveHeader = null;

                              if (isDirective && !hasDirective) {
                                hasDirective = true;
                                directiveHeader = (
                                  <li
                                    key="directive-header"
                                    className={`${classes.headerText}`}
                                  >
                                    Директивы
                                  </li>
                                );
                              }

                              return (
                                <React.Fragment key={element.policy.id}>
                                  {directiveHeader}
                                  {instructionHeader}
                                  <li
                                    onClick={() =>
                                      getPolicyId(element.policy.id)
                                    }
                                    className={classes.textMontserrat}
                                  >
                                    {element.policy.policyName}
                                  </li>
                                </React.Fragment>
                              );
                            })}
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
              </div>
            </div>
          </div>

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
                    // value={type || currentPolicy.type}
                    value={type}
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
                    // value={state || currentPolicy.state}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="Черновик">Черновик</option>
                    <option value="Активный">Активный</option>
                    <option value="Отменён">Отменён</option>
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
                    value={organizationId || currentPolicy?.organization?.id}
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
            </>
          ) : (
            <></>
          )}

          <div className={classes.imageButton}>
            <div className={classes.blockIconAdd}>
              <img
                src={iconAdd}
                alt="iconAdd"
                className={classes.iconAdd}
                onClick={() => pathNewPolicy()}
              />
            </div>
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
                        <Mdxeditor
                          key={currentPolicy.id}
                          editorState={currentPolicy.content}
                          setEditorState={setEditorState}
                          userId={userId}
                          policyId={selectedPolicyId}
                        ></Mdxeditor>

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

                        <HandlerMutation
                          Loading={isLoadingPostPolicyDirectoriesMutation}
                          Error={
                            isErrorPostPolicyDirectoriesMutation &&
                            !manualCreateErrorResetDirectory
                          }
                          Success={
                            isSuccessPostPolicyDirectoriesMutation &&
                            !manualCreateSuccessResetDirectory
                          }
                          textSuccess={"Папка создана"}
                          textError={
                            ErrorPolicyDirectories?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorPolicyDirectories.data.errors[0].errors[0]
                              : ErrorPolicyDirectories?.data?.message
                          }
                        ></HandlerMutation>

                        <HandlerMutation
                          Loading={isLoadingUpdatePolicyDirectoriesMutation}
                          Error={
                            isErrorUpdatePolicyDirectoriesMutation &&
                            !manualUpdateErrorResetDirectory
                          }
                          Success={
                            isSuccessUpdatePolicyDirectoriesMutation &&
                            !manualUpdateSuccessResetDirectory
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
                          Error={
                            isErrorDeletePolicyDirectoriesMutation &&
                            !manualDeleteErrorResetDirectory
                          }
                          Success={
                            isSuccessDeletePolicyDirectoriesMutation &&
                            !manualDeleteSuccessResetDirectory
                          }
                          textSuccess={"Папка удалена"}
                          textError={
                            ErrorDeleteDirectories?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorDeleteDirectories.data.errors[0].errors[0]
                              : ErrorDeleteDirectories?.data?.message
                          }
                        ></HandlerMutation>
                      </>
                    ) : (
                      <>
                        <WaveLetters
                          letters={"Выберите политику"}
                        ></WaveLetters>

                        <HandlerMutation
                          Loading={isLoadingPostPolicyDirectoriesMutation}
                          Error={
                            isErrorPostPolicyDirectoriesMutation &&
                            !manualCreateErrorResetDirectory
                          }
                          Success={
                            isSuccessPostPolicyDirectoriesMutation &&
                            !manualCreateSuccessResetDirectory
                          }
                          textSuccess={"Папка создана"}
                          textError={
                            ErrorPolicyDirectories?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorPolicyDirectories.data.errors[0].errors[0]
                              : ErrorPolicyDirectories?.data?.message
                          }
                        ></HandlerMutation>
                        <HandlerMutation
                          Loading={isLoadingUpdatePolicyDirectoriesMutation}
                          Error={
                            isErrorUpdatePolicyDirectoriesMutation &&
                            !manualUpdateErrorResetDirectory
                          }
                          Success={
                            isSuccessUpdatePolicyDirectoriesMutation &&
                            !manualUpdateSuccessResetDirectory
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
                          Error={
                            isErrorDeletePolicyDirectoriesMutation &&
                            !manualDeleteErrorResetDirectory
                          }
                          Success={
                            isSuccessDeletePolicyDirectoriesMutation &&
                            !manualDeleteSuccessResetDirectory
                          }
                          textSuccess={"Папка удалена"}
                          textError={
                            ErrorDeleteDirectories?.data?.errors?.[0]
                              ?.errors?.[0]
                              ? ErrorDeleteDirectories.data.errors[0].errors[0]
                              : ErrorDeleteDirectories?.data?.message
                          }
                        ></HandlerMutation>
                      </>
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
                                  <div className={classes.itemRow2Column}>
                                    <div className={classes.itemName}>
                                      <span>
                                        {" "}
                                        <span style={{ color: "red" }}>
                                          *
                                        </span>{" "}
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
                                        className={classes.textMontserrat14}
                                      />
                                    </div>
                                  </div>

                                  <div className={classes.blockIconSavetmp}>
                                    <img
                                      src={Blacksavetmp}
                                      alt="Blacksavetmp"
                                      className={classes.iconSavetmp}
                                      style={{ marginLeft: "0.5%" }}
                                      onClick={() => {
                                        saveFolder();
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
                                  <th>Директивы</th>
                                  <th>Инструкции</th>
                                </tr>
                              </thead>

                              {filterArraySearchModalDirectives.length > 0 ||
                              filterArraySearchModalInstructions.length > 0 ? (
                                <tbody>
                                  <tr>
                                    <td>
                                      {filterArraySearchModalDirectives?.map(
                                        (item) => (
                                          <div
                                            key={item.id}
                                            className={classes.row}
                                            onClick={() =>
                                              handleCheckboxChange(item.id)
                                            }
                                          >
                                            <input
                                              type="checkbox"
                                              checked={policyToPolicyDirectories.includes(
                                                item.id
                                              )}
                                            />
                                            {item.policyName}
                                          </div>
                                        )
                                      )}
                                    </td>

                                    <td>
                                      {filterArraySearchModalInstructions?.map(
                                        (item) => (
                                          <div
                                            key={item.id}
                                            className={classes.row}
                                            onClick={() =>
                                              handleCheckboxChange(item.id)
                                            }
                                          >
                                            <input
                                              type="checkbox"
                                              checked={policyToPolicyDirectories.includes(
                                                item.id
                                              )}
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
                                      {directivesActive?.map((item) => (
                                        <div
                                          key={item.id}
                                          className={classes.row}
                                          onClick={() =>
                                            handleCheckboxChange(item.id)
                                          }
                                        >
                                          <input
                                            type="checkbox"
                                            checked={policyToPolicyDirectories.includes(
                                              item.id
                                            )}
                                          />
                                          {item.policyName}
                                        </div>
                                      ))}
                                    </td>

                                    <td>
                                      {instructionsActive?.map((item) => (
                                        <div
                                          key={item.id}
                                          className={classes.row}
                                          onClick={() =>
                                            handleCheckboxChange(item.id)
                                          }
                                        >
                                          <input
                                            type="checkbox"
                                            checked={policyToPolicyDirectories.includes(
                                              item.id
                                            )}
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
                    {openModalUpdate ? (
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
                                  <div className={classes.itemRow2Column}>
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
                                          setCurrentDirectoryName(
                                            e.target.value
                                          )
                                        }
                                        className={classes.textMontserrat14}
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
                                          // setManualDeleteSuccessResetDirectory(
                                          //   true
                                          // );
                                          // setManualDeleteErrorResetDirectory(true);
                                          setOpenModalDelete(true);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <table className={classes.modalTable}>
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

                              {filterArraySearchModalDirectives.length > 0 ||
                              filterArraySearchModalInstructions.length > 0 ? (
                                <tbody>
                                  <tr>
                                    <td>
                                      {filterArraySearchModalDirectives?.map(
                                        (item) => (
                                          <div
                                            key={item.id}
                                            className={classes.row}
                                            onClick={() =>
                                              handleCheckboxChangeUpdate(
                                                item.id,
                                                "directives"
                                              )
                                            }
                                          >
                                            <input
                                              type="checkbox"
                                              checked={item.checked}
                                            />
                                            {item.policyName}
                                          </div>
                                        )
                                      )}
                                    </td>

                                    <td>
                                      {filterArraySearchModalInstructions?.map(
                                        (item) => (
                                          <div
                                            key={item.id}
                                            className={classes.row}
                                            onClick={() =>
                                              handleCheckboxChangeUpdate(
                                                item.id,
                                                "instructions"
                                              )
                                            }
                                          >
                                            <input
                                              type="checkbox"
                                              checked={item.checked}
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
                                      {currentDirectoryDirectives?.map(
                                        (item) => (
                                          <div
                                            key={item.id}
                                            className={classes.row}
                                            onClick={() =>
                                              handleCheckboxChangeUpdate(
                                                item.id,
                                                "directives"
                                              )
                                            }
                                          >
                                            <input
                                              type="checkbox"
                                              checked={item.checked}
                                            />
                                            {item.policyName}
                                          </div>
                                        )
                                      )}
                                    </td>

                                    <td>
                                      {currentDirectoryInstructions?.map(
                                        (item) => (
                                          <div
                                            key={item.id}
                                            className={classes.row}
                                            onClick={() =>
                                              handleCheckboxChangeUpdate(
                                                item.id,
                                                "instructions"
                                              )
                                            }
                                          >
                                            <input
                                              type="checkbox"
                                              checked={item.checked}
                                            />
                                            {item.policyName}
                                          </div>
                                        )
                                      )}
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
                    {openModalDelete ? (
                      <>
                        <div className={classes.modalDelete}>
                          <div className={classes.modalDeleteElement}>
                            <img
                              src={exitModal}
                              alt="exitModal"
                              className={classes.exitImage}
                              onClick={() => setOpenModalDelete(false)}
                            />
                            <div className={classes.row1}>
                              <span className={classes.text}>
                                Вы точно хотите удалить папку{" "}
                                <span style={{ fontWeight: "700" }}>
                                  {currentDirectoryName}
                                </span>
                              </span>
                            </div>

                            <div className={classes.row2}>
                              <button
                                className={`${classes.btnYes} ${classes.textBtnYes}`}
                                onClick={() => {
                                  setManualDeleteSuccessResetDirectory(true);
                                  setManualDeleteErrorResetDirectory(true);
                                  saveDeleteFolder();
                                }}
                              >
                                Да
                              </button>
                              <button
                                className={`${classes.btnNo} ${classes.textBtnNo}`}
                                onClick={() => {
                                  setOpenModalDelete(false);
                                }}
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
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
