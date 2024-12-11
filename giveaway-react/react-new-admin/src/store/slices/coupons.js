/* eslint-disable dot-notation */
// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';
import { configHeader, configHeaderAppJson } from 'config';

// ----------------------------------------------------------------------

// Define the initial state
const initialState = {
  data: [],
  totalPages: 0,
  loading: false,
  error: null
};

// Create a slice of the Redux store
const contactSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.data = action?.payload?.data?.couponList;
      state.totalPages = action?.payload?.data?.totalPages;
    },
    requestSuccessCategory(state, action) {
      state.loading = false;
      state.categoryData = action?.payload?.data;
      // state.totalPages = action?.payload?.data?.total;
    },
    requestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

// Export the actions
export const { requestStart, requestSuccess, requestSuccessCategory, requestFailure } = contactSlice.actions;

export const addCouponRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/add-coupon', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateCouponRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/update-coupon', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getCoupons = (search, page, limit) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`admin/coupon?page=${page}&record=${limit}&search=${search}`, configHeaderAppJson);
    dispatch(requestSuccess(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

// Export the reducer for use in the Redux store
export default contactSlice.reducer;
