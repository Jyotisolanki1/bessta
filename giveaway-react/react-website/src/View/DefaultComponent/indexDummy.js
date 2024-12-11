/* eslint-disable no-undef */

import { Suspense, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HeaderPopUpFunction } from '../../Slices/CommonSlice';
import Loader from '../../Common/Loader';
import ProtectedRoute from './ProtectedRoute';
// import Main from "./Main";
import PaymentSuccess from '../PaymentGateway/Success';
import PaymentFailure from '../PaymentGateway/Failure';
import PartnerPayment from '../PartnerPayments/PartnerPayments';
import PartnerSuccess from '../PartnerPayments/PartnerSuccess';
import PartnerFailure from '../PartnerPayments/PartnerFailure';
import StorePayments from '../PaymentGateway/StorePayments';
import Privacy from '../Privacy/Privacy';
import ScrollToTop from './ScrollToTop';

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

const Index = () => {
  const dispatch = useDispatch();
  const { headerPopUp } = useSelector((state) => state.commonAction);
  // // console.log("ðŸš€ ~ Index ~ headerPopUp:", headerPopUp);

  const currentPathName = window.location.pathname;

  const NonHeadArray = [
    // "/signup",
    // "/login",
    // "/sendotp",
    // "/submitotp",
    // "/resetpassword",
  ];

  useEffect(() => {
    let timerId;
    const dynamicCurrentMenuClass = (selector) => {
      let FileName = window.location.href.split('/').reverse()[0];
      selector.find('li').each(function () {
        let anchor = $(this).find('a');
        if ($(anchor).attr('href') == FileName) {
          $(this).addClass('current');
        }
      });

      selector.children('li').each(function () {
        if ($(this).find('.current').length) {
          $(this).addClass('current');
        }
      });

      if ('' == FileName) {
        selector.find('li').eq(0).addClass('current');
      }
    };

    if ($('.main-menu__list').length) {
      let mainNavUL = $('.main-menu__list');
      dynamicCurrentMenuClass(mainNavUL);
    }
    if ($('.services-details__services').length) {
      let mainNavUL = $('.services-details__services');
      dynamicCurrentMenuClass(mainNavUL);
    }

    if ($('.main-menu__nav').length && $('.mobile-nav__container').length) {
      let navContent = document.querySelector('.main-menu__nav').innerHTML;
      let mobileNavContainer = document.querySelector('.mobile-nav__container');
      mobileNavContainer.innerHTML = navContent;
    }
    // if ($(".sticky-header__content").length) {
    //   let navContent = document.querySelector(".main-menu").innerHTML;
    //   let mobileNavContainer = document.querySelector(
    //     ".sticky-header__content"
    //   );
    //   mobileNavContainer.innerHTML = navContent;
    // }

    if ($('.mobile-nav__container .main-menu__list').length) {
      let dropdownAnchor = $('.mobile-nav__container .main-menu__list .dropdown > a');
      dropdownAnchor.each(function () {
        let self = $(this);
        let toggleBtn = document.createElement('BUTTON');
        toggleBtn.setAttribute('aria-label', 'dropdown toggler');
        toggleBtn.innerHTML = "<i class='fa fa-angle-down'></i>";
        self.append(function () {
          return toggleBtn;
        });
        self.find('button').on('click', function (e) {
          e.preventDefault();
          let self = $(this);
          self.toggleClass('expanded');
          self.parent().toggleClass('expanded');
          self.parent().parent().children('ul').slideToggle();
        });
      });
    }

    if ($('.mobile-nav__toggler').length) {
      $('.mobile-nav__toggler').on('click', function (e) {
        e.preventDefault();
        $('.mobile-nav__wrapper').toggleClass('expanded');
        $('body').toggleClass('locked');
      });
    }

    return () => {
      clearInterval(timerId);
    };
  }, []);
  // // console.log("local",localStorage.getItem("persist:root"))
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
              <Route path="/store" element={<StoreComponent />} />
              <Route path="/store/:id" element={<ProductDetails />} />
              {/* <Route path="/stores/:id" element={<ProductNew />} /> */}
              <Route path="/upcoming-giveaways" element={<MemberGiveAway />} />
              <Route path="/upcoming-giveaways/:id" element={<MemberGiveAwayDetail />} />
              {/* Previous Winner - member- draws */}
              <Route path="/winners" element={<MembersDraws />} />
              {/* <Route path="/winners" element={<Winner />} /> */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/store-payments" element={<ProtectedRoute element={StorePayments} />} />
              <Route path="/privacypolicy" element={<Privacy />} />
              <Route path="/termsandcondition" element={<TermsAndCondition />} />
              <Route path="/membertermsandcondition" element={<MemberTermsAndConditions />} />
              {/* <Route path="/privacypolicy" element={<PrivacyPolicy/>} /> */}

              {/* Authenticated Routes */}
              <Route path="/orders" element={<ProtectedRoute element={Orders} />} />
              <Route path="/orders/order-details/:id" element={<ProtectedRoute element={OrdersDetails} />} />
              <Route path="/profile" element={<ProtectedRoute element={GetProfile} />} />
              <Route path="/changepassword" element={<ProtectedRoute element={ChangePassword} />} />
              <Route path="/subscription-history" element={<ProtectedRoute element={SubscriptionHistory} />} />
              <Route path="/landing" element={<ProtectedRoute element={Landing} />} />
              {/* <Route path="/events" element={<Events />} /> */}
              <Route path="/checkout" element={<ProtectedRoute element={Checkout} />} />

              {/* <Route path="/users/*" element={<UserApp />} /> */}
              <Route path="/membership" element={<ProtectedRoute element={MemberShip} />} />
              <Route path="/payments" element={<ProtectedRoute element={PaymentGateway} />} />
              <Route path="/purchase" element={<PaymentGateway />} />
              <Route path="/entryplans" element={<EntryPlans />} />
              <Route path="/success" element={<ProtectedRoute element={PaymentSuccess} />} />
              <Route path="/failure" element={<ProtectedRoute element={PaymentFailure} />} />

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
        </BrowserRouter>
      </div>
      <div className={headerPopUp ? 'mobile-nav__wrapper expanded' : 'mobile-nav__wrapper'}>
        <div className="mobile-nav__overlay mobile-nav__toggler" />
        {/* /.mobile-nav__overlay */}
        <div className="mobile-nav__content">
          <span className="mobile-nav__close mobile-nav__toggler" onClick={() => dispatch(HeaderPopUpFunction(false))}>
            <i className="fa fa-times" />
          </span>
          <div className="logo-box">
            <a href="/" aria-label="logo image">
              <img src="assets/images/logo-white.png" width={96} height={34} alt="nisoz" />
            </a>
          </div>
          {/* /.logo-box */}

          <div className="mobile-nav__container" />
          {/* /.mobile-nav__container */}

          <ul className="mobile-nav__contact list-unstyled">
            <li>
              <i className="fas fa-envelope" />
              <a href="mailto:needhelp@company.com">needhelp@company.com</a>
            </li>
            <li>
              <i className="fa fa-phone-alt" />
              <a href="javascript:void(0)">+92 (3680) - 9850</a>
            </li>
          </ul>
          {/* /.mobile-nav__contact */}
          <div className="mobile-nav__social">
            <a href="https://twitter.com/">
              <i className="fab fa-twitter" />
            </a>
            <a href="https://www.facebook.com/">
              <i className="fab fa-facebook" />
            </a>
            <a href="https://www.pinterest.com/">
              <i className="fab fa-pinterest-p" />
            </a>
            <a href="https://www.instagram.com/">
              <i className="fab fa-instagram" />
            </a>
          </div>
          {/* /.mobile-nav__social */}
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
    </>
  );
};

export default Index;
