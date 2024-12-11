import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch } from 'react-redux'; // Import useDispatch from react-redux
import { REACT_API_URL } from '../../config';

const bool = localStorage.getItem('isAuthenticated');
const token = localStorage.getItem('userToken');
// // console.log("🚀 ~ bool:", bool);
const initialState = {
  loading: true,
  ProfileData: {}
};

const PROXY = REACT_API_URL;

const LoginSlice = createSlice({
  name: 'Login-Action',
  initialState,
  reducers: {
    // Use 'reducers' instead of 'reducer'
    Login_Success(state, action) {
      // console.log("action",action)
      state.userToken = action.payload?.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
    },

    Login_Failed(state) {
      state.userToken = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    User_Details(state, action) {
      state.isSubcription = action.payload?.isSubcription;
      state.ProfileData = action.payload;
      state.loading = false;
    },

    // details failed
    User_Details_Failed(state) {
      state.ProfileData = {};
      state.isAuthenticated = false;
      state.loading = false;
      state.isSubcription = false;
      state.userToken = null;
    },

    SetAuthCartId(state, action) {
      state.cardIdLength = action.payload;
    },

    LogoutData(state) {
      state.userToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.ProfileData = {};
      state.cardIdLength = null;
      state.isSubcription = false;
      state.error = null;
    },

    SetOtpToken(state, action) {
      state.userToken = action.payload;
    }
  }
});

export const { Login_Success, Login_Failed, SetAuthCartId, LogoutData, SetOtpToken } = LoginSlice.actions; // Destructure the actions

export default LoginSlice.reducer;

export const GetProfileApi = (usertoken) => async (dispatch) => {
  let myToken = localStorage.getItem('userToken');
  const newAuth = {
    headers: {
      'content-type': 'application/json',
      Authorization: `bearer ${myToken}`
    }
  };

  try {
    const response = await axios.get(`${PROXY}profile`, newAuth);
    if (response.data.success === true) {
      dispatch(LoginSlice.actions.User_Details(response.data.data));
    } else {
      dispatch(LoginSlice.actions.User_Details_Failed(response.data.data));
    }
    return response.data;
  } catch (error) {
    dispatch(LoginSlice.actions.User_Details_Failed(error));
    // dispatch(LoginSlice.actions.hasError(error));
    return error;
  }
};

export const getUrl = (usertoken) => async (dispatch) => {
  let myToken = localStorage.getItem('userToken');
  const newAuth = {
    headers: {
      'content-type': 'application/json',
      Authorization: `bearer ${myToken}`
    }
  };

  try {
    const response = await axios.get(`${PROXY}go-to-stripe`, newAuth);
   
    return response.data;
  } catch (error) {
    dispatch(LoginSlice.actions.User_Details_Failed(error));
    // dispatch(LoginSlice.actions.hasError(error));
    return error;
  }
};
