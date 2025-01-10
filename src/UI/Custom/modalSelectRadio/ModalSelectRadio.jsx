import React from "react";
import classes from "./ModalSelectRadio.module.css";
import exitModal from "@image/exitModal.svg";
import Blacksavetmp from "@image/Blacksavetmp.svg";
import ButtonImage from "@Custom/buttonImage/ButtonImage";

export function ModalSelectRadio({
  nameTable,
  handleSearchValue,
  handleSearchOnChange,
  exit,
  filterArray,
  array,
  arrayItem,
  selectedItemID,
  handleRadioChange,
  save,
}) {
  return (
    <div className={classes.modal}>
      <div className={classes.modalWindow}>
        <img
          src={exitModal}
          alt="exitModal"
          onClick={() => exit()}
          className={classes.exitImage}
        />

        <div className={classes.itemTable}>
          <div className={classes.itemRow1}>
            <input
              type="search"
              placeholder="Найти"
              value={handleSearchValue}
              onChange={handleSearchOnChange}
              className={classes.searchModal}
            />
          </div>

          {save && (
            <div className={classes.itemRow2}>
              <ButtonImage
                name={"сохранить"}
                icon={Blacksavetmp}
                onClick={save}
              ></ButtonImage>
            </div>
          )}
        </div>

        <table className={classes.modalTable}>
          <thead>
            <tr>
              <th>{nameTable}</th>
            </tr>
          </thead>

          {filterArray.length > 0 ? (
            <tbody>
              <tr>
                <td>
                  {filterArray?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() => handleRadioChange(item.id, item)}
                    >
                      <input
                        type="radio"
                        checked={selectedItemID === item.id}
                      />
                      {item[arrayItem]}
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td>
                  {array?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() => handleRadioChange(item.id, item)}
                    >
                      <input
                        type="radio"
                        checked={selectedItemID === item.id}
                      />
                      {item[arrayItem]}
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
