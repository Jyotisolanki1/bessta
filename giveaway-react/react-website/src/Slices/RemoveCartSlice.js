import { createSlice } from "@reduxjs/toolkit";
import { REACT_API_URL } from "../../config";
import axios from "axios";

const initialState = {
  removeCartItem: false,
};

const RemoveCartSlice = createSlice({
  name: "RemoveCart-Action",
  initialState,
  reducers: {
    RemoveCartItem(state, action) {
      state.removeCartItem = true;
    },
  },
});

export const { RemoveCartItem } = RemoveCartSlice.actions;

export default RemoveCartSlice.reducer;

export const RemoveCartItemApi = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${REACT_API_URL}remove-cart-item`,
      data,
      {}
    );

    if (response.data.success === true) {
      dispatch(RemoveCartItem(response.data.data));
    } else {
    }
    return response.data;
  } catch (error) {
    return error;
  }
};
