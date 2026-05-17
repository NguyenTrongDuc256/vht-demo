import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EquipmentSpecTabId } from '../models/equipment.types';

export interface EquipmentDetailUiState {
  activeSpecTabId: EquipmentSpecTabId;
  selectedEquipmentId: string;
}

const initialState: EquipmentDetailUiState = {
  activeSpecTabId: 'tong_quan',
  selectedEquipmentId: 'cv-18-fujian',
};

const equipmentDetailSlice = createSlice({
  name: 'equipmentDetail',
  initialState,
  reducers: {
    setActiveSpecTabId: (state, action: PayloadAction<EquipmentSpecTabId>) => {
      state.activeSpecTabId = action.payload;
    },
    setSelectedEquipmentId: (state, action: PayloadAction<string>) => {
      state.selectedEquipmentId = action.payload;
    },
  },
});

export const { setActiveSpecTabId, setSelectedEquipmentId } =
  equipmentDetailSlice.actions;

export const equipmentDetailReducer = equipmentDetailSlice.reducer;

export const selectActiveSpecTabId = (state: {
  equipmentDetail: EquipmentDetailUiState;
}) => state.equipmentDetail.activeSpecTabId;

export const selectSelectedEquipmentId = (state: {
  equipmentDetail: EquipmentDetailUiState;
}) => state.equipmentDetail.selectedEquipmentId;
