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
  viewuser: {},
  userData: {},
  viewLoading: false
};

// Create a slice of the Redux store
const contactSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
      state.viewLoading = true;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.data = action?.payload?.data?.userList;
      state.totalPages = action?.payload?.data?.totalPages;
    },
    requestViewSuccess(state, action) {
      state.viewLoading = false;
      state.viewuser = action?.payload;
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
export const { requestStart, requestSuccess, requestSuccessAll, requestFailure, requestViewSuccess } = contactSlice.actions;

export const getUser = (search, page, limit, startDate, endDate) => async (dispatch) => {
  try {
    if (startDate == null) {
      startDate = '';
    }
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(
      `/admin/user?page=${page}&record=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`,
      configHeaderAppJson
    );
    dispatch(requestSuccess(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

export const getAllUser = (search) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`/admin/alluser?search=${search}`, configHeaderAppJson);
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
    const response = await axios.post(`admin/update-user-status`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const viewUserRequest = (id) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`/admin/user-payment-history?id=${id}`, configHeaderAppJson);
    dispatch(requestViewSuccess(response.data));
    return response.data;
  } catch (error) {
    return error;
  }
};

export const userSubscriptionRequest =
  ({ uid, type }) =>
  async (dispatch) => {
    try {
      configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
      dispatch(requestStart());
      const response = await axios.get(`/admin/user-subscription-history?id=${uid}&type=${type}`, configHeaderAppJson);
      return response.data;
    } catch (error) {
      return error;
    }
  };

export const sendMailRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`/admin/send-user-mail`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const sendHelpCenterMailRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`/admin/send-helpcenter-mail`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const sendNotificationRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`/admin/send-user-notification`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const sendBulkMailApi = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`/admin/sendBulkMail`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const sendBulkNotificationApi = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`/admin/sendBulkNotification`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const updateUserApi = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`/admin/update-user`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const resetUserPassword = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.post(`/admin/reset-user-password`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};
// Export the reducer for use in the Redux store
export default contactSlice.reducer;
