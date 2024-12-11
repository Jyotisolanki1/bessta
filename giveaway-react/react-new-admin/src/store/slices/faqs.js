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
  faqsData: [],
  loading: false,
  error: null
};

// Create a slice of the Redux store
const faqsSlice = createSlice({
  name: 'faqs',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.faqsData = action.payload.data;
    },
    requestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

// Export the actions
export const { requestStart, requestSuccess, requestFailure } = faqsSlice.actions;

export const getFaqs = () => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`/admin/faq`, configHeaderAppJson);

    if (response) {
      dispatch(requestSuccess(response.data));
    }
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

// eslint-disable-next-line consistent-return
export const updateFaqs = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`/admin/update-faq`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

// eslint-disable-next-line consistent-return
export const addFaqs = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`/admin/faq`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

// eslint-disable-next-line consistent-return
export const deleteFaq = (id) => async (dispatch) => {
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
    const response = await axios.delete(`/admin/delete-faq/${id}`, configHeaderAppJson);
    // Send id as an object { id: id }
    return response.data;
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};
// Export the reducer for use in the Redux store
export default faqsSlice.reducer;
