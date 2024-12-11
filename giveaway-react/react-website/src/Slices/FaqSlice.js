import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { REACT_API_URL } from "../../config";

const initialState = {
  loading: true,
  FaqObj: [],
};
const CartSlice = createSlice({
  name: "Cart-Action",
  initialState,
  reducers: {
    GetFaq(state, action) {
      state.FaqObj = action.payload;
      state.loading = false;
    },
  },
});

export const { GetFaq } = CartSlice.actions;

export default CartSlice.reducer;

const token = localStorage.getItem("userToken");

export const GetFaqApi =
  (cartId = "") =>
  async (dispatch) => {
    try {
      const response = await axios.get(
        `${REACT_API_URL}faq`
        // newAuth
      );
      if (response.data.success) {
        dispatch(GetFaq(response.data.data));
      }

      return response.data;
    } catch (err) {
      return err;
    }
  };
