import axiosServices from "./src/Helper/axios";

// export const REACT_API_URL = "https://52.22.241.165:10010/";
export const REACT_API_URL = "https://indoredev.webmobrildemo.com:10010/";
export const STRIPE_KEY =
  "";

export const setAuthSession = (serviceToken) => {
  const auth = localStorage.getItem("userToken");
  if (serviceToken) {
    axiosServices.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    axiosServices.defaults.headers.common.Authorization = `Bearer ${auth}`;
    // localStorage.removeItem('serviceToken');
    // delete axios.defaults.headers.common.Authorization;
  }
};
