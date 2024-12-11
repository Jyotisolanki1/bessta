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
  branchData: [],
  branchLoading: false,
  totalPages: 0,
  loading: false,
  error: null
};

// Create a slice of the Redux store
const contactSlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    requestBranchStart(state) {
      state.branchLoading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.data = action.payload.ResponseBody.docs;
      state.totalPages = action.payload.ResponseBody.totalPages;
    },
    requestBranchSuccess(state, action) {
      state.branchLoading = false;
      state.branchData = action.payload.ResponseBody;
    },
    requestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

// Export the actions
export const { requestStart, requestSuccess, requestFailure, requestBranchStart, requestBranchSuccess } = contactSlice.actions;

// Action creator to post contact
export const addRequest = (data) => async (dispatch) => {
  try {
    // dispatch(requestStart());
    const response = await axios.post('company/send_req', data);
    return response.data;
    // dispatch(requestSuccess(response.data));
  } catch (error) {
    return error;
    // dispatch(requestFailure(error.message));
  }
};

export const getRcompany = (page, limit, search) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`admin/get_company_req?page=${page}&limit=${limit}&search=${search}`, configHeaderAppJson);
    // return response.data;
    dispatch(requestSuccess(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

export const addCompanyRequest = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeader.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/add_company', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateCompanyRequest = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeader.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/update_company', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getCompany = (page, limit, search) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`admin/get_company?page=${page}&limit=${limit}&search=${search}`, configHeaderAppJson);
    // return response.data;
    dispatch(requestSuccess(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};
export const getBranch = (id) => async (dispatch) => {
  const data = { companyId: id };
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestBranchStart());
    const response = await axios.post(`admin/get_branch_by_company`, data, configHeaderAppJson);
    // return response.data;
    dispatch(requestBranchSuccess(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};
export const deleteCompanyRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`admin/delete_company`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

// Export the reducer for use in the Redux store
export default contactSlice.reducer;
