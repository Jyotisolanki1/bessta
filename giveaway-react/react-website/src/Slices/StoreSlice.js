import { createSlice } from '@reduxjs/toolkit';

import { REACT_API_URL } from '../../config';

import axios from 'axios';

const PROXY = REACT_API_URL;

const initialState = {
  Products: [],
  loading: true,
  suggestedProduct: [],
  status :  "enable"
};

const storeSlice = createSlice({
  name: 'Store',
  initialState,
  reducers: {
    GetProducts(state, action) {
      state.Products = action.payload;
      state.loading = false;
    },
    GetSuggestProduct(state, action) {
      state.suggestedProduct = action.payload;
      state.loading = false;
    },
    storeStatus(state, action) {
      // console.log("action?.payload?.status",action?.payload?.status)
      state.status = action?.payload?.status
     }
  },

});

export const { GetProducts, GetSuggestProduct ,storeStatus} = storeSlice.actions;

export default storeSlice.reducer;

export const ProductGetApi = () => async (dispatch) => {
  try {
    const response = await axios.get(PROXY + `product`, {});

    if (response.data.success === true) {
      dispatch(GetProducts(response.data.data));
    }
    //   else {
    //     dispatch(Login_Failed()); // Dispatch the failure action
    //   }
    return response.data;
  } catch (error) {
    return error;
  }
};

export const GetSuggestProductApi = (id) => async (dispatch) => {
  try {
    const response = await axios.get(PROXY + `product?category=${id}`, {});

    if (response.data.success === true) {
      dispatch(GetSuggestProduct(response.data.data));
    }
    //   else {
    //     dispatch(Login_Failed()); // Dispatch the failure action
    //   }
    return response.data;
  } catch (error) {
    return error;
  }
};

export const StoreStatusAPI = () => async(dispatch) => {
  try {
    const response = await axios.get(PROXY + `store-status`);
    if (response.data.success === true) {
      dispatch(storeStatus(response?.data?.data));
    }
    // console.log(response.data.data.status)
  } catch (error) {
    // console.log(error)
  }
};
