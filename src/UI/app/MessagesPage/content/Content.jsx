import React, { useEffect } from "react";
import classes from "./Content.module.css";
import Contact from "./Contact";
import Dialog from "./Dialog";
import GoalContent from "../../GoalPage/GoalContent";
import { useLocation } from "react-router-dom";
import PolicyContent from "../../PolicyPage/PolicyContent";
import PostContent from "../../PostPage/PostContent";
import SpeedGoalContent from "../../SpeedGoalPage/SpeedGoalContent";
import StrategContent from "../../StrategPage/StrategContent";
import StatisticsContent from "../../StatisticsPage/StatisticsContent";
import ProjectContent from "../../ProjectPage/ProjectContent";

export default function Content() {
  const location = useLocation();
  console.log(location);
  return (
    <div className={classes.content}>
      <Contact></Contact>
      {location.pathname === "/start" && <Dialog />}
      {location.pathname === "/goal" && <GoalContent />}
      {location.pathname === "/policy" && <PolicyContent />}
      {location.pathname === "/posts" && <PostContent />}
      {location.pathname === "/speedgoal" && <SpeedGoalContent />}
      {location.pathname === "/strateg" && <StrategContent />}
      {location.pathname === "/statistics" && <StatisticsContent />}
      {location.pathname === "/project" && <ProjectContent />}
    </div>
  );
}
