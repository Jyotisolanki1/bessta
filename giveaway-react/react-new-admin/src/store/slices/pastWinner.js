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
  winnerData: [],
  loading: false,
  error: null
};

// Create a slice of the Redux store
const pastWinnerSlice = createSlice({
  name: 'pastWinner',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestSuccessWinner(state, action) {
      state.loading = false;
      state.winnerData = action?.payload?.data;
      // state.totalPages = action?.payload?.data?.total;
    },
    requestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

// Export the actions
export const { requestStart, requestSuccess, requestSuccessWinner, requestFailure } = pastWinnerSlice.actions;

export const getPasWinners = () => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    dispatch(requestStart());
    const response = await axios.get(`admin/past-winner`, configHeaderAppJson);
    dispatch(requestSuccessWinner(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

// export const addCategoryRequest = (data) => async (dispatch) => {
//   try {
//     configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
//     // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
//     const response = await axios.post('admin/plan-category', data, configHeaderAppJson);
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// };

// export const updateCategoryRequest = (data) => async (dispatch) => {
//   try {
//     configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
//     // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
//     const response = await axios.post('admin/update-plan-category', data, configHeaderAppJson);
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// };

export const addPastWinners = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/past-winner', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updatePastWinnersRequest = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/update-past-winner', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

// export const planImages = (data) => async (dispatch) => {
//   try {
//     configHeader.headers['Content-Type'] = 'multipart/form-data';
//     configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
//     // configHeader.headers['Accept-Language'] = localStorage.getItem('language');
//     const response = await axios.post('admin/upload-image', data, configHeader);
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// };

// export const getPlans = (search, searchCategory, page, limit) => async (dispatch) => {
//   try {
//     configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
//     // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
//     dispatch(requestStart());
//     const response = await axios.get(
//       `admin/plan?page=${page}&record=${limit}&search=${search}&category=${searchCategory}`,
//       configHeaderAppJson
//     );
//     dispatch(requestSuccess(response.data));
//   } catch (error) {
//     dispatch(requestFailure(error.message));
//   }
// };

// export const statusChangeRequest = (data) => async (dispatch) => {
//   try {
//     configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
//     configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
//     dispatch(requestStart());
//     const response = await axios.post(`admin/update-plan-status`, data, configHeaderAppJson);
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// };
// Export the reducer for use in the Redux store
export default pastWinnerSlice.reducer;
