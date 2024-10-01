import { configureStore } from '@reduxjs/toolkit';
import { policyApi } from './policyApi';
import { goalApi } from './goalApi';
import { speedGoalApi } from './speedGoalApi';

export const store = configureStore({
    reducer: {
        [policyApi.reducerPath]: policyApi.reducer,
        [goalApi.reducerPath]: goalApi.reducer,
        [speedGoalApi.reducerPath]: speedGoalApi.reducer,
    },
    middleware: (getDefaultMiddlware) => getDefaultMiddlware().concat(policyApi.middleware).concat(goalApi.middleware).concat(speedGoalApi.middleware)
});
export default store;