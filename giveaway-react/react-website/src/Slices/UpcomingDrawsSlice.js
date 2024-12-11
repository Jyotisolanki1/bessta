import { createSlice } from "@reduxjs/toolkit";

import { REACT_API_URL } from "../../config";

const initialState = {
  loading: true,
  UpcomingDraws: [],
};

const UpcomingDrawsSlice = createSlice({
  name: "UpcomeingEvents-Action",
  initialState,
  reducers: {
    GetUpComingDraws(state, action) {
      state.UpcomingDraws = action.payload;
    },
  },
});

export const { GetUpComingDraws } = UpcomingDrawsSlice.actions;

export default UpcomingDrawsSlice.reducer;

export const GetUpComingDrawsApi = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${REACT_API_URL}draw?type=upcoming`,
      {},
      {}
    );

    if (response.data.success) {
      dispatch(GetUpComingDraws(response.data.data));
    } else {
    }
    return response.data;
  } catch (err) {
    return err;
  }
};
