import React, { useEffect } from "react";
import classes from "./Content.module.css";
import Contact from "./Contact";
import Dialog from "./Dialog";
import GoalContent from "../../GoalPage/GoalContent";
import { useLocation, useParams } from "react-router-dom";
import PolicyContent from "../../PolicyPage/PolicyContent";
import PostContent from "../../PostPage/PostContent";
import SpeedGoalContent from "../../SpeedGoalPage/SpeedGoalContent";
import StrategContent from "../../StrategPage/StrategContent";
import StatisticsContent from "../../StatisticsPage/StatisticsContent";
import ProjectContent from "../../ProjectPage/ProjectContent";
import ProjectNew from "../../ProjectPage/ProjectNew";
import NewPolicy from "../../PolicyPage/NewPolicy";
import NewGoal from "../../GoalPage/NewGoal";
import SpeedGoalNew from "../../SpeedGoalPage/SpeedGoalNew";
import PostNew from "../../PostPage/PostNew";

export default function Content() {
  const location = useLocation();
  const { userId } = useParams();
  console.log(location);
  return (
    <div className={classes.content}>
      <Contact></Contact>
      {location.pathname === "/start" && <Dialog />}
      {location.pathname === "/" + userId + "/goal" && <GoalContent />}
      {location.pathname === "/" + userId + "/goal/new" && <NewGoal />}
      {location.pathname === "/" + userId + "/policy" && <PolicyContent />}
      {location.pathname === "/" + userId + "/policy/new" && <NewPolicy />}
      {location.pathname === "/" + userId +"/posts" && <PostContent />}
      {location.pathname === "/" + userId + "/posts/new" && <PostNew />}
      {location.pathname ===  "/" + userId +"/speedgoal" && <SpeedGoalContent />}
      {location.pathname === "/" + userId + "/speedgoal/new" && <SpeedGoalNew />}
      {location.pathname === "/strateg" && <StrategContent />}
      {location.pathname === "/statistics" && <StatisticsContent />}
      {location.pathname === "/" + userId + "/project" && <ProjectContent />}
      {location.pathname === "/" + userId + "/project/new" && < ProjectNew/>}
    </div>
  );
}
// http://localhost:3000/#/3b809c42-2824-46c1-9686-dd666403402a/policy