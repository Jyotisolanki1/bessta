import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { REACT_API_URL } from '../../config';

const initialState = {
  loading: true,
  Winners: []
};

const WinnerSlice = createSlice({
  name: 'Winners-Action',
  initialState,
  reducers: {
    GetWinners(state, action) {
      state.Winners = action.payload;
    }
  }
});

export const { GetWinners } = WinnerSlice.actions;

export default GetWinners.reducer;

export const GetWinnersApi = () => async (dispatch) => {
  try {
    const response = await axios.get(`${REACT_API_URL}draw?type=old`, {}, {});
    if (response.data.success) {
      dispatch(GetWinners(response.data.data));
    }
    return response.data;
  } catch (err) {
    return err;
  }
};
