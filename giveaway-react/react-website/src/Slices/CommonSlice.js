// third-party
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  headerPopUp: false,
  subsciptionPlan: {
    _id: "",
    name: "",
    intervalType: "",
    intervalCount: 0,
    entries: 0,
    price: 0,
    discription: "",
    category: {
      _id: "",
      name: "",
      stripeProductId: "",
      status: "",
      createdAt: "",
      updatedAt: "",
    },
    stripePlanId: "",
    status: "",
    createdAt: "",
    updatedAt: "",
  },
};

const slice = createSlice({
  name: "Common-Action",
  initialState,
  reducers: {
    // Admin Login successfull
    HeaderPopUpFunction(state, action) {
      // // console.log('🚀  state:', action);
      state.headerPopUp = action.payload;
    },

    SetSubscriptionPlan(state, action) {
      // // console.log('🚀  state:', action);
      state.subsciptionPlan = action.payload;
    },

    ClearSubscriptionPlan(state) {
      // // console.log('🚀  state:', action);
      state.subsciptionPlan = {};
    },
  },
});

export const {
  HeaderPopUpFunction,
  SetSubscriptionPlan,
  ClearSubscriptionPlan,
} = slice.actions;
// Reducer
export default slice.reducer;
