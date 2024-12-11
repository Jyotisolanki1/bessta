import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { REACT_API_URL } from '../../config';

const initialState = {
  loading: true,
  CartObj: {}
};
const CartSlice = createSlice({
  name: 'Cart-Action',
  initialState,
  reducers: {
    GetCartItems(state, action) {
      state.CartObj = action.payload;
      state.loading = false;
    },

    ClearCartItems(state) {
      state.CartObj = {};
      state.loading = true;
    }
  }
});

export const { GetCartItems, ClearCartItems } = CartSlice.actions;

export default CartSlice.reducer;

const token = localStorage.getItem('userToken');

export const GetCartItemsApi =
  (cartId = '') =>
  async (dispatch) => {
    const id = localStorage?.getItem('cartid');
    const newAuth = {
      headers: {
        'content-type': 'application/json',
        Authorization: `bearer ${token}`
      }
    };
    const checkID = id !== null ? id : cartId;
    try {
      const response = await axios.get(`${REACT_API_URL}get-cart?cart_id=${checkID}`, newAuth);
      if (response.data.success) {
        dispatch(GetCartItems(response.data.data));
      }
      if (!response.data.success) {
        dispatch(GetCartItems(response.data.data));
      }
      return response.data;
    } catch (err) {
      return err;
    }
  };
