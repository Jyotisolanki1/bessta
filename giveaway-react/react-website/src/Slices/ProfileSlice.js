import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { REACT_API_URL } from '../../config';

const initialState = {
  loading: true,
  ProfileData: {},
  isSubcription: false,
  helpcenter: {}
};

const ProfileSlice = createSlice({
  name: 'Profile-Action',
  initialState,
  reducers: {
    GetProfile(state, action) {
      state.ProfileData = action.payload;
      state.isSubcription = action.payload?.isSubcription;
      state.loading = false;
    },
    UpdateProfile(state, action) {
      (state.ProfileData = action.payload), (state.loading = false);
    },
    HelpCenter(state, action) {
      (state.helpcenter = action.payload), (state.loading = false);
    }
  }
});

export const { GetProfile, UpdateProfile, HelpCenter } = ProfileSlice.actions;

export default ProfileSlice.reducer;

const token = localStorage.getItem('userToken');

export const GetProfileApi = (usertoken) => async (dispatch) => {
  try {
    const myToken = localStorage.getItem('userToken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${myToken}`
      }
    };

    const response = await axios.get(`${REACT_API_URL}profile`, config);

    if (response.data.success) {
      dispatch(GetProfile(response.data.data));
    }
    return response.data;
  } catch (err) {
    return err;
  }
};

export const UpdateProfileApi = (data, userToken) => async (dispatch) => {
  try {
    const myToken = localStorage.getItem('userToken');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${myToken}`
      }
    };
    const response = await axios.post(REACT_API_URL + 'profile', data, config);

    if (response.data.success) {
      dispatch(GetProfile(response.data.data));
    }
    return response.data;
  } catch (err) {
    return err;
  }
};

export const HelpCenterApi = (data) => async (dispatch) => {
  try {
    const response = await axios.post(REACT_API_URL + 'send-query', data);

    if (response.data.success) {
      dispatch(HelpCenter(response.data.data));
    }
    return response.data;
  } catch (err) {
    return err;
  }
};
