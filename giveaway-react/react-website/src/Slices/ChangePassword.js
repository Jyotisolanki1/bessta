import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { REACT_API_URL } from "../../config";
import { blockedUser } from "./LoginSlice";

const initialState = {
  loading: true,
  ChangePassword: {},
};

const ChangePasswordSlice = createSlice({
  name: "ChangePassword-Action",
  initialState,
  reducers: {
    ChangePassword(state, action) {
      state.ChangePassword = action.payload;
    },
  },
});

export const { ChangePassword } = ChangePasswordSlice.actions;

export default ChangePassword.reducer;

export const ChangePasswordApi = (data) => async (dispatch) => {
  try {
    const token = localStorage.getItem("userToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      `${REACT_API_URL}change-password`,
      data,
      config
    );
    await dispatch(blockedUser(response));
    if (response.data.success) {
      dispatch(ChangePassword(response.data));
    } else {
    }
    return response.data;
  } catch (err) {
    return err;
  }
};
