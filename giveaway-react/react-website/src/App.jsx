/* eslint-disable no-unused-vars */
// import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css';
import Index from './View/DefaultComponent/Index';
// import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'swiper/css';
import 'react-loading-skeleton/dist/skeleton.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetProfileApi, LogoutData } from './Slices/LoginSlice';
import { StoreStatusAPI } from './Slices/StoreSlice';
import { setAuthSession } from '../config';
import { toast } from 'react-toastify';


function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const dispatch = useDispatch();

  const newRole = localStorage.getItem('userToken');
  const { userToken, adminRole, isUserStatus } = useSelector((state) => state.loginAction);

  // sx={{ '& > *': { borderBottom: 'unset' } }}
  useEffect(() => {
    setAuthSession(userToken);
 
 
    // dispatch(GetProfileApi(userToken)).then((res) => {
    //   console.log(res);

    //   if (res?.data?.user?.isStatus === 'blocked') {
    //     toast.success('Blocked');
    //     setTimeout(() => {
    //       localStorage.removeItem('persist:root');
    //       localStorage.removeItem('userToken');
    //       localStorage.removeItem('isAuthenticated');
    //       localStorage.removeItem('subsciptionPlan');
    //       localStorage.removeItem('cartid');
    //       localStorage.removeItem('applyToDraw');
    //       dispatch(LogoutData());
    //     }, 2000);
    //   }
    // });
    dispatch(StoreStatusAPI());
  }, [isUserStatus,dispatch]);


  // useEffect(() => {
  //   if (isUserStatus === 'blocked') {
  //     dispatch(LogoutData());
  //   }
  // }, [isUserStatus]);

  //handling internet status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(true);
    const handleOfflineStatus = () => setIsOnline(false);

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  });

  useEffect(() => {
    if (!isOnline) {
      toast.error('No Internet connection try again later', {
        autoClose: false,
        draggable: true,
        theme: 'dark',
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        position: 'bottom-center'
      });
    } else {
      toast.dismiss(); // Dismiss any existing toast messages when the internet connection is restored
    }
  }, [isOnline]);

  return (
    <>
      <ToastContainer
        position="top-right"
        style={{ zIndex: 1999 }}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <Index />
    </>
  );
}

export default App;
