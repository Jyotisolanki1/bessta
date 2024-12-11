import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { loading, CartObj } = useSelector((state) => state.cartItemsAction);

  return (
    <>
      <div className="stricky-header stricked-menu main-menu main-menu-with-border">
        <div className="sticky-header__content" />
        {/* /.sticky-header__content */}
      </div>
      {/* /.stricky-header */}
      {/*Main Slider Start*/}
      <section className="page-header merch">
        <div
          className="page-header__shape3"
          data-wow-delay="300ms"
          style={{
            backgroundImage: "url(assets/images/backgrounds/coverphoto.webp)",
            backgroundPosition: "center",
            opacity: 1,
            top: 112,
            backgroundRepeat: "repeat",
          }}
        />
        {/* /.page-header__shape3 */}
        <div className="container" />
        {/* /.container */}
      </section>
      {/* /.page-header */}
      {/*Main Slider End*/}
      <section className="checkout-page">
        <div className="container mt-5">
          <div className="row pt-5">
            <div className="col-xl-6 col-lg-6">
              <div className="checkout-page__billing-address">
                <h2 className="checkout-page__billing-address__title">
                  Shipping details
                </h2>
                <form
                  className="checkout-page__form"
                  style={{ marginTop: "50px" }}
                >
                  <div className="row"></div>

                  <div className="row">
                    <div className="col-xl-12">
                      <div className="checkout-page__input-box">
                        <input
                          type="text"
                          name="Address"
                          defaultValue=""
                          placeholder="Shipping Address"
                        />
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className="checkout-page__input-box">
                        <input
                          type="text"
                          name="company_name"
                          defaultValue=""
                          placeholder="City"
                        />
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className="checkout-page__input-box">
                        <input
                          type="text"
                          name="company_name"
                          defaultValue=""
                          placeholder="State"
                        />
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className="checkout-page__input-box">
                        <input
                          type="text"
                          name="company_name"
                          defaultValue=""
                          placeholder="Zip Code"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="checkout-page__your-order">
                <h2 className="checkout-page__your-order__title">Your order</h2>
                <table className="checkout-page__order-table">
                  <thead className="order_table_head">
                    <tr>
                      <th>Product</th>
                      <th className="right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="pro__title">Product Name</td>
                      <td className="pro__price">$10.99 USD</td>
                    </tr>
                    <tr>
                      <td className="pro__title">Subtotal</td>
                      <td className="pro__price">$10.99 USD</td>
                    </tr>
                    <tr>
                      <td className="pro__title">Shipping</td>
                      <td className="pro__price">$0.00 USD</td>
                    </tr>
                    <tr>
                      <td className="pro__title">Total</td>
                      <td className="pro__price">$20.98 USD</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-right d-flex justify-content-end mt-4">
                  <a href="checkout.html" className="nisoz-btn">
                    <span className="nisoz-btn__shape" />
                    <span className="nisoz-btn__shape" />
                    <span className="nisoz-btn__shape" />
                    <span className="nisoz-btn__shape" />
                    <span className="nisoz-btn__text">Place your Order</span>
                  </a>
                </div>
                {/* /.text-right */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
