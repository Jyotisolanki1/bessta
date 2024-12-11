import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { REACT_API_URL } from '../../config';

const initialState = {
  loading: true,
  PartnerData: [],
  category: []
};

const BecomeAPartnerSlice = createSlice({
  name: 'BecomeAPartner-Action',
  initialState,
  reducers: {
    BecomePartner(state, action) {
      state.PartnerData = action.payload;
      state.loading = false;
    },
    GetCat(state, action) {
      state.category = action.payload;
      state.loading = false;
    }
  }
});

export const { BecomePartner, GetCat } = BecomeAPartnerSlice.actions;

export default BecomeAPartnerSlice.reducer;

export const BecomeAPartnerAPiold = (data) => async (dispatch) => {
  try {
    const res = await axios.post(`${REACT_API_URL}add-partner`, data, {});
    if (res.data.success) {
      dispatch(BecomePartner(res));
    }
    return res.data;
  } catch (err) {
    return err;
  }
};
export const BecomeAPartnerAPi = (data) => async (dispatch) => {
  let myToken = localStorage.getItem('userToken');
  const newAuth = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `bearer ${myToken}`
    }
  };
  try {
    const res = await axios.post(`${REACT_API_URL}become-a-partner`, data, newAuth);

    if (res.data.success) {
      dispatch(BecomePartner(res));
    }
    return res.data;
  } catch (err) {
    return err;
  }
};

export const GetCatAPi = () => async (dispatch) => {
  try {
    const res = await axios.get(`${REACT_API_URL}get-business-category`);
    if (res.data.success) {
      dispatch(GetCat(res?.data));
    }
    return res.data;
  } catch (err) {
    return err;
  }
};
