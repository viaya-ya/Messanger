import React from "react";
import classes from "./TextArea.module.css";

export default function TextArea({ value, onChange, readOnly }) {
  return (
    <textarea
      className={classes.textArea}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={readOnly}
    ></textarea>
  );
}
