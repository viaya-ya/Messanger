import React from "react";
import classes from "./Content.module.css";
import { useParams } from "react-router-dom";
import pageComponents from "@constants/pageComponents.js";
import Chat from "@app/Chat/Chat";


export default function Content() {
  const { userId, group, route, paramPostID } = useParams();
  const Component = pageComponents[group]?.[route];

  return (
    <div className={classes.content}>
      <Chat></Chat>
      <Component></Component>
    </div>
  );
}
// http://localhost:3000/#/bc807845-08a8-423e-9976-4f60df183ae2/start
