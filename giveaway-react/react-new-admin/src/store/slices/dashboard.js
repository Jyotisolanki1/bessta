/* eslint-disable consistent-return */
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
  dashboardData: {},
  loading: false,
  error: null
};

// Create a slice of the Redux store
const dashboardSlice = createSlice({
  name: 'dashboardC',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.dashboardData = action.payload.data;
    },
    requestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

// Export the actions
export const { requestStart, requestSuccess, requestFailure } = dashboardSlice.actions;

export const getDashboard = () => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`admin/dashboard`, configHeaderAppJson);

    if (response) {
      dispatch(requestSuccess(response.data));
    }
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

export const getChart = () => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`admin/statics-chart`, configHeaderAppJson);

    return response.data;
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};
// Export the reducer for use in the Redux store
export default dashboardSlice.reducer;
