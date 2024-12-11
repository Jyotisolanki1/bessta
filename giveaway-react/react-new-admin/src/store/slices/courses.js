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
  courseData: [],
  categoryData: [],
  catloading: false,
  //  totalPages: 0,
  loading: false,
  error: null
};

// Create a slice of the Redux store
const contactSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.catloading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.courseData = action?.payload?.data?.courseList;
      state.totalPages = action?.payload?.data?.totalPages;
    },
    requestSuccessCategory(state, action) {
      state.catloading = false;
      state.categoryData = action?.payload?.data?.planList;
      // state.totalPages = action?.payload?.data?.total;
    },
    requestFailure(state, action) {
      state.loading = false;
      state.catloading = false;
      state.error = action.payload;
    }
  }
});

// Export the actions
export const { requestStart, requestSuccess, requestSuccessCategory, requestFailure } = contactSlice.actions;

export const getCategories = (search) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(`admin/course-category?search=${search}`, configHeaderAppJson);
    dispatch(requestSuccessCategory(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

export const addCategoryRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/course-category', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateCategoryRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/update-course-category', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const addCourseRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/add-course', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateCourseRequest = (data) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/update-course', data, configHeaderAppJson);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const courseImages = (data) => async (dispatch) => {
  try {
    configHeader.headers['Content-Type'] = 'multipart/form-data';
    configHeader.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeader.headers['Accept-Language'] = localStorage.getItem('language');
    const response = await axios.post('admin/upload-image', data, configHeader);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getCourses = (search, searchCategory, page, limit) => async (dispatch) => {
  try {
    configHeaderAppJson.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    // configHeaderAppJson.headers['Accept-Language'] = localStorage.getItem('language');
    dispatch(requestStart());
    const response = await axios.get(
      `admin/course?page=${page}&record=${limit}&search=${search}&category=${searchCategory}`,
      configHeaderAppJson
    );
    dispatch(requestSuccess(response.data));
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};
// eslint-disable-next-line consistent-return
export const deleteCourse = (id) => async (dispatch) => {
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
    const response = await axios.delete(`admin/delete-course/${id.id}`, configHeaderAppJson);
    // Send id as an object { id: id }
    return response.data;
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

// eslint-disable-next-line consistent-return
export const deleteCourseCategory = (id) => async (dispatch) => {
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
    const response = await axios.delete(`admin/delete-course-category/${id}`, configHeaderAppJson);
    // Send id as an object { id: id }
    return response.data;
  } catch (error) {
    dispatch(requestFailure(error.message));
  }
};

// Export the reducer for use in the Redux store
export default contactSlice.reducer;
