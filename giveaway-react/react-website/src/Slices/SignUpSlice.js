import { createSlice } from "@reduxjs/toolkit";

import axios from "axios";

import { REACT_API_URL } from "../../config";

const initialState = {
  loading: true,
  error: null,
  details: {},
};

const SignUpSlice = createSlice({
  name: "SignupAction",
  initialState,
  reducers: {
    SignUp_Success(state, action) {
      state.details = action.payload;
      state.loading = false;
    },
    SignUp_Failed(state) {},
  },
});

export const { SignUp_Success } = SignUpSlice.actions;

export default SignUpSlice.reducer;

export const UserSignUpApi = (data) => async (dispatch) => {
  try {
    const response = await axios.post(REACT_API_URL + "register", data);

    if (response.data.success) {
      dispatch(SignUp_Success(response.data.data));
    } else {
    }
    return response.data;
  } catch (err) {}
};
