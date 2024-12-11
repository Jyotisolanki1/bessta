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
  planData: [],
  categoryData: [],
  loading: false,
  catloading: false,
  planloading: false,
  error: null,
  planDetail: [],
  totalPages: 0
};

// Create a slice of the Redux store
const contactSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    requestStart(state) {
      state.catloading = true;
      state.loading = true;
      state.error = null;
      state.planloading = true;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.planData = action?.payload?.data?.planList;
      state.totalPages = action?.payload?.data?.totalPages;
    },
    requestSuccessCategory(state, action) {
      state.catloading = false;
      state.categoryData = action?.payload?.data;
      // state.totalPages = action?.payload?.data?.total;
    },
    requestFailure(state, action) {
      state.loading = false;
      state.catloading = false;
      state.error = action.payload;
    },
    requestPlanDetail(state, action) {
      state.planloading = false;
      state.planDetail = action?.payload?.data;
      state.totalPages = action?.payload?.totalPages;
    }
  }
});

// Export the actions
export const { requestStart, requestSuccess, requestSuccessCategory, requestFailure, requestPlanDetail } = contactSlice.actions;

export const getCategories = (search) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`admin/plan-category?search=${search}`, configHeaderAppJson);
    dispatch(requestSuccessCategory(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

export const addCategoryRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/plan-category', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateCategoryRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/update-plan-category', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const addPlanRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/add-plan', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updatePlanRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/update-plan', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const planImages = (data) => async (dispatch) => {
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

export const getPlans = (search, searchCategory, searchFilter, page, limit) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(
      `admin/plan?page=${page}&record=${limit}&search=${search}&category=${searchCategory}&filter=${searchFilter}&`,
      configHeaderAppJson
    );
    dispatch(requestSuccess(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

export const statusChangeRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`admin/update-plan-status`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const planDetailRequest = (id, page, limit, filter, startDate, endDate) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(
      `/admin/plan-user-subscription?id=${id}&page=${page}&record=${limit}&filter=${filter}&startDate=${startDate}&endDate=${endDate}`,
      configHeaderAppJson
    );
    dispatch(requestPlanDetail(response.data));
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deletePlan = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`/admin/delete-plan/${data}`, configHeaderAppJson);
    dispatch(requestPlanDetail(response.data));
    return response.data;
  } catch (error) {
    return error;
  }
};
// Export the reducer for use in the Redux store
export default contactSlice.reducer;
