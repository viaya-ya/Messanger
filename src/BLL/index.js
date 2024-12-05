import { configureStore } from '@reduxjs/toolkit';
import { policyApi } from './policyApi';
import { goalApi } from './goalApi';
import { speedGoalApi } from './speedGoalApi';
import { postApi } from './postApi';
import { projectApi } from './projectApi';
import { strategApi } from './strategApi';
import { statisticsApi } from './statisticsApi';
import { policyDirectoriesApi } from './policyDirectoriesApi';
import { organizationApi } from './organizationApi';
import strategReducer from "./strategSlice";
import postReducer from "./postSlice";
import policyReducer from "./policySlice";
import statisticReducer from "./statisticsSlice";


import projectReducer from "./Project/Slice/projectSlice";
import programReducer from "./Program/Slice/programSlice";


export const store = configureStore({
    reducer: {
        [policyApi.reducerPath]: policyApi.reducer,
        [goalApi.reducerPath]: goalApi.reducer,
        [speedGoalApi.reducerPath]: speedGoalApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
        [projectApi.reducerPath]: projectApi.reducer,
        [strategApi.reducerPath]: strategApi.reducer,
        [statisticsApi.reducerPath]: statisticsApi.reducer,
        [policyDirectoriesApi.reducerPath]: policyDirectoriesApi.reducer,
        [organizationApi.reducerPath]: organizationApi.reducer,
        strateg: strategReducer,
        post: postReducer,
        policy: policyReducer,
        statistic: statisticReducer,
        project: projectReducer,
        program: programReducer,
    },
    middleware: (getDefaultMiddlware) => getDefaultMiddlware()
                                                                .concat(policyApi.middleware)
                                                                .concat(goalApi.middleware)
                                                                .concat(speedGoalApi.middleware)
                                                                .concat(postApi.middleware)
                                                                .concat(projectApi.middleware)
                                                                .concat(strategApi.middleware)
                                                                .concat(statisticsApi.middleware)
                                                                .concat(policyDirectoriesApi.middleware)
                                                                .concat(organizationApi.middleware)
});
export default store;