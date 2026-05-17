import { configureStore } from '@reduxjs/toolkit';
import { equipmentDetailReducer } from '@smart-duty/logic';

export const store = configureStore({
  reducer: {
    equipmentDetail: equipmentDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
