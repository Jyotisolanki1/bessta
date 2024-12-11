/* eslint-disable no-undef */

/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderPopUpFunction, ClearSubscriptionPlan } from '../../Slices/CommonSlice';
import { useLocation, Link } from 'react-router-dom';
import { RemoveCartItemApi } from '../../Slices/RemoveCartSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Card, CardBody, CardText, CardImg } from 'reactstrap';
import { AddToCartApi } from '../../Slices/AddToCartSlice';
import { getUrl, GetProfileApi } from '../../Slices/GetProfile';

import { NavLink } from 'react-router-dom';
import { REACT_API_URL } from '../../../config';

import { ClearCartItems, GetCartItemsApi } from '../../Slices/CartSlice';
import { LogoutData } from '../../Slices/LoginSlice';
import { StoreStatusAPI } from '../../Slices/StoreSlice';
import '../Cart/Card.css';

const Header = () => {
  const [checkout, setCheckout] = useState(false);

  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const location = useLocation();
  const profileDetails = useSelector((state) => state.loginAction);
  const { cardIdLength, ProfileData } = profileDetails;
  const { CartObj } = useSelector((state) => state.cartItemsAction);
  const { status } = useSelector((state) => state.storeAction);
  const { ProfileData: profileActionData } = useSelector((state) => state.profileAction);

  console.log(ProfileData);

  const navigate = useNavigate();

  const currentPath = location.pathname;

  const [isAuth, setIsAuth] = useState(false);

  const [activeCls, setActiveCls] = useState(false);

  const [billingDetails, setBillingDetails] = useState({
    couponCode: '',
    totalCartPrice: '',
    totalPriceAfterDiscount: ''
  });

  const fetchCartItems = async () => {
    const cartResponse = await dispatch(GetCartItemsApi());

    if (cartResponse.success) {
      setBillingDetails({
        couponCode: cartResponse?.coupons,
        totalCartPrice: cartResponse?.data?.totalCartPrice,
        totalPriceAfterDiscount: cartResponse?.data?.totalPriceAfterDiscount
      });
    }
  };

  useEffect(() => {
    if (CartObj?.cartItems) {
      setData(CartObj);
    }
  }, [CartObj]);

  const handleViewClick = () => {
    navigate('/cart');
  };
  const handleRemoveItem = (cartItem) => {
    const data = {
      cart_id: cartId,
      product_id: cartItem?.product,
      variable_id: cartItem?.productInfo?.variableProducts[0]?._id
    };

    dispatch(RemoveCartItemApi(data)).then((res) => {
      // // console.log("🚀 ~ dispatch ~ res:", res);
      if (res.success) {
        toast.success(res.message);
        fetchCartItems();
      } else {
        toast.error(res.message);
      }
    });
    setCheckout(false);
  };
  const handleClickPayment = async () => {
    const res = await dispatch(getUrl());
    if (res.success === true) {
      window.open(res?.data?.url, '_blank');
    }
  };
  useEffect(() => {
    if (cardIdLength !== null) dispatch(GetCartItemsApi(cardIdLength));
    const isTokenExists = localStorage.getItem('userToken');
    if (isTokenExists) {
      setIsAuth(true);
    }
    setActiveCls(false);
  }, [isAuth, currentPath, checkout, dispatch]);

  const handlePayments = async () => {
    const isTokenExists = localStorage.getItem('userToken');
    const cartResponse = await dispatch(GetCartItemsApi());

    if (cartResponse.success) {
      const hasUnpublishedItem = cartResponse?.data?.cartItems.some((item) => item?.productInfo?.status === 'unpublished');

      if (hasUnpublishedItem) {
        alert('Please remove out of stock items from the cart before proceeding to checkout.');
        return false;
      }
    }
    isTokenExists
      ? navigate('/store-payments', { state: { CartObj, totalPriceAfterDiscount: billingDetails?.totalPriceAfterDiscount } })
      : navigate('/login');
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveCls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeCls]);

  // const fetchCartItems = async () => {
  //   const res = await dispatch(GetCartItemsApi());
  //   // // console.log(res, "lllll");
  // };
  const cartId = localStorage.getItem('cartid');
  // // console.log("🚀 ~ Header ~ cartId:", cartId === cardIdLength, CartObj);

  useEffect(() => {
    fetchCartItems(cardIdLength);
    dispatch(StoreStatusAPI());
    dispatch(GetProfileApi());
  }, [dispatch]);

  useEffect(() => {
    const paymentCheck = localStorage?.getItem('paymentCheck');
    const url = window.location.href;
    if (paymentCheck && url.includes('partner-payments') == false) {
      return navigate('/partner-payments', { state: JSON.parse(paymentCheck) });
    }
    const userPaymentCheck = localStorage?.getItem('userPaymentCheck');
    if (userPaymentCheck && url.includes('plans') == false && url.includes('purchase') == false) {
      return navigate('/plans');
    }
    // if (userPaymentCheck && url.includes('plans') == false) {
    //   return navigate('/plans');
    // }
  }, [location]);

  const handleLogout = async () => {
    const result = window.confirm('Are you sure, you want to logout?');
    if (result) {
      localStorage.removeItem('persist:root');
      localStorage.removeItem('userToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('subsciptionPlan');
      localStorage.removeItem('cartid');
      localStorage.removeItem('applyToDraw');
      localStorage.removeItem('paymentCheck');
      localStorage.removeItem('userPaymentCheck');
      await dispatch(LogoutData());
      await dispatch(ClearCartItems());
      setIsAuth(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('subsciptionPlan');
    dispatch(ClearSubscriptionPlan());
  };
  const incrementQuantity = async (items) => {
    setData((prevData) => {
      const updatedCartItems = prevData?.cartItems.map((item) =>
        item.product === items.product ? { ...item, quantity: item?.quantity + 1 } : item
      );

      return {
        ...prevData,
        cartItems: updatedCartItems
      };
    });

    // Perform the API call after the state update
    const cartDetails = {
      product_id: items?.product,
      variable_id: items.variation,
      quantity: items.quantity + 1 // Incremented quantity
    };

    try {
      const cartId = localStorage?.getItem('cartid');
      if (cartId) {
        cartDetails.cart_id = cartId;
      }
      const res = await dispatch(AddToCartApi(cartDetails));
      dispatch(SetAuthCartId(res?.data?._id));
      if (res.success) {
        dispatch(GetCartItemsApi(res?.data?._id));
        localStorage.setItem('cartid', res.data._id);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const decrementQuantity = async (items) => {
    setData((prevData) => {
      const updatedCartItems = prevData?.cartItems.map((item) =>
        item.product === items.product && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      );

      return {
        ...prevData,
        cartItems: updatedCartItems
      };
    });

    // Perform the API call after the state update
    const cartDetails = {
      product_id: items?.product,
      variable_id: items.variation,
      quantity: items.quantity - 1 // Decremented quantity
    };

    try {
      const cartId = localStorage?.getItem('cartid');
      if (cartId) {
        cartDetails.cart_id = cartId;
      }
      const res = await dispatch(AddToCartApi(cartDetails));
      dispatch(SetAuthCartId(res?.data?._id));
      if (res.success) {
        dispatch(GetCartItemsApi(res?.data?._id));
        localStorage.setItem('cartid', res.data._id);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  // const removeItem = (id) => {
  //   setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  // };

  const storeNav = ['/store', '/cart', '/orders'];

  if (storeNav.includes(currentPath) || currentPath.includes('store')) {
    return (
      <>
        <section className="topbar" style={{ padding: '7px 68px 9px 0px' }}>
          <div className="container-fluid">
            <div className="">
              <span className="top-head">SPEND $99 TO UNLOCK FREE SHIPPING</span>
            </div>
          </div>
        </section>
        <header className="main-header">
          <nav className="main-menu main-menu-with-border white-background" style={{ position: 'fixed', backgroundColor: 'white' }}>
            <div className="container">
              <div className="d-flex justify-content-between align-items-center">
                <div className="main-menu__logo">
                  <NavLink activeClassName="current" to={profileDetails?.isAuthenticated ? '/landing' : '/'}>
                    <img src="../../assets/images/logo.png" width={96} height={34} alt="nisoz" />
                  </NavLink>
                </div>
                {/* /.main-menu__logo */}
                <div className="main-menu__nav">
                  <ul className="main-menu__list">
                    {/* <li className="current megamenu megamenu-clickable megamenu-clickable--toggler"> */}
                    {/* <a href="index.html">Home</a> */}
                    {/* </li> */}
                    <li className="dropdown">
                      <NavLink activeClassName="current" to="#">
                        TRACK MY ORDER
                      </NavLink>
                    </li>
                    {/*  {profileDetails.isAuthenticated && (
                      <li className="dropdown">
                        <NavLink activeClassName="current" to="/orders">
                          MY ORDERS
                        </NavLink>
                      </li>
                    )}{' '} */}
                    {status == 'disable' ? (
                      ''
                    ) : (
                      <li className="dropdown">
                        <NavLink activeClassName="current" to="/store">
                          BESTTA Merch
                        </NavLink>
                        {/* BESTTA Merch */}
                      </li>
                    )}{' '}
                    <li className="dropdown">
                      <a href="https://www.claybourn.com.au" target="_blank">
                        Claybourn
                      </a>
                    </li>{' '}
                    <li className="dropdown">
                      <a href="https://claybournmanufacturing.com.au/" target="_blank">
                        Claybourn Manufacturing
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="main-menu__right" style={{ display: 'flex', marginLeft: 0 }}>
                  <NavLink
                    activeClassName="current"
                    to="#"
                    className="main-menu__toggler mobile-nav__toggler"
                    onClick={() => dispatch(HeaderPopUpFunction(true))}
                  >
                    <i className="fa fa-bars" />
                  </NavLink>
                  {/* /.mobile menu btn */}

                  <div className="cart-icon-wrapper">
                    {status == 'disable' ? (
                      ''
                    ) : (
                      <Link to="/cart" className="main-menu__cart cart-toggler">
                        <div className="cart-icon">
                          <i className="icon-shopping-cart" />
                          <span className="main-menu__cart__count">{CartObj?.cartItems?.length || 0}</span>
                        </div>
                      </Link>
                    )}

                    {CartObj?.cartItems ? (
                      <Card className="cart-popup">
                        <CardBody>
                          <Row>
                            <Col xs="12" className="text-center">
                              <CardText className="free-shipping-text">You are eligible for free shipping!</CardText>
                            </Col>
                          </Row>
                          <div className="cart-items">
                            {data?.cartItems
                              ? data?.cartItems.map((item) => (
                                  <div key={item._id}>
                                    <Row className="align-items-center">
                                      <Col xs="3">
                                        <CardImg
                                          src={`${REACT_API_URL}${item?.productInfo?.images[0]}`}
                                          alt="Product Image"
                                          className="product-image"
                                          style={{ height: '80px', objectFit: 'cover', marginBottom: '10px' }}
                                        />
                                      </Col>
                                      <Col xs="6">
                                        <CardText className="titleText">
                                          {item?.productInfo?.name} / {item?.productInfo?.variableProducts[0]?.attributes[0]?.value}
                                        </CardText>
                                        <CardText>${item?.price}</CardText>
                                      </Col>
                                      <Col xs="3" className="text-right">
                                        <span className="minus" onClick={() => decrementQuantity(item)}>
                                          -
                                        </span>
                                        <span className="quantity">{item?.quantity}</span>
                                        <span className="plus" onClick={() => incrementQuantity(item)}>
                                          +
                                        </span>

                                        <CardText className="remove-text" onClick={() => handleRemoveItem(item)}>
                                          Remove
                                        </CardText>
                                      </Col>
                                    </Row>
                                  </div>
                                ))
                              : ''}
                          </div>
                          <Row className="total-row">
                            <Col xs="6">
                              <CardText className="total">Total</CardText>
                            </Col>
                            <Col xs="6" className="text-right">
                              <CardText className="total-text">$ {billingDetails?.totalPriceAfterDiscount}</CardText>
                            </Col>
                          </Row>
                          <Row className="button-row">
                            <Col xs="6">
                              <Button className="view-cart-btn" onClick={() => handleViewClick()}>
                                View cart
                              </Button>
                            </Col>
                            <Col xs="6" className="text-right">
                              <Button className="checkout-btn" onClick={() => handlePayments()}>
                                Checkout
                              </Button>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    ) : (
                      ''
                    )}
                  </div>

                  {/* /.cart btn */}
                </div>
              </div>
            </div>
            {/* /.container */}
          </nav>
          {/* /.main-menu */}
        </header>

        <section className="page-header merch">
          <div
            className="page-header__shape3"
            data-wow-delay="300ms"
            style={{
              backgroundImage: 'url(assets/images/backgrounds/coverphoto.webp)',
              backgroundPosition: 'left top',
              opacity: 1,
              top: 100,
              backgroundRepeat: 'repeat'
            }}
          />
          {/* /.page-header__shape3 */}
          <div className="container" />
          {/* /.container */}
        </section>
      </>
    );
  } else if (profileDetails?.isAuthenticated) {
    return (
      <header className="main-header">
        <nav className="main-menu main-menu-with-border" style={{ position: 'fixed', backgroundColor: 'white' }}>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div className="main-menu__logo">
                <NavLink to={profileDetails?.isAuthenticated ? '/landing' : '/'}>
                  <img src="../../assets/images/logo.png" width={96} height={34} loading="lazy" />
                </NavLink>
              </div>
              {/* /.main-menu__logo */}
              <div className="main-menu__nav">
                <ul className="main-menu__list">
                  {/* <li className="current megamenu megamenu-clickable megamenu-clickable--toggler"> */}
                  {/* <a href="index.html">Home</a> */}
                  {/* </li> */}
                  <li className="dropdown">
                    <NavLink activeClassName="current" to="/landing">
                     Dashboard
                    </NavLink>
                  </li>
                  <li className="dropdown">
                    <NavLink activeClassName="current" to="/our-partners">
                      Our Partners
                    </NavLink>
                  </li>
                  {ProfileData?.user?.isPartner === 'false' && (
                    <li className="dropdown">
                      <NavLink to="/partner-become" onClick={() => dispatch(HeaderPopUpFunction(false))}>
                        Become A Partner
                      </NavLink>
                    </li>
                  )}
                  <li className="dropdown">
                    <NavLink activeClassName="current" to="/membership">
                      Membership
                    </NavLink>
                  </li>
                  {/* {status == 'disable' ? (
                    ''
                  ) : (
                    <li className="dropdown">
                      <NavLink activeClassName="current" to="/store">
                        Store
                      </NavLink>
                    </li>
                  )} */}{' '}
                  {/* <li className="dropdown"> */}
                  {/* <a href="events.html">Events</a> */}
                  {/* </li> */}
                  {/* <li className="dropdown"> */}
                  {/* <a href="#">Mates Rates Discounts</a> */}
                  {/* </li> */}
                  <li className="dropdown">
                    <NavLink activeClassName="current" to="/upcoming-giveaways">
                      Giveaways <i className="fa-solid fa-angle-down" />
                    </NavLink>

                    <ul>
                      <li>
                        <NavLink activeClassName="current" to="/upcoming-giveaways">
                          Upcoming Giveaways
                        </NavLink>
                      </li>
                      <li>
                        <NavLink activeClassName="current" to="/winners">
                          {' '}
                          Past winners
                        </NavLink>
                      </li>
                      {/* <li>
                        <NavLink to="/winners">Winners</NavLink>
                      </li> */}
                    </ul>
                  </li>
                  <div className="menu__right">
                    <div className="right-sec">
                      <div className="dropdown">
                        <button onClick={() => setActiveCls((prevState) => !prevState)}>
                          <div className="header__user">
                            {ProfileData?.user?.image === '' || !ProfileData?.user?.image ? (
                              <img src="../../assets/images/avtar.png" loading="lazy" className="header__user-avatar" />
                            ) : (
                              <img
                                src={`${REACT_API_URL}${ProfileData?.user?.image}?${Date.now()}`}
                                loading="lazy"
                                className="header__user-avatar"
                              />
                            )}
                            <span className="header__user-name"></span>
                          </div>
                        </button>
                        <ul className={activeCls ? 'active' : ''}>
                          <li>
                            <NavLink activeClassName="current" to="/profile">
                              My Profile
                            </NavLink>
                          </li>
                          <li>
                            <NavLink activeClassName="current" to="/changepassword">
                              Change Password
                            </NavLink>
                          </li>
                          {profileDetails?.ProfileData?.url ? (
                            <li>
                              <p onClick={handleClickPayment}>Payment Method</p>
                            </li>
                          ) : (
                            ''
                          )}

                          <li>
                            <NavLink activeClassName="current" to="/subscription-history">
                              Subscription History
                            </NavLink>
                          </li>

                          <li>
                            <NavLink activeClassName="current" to="/help-center">
                              Help Center
                            </NavLink>
                          </li>
                          <li onClick={handleLogout}>
                            <NavLink activeClassName="current" to="/login">
                              LogOut
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* /.mobile menu btn */}
                  </div>
                </ul>
              </div>
              <div className="main-menu__right">
                <NavLink href="" className="main-menu__toggler mobile-nav__toggler" onClick={() => dispatch(HeaderPopUpFunction(true))}>
                  <i className="fa fa-bars" />
                </NavLink>
                {/* /.mobile menu btn */}
              </div>
            </div>
          </div>
          {/* /.container */}
        </nav>
        {/* /.main-menu */}
      </header>
    );
  } else {
    return (
      <header className="main-header">
        <nav className="main-menu main-menu-with-border" style={{ position: 'fixed', backgroundColor: 'white' }}>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div className="main-menu__logo">
                <NavLink activeClassName="current" to="/">
                  <img src="assets/images/logo.png" width={96} height={34} alt="nisoz" />
                </NavLink>
                {/* <span className="header__user-name">P</span> */}
              </div>
              {/* /.main-menu__logo */}
              <div className="main-menu__nav">
                <ul className="main-menu__list">
                  {/* <li className="current megamenu megamenu-clickable megamenu-clickable--toggler"> */}
                  {/* <a href="/">Home</a> */}
                  {/* </li> */}
                  <li className="dropdown">
                    <NavLink activeClassName="current" to="/our-partner" className="ourpartner"></NavLink>
                  </li>
                  <li className="dropdown">
                    <NavLink activeClassName="current" to="/our-partner" className="ourpartner">
                      Our Partners
                    </NavLink>
                  </li>

                  <li className="dropdown">
                    <NavLink activeClassName="current" to="/upcoming-giveaways">
                      Giveaways <i className="fa-solid fa-angle-down" />
                    </NavLink>
                    <ul>
                      <li>
                        <NavLink activeClassName="current" to="/upcoming-giveaways">
                          Upcoming Giveaways
                        </NavLink>
                      </li>
                      <li>
                        <NavLink activeClassName="current" to="/winners">
                          Past winners
                        </NavLink>
                      </li>
                      {/* <li>
                        <NavLink to="/winners">Winners</NavLink>
                      </li> */}
                    </ul>
                  </li>
                  {/* {status == 'disable' ? (
                    ''
                  ) : (
                    <li className="dropdown">
                      <NavLink activeClassName="current" to="/store">
                        Store
                      </NavLink>
                    </li>
                  )} */}

                  <li className="dropdown">
                    <NavLink activeClassName="current" to="/about-us">
                      About Us
                    </NavLink>
                  </li>

                  <li className="dropdown">
                    <NavLink activeClassName="current" className="signup-btn" to="/plans" onClick={() => handleSignOut()}>
                      Sign Up
                    </NavLink>
                  </li>
                  <li className="dropdown">
                    <NavLink activeClassName="current" className="main-menu__phone" to="/login">
                      <i className="fa-regular fa-user" />
                    </NavLink>
                  </li>
                </ul>
              </div>
              <div className="main-menu__right">
                <NavLink
                  activeClassName="current"
                  to="#"
                  className="main-menu__toggler mobile-nav__toggler"
                  // onClick={() => setOpenPopUp(!openPopUp)}
                  onClick={() => dispatch(HeaderPopUpFunction(true))}
                >
                  <i className="fa fa-bars" />
                </NavLink>
                {/* /.mobile menu btn */}
              </div>
            </div>
          </div>
          {/* /.container */}
        </nav>
        {/* /.main-menu */}
      </header>
    );
  }
};

export default Header;
