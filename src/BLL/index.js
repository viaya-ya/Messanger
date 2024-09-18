import { configureStore } from '@reduxjs/toolkit';
import { policyApi } from './policyApi';

export const store = configureStore({
    reducer: {
        [policyApi.reducerPath]: policyApi.reducer,
    },
    middleware: (getDefaultMiddlware) => getDefaultMiddlware().concat(policyApi.middleware)
});
export default store;