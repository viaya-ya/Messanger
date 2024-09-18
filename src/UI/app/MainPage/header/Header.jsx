import React from "react";
import classes from "./Header.module.css";
import IconButton from "@mui/material/IconButton";
import exit from "../../../image/exit.svg";

export default function Header() {
  return (
    <div className={classes.header}>
      <div className={classes.exit}>
        <IconButton>
          <img src={exit} alt="exit" />
        </IconButton>
      </div>
    </div>
  );
}
