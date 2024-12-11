import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { REACT_API_URL } from "../../config";

const initialState = {
  loading: true,
  Orders: [],
  RateReview: null
};

const OrderSlice = createSlice({
  name: "Orders-Action",
  initialState,
  reducers: {
    GetOrders(state, action) {
      state.Orders = action.payload;
      state.loading = false;
    },
    RateReview(state,action){
     state.RateReview = action.payload
    }
  },
});

export const { GetOrders ,RateReview} = OrderSlice.actions;

export default OrderSlice.reducer;

export const GetMyOrdersApi = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("userToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${REACT_API_URL}my-order`, config);

    if (response.data.success) {
      dispatch(GetOrders(response.data.data));
    }
    return response.data;
  } catch (err) {
    return err;
  }
};


export const RateReviewApi = (data) => async (dispatch) => {
  try {
    const token = localStorage.getItem("userToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(REACT_API_URL + "review-rating", data,config);
    if (response.data.success) {
      dispatch(RateReview(response.data.data));
    }
    return response.data;
  } catch (err) {
    return err
  }
};



