import { createSlice } from '@reduxjs/toolkit';
import { REACT_API_URL } from '../../config';
import axios from 'axios';

const initialState = {
  addedToCart: false,
  cartItems: []
};

const CartSlice = createSlice({
  name: 'AddCart-Action',
  initialState,
  reducers: {
    AddToCart(state, action) {
      state.addedToCart = true;
      state.cartItems = action.payload;
    }
  }
});

export const { AddToCart } = CartSlice.actions;

export default CartSlice.reducer;

export const AddToCartApi = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${REACT_API_URL}add-cart`, data, {});

    if (response.data.success === true) {
      dispatch(AddToCart(response.data.data));
    }
    return response.data;
  } catch (error) {
    return error;
  }
};
