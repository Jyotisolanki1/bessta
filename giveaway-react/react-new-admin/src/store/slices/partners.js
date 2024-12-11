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
  // totalPages: 0,
  loading: false,
  error: null
};

// Create a slice of the Redux store
const contactSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.data = action?.payload?.data?.partnerList;
      state.totalPages = action?.payload?.data?.totalPages;
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

export const getPartner = (search, page, limit, searchCategory) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(
      `admin/partner-list?page=${page}&record=${limit}&search=${search}&searchCategory=${searchCategory}`,
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
    const response = await axios.post(`admin/update-partner-status`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const UpdatePartner = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    dispatch(requestStart());
    const response = await axios.post(`/admin/update-partner`, data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const AddPartners = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    dispatch(requestStart());
    const response = await axios.post(`/admin/add-partner`, data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

// Export the reducer for use in the Redux store
export default contactSlice.reducer;
