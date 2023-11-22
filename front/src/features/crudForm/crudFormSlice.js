import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formValues: {
    step: 1,
    lastStep: 5,

    seoTitle: "",
    seoUrl: "",
    seoDescription: "",

    // step 1
    advertTypeId: "",
    processTypeId: "",
    advertShapeId: "",
    adverTitle: "",
    description: "",
    advertPrice: "",
    shortDescription: "",
    isEncrypted: false,
    isContract: false,
    contractDate: '',
    advertPassword: "",

    // step 2
    address: "",
    countryId: "652919953f904b78aff02cae",
    cityId: "",
    districtId: "",
    neighbourhoodId: "",
    isMapActive: false,
    zipcode: "",
    latitude: "",
    longitude: "",
    // step 3 - Detail Information
    features: [],

    // step 4  Upload Photo
    advertPhoto: "",
    photoStatus: "",

    // step 5 Cover Photo
    coverPhoto: "",
  },
};

export const crudFormSlice = createSlice({
  name: "crudForm",
  initialState: initialState,
  reducers: {
    setFormValues(state, action) {
      state.formValues = action.payload;
    },
    updateField: (state, action) => {
      state.formValues[action.payload.field] = action.payload.value;
    },

    resetFields:state => {
      state.formValues= {
        step: 1,
        lastStep: 5,
    
        seoTitle: "",
        seoUrl: "",
        seoDescription: "",
    
        // step 1
        advertTypeId: "",
        processTypeId: "",
        advertShapeId: "",
        adverTitle: "",
        description: "",
        advertPrice: "",
        shortDescription: "",
        isEncrypted: false,
        isContract: false,
        contractDate: '',
        advertPassword: "",
    
        // step 2
        address: "",
        countryId: "652919953f904b78aff02cae",
        cityId: "",
        districtId: "",
        neighbourhoodId: "",
        isMapActive: false,
        zipcode: "",
        latitude: "",
        longitude: "",
        // step 3 - Detail Information
        features: [],
    
        // step 4  Upload Photo
        advertPhoto: "",
        photoStatus: "",
    
        // step 5 Cover Photo
        coverPhoto: "",
      }
    }
  },
});

export const { setFormValues, updateField, resetFields } = crudFormSlice.actions;
export default crudFormSlice.reducer;
