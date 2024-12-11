import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderPopUpFunction, ClearSubscriptionPlan } from '../../Slices/CommonSlice';
import { useLocation, Link, NavLink, useNavigate } from 'react-router-dom';
import { RemoveCartItemApi } from '../../Slices/RemoveCartSlice';
import { toast } from 'react-toastify';
import { Row, Col, Button, Card, CardBody, CardText, CardImg } from 'reactstrap';
import { REACT_API_URL } from '../../../config';
import avatar from '../../assets/images/avtar.png';
import { ClearCartItems, GetCartItemsApi } from '../../Slices/CartSlice';
import { LogoutData } from '../../Slices/LoginSlice';
import '../Cart/Card.css';

const Header = () => {
  const [checkout, setCheckout] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const profileDetails = useSelector((state) => state.loginAction);
  const { isSubcription, cardIdLength, ProfileData } = profileDetails;
  const { CartObj } = useSelector((state) => state.cartItemsAction);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isAuth, setIsAuth] = useState(false);
  const [activeCls, setActiveCls] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    couponCode: '',
    totalCartPrice: '',
    totalPriceAfterDiscount: ''
  });

  useEffect(() => {
    if (CartObj?.cartItems) {
      setCartItems(CartObj.cartItems);
    }
  }, [CartObj]);

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

  const handleQuantityChange = (itemId, delta) => {
    const updatedItems = cartItems.map((item) => (item._id === itemId ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item));
    setCartItems(updatedItems);
  };

  const handleViewClick = () => {
    navigate('/cart');
  };

  const handleRemoveItem = (cartItem) => {
    const data = {
      cart_id: localStorage.getItem('cartid'),
      product_id: cartItem?.product,
      variable_id: cartItem?.productInfo?.variableProducts[0]?._id
    };

    dispatch(RemoveCartItemApi(data)).then((res) => {
      if (res.success) {
        toast.success(res.message);
        fetchCartItems();
      } else {
        toast.error(res.message);
      }
    });
    setCheckout(false);
  };

  useEffect(() => {
    if (cardIdLength !== null) dispatch(GetCartItemsApi(cardIdLength));
    const isTokenExists = localStorage.getItem('userToken');
    if (isTokenExists) {
      setIsAuth(true);
    }
    setActiveCls(false);
  }, [isAuth, currentPath, checkout]);

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

  const handleLogout = async () => {
    const result = window.confirm('Are you sure, you want to logout?');
    if (result) {
      await dispatch(LogoutData());
      await dispatch(ClearCartItems());
      setIsAuth(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('subsciptionPlan');
    dispatch(ClearSubscriptionPlan());
  };

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
          <nav className="main-menu main-menu-with-border white-background">
            <div className="container">
              <div className="d-flex justify-content-between align-items-center">
                <div className="main-menu__logo">
                  <NavLink to={isAuth ? '/landing' : '/'}>
                    <img src="../../assets/images/logo.png" width={96} height={34} alt="nisoz" />
                  </NavLink>
                </div>
                <div className="main-menu__nav">
                  <ul className="main-menu__list">
                    <li className="dropdown">
                      <NavLink to="#">TRACK MY ORDER</NavLink>
                    </li>
                    {isAuth && (
                      <li className="dropdown">
                        <NavLink to="/orders">MY ORDERS</NavLink>
                      </li>
                    )}
                    <li className="dropdown">
                      <NavLink to="/store">BESTTA Merch</NavLink>
                    </li>
                    <li className="dropdown">
                      <a href="https://www.claybourn.com.au" target="_blank">
                        Claybourn
                      </a>
                    </li>
                    <li className="dropdown">
                      <a href="https://claybournmanufacturing.com.au/" target="_blank">
                        Claybourn Manufacturing
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="main-menu__right" style={{ display: 'flex', marginLeft: 0 }}>
                  <NavLink to="#" className="main-menu__toggler mobile-nav__toggler" onClick={() => dispatch(HeaderPopUpFunction(true))}>
                    <i className="fa fa-bars" />
                  </NavLink>
                  <div className="cart-icon-wrapper">
                    <Link to="/cart" className="main-menu__cart cart-toggler">
                      <div className="cart-icon">
                        <i className="icon-shopping-cart" />
                        <span className="main-menu__cart__count">{cartItems.length || 0}</span>
                      </div>
                    </Link>
                    {cartItems.length ? (
                      <Card className="cart-popup">
                        <CardBody>
                          <Row>
                            <Col xs="12" className="text-center">
                              <CardText className="free-shipping-text">You are eligible for free shipping!</CardText>
                            </Col>
                          </Row>
                          <div className="cart-items">
                            {cartItems.map((item) => (
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
                                    <span className="minus" onClick={() => handleQuantityChange(item._id, -1)}>
                                      -
                                    </span>
                                    <span className="quantity">{item?.quantity}</span>
                                    <span className="plus" onClick={() => handleQuantityChange(item._id, 1)}>
                                      +
                                    </span>
                                    <Button close onClick={() => handleRemoveItem(item)} />
                                  </Col>
                                </Row>
                              </div>
                            ))}
                          </div>
                          <Row>
                            <Col xs="6" className="text-center">
                              <Button color="primary" size="sm" onClick={handleViewClick}>
                                VIEW CART
                              </Button>
                            </Col>
                            <Col xs="6" className="text-center">
                              <Button color="success" size="sm" onClick={handlePayments}>
                                CHECKOUT
                              </Button>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    ) : null}
                  </div>
                  {isAuth ? (
                    <>
                      <div className="main-menu__login">
                        <NavLink to="#" onClick={handleLogout}>
                          Logout
                        </NavLink>
                      </div>
                      <div className="main-menu__login">
                        <NavLink to="/profile">
                          <img
                            src={ProfileData?.image ? `${REACT_API_URL}${ProfileData?.image}` : avatar}
                            alt="User Avatar"
                            width={40}
                            height={40}
                          />
                        </NavLink>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="main-menu__login">
                        <NavLink to="/login">Login</NavLink>
                      </div>
                      <div className="main-menu__register">
                        <NavLink to="/register">Register</NavLink>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </header>
      </>
    );
  }

  return (
    <header className="main-header">
      <nav className="main-menu main-menu-with-border white-background">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="main-menu__logo">
              <NavLink to={isAuth ? '/landing' : '/'}>
                <img src="../../assets/images/logo.png" width={96} height={34} alt="nisoz" />
              </NavLink>
            </div>
            <div className="main-menu__nav">
              <ul className="main-menu__list">
                <li className="dropdown">
                  <NavLink to="#">TRACK MY ORDER</NavLink>
                </li>
                {isAuth && (
                  <li className="dropdown">
                    <NavLink to="/orders">MY ORDERS</NavLink>
                  </li>
                )}
                <li className="dropdown">
                  <NavLink to="/store">BESTTA Merch</NavLink>
                </li>
                <li className="dropdown">
                  <a href="https://www.claybourn.com.au" target="_blank">
                    Claybourn
                  </a>
                </li>
                <li className="dropdown">
                  <a href="https://claybournmanufacturing.com.au/" target="_blank">
                    Claybourn Manufacturing
                  </a>
                </li>
              </ul>
            </div>
            <div className="main-menu__right" style={{ display: 'flex', marginLeft: 0 }}>
              <NavLink to="#" className="main-menu__toggler mobile-nav__toggler" onClick={() => dispatch(HeaderPopUpFunction(true))}>
                <i className="fa fa-bars" />
              </NavLink>
              <div className="cart-icon-wrapper">
                <Link to="/cart" className="main-menu__cart cart-toggler">
                  <div className="cart-icon">
                    <i className="icon-shopping-cart" />
                    <span className="main-menu__cart__count">{cartItems.length || 0}</span>
                  </div>
                </Link>
                {cartItems.length ? (
                  <Card className="cart-popup">
                    <CardBody>
                      <Row>
                        <Col xs="12" className="text-center">
                          <CardText className="free-shipping-text">You are eligible for free shipping!</CardText>
                        </Col>
                      </Row>
                      <div className="cart-items">
                        {cartItems.map((item) => (
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
                                <span className="minus" onClick={() => handleQuantityChange(item._id, -1)}>
                                  -
                                </span>
                                <span className="quantity">{item?.quantity}</span>
                                <span className="plus" onClick={() => handleQuantityChange(item._id, 1)}>
                                  +
                                </span>
                                <Button close onClick={() => handleRemoveItem(item)} />
                              </Col>
                            </Row>
                          </div>
                        ))}
                      </div>
                      <Row>
                        <Col xs="6" className="text-center">
                          <Button color="primary" size="sm" onClick={handleViewClick}>
                            VIEW CART
                          </Button>
                        </Col>
                        <Col xs="6" className="text-center">
                          <Button color="success" size="sm" onClick={handlePayments}>
                            CHECKOUT
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                ) : null}
              </div>
              {isAuth ? (
                <>
                  <div className="main-menu__login">
                    <NavLink to="#" onClick={handleLogout}>
                      Logout
                    </NavLink>
                  </div>
                  <div className="main-menu__login">
                    <NavLink to="/profile">
                      <img
                        src={ProfileData?.image ? `${REACT_API_URL}${ProfileData?.image}` : avatar}
                        alt="User Avatar"
                        width={40}
                        height={40}
                      />
                    </NavLink>
                  </div>
                </>
              ) : (
                <>
                  <div className="main-menu__login">
                    <NavLink to="/login">Login</NavLink>
                  </div>
                  <div className="main-menu__register">
                    <NavLink to="/register">Register</NavLink>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
