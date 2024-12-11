import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { REACT_API_URL } from "../../config";
import { blockedUser } from "./LoginSlice";

const initialState = {
  loading: true,
  CoursesCategories: [],
};

const courseCategorySlice = createSlice({
  name: "CourseCategories-Action",
  initialState,
  reducers: {
    GetCoursesCategories(state, action) {
      state.CoursesCategories = action.payload;
      state.loading = false;
    },
  },
});

export const { GetCoursesCategories } = courseCategorySlice.actions;

export default courseCategorySlice.reducer;

export const GetCourseCategoryApi = () => async (dispatch) => {
  const token = localStorage.getItem("userToken");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(`${REACT_API_URL}course-category`, config);
    await dispatch(blockedUser(response))
    if (response.data.success) {
      dispatch(GetCoursesCategories(response.data.data));
    } else {
    }
    return response.data;
  } catch (err) {
    return err;
  }
};
