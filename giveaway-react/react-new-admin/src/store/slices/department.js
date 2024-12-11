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
  name: 'dapartment',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.data = action.payload.ResponseBody.docs;
      state.totalPages = action.payload.ResponseBody.totalPages;
    },
    requestSuccessAll(state, action) {
      state.loading = false;
      state.data = action.payload.ResponseBody;
      // state.totalPages = action.payload.ResponseBody.totalPages;
    },
    requestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

// Export the actions
export const { requestStart, requestSuccess, requestSuccessAll, requestFailure } = contactSlice.actions;

export const updateDepartmentRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/update_department', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const addDepartmentRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/add_department', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getDepartment = (page, limit, search) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`admin/get_department?page=${page}&limit=${limit}&search=${search}`, configHeaderAppJson);
    // return response.data;
    dispatch(requestSuccess(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

export const getAllDepartment = () => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`company/get_all_department`, configHeaderAppJson);
    // return response.data;
    dispatch(requestSuccessAll(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

export const deleteDepartment = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`admin/delete_department`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

// Export the reducer for use in the Redux store
export default contactSlice.reducer;
