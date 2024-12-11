import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { REACT_API_URL } from "../../config";

const initialState = {
  loading: true,
  contents: {},
};

const StaticContentSlice = createSlice({
  name: "StaticContent-Action",
  initialState,
  reducers: {
    GetPrivacyPolicy(state, action) {
      state.contents = action.payload;
      state.loading = false;
    },
    GetTermsAndConditions(state, action) {
      state.contents = action.payload;
      state.loading = false;
    },
    GetMemberTermsAndCondition(state, action) {
      state.contents = action.payload;
      state.loading = false;
    },

    GetAboutUs(state, action) {
      state.contents = action.payload;
      state.loading = false;
    },
  },
});

export const {
  GetPrivacyPolicy,
  GetMemberTermsAndCondition,
  GetTermsAndConditions,
  GetAboutUs,
} = StaticContentSlice.actions;

export default StaticContentSlice.reducer;

export const GetContentsApi = (path) => async (dispatch) => {
  try {
    const res = await axios.get(
      `${REACT_API_URL}get-static-content?type=${path}`,
      {},
      {}
    );

    if (res.data.success) {
      if (path === "About Us") {
        dispatch(GetAboutUs(res.data));
      }
      if (path === "Terms and Conditions") {
        dispatch(GetTermsAndConditions(res.data));
      }
      if (path === "Privacy Policy") {
        dispatch(GetPrivacyPolicy(res.data));
      }
      if (path === "Member Terms and Condition") {
        dispatch(GetMemberTermsAndCondition(res.data));
      }
      return res.data;
    }
  } catch (err) {
    return err;
  }
};
