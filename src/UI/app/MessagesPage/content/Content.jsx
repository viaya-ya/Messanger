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


import NewPolicy from "../../PolicyPage/NewPolicy";
import NewGoal from "../../GoalPage/NewGoal";
import SpeedGoalNew from "../../SpeedGoalPage/SpeedGoalNew";
import PostNew from "../../PostPage/PostNew";
import StrategNew from "../../StrategPage/StrategNew";
import StatisticsNew from "../../StatisticsPage/StatisticsNew";

import StartContent from "../../ProjectPage/Start/Update/StartContent";


import ProjectContent from "../../ProjectPage/Project/Update/ProjectContent";
import ProjectNew from "../../ProjectPage/Project/Create/ProjectNew";

import ProgramContent from "../../ProjectPage/Program/Update/ProgramContent";
import ProgramNew from "../../ProjectPage/Program/Create/ProgramNew";

export default function Content() {
  const location = useLocation();
  const { userId, paramPostID } = useParams();
  return (
    <div className={classes.content}>
      <Contact></Contact>
      {location.pathname ===  "/" + userId + "/start" && <Dialog />}

      {location.pathname === "/" + userId + "/goal" && <GoalContent />}
      {location.pathname === "/" + userId + "/goal/new" && <NewGoal />}

      {location.pathname === "/" + userId + "/policy" && <PolicyContent />}
      {location.pathname === "/" + userId + "/policy/new" && <NewPolicy />}


      
      {/* {location.pathname === "/" + userId + "/posts" && <PostContent />}
      {location.pathname.startsWith(`/${userId}/posts/new`) && <PostNew />} */}


      {location.pathname === `/${userId}/posts${paramPostID ? `/${paramPostID}` : ""}` && <PostContent />}
      {location.pathname === "/" + userId + "/posts/new" && <PostNew />}



      {location.pathname ===  "/" + userId +"/speedgoal" && <SpeedGoalContent />}
      {location.pathname === "/" + userId + "/speedgoal/new" && <SpeedGoalNew />}

      {location.pathname ===  "/" + userId + "/strateg" && <StrategContent />}
      {location.pathname === "/" + userId + "/strateg/new" && <StrategNew />}

      {location.pathname === "/" + userId + "/statistics" && <StatisticsContent />}
      {location.pathname.startsWith(`/${userId}/statistics/new`) && <StatisticsNew />}
      


      {location.pathname === "/" + userId + "/startProject" && <StartContent/>}

      {location.pathname === "/" + userId + "/project" && <ProjectContent />}
      {location.pathname === "/" + userId + "/project/new" && < ProjectNew/>}
      
      {location.pathname === "/" + userId + "/program/new" && < ProgramNew/>}
      {location.pathname === "/" + userId + "/program" && < ProgramContent/>}
      
    </div>
  );
}
// http://localhost:3000/#/bc807845-08a8-423e-9976-4f60df183ae2/start