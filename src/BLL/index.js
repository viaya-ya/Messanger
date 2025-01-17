import { configureStore } from '@reduxjs/toolkit';
import { policyApi } from './policyApi';
import { goalApi } from './goalApi';
import { speedGoalApi } from './speedGoalApi';
import { postApi } from './postApi';
import { projectApi } from './projectApi';
import { strategApi } from './strategy/strategApi';
import { statisticsApi } from './statisticsApi';
import { directoriesApi } from './directoriesApi';
import { organizationApi } from './organizationApi';
import { controlPanelApi } from './controlPanel/controlPanelApi';

import localStorageReducer from "./localStorage/localStorageSlice";
import postReducer from "./postSlice";
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
        [directoriesApi.reducerPath]: directoriesApi.reducer,
        [organizationApi.reducerPath]: organizationApi.reducer,
        [controlPanelApi.reducerPath]: controlPanelApi.reducer,
        localStorage: localStorageReducer,
        post: postReducer,
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
                                                                .concat(directoriesApi.middleware)
                                                                .concat(organizationApi.middleware)
                                                                .concat(controlPanelApi.middleware)
});
export default store;