import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterValues: {
    city: "",
    doctorName: "",
    district: "",
    neighbourhood: "",
    
  },
};

export const advertFilterSlice = createSlice({
  name: "advertFilter",
  initialState: initialState,
  reducers: {
    setFormValues(state, action) {
      state.filterValues = action.payload;
    },
    updateField: (state, action) => {
      state.filterValues[action.payload.field] = action.payload.value;
    },

    resetFields:state => {
      state.filterValues= {}
    }
  },
});

export const { setFormValues, updateField, resetFields } = advertFilterSlice.actions;
export default advertFilterSlice.reducer;
