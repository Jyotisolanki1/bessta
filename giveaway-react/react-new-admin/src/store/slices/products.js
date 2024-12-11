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
  productData: [],
  categoryData: [],
  totalPagesCat: 0,
  catloading: false,
  loading: false,
  error: null,
  status: 'enable'
};

// Create a slice of the Redux store
const contactSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.catloading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.productData = action?.payload?.data?.productList;
      state.totalPages = action?.payload?.data?.totalPages;
    },
    requestSuccessCategory(state, action) {
      state.catloading = false;
      state.categoryData = action?.payload?.data;
      state.totalPagesCat = action?.payload?.totalPages;
    },
    requestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestStoreStatus(state, action) {
      state.status = action?.payload?.status;
    }
  }
});

// Export the actions
export const { requestStart, requestSuccess, requestSuccessCategory, requestFailure, requestStoreStatus } = contactSlice.actions;

export const getCategories = (search, limit, page) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`/admin/category?page=${page}&record=${limit}&search=${search}`, configHeaderAppJson);
    dispatch(requestSuccessCategory(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

export const addCategoryRequest = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeader.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/category', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const addProductRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('/admin/product', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateProductRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('/admin/update-product', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const statusChangeRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`/admin/update-product-status`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const productImages = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeader.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/upload-image', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateCategoryRequest = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeader.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/update-category', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getProducts = (search, searchCategory, page, limit) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(
      `admin/product?page=${page}&record=${limit}&search=${search}&category=${searchCategory}`,
      configHeaderAppJson
    );
    dispatch(requestSuccess(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};
export const getStoreStatus = () => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.get(`admin/store-status`, configHeaderAppJson);
    dispatch(requestStoreStatus(response?.data?.data));
  } catch (error) {
    console.log('hhe');
  }
};

// eslint-disable-next-line consistent-return
export const storestatusChangeRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.post(`admin/update-store-status`, data, configHeaderAppJson);
    return response;
  } catch (err) {
    console.log('err', err);
  }
};
// Export the reducer for use in the Redux store
export default contactSlice.reducer;
