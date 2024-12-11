import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { REACT_API_URL } from "../../config";
import { blockedUser } from './LoginSlice';

const initialState = {
  loading: true,
  PastWinnersData: [],
};

const pastWinnerSlice = createSlice({
  name: "past-winner",
  initialState,
  reducers: {
    PastWinners(state, action) {
      state.PastWinnersData = action.payload;
      state.loading = false;
    },
  },
});

export const {PastWinners} = pastWinnerSlice.actions;

export default pastWinnerSlice.reducer;

export const GetPastWinnersApi = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("userToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${REACT_API_URL}past-winner`,config);
    await dispatch(blockedUser(response));
    if (response.data.success) {
      dispatch(PastWinners(response.data.data));
    }
    return response.data;
  } catch (err) {
    return err
  }
};

// export const GetUpcomingDrawsApi = (path) => async (dispatch) => {
//   try {
//     const token = localStorage.getItem("userToken");
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     const response = await axios.get(`${REACT_API_URL}draw?type=${path}`,config);
//     // // console.log(response);
//     if (response.data.success) {
//       dispatch(GetUpcomingDraws(response.data.data));
//     }
//     return response.data;
//   } catch (err) {
//     return err
//   }
// };
