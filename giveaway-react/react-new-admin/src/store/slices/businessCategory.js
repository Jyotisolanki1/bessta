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
  businessCatData: [],
  loading: false,
  error: null
};

// Create a slice of the Redux store
const businessCatSlice = createSlice({
  name: 'businessCat',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.businessCatData = action.payload.data;
    },
    requestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

// Export the actions
export const { requestStart, requestSuccess, requestFailure } = businessCatSlice.actions;

export const getBusinessCat =
  (search = '') =>
  async (dispatch) => {
    try {
      configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
      dispatch(requestStart());
      const response = await axios.get(`/admin/get-business-category?search=${search}`, configHeaderAppJson);

      if (response) {
        dispatch(requestSuccess(response.data));
      }
    } catch (error) {
      dispatch(requestFailure(error.message));
    }
  };

// eslint-disable-next-line consistent-return
export const updateBusinesscat = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`/admin/update-business-category`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

// eslint-disable-next-line consistent-return
export const addBusinessCategory = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`/admin/add-business-category`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

// eslint-disable-next-line consistent-return
export const deleteBusinessCategory = (id) => async (dispatch) => {
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
    const response = await axios.delete(`/admin/delete-business-category/${id}`, configHeaderAppJson);
    // Send id as an object { id: id }
    return response.data;
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};
// Export the reducer for use in the Redux store
export default businessCatSlice.reducer;
