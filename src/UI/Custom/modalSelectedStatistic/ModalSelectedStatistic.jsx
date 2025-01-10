import React from "react";
import classes from "./ModalSelectedStatistic.module.css";
import Blacksavetmp from "@image/Blacksavetmp.svg";
import iconAdd from "@image/iconAdd.svg";
import exitModal from "@image/exitModal.svg";
import ButtonImage from "@Custom/buttonImage/ButtonImage";

export function ModalSelectedStatistic({
  value,
  onChange,
  createNewStatistic,
  setOpenModalStatisticSave,
  filterArraySearchModalStatistics,
  handleChecboxChangeStatistics,
  statisticsChecked,
  disabledStatisticsChecked,
  statistics,
  openStatisticWarning,
}) {
  return (
    <div className={classes.modal}>
      <div className={classes.modalWindow}>
        <img
          src={exitModal}
          alt="exitStatistic"
          onClick={openStatisticWarning}
          className={classes.exitImage}
        />
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
            <ButtonImage
              name={"создать"}
              icon={iconAdd}
              onClick={createNewStatistic}
            ></ButtonImage>

            <ButtonImage
              name={"сохранить"}
              icon={Blacksavetmp}
              onClick={() => {
                setOpenModalStatisticSave(true);
              }}
            ></ButtonImage>
          </div>
        </div>

        <table className={classes.modalTable}>
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
