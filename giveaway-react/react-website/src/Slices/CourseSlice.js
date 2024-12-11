import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { REACT_API_URL } from '../../config';
import { LogoutData } from './LoginSlice';
const initialState = {
  loading: true,
  Courses: []
};

const courseSlice = createSlice({
  name: 'Course-Action',
  initialState,
  reducers: {
    GetCourses(state, action) {
      state.Courses = action.payload;
      state.loading = false;
    }
  }
});

export const { GetCourses } = courseSlice.actions;

export default courseSlice.reducer;

export const GetCourseApi = () => async (dispatch,getState) => {
  const state = getState();
  console.log(state.loginAction.isUserStatus)
  if(state.loginAction.isUserStatus === "blocked"){
    await dispatch(LogoutData());
  }else{
    const token = localStorage.getItem('userToken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };
  
    try {
      const response = await axios.get(`${REACT_API_URL}course`, config);
      if (response.data.success) {
        dispatch(GetCourses(response.data.data));
      }
      return response.data;
    } catch (err) {
      return err;
    }
  }
  
};
