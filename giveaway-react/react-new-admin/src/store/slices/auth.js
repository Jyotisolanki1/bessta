/* eslint-disable dot-notation */
/* eslint-disable no-undef */
// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';
import { configHeader, imgPath, configHeaderAppJson } from 'config';

// ----------------------------------------------------------------------

const initialState = {
  error: null,
  token: '',
  role: '',
  name: typeof window !== 'undefined' && localStorage.getItem('name') !== null ? localStorage.getItem('name') : '',
  profile: typeof window !== 'undefined' && localStorage.getItem('profile') !== null ? localStorage.getItem('profile') : '',
  isLoggedIn: false
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },
    // Login
    SigninSuccess(state, action) {
      console.log(action.payload);
      // state.token = action.payload.token;
      state.token = action?.payload?.data?.token?.accessToken;
      state.role = action?.payload?.data?.user_type;
      state.name = action?.payload?.data?.name;
      state.profile = `${imgPath}${action?.payload?.data?.profile_pic}`;
      state.isLoggedIn = true;
    },

    dataRefiel(state, action) {
      state.name = action?.payload?.ResponseBody?.name;
      state.profile = `${imgPath}${action?.payload?.ResponseBody?.profile_pic}`;
      state.isLoggedIn = true;
    },

    dataRefielCompany(state, action) {
      state.name = action?.payload?.ResponseBody?.name;
      state.profile = `${imgPath}${action?.payload?.ResponseBody?.logo}`;
      state.isLoggedIn = true;
    },

    LogoutSuccess(state) {
      state.token = '';
      state.role = '';
      state.name = '';
      state.profile = '';
      state.isLoggedIn = false;
    },

    AuthSuccess(state, action) {
      state.token = '';
      state.role = '';
      state.name = '';
      state.profile = '';
      state.isLoggedIn = false;
    }
  }
});

// Reducer
// export default slice.reducer;

export default slice.reducer;

export const { LogoutSuccess, AuthSuccess } = slice.actions;
export function verifyAcount(email, password) {
  return async () => {
    try {
      configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
      const response = await axios.post(`admin/verifyadmin`, { email, password }, configHeaderAppJson);
      // if (response?.data?.success === true) {
      //   dispatch(slice.actions.SigninSuccess(response?.data));
      // }
      return response?.data;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}
export function resendOtpApi() {
  return async () => {
    try {
      const configHeaderAppJson = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Temptoken')}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get(`admin/resend-otp`, configHeaderAppJson);
      // if (response?.data?.success === true) {
      //   dispatch(slice.actions.SigninSuccess(response?.data));
      // }
      return response?.data;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}
export function verifyOtpApi(data, token) {
  return async (dispatch) => {
    // Ensure you have `dispatch` passed in here.
    try {
      const configHeaderAppJson = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Temptoken')}`,
          'Content-Type': 'application/json'
        }
      };

      // Sending the email and token in the request body
      const response = await axios.post(
        'admin/verify-otp',
        { data, token }, // body payload
        configHeaderAppJson // headers configuration
      );

      if (response?.data?.success === true) {
        dispatch(slice.actions.SigninSuccess(response?.data));
      }

      return response?.data;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

export function signin(email, password) {
  return async () => {
    try {
      configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
      const response = await axios.post(`admin/login`, { email, password }, configHeaderAppJson);
      if (response?.data?.success === true) {
        dispatch(slice.actions.SigninSuccess(response?.data));
      }
      return response?.data;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}
// export const resetPasswordLink = (email) => async (dispatch) => {
//   try {
//     configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
//     const response = await axios.post('admin/forgot_password', { email }, configHeaderAppJson);
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// };
export const resetPasswordLink = (email) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/forgot-password', { email }, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const resetPassword = (email) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    configHeaderAppJson.headers.Authorization = `Bearer ${localStorage.getItem('Temptoken')}`;
    const response = await axios.post(`admin/reset-password`, email, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const changePassword = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post(`admin/change-password`, data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const changePasswordCompany = (oldPassword, newPassword) => async (dispatch) => {
  try {
    configHeaderAppJson.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post(`company/change_password`, { oldPassword, newPassword }, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getProfile = () => async (dispatch) => {
  try {
    configHeaderAppJson.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.get(`admin/get_profile`, configHeaderAppJson);
    dispatch(slice.actions.dataRefiel(response.data));
    return response.data;
  } catch (error) {
    return error;
  }
};
export const updateProfile = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeader.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/update_admin', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getProfileCompany = () => async (dispatch) => {
  try {
    configHeaderAppJson.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    const response = await axios.get(`company/get_company_profile`, configHeaderAppJson);
    configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(slice.actions.dataRefielCompany(response?.data));
    return response.data;
  } catch (error) {
    return error;
  }
};
export const updateProfileCompany = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    configHeader.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('company/update_company_profile', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};
// export function authCheck(token) {
//   return async () => {
//     try {
//       // const response = await axios.post(`${process.env.API_PATH}/user/auth`, { email, password });
//       dispatch(slice.actions.AuthSuccess('shivi'));
//     } catch (error) {
//       dispatch(slice.actions.AuthSuccess('shivi'));
//       // dispatch(slice.actions.hasError(error));
//     }
//   };
// }
