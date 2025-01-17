import React, { useState, useEffect } from "react";
import classes from "./ControlPanel.module.css";
import Headers from "@Custom/Headers/Headers";
import BottomHeaders from "@Custom/Headers/BottomHeaders/BottomHeaders";
import ModalSetting from "@Custom/modalSetting/ModalSetting";
import PanelDragDrop from "@Custom/panelDragDrop/PanelDragDrop";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useControlPanel from "UI/hooks/useControlPanel";
import { ModalSelectRadio } from "@Custom/modalSelectRadio/ModalSelectRadio";
import { useModalSelectRadio } from "UI/hooks/useModalSelectRadio";
import usePostsHook from "UI/hooks/usePostsHook";
import ModalWindow from "@Custom/ModalWindow";
import CartStatistic from "@Custom/GraphicStatistics/CartStatistic";

const dbName = "ControlPanelDB";

function initDB(orgName) {
  const request = indexedDB.open(dbName, 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Создаём объектное хранилище для каждой организации
    if (!db.objectStoreNames.contains(orgName)) {
      db.createObjectStore(orgName, { keyPath: "id" }); // "id" будет ключом
    }
  };

  request.onerror = (event) => {
    console.error("Ошибка инициализации базы данных:", event.target.errorCode);
  };

  return request;
}

function saveToIndexedDB(orgName, dataArray) {
  const request = initDB(orgName);

  request.onsuccess = (event) => {
    const db = event.target.result;

    // Создаем транзакцию для конкретного хранилища
    const transaction = db.transaction(orgName, "readwrite");
    const store = transaction.objectStore(orgName);

    // Очищаем хранилище перед записью новых данных
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      // Добавляем каждый объект из массива
      dataArray.forEach((item) => {
        store.add(item); // "item" должен содержать поля "id" и "orderNumber"
      });

      console.log("Данные успешно сохранены в IndexedDB");
    };

    clearRequest.onerror = (event) => {
      console.error("Ошибка очистки хранилища:", event.target.errorCode);
    };
  };
}

function deleteFromIndexedDB(orgName, id) {
  const request = initDB(orgName);

  request.onsuccess = (event) => {
    const db = event.target.result;

    // Создаем транзакцию для конкретного хранилища
    const transaction = db.transaction(orgName, "readwrite");
    const store = transaction.objectStore(orgName);

    // Удаляем объект по id
    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = () => {
      console.log(`Объект с id ${id} успешно удалён из ${orgName} в IndexedDB`);
    };

    deleteRequest.onerror = (event) => {
      console.error("Ошибка удаления данных:", event.target.errorCode);
    };
  };

  request.onerror = (event) => {
    console.error("Ошибка при открытии базы данных:", event.target.errorCode);
  };
}

function loadFromIndexedDB(orgName, callback) {
  const request = initDB(orgName);

  request.onsuccess = (event) => {
    const db = event.target.result;

    const transaction = db.transaction(orgName, "readonly");
    const store = transaction.objectStore(orgName);

    const getRequest = store.getAll();

    getRequest.onsuccess = () => {
      callback(getRequest.result || []);
    };

    getRequest.onerror = (event) => {
      console.error("Ошибка чтения из IndexedDB:", event.target.errorCode);
    };
  };
}

export default function ControlPanel() {
  const [openModalSetting, setOpenModalSetting] = useState();
  const [openModalCreate, setOpenModalCreate] = useState();
  const [openModalDelete, setOpenModalDelete] = useState();

  const [selectedControlPanelId, setSelectedControlPanelId] = useState();
  const [arrayAllControlPanel, setArrayAllControlPanel] = useState([]);

  const {
    reduxNewSelectedOrganizationId,

    // Получение всех панелей по организации
    allControlPanel,
    isLoadingGetAllControlPanel,
    isFetchingGetAllControlPanel,
    isErrorGetAllControlPanel,

    // Получение панели по id
    currentControlPanel,
    statisticsIdsInPanel,
    statisticsPoints,
    isLoadingGetontrolPanelId,
    isFetchingGetontrolPanelId,
    isErrorGetontrolPanelId,

    // Создание панели
    postControlPanel,
    isLoadingPostControlPanelMutation,
    isSuccessPostControlPanelMutation,
    isErrorPostControlPanelMutation,
    ErrorPostControlPanel,

    //  Обновление
    updateControlPanel,
    isLoadingUpdateControlPanelMutation,
    isSuccessUpdateControlPanelMutation,
    isErrorUpdateControlPanelMutation,
    ErrorUpdateControlPanel,

    // Удаление статистики
    deleteControlPanel,
    isLoadingDeleteControlPanelMutation,
    isSuccessDeleteControlPanelMutation,
    isErrorDeleteControlPanelMutation,
    ErrorDeleteControlPanel,
  } = useControlPanel({ selectedControlPanelId });

  const { allPosts, isLoadingGetPosts, isErrorGetPosts } = usePostsHook();

  const {
    selectedID: selectedPostIdForCreated,
    selectedName,

    handleRadioChange,
    handleInputChangeModalSearch,

    filterArraySearchModal,
    inputSearchModal,
  } = useModalSelectRadio({ array: allPosts, arrayItem: "postName" });

  const getControlPanelId = (id) => {
    setSelectedControlPanelId(id);
  };

  const openCreate = () => {
    setOpenModalCreate(true);
  };
  const createControlPanel = async () => {
    await postControlPanel({
      orderNumber: allControlPanel.length == 0 ? 1 : allControlPanel.length + 1,
      panelName: `${selectedName} №`,
      statisticIds: [
        "d0582c86-8489-4eb6-b273-04d51cb8f904",
        "9f4d593a-8b0e-42c6-b1a7-ae1f585ed137",
      ],
      organizationId: reduxNewSelectedOrganizationId,
      postId: selectedPostIdForCreated,
    })
      .unwrap()
      .then(() => {
        setOpenModalCreate(false);
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2));
      });
  };
  const removeControlPanel = async () => {
    await deleteControlPanel({
      controlPanelId: selectedControlPanelId,
    })
      .unwrap()
      .then(() => {
        setOpenModalDelete(false);
        deleteFromIndexedDB(
          reduxNewSelectedOrganizationId,
          selectedControlPanelId
        );
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2));
      });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    // Создаем новый массив состояний
    const updatedState = Array.from(arrayAllControlPanel);
    // Перемещаем редактор
    const [movedItem] = updatedState.splice(source.index, 1);
    updatedState.splice(destination.index, 0, movedItem);

    setArrayAllControlPanel(() => {
      const updatedArray = updatedState.map((item, index) => ({
        ...item,
        orderNumber: index + 1,
      }));

      // Сохраняем массив в IndexedDB
      saveToIndexedDB(
        reduxNewSelectedOrganizationId,
        updatedArray.map(({ id, orderNumber, panelName }) => ({
          id,
          orderNumber,
          panelName,
        }))
      );

      return updatedArray;
    });
  };

  const btnYes = () => {
    removeControlPanel();
  };

  const btnNo = () => {
    setOpenModalDelete(false);
  };

  useEffect(() => {
    if (Object.keys(allControlPanel).length > 0) {
      loadFromIndexedDB(reduxNewSelectedOrganizationId, (data) => {
        if (data.length > 0) {
          setArrayAllControlPanel(() => {
            // Создаем новый массив, обновляем orderNumber, и затем сортируем по orderNumber
            return allControlPanel
              .map((panel) => {
                const matchingData = data.find((item) => item.id === panel.id);

                if (matchingData) {
                  // Заменяем orderNumber, если нашли совпадение по id
                  return {
                    ...panel,
                    orderNumber: matchingData.orderNumber,
                  };
                }

                // Если совпадения нет, возвращаем панель без изменений
                return panel;
              })
              .sort((a, b) => a.orderNumber - b.orderNumber); // Сортировка по orderNumber
          });
        } else {
          setArrayAllControlPanel(allControlPanel);
        }
      });
    }
  }, [allControlPanel]);

  return (
    <div className={classes.dialog}>
      <Headers name={"панель управления"}>
        <BottomHeaders create={openCreate}></BottomHeaders>
      </Headers>

      <div className={classes.main}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="panelList" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={classes.droppableContainer}
              >
                {arrayAllControlPanel?.map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={`item-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <PanelDragDrop
                          isActive={currentControlPanel.id === item.id}
                          openSetting={() => setOpenModalSetting(true)}
                          name={`${item.panelName} ${item.controlPanelNumber}`}
                          onClick={() => getControlPanelId(item.id)}
                          deletePanel={() => setOpenModalDelete(true)}
                        ></PanelDragDrop>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className={classes.graphics}>
          {statisticsPoints.length > 0 &&
            statisticsPoints.map((item, index) => (
              <CartStatistic
                key={item.index}
                name={item.name}
                data={[...item.statisticDatas]}
                typeGraphic={currentControlPanel.graphType}
                type={"Прямая"}
                reportDay={3}
              />
            ))}
        </div>

        {openModalSetting && (
          <ModalSetting
            exit={() => setOpenModalSetting(false)}
            updateControlPanel={updateControlPanel}
            currentControlPanel={currentControlPanel}
            statisticsIdsInPanel={statisticsIdsInPanel}
          ></ModalSetting>
        )}
        {openModalCreate && (
          <ModalSelectRadio
            nameTable={"Название поста"}
            handleSearchValue={inputSearchModal}
            handleSearchOnChange={handleInputChangeModalSearch}
            handleRadioChange={handleRadioChange}
            exit={() => {
              setOpenModalCreate(false);
            }}
            filterArray={filterArraySearchModal}
            array={allPosts}
            arrayItem={"postName"}
            selectedItemID={selectedPostIdForCreated}
            save={createControlPanel}
          ></ModalSelectRadio>
        )}
        {openModalDelete && (
          <ModalWindow
            text={`Вы точно хотите удалить панель управления ${currentControlPanel.panelName} ${currentControlPanel.controlPanelNumber}`}
            close={setOpenModalDelete}
            btnYes={btnYes}
            btnNo={btnNo}
          ></ModalWindow>
        )}
      </div>
    </div>
  );
}
