
import Pomoshnik from "@app/Pomoshnik/Pomoshnik";
import Goal from "@app/GoalPage/Goal";
import Policy from "@app/PolicyPage/Policy";
import Statistic from "@app/StatisticsPage/Statistic";
import SpeedGoal from "@app/SpeedGoalPage/SpeedGoal";
import Strategy from "@app/StrategyPage/Strategy";
import StartProject from "@app/ProjectPage/Start/Update/StartContent";

import ProjectNew from "@app/ProjectPage/Project/Create/ProjectNew";
import Project from "@app/ProjectPage/Project/Update/Project";

import Program from "@app/ProjectPage/Program/Update/Program";
import ProgramNew from "@app/ProjectPage/Program/Create/ProgramNew";

import Post from "@app/PostPage/Post";
import PostNew from "@app/PostPage/PostNew";

const pageComponents = {
  pomoshnik: {
    start: Pomoshnik,

    goal: Goal,

    policy: Policy,


    statistic: Statistic,

    speedGoal: SpeedGoal,

    strategy: Strategy,
     
    startProject: StartProject,

    project: Project,
    projectNew: ProjectNew,

    program: Program,
    programNew: ProgramNew,

    post: Post,
    postNew: PostNew,
  },
};

export default pageComponents;
