import { configureStore } from '@reduxjs/toolkit';
import { policyApi } from './policyApi';
import { goalApi } from './goalApi';
import { speedGoalApi } from './speedGoalApi';
import { postApi } from './postApi';
import { projectApi } from './projectApi';
import { strategApi } from './strategApi';

export const store = configureStore({
    reducer: {
        [policyApi.reducerPath]: policyApi.reducer,
        [goalApi.reducerPath]: goalApi.reducer,
        [speedGoalApi.reducerPath]: speedGoalApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
        [projectApi.reducerPath]: projectApi.reducer,
        [strategApi.reducerPath]: strategApi.reducer,
    },
    middleware: (getDefaultMiddlware) => getDefaultMiddlware()
                                                                .concat(policyApi.middleware)
                                                                .concat(goalApi.middleware)
                                                                .concat(speedGoalApi.middleware)
                                                                .concat(postApi.middleware)
                                                                .concat(projectApi.middleware)
                                                                .concat(strategApi.middleware)
});
export default store;