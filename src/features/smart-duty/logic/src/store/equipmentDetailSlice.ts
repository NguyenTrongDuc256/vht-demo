import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface EquipmentDetailUiState {
  activePropertyGroupId: string;
  selectedModelId: string;
}

const initialState: EquipmentDetailUiState = {
  activePropertyGroupId: '',
  selectedModelId: 'cv-18-fujian',
};

const equipmentDetailSlice = createSlice({
  name: 'equipmentDetail',
  initialState,
  reducers: {
    setActivePropertyGroupId: (state, action: PayloadAction<string>) => {
      state.activePropertyGroupId = action.payload;
    },
    setSelectedModelId: (state, action: PayloadAction<string>) => {
      state.selectedModelId = action.payload;
    },
  },
});

export const { setActivePropertyGroupId, setSelectedModelId } =
  equipmentDetailSlice.actions;

export const equipmentDetailReducer = equipmentDetailSlice.reducer;

export const selectActivePropertyGroupId = (state: {
  equipmentDetail: EquipmentDetailUiState;
}) => state.equipmentDetail.activePropertyGroupId;

export const selectSelectedModelId = (state: {
  equipmentDetail: EquipmentDetailUiState;
}) => state.equipmentDetail.selectedModelId;
