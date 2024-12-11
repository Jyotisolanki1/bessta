import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { REACT_API_URL } from '../../config';

const initialState = {
  loading: true,
  GetDraws: [],
  GetUpcomingDraws: []
};

const drawSlice = createSlice({
  name: 'Draw-Action',
  initialState,
  reducers: {
    GetDraws(state, action) {
      state.GetDraws = action.payload;
      state.loading = false;
    },
    GetUpcomingDraws(state, action) {
      state.GetUpcomingDraws = action.payload;
      state.loading = false;
    }
  }
});

export const { GetDraws, GetUpcomingDraws } = drawSlice.actions;

export default drawSlice.reducer;

export const GetDrawsApi =
  (path = '') =>
  async (dispatch) => {
    try {
      const token = localStorage.getItem('userToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(`${REACT_API_URL}draw?type=${path}`, config);
      // // console.log(response);
      if (response.data.success) {
        dispatch(GetDraws(response.data.data));
      }
      return response.data;
    } catch (err) {
      return err;
    }
  };

export const GetUpcomingDrawsApi = (path) => async (dispatch) => {
  try {
    const token = localStorage.getItem('userToken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };
    const response = await axios.get(`${REACT_API_URL}draw?type=${path}`, config);
    // // console.log(response);
    if (response.data.success) {
      dispatch(GetUpcomingDraws(response.data.data));
    }
    return response.data;
  } catch (err) {
    return err;
  }
};

export const applyDrawEntriesApi = (data) => async () => {
  try {
    const token = localStorage.getItem('userToken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };
    const response = await axios.post(`${REACT_API_URL}apply-draw-entry`, data, config);
    return response.data;
  } catch (err) {
    return err;
  }
};
