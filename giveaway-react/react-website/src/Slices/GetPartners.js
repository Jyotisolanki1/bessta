import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { REACT_API_URL } from "../../config";

const initialState = {
  loading: true,
  getPartnersList: [],
  getPartnersFilteredList: []
};

const GetPartnerSlice = createSlice({
  name: "GetPartner-Action",
  initialState,
  reducers: {
    GetPartners(state, action) {
      state.getPartnersList = action.payload;
      state.loading = false;
    },
    GetFilterPartners(state, action) {
      state.getPartnersFilteredList = action.payload;
      state.loading = false;
    },
  },
});

export const { GetPartners,GetFilterPartners } = GetPartnerSlice.actions;

export default GetPartnerSlice.reducer;

export const GetPartnersApi = () => async (dispatch) => {
  try {
   
    const res = await axios.get(`${REACT_API_URL}get-partner`);
    if (res.data.success) {
      dispatch(GetPartners(res?.data?.data));
    }
    return res.data;
  } catch (Err) {
    return Err;
  }
};

export const SearchPartnerApi = (search)=> async (dispatch) =>{
 try {
  const res = await axios.get(`${REACT_API_URL}get-partner?type=${search.name}&search=${search.value}`);
  if (res.data.success) {
    dispatch(GetFilterPartners(res?.data?.data));
  }
  return res.data;
 } catch (Err) {
  return Err;
 }
  
  
}
