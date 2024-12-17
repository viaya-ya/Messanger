import React from "react";
import Listsetting from "../../image/Listsetting.svg";
import glazikBlack from "../../image/glazikBlack.svg";
import glazikInvisible from "../../image/glazikInvisible.svg";
import classes from "./blockSections.module.css";

export default function blockSections({ showTable }) {
  return (
    <div className={classes.blockSelect}>
      <img src={Listsetting} alt="Listsetting"  />
      <ul className={classes.option}>
        <div className={classes.nameList}>РАЗДЕЛЫ</div>
        <li>
          <img src={glazikBlack} alt="glazikBlack" />
          Продукт
        </li>
        <li>
          <img src={glazikBlack} alt="glazikBlack" /> Задача
        </li>

        {Object.keys(showTable).map((key) => {
          const { isShow, setIsShow } = showTable[key];
          return (
            <li onClick={() => setIsShow(!isShow)}>
              {isShow ? (
                <img src={glazikBlack} alt="glazikBlack" />
              ) : (
                <img src={glazikInvisible} alt="glazikInvisible" />
              )}

              {key}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
