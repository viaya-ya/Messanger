import React from "react";
import classes from "./Content.module.css";
import { useParams } from "react-router-dom";
import pageComponents from "@constants/pageComponents.js";
import Chat from "@app/Chat/Chat";


export default function Content() {
  const { group, route } = useParams();
  const Component = pageComponents[group]?.[route];

  return (
    <div className={classes.content}>
      <Chat></Chat>
      <Component></Component>
    </div>
  );
}
