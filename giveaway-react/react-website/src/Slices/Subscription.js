import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { REACT_API_URL } from '../../config';
import { blockedUser } from './LoginSlice';

const initialState = {
  isSubscribed: null,
  client_Secret: '',
  checkout_data: '',
  payment_status: ''
};

const SubScriptionSlice = createSlice({
  name: 'SUbscriptionSlice',
  initialState,
  reducers: {
    SubScriptionCheckout(state, action) {
      state.checkout_data = action.payload;
    },
    SubscriptionStatus(state, action) {
      state.isSubscribed = true;
      state.payment_status = true;
    },
    CancelSubscription(state, action) {
      state.isSubscribed = false;
    },
    UpdateSubscription(state, action) {
      state.checkout_data = action.payload;
    }
  }
});

export const { SubScriptionCheckout, SubscriptionStatus, CancelSubscription, UpdateSubscription } = SubScriptionSlice.actions;

export default SubScriptionSlice.reducer;

const token = localStorage.getItem('userToken');

export const SubScriptionCheckoutApi = (data) => async (dispatch) => {
  const checkToken = localStorage.getItem('PaymentUserToken') || localStorage.getItem('userToken');
  const configApi = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${checkToken}`
    }
  };
  try {
    const res = await axios.post(`${REACT_API_URL}subscription-checkout`, data, configApi);
    console.log(res);
    await dispatch(blockedUser(res));
    if (res.data.success) {
      dispatch(SubScriptionCheckout(res.data));
    }
    return res.data;
  } catch (err) {
    return err;
  }
};

export const SubscriptionStatusApi = (data, newToken) => async (dispatch) => {
  const checkToken = localStorage.getItem('PaymentUserToken') || localStorage.getItem('userToken');
  const configApi = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${checkToken}`
    }
  };
  try {
    const res = await axios.post(`${REACT_API_URL}subscription-status`, data, configApi);
    await dispatch(blockedUser(res));
    if (res.data.success) {
      dispatch(SubscriptionStatus(res.data));
    }
    return res.data;
  } catch (err) {
    return err;
  }
};

export const UpdateSubscriptionApi = (data, newToken) => async (dispatch) => {
  const checkToken = localStorage.getItem('PaymentUserToken') || localStorage.getItem('userToken');
  const configApi = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${checkToken}`
    }
  };
  try {
    const res = await axios.post(`${REACT_API_URL}update-subscription`, data, configApi);
    await dispatch(blockedUser(res));
    if (res.data.success) {
      dispatch(UpdateSubscription(res.data));
    }
    return res.data;
  } catch (err) {
    return err;
  }
};

export const CancelSubscriptionApi = (newToken) => async (dispatch) => {
  const checkToken = localStorage.getItem('PaymentUserToken') || localStorage.getItem('userToken');
  const configApi = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${checkToken}`
    }
  };
  try {
    const res = await axios.get(`${REACT_API_URL}cancel-subscription`, configApi);
    await dispatch(blockedUser(res));
    if (res.data.success) {
      dispatch(CancelSubscription(res.data.data));
    }

    return res.data;
  } catch (err) {
    return err;
  }
};
