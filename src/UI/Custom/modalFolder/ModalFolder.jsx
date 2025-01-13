import React from "react";
import classes from "./ModalFolder.module.css";
import deleteGrey from "../../image/deleteGrey.svg";
import exitModal from "../../image/exitModal.svg";
import Blacksavetmp from "../../image/Blacksavetmp.svg";
import Input from "@Custom/Input/Input";
import ButtonImage from "@Custom/buttonImage/ButtonImage";

export default function ModalFolder({
  searchArrayDirectives,
  searchArrayInstructions,
  arrayDirectives,
  arrayInstructions,
  inputSearchModalDirectory,
  handleInputChangeModalSearch,
  handleCheckboxChange,
  directoryName,
  setDirectoryName,
  save,
  setOpenModalDeleteDirectory,
  exit,
  buttonDelete,
}) {
  return (
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
              <Input
                name={"Название папки"}
                value={directoryName}
                onChange={setDirectoryName}
              ></Input>

              <div className={classes.modalTableRowIcon}>
                <ButtonImage
                  name={"сохранить"}
                  icon={Blacksavetmp}
                  onClick={save}
                ></ButtonImage>
                {buttonDelete && (
                  <ButtonImage
                    name={"удалить"}
                    icon={deleteGrey}
                    onClick={() => {
                      setOpenModalDeleteDirectory(true);
                    }}
                  ></ButtonImage>
                )}
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

          {searchArrayDirectives.length > 0 ||
          searchArrayInstructions.length > 0 ? (
            <tbody>
              <tr>
                <td>
                  {searchArrayDirectives?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() =>
                        handleCheckboxChange(item.id, "directives")
                      }
                    >
                      <input type="checkbox" checked={item.checked} />
                      {item.policyName}
                    </div>
                  ))}
                </td>

                <td>
                  {searchArrayInstructions?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() =>
                        handleCheckboxChange(item.id, "instructions")
                      }
                    >
                      <input type="checkbox" checked={item.checked} />
                      {item.policyName}
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td>
                  {arrayDirectives?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() =>
                        handleCheckboxChange(item.id, "directives")
                      }
                    >
                      <input type="checkbox" checked={item.checked} />
                      {item.policyName}
                    </div>
                  ))}
                </td>

                <td>
                  {arrayInstructions?.map((item) => (
                    <div
                      key={item.id}
                      className={classes.row}
                      onClick={() =>
                        handleCheckboxChange(item.id, "instructions")
                      }
                    >
                      <input type="checkbox" checked={item.checked} />
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
  );
}
