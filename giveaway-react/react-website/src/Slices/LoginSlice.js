import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch } from 'react-redux'; // Import useDispatch from react-redux
import { REACT_API_URL } from '../../config';
const bool = localStorage.getItem('isAuthenticated');
const token = localStorage.getItem('userToken');
// // console.log("🚀 ~ bool:", bool);
const initialState = {
  userToken: localStorage.getItem('userToken'),
  isAuthenticated: localStorage.getItem('userToken') ? true : false,
  isUserStatus: '',
  loading: true,
  ProfileData: {},
  isSubcription: localStorage.getItem('isSubcription') ? true : false,
  error: null,
  profileLoading: true
};

const PROXY = REACT_API_URL;

const LoginSlice = createSlice({
  name: 'Login-Action',
  initialState,
  reducers: {
    // Use 'reducers' instead of 'reducer'
    Login_Success(state, action) {
      if (action?.payload?.isStatus === 'pending') {
        state.userToken = null;
        state.isAuthenticated = false;
      } else {
        state.userToken = action.payload?.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
      }
    },

    Login_Failed(state) {
      state.userToken = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    User_Details(state, action) {
      // state.isAuthenticated = true;
      localStorage.setItem('isSubcription', action.payload?.isSubcription);
      state.isSubcription = action.payload?.isSubcription;
      state.ProfileData = action.payload;
      state.loading = false;
      state.profileLoading = false;
    },

    // details failed
    User_Details_Failed(state) {
      state.ProfileData = {};
      state.isAuthenticated = false;
      state.isUserStatus = '';
      state.loading = false;
      state.isSubcription = false;
      state.userToken = null;
      state.profileLoading = false;
    },

    SetAuthCartId(state, action) {
      state.cardIdLength = action.payload;
    },

    LogoutData(state) {
      state.userToken = null;
      state.isAuthenticated = false;
      state.isUserStatus = '';
      state.loading = false;
      state.ProfileData = {
        user: null
      };
      state.cardIdLength = null;
      state.isSubcription = false;
      state.error = null;

      localStorage.removeItem('persist:root');
      localStorage.removeItem('userToken');
      localStorage.removeItem('isSubcription');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('subsciptionPlan');
      localStorage.removeItem('cartid');
      localStorage.removeItem('applyToDraw');
      localStorage.removeItem('paymentCheck');
      localStorage.removeItem('PaymentUserToken');
    },

    SetOtpToken(state, action) {
      state.userToken = action.payload;
    }
  }
});

export const { Login_Success, Login_Failed, SetAuthCartId, LogoutData, SetOtpToken, Is_User } = LoginSlice.actions; // Destructure the actions

export default LoginSlice.reducer;

// Asyn thunk creater

export const UserLoginApi = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${PROXY}login`, data);
    if (response.data.success === true) {
      dispatch(Login_Success(response.data.data));
    } else {
      dispatch(Login_Failed()); // Dispatch the failure action
    }
    return response.data;
  } catch (error) {
    dispatch(Login_Failed(error));
    return error;
  }
};

export const GetProfileApi = (usertoken) => async (dispatch, getState) => {
  let myToken = localStorage.getItem('userToken');
  const newAuth = {
    headers: {
      'content-type': 'application/json',
      Authorization: `bearer ${usertoken ? usertoken : myToken}`
    }
  };

  try {
    const state = getState();
    console.log(state.loginAction.isUserStatus);
    if (state.loginAction.isUserStatus === 'blocked') {
      await dispatch(LoginSlice.actions.LogoutData());
    } else {
      const response = await axios.get(`${PROXY}profile`, newAuth);
      await dispatch(blockedUser(response));
      if (response.data.success === true && response?.data?.data?.user?.isStatus === 'active') {
        dispatch(LoginSlice.actions.User_Details(response.data.data));
      } else {
        dispatch(LoginSlice.actions.User_Details_Failed(response.data.data));
        // localStorage.removeItem('persist:root');
        // localStorage.removeItem('userToken');
        // localStorage.removeItem('isAuthenticated');
        // localStorage.removeItem('subsciptionPlan');
        // localStorage.removeItem('cartid');
        // localStorage.removeItem('applyToDraw');
        // dispatch(LogoutData());
      }
      return response.data;
    }
  } catch (error) {
    dispatch(LoginSlice.actions.User_Details_Failed(error));
    // dispatch(LoginSlice.actions.hasError(error));
    return error;
  }
};

export const blockedUser = (response) => async (dispatch) => {
  try {
    if (response.data.success === false && response?.data?.data?.isBlocked === true) {
      localStorage.setItem('userStatus', 'blocked');
      await dispatch(LoginSlice.actions.LogoutData());
      return false;
    }
  } catch (error) {
    console.log('yuuyiuyiuy');
  }
};
