import React from "react";
import addCircle from "../../image/addCircle.svg";
import deleteGrey from "../../image/deleteGrey.svg";
import classes from "./TableProject.module.css";

export default function TableProject({
  tableKey,
  nameTable,
  add,
  array,
  setArray,
  _array,
  _setArray,
  workers,
  deleteRow,
  noDelete,
  disabledTable
}) {
  console.log(disabledTable);
  return (
    <table key={tableKey} className={classes.table}>
      <caption>
        <div className={classes.nameRow}>
          <div>
            {(() => {
              const map = {
                Обычная: "ЗАДАЧА",
                Статистика: "МЕТРИКА",
              };
              return map[nameTable] || nameTable.toUpperCase();
            })()}
          </div>
          {nameTable !== "Продукт" && (
            <img
              src={addCircle}
              alt="addCircle"
              onClick={() => add(nameTable)}
            />
          )}
        </div>
      </caption>
      <tbody>
        {array?.map((item) => {
          return (
            <tr key={`${item.id}-${item.orderNumber}`}>
              <td className={classes.numberTableColumn}>{item.orderNumber}</td>

              <td className={classes.nameTableColumn}>
                <input
                  type="text"
                  value={item.content}
                  onChange={(e) => {
                    const updated = [...array];
                    updated[item.orderNumber - 1].content = e.target.value;
                    setArray(updated);
                  }}
                  disabled={item?.isExpired || disabledTable}
                />
              </td>

              <td className= {classes.imageTableColumn}>
                <select
                  name="mySelect"
                  value={item.holderUserId}
                  onChange={(e) => {
                    const updated = [...array];
                    updated[item.orderNumber - 1].holderUserId = e.target.value;
                    setArray(updated);
                  }}
                  className={classes.select}
                  disabled={item?.isExpired || disabledTable}
                >
                  <option value="">Выберите опцию</option>
                  {workers.map((item) => {
                    return (
                      <option
                        key={item.id}
                        value={item.id}
                      >{`${item.firstName} ${item.lastName} `}</option>
                    );
                  })}
                </select>
              </td>

              <td className=  {`${item.isExpired === true ? classes.expired: ''} ${classes.dateTableColumn}`}>
                <input
                  type="date"
                  value={item.deadline.slice(0, 10)}
                  onChange={(e) => {
                    const updated = [...array];
                    const date = new Date(e.target.value);
                    date.setUTCHours(21, 0, 0, 0);
                    updated[item.orderNumber - 1].deadline = date.toISOString();
                    setArray(updated);
                  }}
                  disabled={item?.isExpired || disabledTable}
                  className=  {`${item.isExpired === true ? classes.expired: ''}`}
                />
              </td>

              {noDelete ? (
                <td className={classes.statusTableColumn}>
                  <select
                    name="mySelect"
                    value={item.targetState}
                    onChange={(e) => {
                      const updated = [...array];
                      updated[item.orderNumber - 1].targetState =
                        e.target.value;
                      setArray(updated);
                    }}
                    className={classes.select}
                    disabled={item?.isExpired || disabledTable}
                  >
                    <option value="Активная">Активная</option>
                    <option value="Завершена">Завершена</option>
                    <option value="Отменена">Отменена</option>
                  </select>
                </td>
              ) : (
                <td className={classes.deleteTableColumn}>
                  {nameTable !== "Продукт" && (
                    <img
                      src={deleteGrey}
                      alt="deleteGrey"
                      onClick={() => deleteRow(item.type, item.id)}
                    />
                  )}
                </td>
              )}
            </tr>
    
          );
        })}
        {_array?.map((item) => {
          return (
            <tr key={`${item.id}-${item.orderNumber}`}>
              <td className={classes.numberTableColumn}>{item.orderNumber}</td>
              <td className={classes.nameTableColumn}>
                <input
                  type="text"
                  value={item.content}
                  onChange={(e) => {
                    const updated = [..._array];
                    updated[item.orderNumber - 1].content = e.target.value;
                    _setArray(updated);
                  }}
                />
              </td>
              <td className={classes.imageTableColumn}>
                <select
                  name="mySelect"
                  value={item.holderUserId}
                  onChange={(e) => {
                    const updated = [..._array];
                    updated[item.orderNumber - 1].holderUserId = e.target.value;
                    _setArray(updated);
                  }}
                  className={classes.select}
                >
                  <option value="">Выберите опцию</option>
                  {workers.map((item) => {
                    return (
                      <option
                        key={item.id}
                        value={item.id}
                      >{`${item.firstName} ${item.lastName} `}</option>
                    );
                  })}
                </select>
              </td>
              <td className={classes.dateTableColumn}>
                <input
                  type="date"
                  value={item.deadline.slice(0, 10)}
                  onChange={(e) => {
                    const updated = [..._array];
                    const date = new Date(e.target.value);
                    date.setUTCHours(21, 0, 0, 0);
                    updated[item.orderNumber - 1].deadline = date.toISOString();
                    _setArray(updated);
                  }}
                />
              </td>
              <td className={classes.deleteTableColumn}>
                {nameTable !== "Продукт" && (
                  <img
                    src={deleteGrey}
                    alt="deleteGrey"
                    onClick={() => deleteRow(item.type, item.id)}
                  />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
