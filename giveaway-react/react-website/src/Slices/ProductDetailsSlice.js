import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { REACT_API_URL } from '../../config';

const initialState = {
  ProductDetails: [],
  loading: true
};

const ProductDetailSlice = createSlice({
  name: 'ProductDetailsAction',
  initialState,
  reducers: {
    GetProductDetails(state, action) {
      state.ProductDetails = action.payload;
      state.loading = false;
    },

    ClearProductDetails(state) {
      state.ProductDetails = [];
      state.loading = true;
    }
  }
});

export default ProductDetailSlice.reducer;

export const { GetProductDetails, ClearProductDetails } = ProductDetailSlice.actions;

export const ProductDetailsApi = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${REACT_API_URL}product-by-id?id=${id}`, {});

    if (response.data.success) {
      dispatch(GetProductDetails(response?.data?.data));
    }
    return response.data;
  } catch (err) {
    return err;
  }
};
