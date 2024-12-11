import { createSlice } from "@reduxjs/toolkit";
import { REACT_API_URL } from "../../config";
import axios from "axios";

const initialState = {
  loading: true,
  ProductCategories: [],
};

const ProductCategorySlice = createSlice({
  name: "productCategories-Action",
  initialState,
  reducers: {
    GetProductCategories(state, action) {
      state.ProductCategories = action.payload;
      state.loading = false;
    },
  },
});

export const { GetProductCategories } = ProductCategorySlice.actions;

export default ProductCategorySlice.reducer;

export const GetProductCategoriesApi = () => async (dispatch) => {
  try {
    const response = await axios.get(`${REACT_API_URL}category`);
    // // console.log(response, "mcmmcmcm")
    if (response.data.success) {
      dispatch(GetProductCategories(response.data.data));
    }
    return response.data;
  } catch (Err) {
    return Err;
  }
};
