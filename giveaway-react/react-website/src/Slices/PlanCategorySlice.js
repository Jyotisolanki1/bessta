import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { REACT_API_URL } from "../../config";

const initialState = {
  loading: true,
  PlanCategories: [],
  AllCategories : []
};

const PlanCategorySlice = createSlice({
  name: "PlanCategory-Action",
  initialState,
  reducers: {
    GetPlanCategories(state, action) {
      state.PlanCategories = action.payload;
      state.loading = false;
    },
    GetAllPlanCategories(state, action) {
      state.AllCategories = action.payload;
      state.loading = false;
    },
  },
});

export const { GetPlanCategories,GetAllPlanCategories } = PlanCategorySlice.actions;

export default PlanCategorySlice.reducer;

export const GetPlanCategoriesApi = () => async (dispatch) => {
  try {
    const response = await axios.get(`${REACT_API_URL}plan-category`);

    if (response.data.success) {
      dispatch(GetPlanCategories(response.data.data));
    } 
    return response.data;
  } catch (err) {
    // console.log(err)
  }
};

export const GetAllPlanCategoriesApi = (data) => async (dispatch) => {
  try {
    const response = await axios.get(`${REACT_API_URL}plan-category?type=${data}`);

    if (response.data.success) {
      dispatch(GetAllPlanCategories(response.data.data));
    }
    return response.data;
  } catch (err) {
    // console.log(err)
  }
};