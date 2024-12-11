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
  loading: false,
  error: null,
  totalPages: 0
};

// Create a slice of the Redux store
const helpSlice = createSlice({
  name: 'help',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.data = action?.payload?.data?.helpList;
      state.loading = false;
      state.totalPages = action?.payload?.data?.totalPages;
    },
    requestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

// Export the actions
export const { requestStart, requestSuccess, requestFailure } = helpSlice.actions;

export const getHelps = (page, limit) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`/admin/help-center?page=${page}&record=${limit}`, configHeaderAppJson);
    dispatch(requestSuccess(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

export const replyQuery = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`/admin/update-query`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

// eslint-disable-next-line consistent-return
export const deleteQuery = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in local storage');
    }

    const configHeaderAppJson = {
      headers: {
        Authorization: `Bearer ${token}`
        // Add other headers if needed
      }
    };

    dispatch(requestStart());
    const response = await axios.delete(`/admin/delete-query/${id}`, configHeaderAppJson);
    // Send id as an object { id: id }
    return response.data;
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};
// Export the reducer for use in the Redux store
export default helpSlice.reducer;
