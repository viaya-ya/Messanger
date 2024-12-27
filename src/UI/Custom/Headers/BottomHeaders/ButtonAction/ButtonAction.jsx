import React from "react";
import classes from "./ButtonAction.module.css";
import iconAdd from "../../../../image/iconAdd.svg";
import Blacksavetmp from "../../../../image/Blacksavetmp.svg";
export default function ButtonAction({ create, update }) {
  return (
    <div className={classes.imageButton}>
      {create && (
        <div className={classes.blockIconAdd}>
          <img
            src={iconAdd}
            alt="iconAdd"
            className={classes.icon}
            onClick={() => create()}
          />
        </div>
      )}

      <div className={classes.blockIconSavetmp}>
        <img
          src={Blacksavetmp}
          alt="Blacksavetmp"
          className={classes.icon}
          style={{ marginLeft: "0.5%" }}
          onClick={() => update()}
        />
      </div>
    </div>
  );
}
