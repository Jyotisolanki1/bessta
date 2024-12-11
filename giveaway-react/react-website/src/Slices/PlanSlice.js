import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { REACT_API_URL } from "../../config";
import { blockedUser } from "./LoginSlice";

const initialState = {
  loading: true,
  planloading: true,
  PlansData: [],
  PlansLevelData: [],
  PlansLevelLoading: true,
  PlanshistoryData: [],
};

const PlanSlice = createSlice({
  name: "Plans-Action",
  initialState,
  reducers: {
    GetPlans(state, action) {
      state.PlansData = action.payload;
      state.loading = false;
    },
    GetPlansLevel(state, action) {
      state.PlansLevelData = action.payload;
      state.PlansLevelLoading = false;
    },
    GetPlansHistory(state, action) {
      state.PlanshistoryData = action.payload;
      state.planloading = false;
    },
  },
});

export const { GetPlans, GetPlansHistory, GetPlansLevel } = PlanSlice.actions;

export default PlanSlice.reducer;

export const GetPlansApi = (path) => async (dispatch) => {
  try {
    const token = localStorage.getItem("userToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${REACT_API_URL}${path}`, config);

    if (response.data.success) {
      dispatch(GetPlans(response.data.data));
    }
    return response.data;
  } catch (err) {
    return err;
  }
};

export const GetPlansLevelApi = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("userToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `${REACT_API_URL}plans?plantype=fixed`,
      config
    );
   
    if (response.data.success) {
      dispatch(GetPlansLevel(response.data.data));
    }
    return response.data;
  } catch (err) {
    return err;
  }
};

export const GetPlansHistoryApi = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("userToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `${REACT_API_URL}subscription-history`,
      config
    );
    await dispatch(blockedUser(response));
    // // console.log("🚀 ~ GetPlansApi ~ response:", response.data.data);
    if (response.data.success) {
      dispatch(GetPlansHistory(response.data.data));
    }
    return response.data;
  } catch (err) {
    return err;
  }
};
