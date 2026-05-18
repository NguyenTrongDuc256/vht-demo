import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IResEquipmentModelDetail } from '../models/equipment.types';

export interface EquipmentState {
  currentEquipment: IResEquipmentModelDetail | null;
  selectedTabId: string;
}

const initialState: EquipmentState = {
  currentEquipment: null,
  selectedTabId: '',
};

export const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    setEquipmentDetail: (
      state,
      action: PayloadAction<IResEquipmentModelDetail>,
    ) => {
      state.currentEquipment = action.payload;
    },
    setSelectedTab: (state, action: PayloadAction<string>) => {
      state.selectedTabId = action.payload;
    },
    clearEquipmentDetail: (state) => {
      state.currentEquipment = null;
      state.selectedTabId = '';
    },
  },
});

export const { setEquipmentDetail, setSelectedTab, clearEquipmentDetail } =
  equipmentSlice.actions;

export default equipmentSlice.reducer;
