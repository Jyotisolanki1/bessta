import React from "react";

import Loader from "../../Common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { GetContentsApi } from "../../Slices/StaticContentSlice";
import parse from "html-react-parser";

const TermsAndCondition = () => {
  const { loading, contents } = useSelector(
    (state) => state.staticContentAction
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetContentsApi("Terms and Conditions"));
  }, []);
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="stricky-header stricked-menu main-menu main-menu-with-border">
            <div className="sticky-header__content" />
            {/* /.sticky-header__content */}
          </div>
          {/* /.stricky-header */}
          {/*Main Slider Start*/}
          <section className="page-header">
            <div
              className="page-header__shape3 "
              data-wow-delay="300ms"
              style={{ backgroundPosition: "left top", opacity: "0.9" }}
            />
            {/* /.page-header__shape3 */}
            <div className="container"></div>
            {/* /.container */}
          </section>
          {/* /.page-header */}
          {/*Main Slider End*/}
          <section className="cms mb-5">
            <div className="section-title text-center mb-5">
              <h2 className="cms__title">Terms and Conditions</h2>
            </div>
            <div className="community-text" >
              <p style={{ textAlign: "justify" }}>{parse(contents?.data?.content)}</p>
            </div>
          </section>
          {/*Testimonial Start*/}
          <section className="testimonial-two">
            <div className="testimonial-two__bg" style={{}} />
            <div className="container">
              <div className="testimonial-two__wrapper">
                <div
                  className="testimonial-two__carousel nisoz-owl__carousel owl-theme owl-carousel"
                  data-owl-options='{
              "items": 1,
              "margin": 0,
              "smartSpeed": 700,
              "loop":true,
              "autoplay": true,
              "nav":false,
              "URLhashListener":true,
              "dots":true,
              "navText": ["<span class=\"icon-left-arrow\"></span>","<span class=\"icon-right-arrow\"></span>"]
              }'
                >
                  {/* Testimonial Item */}
                  <div className="item" data-hash="item1">
                    <div className="testimonial-two__item">
                      <div className="testimonial-two__author">
                        <img
                          src="assets/images/resources/testimonial-2-1.jpg"
                          alt="nisoz"
                        />
                        <div className="testimonial-two__icon">
                          <span className="icon-quote" />
                        </div>
                        {/* testimonial-quote-icon */}
                      </div>
                      <div className="testimonial-two__ratings">
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                      </div>
                      {/* testimonial-ratings */}
                      <div className="testimonial-two__quote">
                        This is due to their excellent service, competitive
                        pricing and customer support. It’s through refresing to
                        get such a personal touch.
                      </div>
                      {/* testimonial-quote */}
                      <div className="testimonial-two__meta">
                        <h5 className="testimonial-two__title">
                          aleesha michale
                        </h5>
                        <span className="testimonial-two__designation">
                          ceo &amp; co founder
                        </span>
                      </div>
                      {/* testimonial-meta */}
                    </div>
                  </div>
                  {/* Testimonial Item */}
                  {/* Testimonial Item */}
                  <div className="item" data-hash="item2">
                    <div className="testimonial-two__item">
                      <div className="testimonial-two__author">
                        <img
                          src="assets/images/resources/testimonial-2-2.jpg"
                          alt="nisoz"
                        />
                        <div className="testimonial-two__icon">
                          <span className="icon-quote" />
                        </div>
                        {/* testimonial-quote-icon */}
                      </div>
                      <div className="testimonial-two__ratings">
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                      </div>
                      {/* testimonial-ratings */}
                      <div className="testimonial-two__quote">
                        This is due to their excellent service, competitive
                        pricing and customer support. It’s through refresing to
                        get such a personal touch.
                      </div>
                      {/* testimonial-quote */}
                      <div className="testimonial-two__meta">
                        <h5 className="testimonial-two__title">
                          aleesha michale
                        </h5>
                        <span className="testimonial-two__designation">
                          ceo &amp; co founder
                        </span>
                      </div>
                      {/* testimonial-meta */}
                    </div>
                  </div>
                  {/* Testimonial Item */}
                  {/* Testimonial Item */}
                  <div className="item" data-hash="item3">
                    <div className="testimonial-two__item">
                      <div className="testimonial-two__author">
                        <img
                          src="assets/images/resources/testimonial-2-3.jpg"
                          alt="nisoz"
                        />
                        <div className="testimonial-two__icon">
                          <span className="icon-quote" />
                        </div>
                        {/* testimonial-quote-icon */}
                      </div>
                      <div className="testimonial-two__ratings">
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                      </div>
                      {/* testimonial-ratings */}
                      <div className="testimonial-two__quote">
                        This is due to their excellent service, competitive
                        pricing and customer support. It’s through refresing to
                        get such a personal touch.
                      </div>
                      {/* testimonial-quote */}
                      <div className="testimonial-two__meta">
                        <h5 className="testimonial-two__title">
                          aleesha michale
                        </h5>
                        <span className="testimonial-two__designation">
                          ceo &amp; co founder
                        </span>
                      </div>
                      {/* testimonial-meta */}
                    </div>
                  </div>
                  {/* Testimonial Item */}
                </div>
                {/* Testimonial Thumb */}
             
                {/* Testimonial Thumb */}
              </div>
            </div>
          </section>
          {/*Testimonial End*/}
        </>
      )}
    </div>
  );
};

export default TermsAndCondition;
