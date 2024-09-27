import { configureStore } from '@reduxjs/toolkit';
import { policyApi } from './policyApi';
import { goalApi } from './goalApi';

export const store = configureStore({
    reducer: {
        [policyApi.reducerPath]: policyApi.reducer,
        [goalApi.reducerPath]: goalApi.reducer,
    },
    middleware: (getDefaultMiddlware) => getDefaultMiddlware().concat(policyApi.middleware).concat(goalApi.middleware)
});
export default store;