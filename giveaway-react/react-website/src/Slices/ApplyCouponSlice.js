import { createSlice } from "@reduxjs/toolkit";
import { REACT_API_URL } from "../../config";
import axios from "axios";

const initialState = {
  loading: true,
  billamount: [],
};

const applyCouponSlice = createSlice({
  name: "ApplyCoupon-Slice",
  initialState,
  reducers: {
    ApplyCoupon(state, action) {
      state.billamount = action.payload;
      state.loading = false;
    },
    RemoveCoupon(state, action) {
      state.billamount = action.payload;
      state.loading = false;
    },
  },
});

export const { ApplyCoupon, RemoveCoupon } = applyCouponSlice.actions;

export default applyCouponSlice.reducer;

export const ApplyCouponAPi = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`${REACT_API_URL}apply-coupon`, data);

    if (res.data.success) {
      dispatch(ApplyCoupon(res.data));
    } 
    return res.data;
  } catch (Err) {
    return Err;
  }
};

export const RemoveCouponApi = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`${REACT_API_URL}remove-coupon`, data);

    if (res.data.success) {
      dispatch(RemoveCoupon(res.data));
    }
    return res.data;
  } catch (Err) {
    return Err;
  }
};
