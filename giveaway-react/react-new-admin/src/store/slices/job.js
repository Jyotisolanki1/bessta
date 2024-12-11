/* eslint-disable prettier/prettier */
/* eslint-disable dot-notation */
// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';
import { configHeader, configHeaderAppJson } from 'config';

// ----------------------------------------------------------------------
// const headers = { 'Content-Type': 'application/json', 'Accept-Language': localStorage.getItem('language') };

// Define the initial state
const initialState = {
  data: [],
  totalPages: 0,
  loading: false,
  error: null
};

// Create a slice of the Redux store
const contactSlice = createSlice({
  name: 'job',
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
export const addJobRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('company/add_job', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateJobRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('company/update_job', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getJob = (page, limit, search) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`company/get_job?page=${page}&limit=${limit}&search=${search}`, configHeaderAppJson);
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
export const statusChangeRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`company/update_job_status`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

// Export the reducer for use in the Redux store
export default contactSlice.reducer;
