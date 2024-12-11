import React from "react";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetContentsApi } from "../../Slices/StaticContentSlice";
import parse from "html-react-parser";

import Loader from "../../Common/Loader";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const { loading, contents } = useSelector(
    (state) => state.staticContentAction
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetContentsApi("About Us"));
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
              <h2 className="cms__title">About</h2>
            </div>
            <div className="community-text" style={{ textAlign: "justify" }}>
              <p>{parse(contents?.data?.content)}</p>
              <ul>
                <li>
                  <a
                    href="https://bestta-group.com.au"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="color-list"
                  >
                    BESTTA Group
                  </a>
                </li>
                <li>
                  <Link to="/faq" className="color-list">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/termsandcondition" className="color-list">
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacypolicy" className="color-list">
                    Privacy Policy
                  </Link>
                </li>
                {/* <li>
                  <Link to="/contact">Contact</Link>
                </li> */}
              </ul>
            </div>
          </section>

          {/*Testimonial Start*/}
          {/* <section className="testimonial-two">
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
                      </div>
                      <div className="testimonial-two__ratings">
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                      </div>
                    </div>
                  </div>
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
                      </div>
                      <div className="testimonial-two__ratings">
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                      </div>
                      <div className="testimonial-two__quote">
                        This is due to their excellent service, competitive
                        pricing and customer support. It’s through refresing to
                        get such a personal touch.
                      </div>
                      <div className="testimonial-two__meta">
                        <h5 className="testimonial-two__title">
                          aleesha michale
                        </h5>
                        <span className="testimonial-two__designation">
                          ceo &amp; co founder
                        </span>
                      </div>
                    </div>
                  </div>
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
                      </div>
                      <div className="testimonial-two__ratings">
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                      </div>
                      <div className="testimonial-two__quote">
                        This is due to their excellent service, competitive
                        pricing and customer support. It’s through refresing to
                        get such a personal touch.
                      </div>
                      <div className="testimonial-two__meta">
                        <h5 className="testimonial-two__title">
                          aleesha michale
                        </h5>
                        <span className="testimonial-two__designation">
                          ceo &amp; co founder
                        </span>
                      </div>
                      
                    </div>
                  </div>
                </div>

                <div
                  className="testimonial-two__carousel__thumb nisoz-owl__carousel owl-theme owl-carousel"
                  data-owl-options='{
          "items": 3,
          "margin": 10,
          "smartSpeed": 700,
          "loop":true,
          "autoplay": true,
          "URLhashListener":true,
          "center": true,
          "dots":false
          }'
                >
                  <a href="" className="item" data-hash="item1">
                    <span className="testimonial-two__carousel__thumb__item">
                      <img
                        src="assets/images/resources/ts-author-1.jpg"
                        alt="nisoz"
                      />
                    </span>
                  </a>

                  <a href="" className="item" data-hash="item2">
                    <span className="testimonial-two__carousel__thumb__item">
                      <img
                        src="assets/images/resources/ts-author-2.jpg"
                        alt="nisoz"
                      />
                    </span>
                  </a>

                  <a href="" className="item" data-hash="item3">
                    <span className="testimonial-two__carousel__thumb__item">
                      <img
                        src="assets/images/resources/ts-author-3.jpg"
                        alt="nisoz"
                      />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section> */}
          {/*Testimonial End*/}
        </>
      )}
    </div>
  );
};

export default AboutUs;
