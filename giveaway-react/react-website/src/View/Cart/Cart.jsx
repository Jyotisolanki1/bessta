import React,{ useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetCartItemsApi } from "../../Slices/CartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './Card.css'
import { RemoveCartItemApi } from "../../Slices/RemoveCartSlice";
import { ApplyCouponAPi, RemoveCouponApi } from "../../Slices/ApplyCouponSlice";
import { REACT_API_URL } from "../../../config";



const CartComponent = () => {
  const dispatch = useDispatch();
  const [checkout,setCheckout] = useState(false);
  // const [cartItems, setCartItems] = useState([
  //   { id: 1, name: 'Jolly Bistre Jacket', variant: 'Olivewax / XS', price: 1190, quantity: 2 },
  // ]);

  // const incrementQuantity = (id) => {
  //   setCartItems((prevItems) =>
  //     prevItems.map((item) =>
  //       item.id === id ? { ...item, quantity: item.quantity + 1 } : item
  //     )
  //   );
  // };

  // const decrementQuantity = (id) => {
  //   setCartItems((prevItems) =>
  //     prevItems.map((item) =>
  //       item.id === id && item.quantity > 1
  //         ? { ...item, quantity: item.quantity - 1 }
  //         : item
  //     )
  //   );
  // };

  // const removeItem = (id) => {
  //   setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  // };

  // const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

 

  const navigate = useNavigate();
  const { loading, CartObj } = useSelector((state) => state.cartItemsAction);

  // eslint-disable-next-line react/prop-types
  const ManageStock = ({stock,quantity,status}) =>{
   if(stock === 0){
    setCheckout(true)
    return  <p style={{color:"red"}}>Out of stock</p>
   }
   if(status === "unpublished"){
    setCheckout(true)
    return  <p style={{color:"red"}}>Out of stock</p>
   }
   if(stock < quantity){
    setCheckout(true)
    return  <p style={{color:"red"}}>Only {stock} quantity available</p>    
   }
   setCheckout(false)
  }




  const token = localStorage.getItem("userToken");
  const cartId = localStorage.getItem("cartid");


  const [isApplied, setIsApplied] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const [billingDetails, setBillingDetails] = useState({
    couponCode: "",
    totalCartPrice: "",
    totalPriceAfterDiscount: "",
  });

  const fetchCartItems = async () => {
    const cartResponse = await dispatch(GetCartItemsApi());

    if (cartResponse.success) {
      setBillingDetails({
        couponCode: cartResponse?.coupons,
        totalCartPrice: cartResponse?.data?.totalCartPrice,
        totalPriceAfterDiscount: cartResponse?.data?.totalPriceAfterDiscount,
      });
    }
  };

  useEffect(() => {
    fetchCartItems();
    dispatch(RemoveCouponApi({ cart_id: cartId }));
  }, []);

  const handleRemoveItem = (cartItem) => {
    const data = {
      cart_id: cartId,
      product_id: cartItem?.product,
      variable_id: cartItem?.productInfo?.variableProducts[0]._id,
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
    setCheckout(false)
  };

  const onCouponApplied = async (e) => {
    e.preventDefault();

    const data = {
      cart_id: cartId,
      coupon_code: couponCode,
    };
    const res = await dispatch(ApplyCouponAPi(data));
    if (res.success) {
      fetchCartItems();
      toast.success("Coupon Applied Successfully");
      setIsApplied(true);
      setBillingDetails({
        couponCode: res?.data?.coupons,
        totalCartPrice: res?.data?.totalCartPrice,
        totalPriceAfterDiscount: res?.data?.totalPriceAfterDiscount,
      });
    } else {
      toast.error(res.message);
    }
  };

  const onCouponRemoved = async (e) => {
    e.preventDefault();

    const data = {
      cart_id: cartId,
    };

    const couponRemoved = await dispatch(RemoveCouponApi(data));
    if (couponRemoved.success) {
      toast.success(couponRemoved.message);
      setBillingDetails({
        couponCode: couponRemoved?.data?.coupons,
        totalCartPrice: couponRemoved?.data?.totalCartPrice,
        totalPriceAfterDiscount: couponRemoved?.data?.totalPriceAfterDiscount,
      });
      setIsApplied(false);
    } else {
      toast.error(couponRemoved.message);
    }
  };

  const handlePayments = async() => {
    const cartResponse = await dispatch(GetCartItemsApi());

    if (cartResponse.success) {
      const hasUnpublishedItem = cartResponse?.data?.cartItems.some(
        (item) => item?.productInfo?.status === "unpublished"
      );

      if (hasUnpublishedItem) {
        alert("Please remove out of stock items from the cart before proceeding to checkout.");
        return false;
      }
    }
    token
      ? navigate("/store-payments", { state: { CartObj ,totalPriceAfterDiscount:billingDetails?.totalPriceAfterDiscount} })
      : navigate("/login");
  };

  const handleOnChangeApplyCoupon = (e) => {
    setCouponCode(e.target.value);
  };
  // // console.log("🚀 ~ isApplied:", isApplied);

  return (
    <div>
      {/* <div className="stricky-header stricked-menu main-menu main-menu-with-border">
        <div className="sticky-header__content" />
      </div> */}
      {/* <section className="page-header merch">
        <div className="container" />
      </section> */}
      {CartObj?.cartItems?.length > 0 && (
        <section className="cart-page">
          <div className="container mt-5">
            <div className="table-responsive">
              <table className="table cart-page__table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {CartObj?.cartItems?.map((item, index) => (
                    <React.Fragment key={index}>
                    <tr key={index}>
                      <td>
                        <div className="cart-page__table__meta">
                          <div className="cart-page__table__meta-img">
                            <img
                              src={`${REACT_API_URL}${item?.productInfo?.images[0]}`}
                              alt="nisoz"
                            />
                          </div>
                          <h3 className="cart-page__table__meta-title">
                            <a href="">{item?.productInfo?.name}</a>
                          </h3>
                        </div>
                      </td>
                      <td>
                        {
                          item?.productInfo?.variableProducts[0]?.attributes[0]
                            ?.value
                        }
                      </td>
                      <td>$ {item?.productInfo?.variableProducts[0]?.price}</td>
                      <td>{item?.quantity}</td>
                      <td>
                        ${" "}
                        {item?.productInfo?.variableProducts[0]?.price *
                          item?.quantity}
                      </td>
                      <td>
                        <span
                          onClick={() => handleRemoveItem(item)}
                          className="table cart-page__table__remove"
                          style={{ cursor: "pointer" }}
                        >
                          <span className="icon-close" />
                        </span>
                      </td>
                    </tr>
                    <tr>
                     <ManageStock  stock={item.productInfo.variableProducts[0].stock}  quantity= {item?.quantity} status={item?.status}/>
                    </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row">
              <div className="col-xl-8 col-lg-7">
                <form className="cart-page__coupone-form">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="cart-cupon__input"
                    value={couponCode}
                    onChange={handleOnChangeApplyCoupon}
                    disabled={isApplied}
                  />

                  {isApplied ? (
                    <button className="nisoz-btn" onClick={onCouponRemoved}>
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__text">Remove Coupon</span>
                    </button>
                  ) : (
                    <button
                      className="nisoz-btn"
                      onClick={onCouponApplied}
                      disabled={couponCode === "" ? true : false}
                    >
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__text">Apply Coupon</span>
                    </button>
                  )}
                </form>
                {isApplied ? (
                  <span style={{ color: "green" }}>Coupon Applied</span>
                ) : (
                  ""
                )}
              </div>
              <div className="col-xl-4 col-lg-5">
                <ul className="cart-page__cart-total list-unstyled">
                  <li>
                    <span>Subtotal</span>
                    <span className="cart-page__cart-total-amount">
                      $ {billingDetails?.totalCartPrice}
                    </span>
                  </li>
                  <li>
                    <span>Shipping cost</span>
                    <span className="cart-page__cart-total-amount">$ 0.00</span>
                  </li>
                  <li>
                    <span>Discount </span>
                    <span className="cart-page__cart-total-amount">
                      - ${" "}
                      {billingDetails.totalCartPrice -
                        billingDetails.totalPriceAfterDiscount}
                    </span>
                  </li>
                  <li>
                    <span>Total</span>
                    <span className="cart-page__cart-total-amount">
                      $ {billingDetails?.totalPriceAfterDiscount}
                    </span>
                  </li>
                </ul>
              {!checkout? <div className="cart-page__buttons" onClick={handlePayments}>
                <a className="nisoz-btn checkout" >
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__text" style={{curosr:"pointer"}}>checkout</span>
                </a>
              </div>:<div className="cart-page__buttons" onClick={()=>alert("Please remove item from cart")}>
              <a className="nisoz-btn checkout" >
                <span className="nisoz-btn__shape" />
                <span className="nisoz-btn__shape" />
                <span className="nisoz-btn__shape" />
                <span className="nisoz-btn__shape" />
                <span className="nisoz-btn__text" style={{curosr:"pointer"}}>checkout</span>
              </a>
            </div>}
               
              </div>
            </div>
          </div>
        </section>
      )}
      {CartObj?.cartItems?.length === 0 && (
        <div
          style={{
            height: "50vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 style={{ color: "#000", fontSize: "40px", margin: "20px" }}>
            No Items In your cart
          </h1>
        </div>
      )}

    </div>
  );
};

export default CartComponent;
