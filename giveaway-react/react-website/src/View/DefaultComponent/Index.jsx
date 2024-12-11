/* eslint-disable no-undef */

import { Suspense, lazy, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import { HeaderPopUpFunction } from '../../Slices/CommonSlice';
import Loader from '../../Common/Loader';
import ProtectedRoute from './ProtectedRoute';
import PaymentSuccess from '../PaymentGateway/Success';
import PaymentFailure from '../PaymentGateway/Failure';
import PartnerPayment from '../PartnerPayments/PartnerPayments';
import PartnerSuccess from '../PartnerPayments/PartnerSuccess';
import PartnerFailure from '../PartnerPayments/PartnerFailure';
import StorePayments from '../PaymentGateway/StorePayments';
import Privacy from '../Privacy/Privacy';
import ScrollToTop from './ScrollToTop';
import { LogoutData } from '../../Slices/LoginSlice';
import { ClearCartItems } from '../../Slices/CartSlice';

// import Footer from "./Footer";

const Header = lazy(() => import('./Header'));
const Plans = lazy(() => import('../Cart/Plans'));
const HelpCenter = lazy(() => import('../../View/Profile/HelpCenter'));
const FAQ = lazy(() => import('./Faq'));
const Footer = lazy(() => import('./Footer'));
const Home = lazy(() => import('../Home/Home'));
const OurPartner = lazy(() => import('../OurPartner/OurPartner'));
const BecomePartner = lazy(() => import('../BecomePartner/BecomePartner'));
const GiveAways = lazy(() => import('../GIveAways/GiveAways'));
const AboutUs = lazy(() => import('../About/AboutUs'));
const StoreComponent = lazy(() => import('../StoreComponent/StoreComponent'));
const MemberGiveAway = lazy(() => import('../MemberGiveAway/MemberGiveAway'));
const MemberGiveAwayDetail = lazy(() => import('../MemberGiveAway/MemberGiveAwayDetails'));
const MembersDraws = lazy(() => import('../MembersDraws/MembersDraws'));
// const Winner = lazy(() => import("./../Winners/Winner"));
const Login = lazy(() => import('../Login&SignUp/Login'));
const SignUp = lazy(() => import('../Login&SignUp/SignUp'));
// const Profile = lazy(() => import("../Profile/Profile"));
const SubscriptionHistory = lazy(() => import('../Profile/SubscriptionHistory'));
const Landing = lazy(() => import('../Landing/Landing'));
// const Events = lazy(() => import("../Events/Events"));
const Checkout = lazy(() => import('../CheckOut/Checkout'));
const ProductDetails = lazy(() => import('../StoreComponent/ProductDetails'));
const Cart = lazy(() => import('../Cart/Cart'));
const Orders = lazy(() => import('../Orders/Orders'));
const OrdersDetails = lazy(() => import('../Orders/OrderDetails'));
const MemberShip = lazy(() => import('../MemberShip/MemberShip'));
const PaymentGateway = lazy(() => import('../PaymentGateway/PaymentGateway'));
const EntryPlans = lazy(() => import('../MemberGiveAway/EntryPlans'));
const SendOtp = lazy(() => import('../ForgetPassword/SendOtp'));
const SubmitOtp = lazy(() => import('../ForgetPassword/SubmitOtp'));
const ResetPassword = lazy(() => import('../ForgetPassword/ResetPassword'));
const TermsAndCondition = lazy(() => import('../TermsAndCondition/TermsAndCondition'));

const MemberTermsAndConditions = lazy(() => import('../MemberTermsAndConditions/MemberTermsAndConditions'));
const UnProtectedRoute = lazy(() => import('./UnprotectedRoute'));
const ChangePassword = lazy(() => import('../Profile/ChangePassword'));
const GetProfile = lazy(() => import('../Profile/GetProfile'));
const PlanPaymentSuccess = lazy(() => import('../PaymentGateway/Plansuccess'));
const Video = lazy(() => import('../Landing/VideoModel'));
const PartnerBecome = lazy(() => import('../Partner/partnerBecome'));

import { getUrl } from '../../Slices/GetProfile';

const Index = () => {
  const dispatch = useDispatch();
  const { headerPopUp } = useSelector((state) => state.commonAction);
  const [isAuth, setIsAuth] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.loginAction);
  const profileDetails = useSelector((state) => state.loginAction);
  const { status } = useSelector((state) => state.storeAction);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isprofiletoggle, setprofileToggle] = useState(false);

  // console.log(isAuthenticated)
  // // console.log("ðŸš€ ~ Index ~ headerPopUp:", headerPopUp);

  const currentPathName = window.location.pathname;

  const NonHeadArray = [
    // "/signup",
    // "/login",
    // "/sendotp",
    // "/submitotp",
    // "/resetpassword",
  ];

  const handleLogout = async () => {
    const result = window.confirm('Are you sure, you want to logout?');
    if (result) {
      localStorage.removeItem('persist:root');
      localStorage.removeItem('userToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('subsciptionPlan');
      localStorage.removeItem('cartid');
      localStorage.removeItem('applyToDraw');
      localStorage.removeItem('applyToDraw');
      await dispatch(LogoutData());
      await dispatch(ClearCartItems());
      setIsAuth(false);
    }
    dispatch(HeaderPopUpFunction(false));
  };

  useEffect(() => {
    const isTokenExists = localStorage.getItem('userToken');
    if (isTokenExists) {
      setIsAuth(true);
    }
  }, [isAuth, currentPathName]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleProfile = () => {
    setprofileToggle(!isprofiletoggle);
  };

  const handleClickPayment = async () => {
    const res = await dispatch(getUrl());
    if (res.success === true) {
      window.open(res?.data?.url, '_blank');
    }
  };
  const storeNav = ['/store', '/cart', '/orders'];
  return (
    <>
      <div className="page-wrapper">
        {/* {isAuth && <Header />} */}

        <BrowserRouter>
          <ScrollToTop />
          {!NonHeadArray.includes(currentPathName) && <Header />}
          <Suspense
            fallback={
              <div>
                <Loader />
              </div>
            }
          >
            <Routes>
              {/* Un Authenticated Routes  */}
              <Route path="/" element={<UnProtectedRoute element={Home} />} />
              <Route path="/our-partner" element={<UnProtectedRoute element={OurPartner} />} />
              <Route path="/become-partner" element={<UnProtectedRoute element={BecomePartner} />} />
              <Route path="/giveaways" element={<GiveAways />} />
              <Route path="/about-us" element={<AboutUs />} />

              <Route path="/store/:id" element={<ProductDetails />} />
              {/* <Route path="/stores/:id" element={<ProductNew />} /> */}
              <Route path="/upcoming-giveaways" element={<MemberGiveAway />} />
              <Route path="/upcoming-giveaways/:id" element={<MemberGiveAwayDetail />} />
              {/* Previous Winner - member- draws */}
              <Route path="/winners" element={<MembersDraws />} />
              {/* <Route path="/winners" element={<Winner />} /> */}
              <Route path="/cart" element={<Cart />} />
              {!(status === 'disable') && <Route path="/store" element={<StoreComponent />} />}
              <Route path="/store-payments" element={<ProtectedRoute element={StorePayments} />} />
              <Route path="/privacypolicy" element={<Privacy />} />
              <Route path="/termsandcondition" element={<TermsAndCondition />} />
              <Route path="/membertermsandcondition" element={<MemberTermsAndConditions />} />
              {/* <Route path="/privacypolicy" element={<PrivacyPolicy/>} /> */}

              {/* Authenticated Routes */}
              <Route path="/orders" element={<ProtectedRoute element={Orders} />} />
              <Route path="/orders/order-details/:id" element={<ProtectedRoute element={OrdersDetails} />} />
              <Route path="/our-partners" element={<ProtectedRoute element={OurPartner} />} />
              <Route path="/profile" element={<ProtectedRoute element={GetProfile} />} />
              <Route path="/changepassword" element={<ProtectedRoute element={ChangePassword} />} />
              <Route path="/subscription-history" element={<ProtectedRoute element={SubscriptionHistory} />} />
              <Route path="/landing" element={<ProtectedRoute element={Landing} />} />

              <Route path="/video" element={<ProtectedRoute element={Video} />} />
              {/* <Route path="/events" element={<Events />} /> */}
              <Route path="/checkout" element={<ProtectedRoute element={Checkout} />} />

              {/* <Route path="/users/*" element={<UserApp />} /> */}
              <Route path="/membership" element={<ProtectedRoute element={MemberShip} />} />
              <Route path="/payments" element={<ProtectedRoute element={PaymentGateway} />} />
              <Route path="/partner-become" element={<ProtectedRoute element={PartnerBecome} />} />
              <Route path="/purchase" element={<PaymentGateway />} />
              <Route path="/entryplans" element={<EntryPlans />} />
              <Route path="/success" element={<ProtectedRoute element={PaymentSuccess} />} />
              <Route path="/failure" element={<ProtectedRoute element={PaymentFailure} />} />
              <Route path="/plan-success" element={<ProtectedRoute element={PlanPaymentSuccess} />} />

              {/* Auth Routes  */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/sendotp" element={<SendOtp />} />
              <Route path="/submitotp" element={<SubmitOtp />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
              {/* Partner Payment Status */}

              <Route path="/partner-payments" element={<PartnerPayment />} />
              <Route path="/partner-success" element={<PartnerSuccess />} />
              <Route path="/partner-failure" element={<PartnerFailure />} />

              {/*others*/}
              <Route path="/plans" element={<Plans />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/help-center" element={<HelpCenter />} />
            </Routes>
          </Suspense>
          {!NonHeadArray.includes(currentPathName) && <Footer />}

          <div className={headerPopUp ? 'mobile-nav__wrapper expanded' : 'mobile-nav__wrapper'}>
            <div className="mobile-nav__overlay mobile-nav__toggler" />
            {/* /.mobile-nav__overlay */}
            <div className="mobile-nav__content">
              <span className="mobile-nav__close mobile-nav__toggler" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                <i className="fa fa-times" />
              </span>
              <div className="logo-box">
                <NavLink to="/" aria-label="logo image" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                  <img src="assets/images/logo-white.png" width={96} height={34} alt="nisoz" />
                </NavLink>
              </div>
              {/* /.logo-box */}

              <div className="mobile-nav__container" />
              {storeNav.includes(currentPathName) || currentPathName.includes('store') ? (
                <ul className="main-menu__list">
                  <li>
                    <NavLink onClick={() => dispatch(HeaderPopUpFunction(false))}>track my ordes</NavLink>
                  </li>
                  <li>
                    <NavLink to="/store" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                      bestta merch
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="https://claybournmanufacturing.com.au/" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                      claybourn
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="https://claybournmanufacturing.com.au/" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                      claybourn Manufacturing
                    </NavLink>
                  </li>
                </ul>
              ) : isAuthenticated ? (
                <ul className="main-menu__list">
                  <li>
                    <NavLink activeClassName="current" to="/landing" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/our-partners" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                      Our Partners
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/partner-become" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                      Become A Partner
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/membership" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                      Mambership
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-toggle" onClick={toggleDropdown}>
                      GiveAways
                    </NavLink>
                    {isDropdownOpen && (
                      <>
                        <li style={{ marginLeft: '5%' }}>
                          <NavLink to="/upcoming-giveaways" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                            Upcoming giveaways
                          </NavLink>
                        </li>
                        <li style={{ marginLeft: '5%' }}>
                          <NavLink to="/winners" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                            Past winners
                          </NavLink>
                        </li>
                      </>
                    )}
                  </li>
                  <li>
                    <NavLink className="dropdown-toggle" onClick={toggleProfile}>
                      Profile
                    </NavLink>
                    {isprofiletoggle && (
                      <>
                        <li style={{ marginLeft: '5%' }}>
                          <NavLink to="/profile" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                            My Profile
                          </NavLink>
                        </li>
                        <li style={{ marginLeft: '5%' }}>
                          <NavLink to="/changepassword" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                            Change Password
                          </NavLink>
                        </li>
                        {profileDetails?.ProfileData?.url ? (
                          <li style={{ marginLeft: '5%' }}>
                            <NavLink onClick={handleClickPayment}>Payment Method</NavLink>
                          </li>
                        ) : (
                          ''
                        )}
                        <li style={{ marginLeft: '5%' }}>
                          <NavLink to="/subscription-history" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                            Subscription History
                          </NavLink>
                        </li>
                        <li style={{ marginLeft: '5%' }}>
                          <NavLink to="/help-center" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                            Help Center
                          </NavLink>
                        </li>
                      </>
                    )}
                  </li>
                  <li onClick={handleLogout}>
                    <NavLink>Logout</NavLink>
                  </li>
                  {/* Add more NavLink components for other routes */}
                </ul>
              ) : (
                <ul className="main-menu__list">
                  <li>
                    <NavLink to="/our-partner" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                      Our Partners
                    </NavLink>
                  </li>

                  <li>
                    <NavLink className="dropdown-toggle" onClick={toggleDropdown}>
                      GiveAways
                    </NavLink>
                    {isDropdownOpen && (
                      <>
                        <li style={{ marginLeft: '5%' }}>
                          <NavLink to="/upcoming-giveaways" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                            Upcoming giveaways
                          </NavLink>
                        </li>
                        <li style={{ marginLeft: '5%' }}>
                          <NavLink to="/winners" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                            Past winners
                          </NavLink>
                        </li>
                      </>
                    )}
                  </li>

                  <li>
                    <NavLink to="/about-us" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                      About us
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/plans" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                      Sign up
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/login" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                      Login
                    </NavLink>
                  </li>
                  {/* Add more NavLink components for other routes */}
                </ul>
              )}
              {/* /.mobile-nav__container */}
              <ul className="mobile-nav__contact list-unstyled">
                <li>
                  <i className="fas fa-envelope" />
                  <a href="mailto:support@bestta.com.au">support@bestta.com.au</a>
                </li>
                <li>
                  <i className="fa fa-phone-alt" />
                  <a href="javascript:void(0)">(+61 7) 3373 9888</a>
                </li>
                <li>
                  <i className="fa-solid fa-location-dot" style={{ width: '44px' }} />
                  <div className="main-footer__about main-footer__navmenu ">
                    <p className="main-footer__about__text">Pacific Centre</p>
                    <p className="main-footer__about__text">
                      Block A, Level 1,
                      <br /> Suite 18, 223 Calam rd, <br /> Sunnybank Hills
                    </p>
                    <p> Qld 4019, Australia</p>
                  </div>
                </li>
              </ul>

              {/* /.mobile-nav__contact */}
              <div className="mobile_main-footer__social">
                <a target="_blank" to="https://www.facebook.com/people/Bestta-Investors-Club/61557651255361/">
                  <i className="fab fa-facebook" />
                </a>{' '}
                <a href="https://www.pinterest.com/">
                  <i className="fab fa-pinterest" />
                </a>
                <a href="https://www.snapchat.com/">
                  <i className="fab fa-snapchat" />
                </a>
                <a href="https://www.instagram.com/">
                  <i className="fab fa-instagram" />
                </a>
                <a href="https://www.youtube.com/">
                  <i className="fa-brands fa-youtube"></i>
                </a>
                <a href="https://www.tiktok.com/">
                  <i className="fa-brands fa-tiktok"></i>
                </a>
                <a href="https://www.linkedin.com/">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
                <a href="https://x.com/">
                  <i className="fa-brands fa-x-twitter" />
                </a>
              </div>
            </div>
            {/* /.mobile-nav__content */}
          </div>
          {/* /.mobile-nav__wrapper */}
          <div className="search-popup">
            <div className="search-popup__overlay search-toggler" />
            {/* /.search-popup__overlay */}
            <div className="search-popup__content">
              <form role="search" method="get" className="search-popup__form" action="#">
                <input type="text" id="search" placeholder="Search Here..." />
                <button type="submit" aria-label="search submit" className="nisoz-btn">
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__text">
                    <i className="icon-magnifying-glass" />
                  </span>
                </button>
              </form>
            </div>
            {/* /.search-popup__content */}
          </div>

          <a href="#" className="scroll-top">
            <svg className="scroll-top__circle" width="100%" height="100%" viewBox="-1 -1 102 102">
              <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
            </svg>
          </a>
        </BrowserRouter>
      </div>
    </>
  );
};

export default Index;
