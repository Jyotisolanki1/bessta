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
  name: 'event',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.data = action?.payload?.data?.drawList;
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

export const addEventRequest = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeader.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('/admin/add-draw', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateEventRequest = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeader.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/update-draw', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getEvents = (search, page, limit) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`admin/draw?page=${page}&record=${limit}&search=${search}`, configHeaderAppJson);
    dispatch(requestSuccess(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

export const getUsers = (id) => async (dispatch) => {
  const data = { draw_id: id };
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.post('/draw-user-list', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getWinnerList = (id) => async (dispatch) => {
  const data = { draw_id: id };
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.post('winner', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

// Export the reducer for use in the Redux store
export default contactSlice.reducer;
