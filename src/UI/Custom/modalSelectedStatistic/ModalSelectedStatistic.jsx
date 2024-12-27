import React from "react";
import classes from "./ModalSelectedStatistic.module.css";
import Blacksavetmp from "@image/Blacksavetmp.svg";
import iconAdd from "@image/iconAdd.svg";
import exitModal from "@image/exitModal.svg";

export function ModalSelectedStatistic({
  value,
  onChange,
  goToStatisticsNew,
  setOpenModalStatisticSave,
  filterArraySearchModalStatistics,
  handleChecboxChangeStatistics,
  statisticsChecked,
  disabledStatisticsChecked,
  statistics,
  openStatisticWarning
}) {
  return (
    <div className={classes.modal}>
      <div className={classes.modalWindow}>
        <div className={classes.itemTable}>
          <div className={classes.itemRow1}>
            <input
              type="search"
              placeholder="Найти"
              value={value}
              onChange={onChange}
              className={classes.searchModal}
            />
          </div>

          <div className={classes.itemRow2}>
            <div className={classes.icon}>
              <img
                src={iconAdd}
                alt="iconAdd"
                onClick={() => goToStatisticsNew()}
              />
            </div>
            <div className={classes.icon}>
              <img
                src={Blacksavetmp}
                alt="Blacksavetmp"
                style={{ marginLeft: "0.5%" }}
                onClick={() => {
                  setOpenModalStatisticSave(true);
                }}
              />
            </div>
          </div>
        </div>

        <table className={classes.modalTable}>
          <img
            src={exitModal}
            alt="exitStatistic"
            onClick={openStatisticWarning}
            className={classes.exitImage}
          />

          <thead>
            <tr>
              <th>Название статистики</th>
            </tr>
          </thead>

          {filterArraySearchModalStatistics.length > 0 ? (
            <tbody>
              <tr>
                <td>
                  {filterArraySearchModalStatistics?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() =>
                        handleChecboxChangeStatistics(item.id, item)
                      }
                    >
                      <input
                        type="checkbox"
                        checked={statisticsChecked.includes(item.id)}
                        disabled={disabledStatisticsChecked.includes(item.id)}
                      />
                      {item.name}
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td>
                  {statistics?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() =>
                        handleChecboxChangeStatistics(item.id, item)
                      }
                    >
                      <input
                        type="checkbox"
                        checked={statisticsChecked.includes(item.id)}
                        disabled={disabledStatisticsChecked.includes(item.id)}
                      />
                      {item.name}
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
