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
  name: 'employee',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.data = action?.payload?.ResponseBody?.docs;
      state.totalPages = action?.payload?.ResponseBody?.totalPages;
    },
    requestFailure(state, action) {
      state.loading = false;
      state.error = action?.payload;
    }
  }
});

// Export the actions
export const { requestStart, requestSuccess, requestFailure } = contactSlice.actions;

// Action creator to post contact
export const addEmployeeRequest = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeader.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('company/add_users', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateEmployeeRequest = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeader.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('company/update_users', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getEmployee = (page, limit, search) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`company/get_all_user?page=${page}&limit=${limit}&search=${search}`, configHeaderAppJson);
    // return response.data;
    dispatch(requestSuccess(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};
export const getAllEmployee = () => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`company/get_all_user`, configHeaderAppJson);
    // return response.data;
    dispatch(requestSuccess(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};
export const deleteEmployeeRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`company/delete_user`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

// Export the reducer for use in the Redux store
export default contactSlice.reducer;
