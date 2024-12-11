import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { REACT_API_URL } from "../../config";
import { SetOtpToken } from "./LoginSlice";

const initialState = {};

const verifyOtpSlice = createSlice({
  name: "VerifyOtp-Action",
  initialState,
  reducers: {
    VerifyOtp() { },
  },
});

export const { VerifyOtp } = verifyOtpSlice.actions;

export default verifyOtpSlice.reducer;

export const VerifyOtpApi = (data, config) => async (dispatch) => {
  const Atoken = {
    headers: {
      authorization: `bearer ${config}`,
    },
  };
  try {
    const res = await axios.post(`${REACT_API_URL}verify-otp`, data, Atoken);
    if (res.data.success) {
      dispatch(VerifyOtp());
      dispatch(SetOtpToken(res.data.accessToken))
    }
    return res.data;
  } catch (err) {
    return err;
  }
};
