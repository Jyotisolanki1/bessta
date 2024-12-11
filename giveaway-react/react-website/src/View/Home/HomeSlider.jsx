import React from 'react';
import Slider from 'react-slick';
import bgImage1 from '../../assets/images/backgrounds/bg-1.jpg';
import { Link } from 'react-router-dom';
function HomeSlider() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000, // 2 seconds for slide transition animation
    autoplaySpeed: 8000, // 2 seconds between each slide transition
    cssEase: 'linear'
  };
  return (
    <div className=" main-slider-two">
      <Slider {...settings}>
        <div
          className="main-slider-two__carousel nisoz-owl__carousel owl-carousel"
          data-owl-options='{
		"loop": true,
		"animateOut": "slideOutDown",
		"animateIn": "fadeIn",
		"items": 1,
		"smartSpeed": 1000, 
  "autoplay": false, 
  "autoplayTimeout": 6000, 
		"autoplayHoverPause": true,
		"nav": true,
  "navText": ["<span class=\"icon-up-arrow\"></span>","<span class=\"icon-down-arrow\"></span>"],
		"dots": false,
		"margin": 0
	    }'
        >
          <div className="item">
            {/* slider item start */}
            <div className="main-slider-two__item">
              {/* bg image start */}
              <div
                className="main-slider-two__bg"
                style={{
                  backgroundImage: 'url(../../assets/images/backgrounds/bg-2.jpg)'
                }}
              />
              {/* bg image end */}
              <div className="main-slider-two__shape-1">
                <img src="assets/images/shapes/slider-2-shape-1.png" alt="nisoz" />
              </div>
              {/* shape-one */}
              <div className="container">
                <div className="row">
                  <div className="col-xl-8">
                    <div className="main-slider-two__content">
                      <h3 className="main-slider-two__sub-title mb-2">Australia's No. 1 Investor's Reward Club</h3>
                      {/* slider-title */}
                      {/* <h3 class="main-slider-two__mid-title">Creative</h3><!-- slider-title */}
                      <h2 className="main-slider-two__title">
                        <span className="main-slider-two__title-anim">Shopping Tool And</span>
                        <span className="main-slider-two__title-anim">Rewards Club.</span>
                      </h2>
                      {/* slider-title */}
                      <h5 className="main-slider-two__sub-title mb-4 text-lower">
                        Almost guaranteed win or more securely become millionaires, multi-millionaires or billionaires for each of our
                        long-term mentoring members with the right mindset and persistent action under Peter's weekly guidance
                      </h5>
                      <div className="main-slider-two__btn d-flex justify-content-between align-items-center">
                        <div className="main-slider-two__btn">
                          <Link to="/signup" className="nisoz-btn">
                            <span className="nisoz-btn__shape" />
                            <span className="nisoz-btn__shape" />
                            <span className="nisoz-btn__shape" />
                            <span className="nisoz-btn__shape" />
                            <span className="nisoz-btn__text">Sign Up</span>
                          </Link>
                          {/* /.btn */}
                        </div>
                        <div className="flex-app social-btns">
                          <Link className="app-btn blu flex-app-1 vert" to="https://apple.com" target="_blank">
                            <i className="fab fa-apple" />
                            <p>
                              Available on the <br />
                              <span className="big-txt">App Store</span>
                            </p>
                          </Link>
                          <Link className="app-btn blu flex-app-1 vert" to="https://play.google.com/" target="_blank">
                            <img src="assets/images/playstore.png" />
                            <p>
                              Get it on <br />
                              <span className="big-txt">Google Play</span>
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{' '}
        <div
          className="main-slider-two__carousel nisoz-owl__carousel owl-carousel"
          data-owl-options='{
		"loop": true,
		"animateOut": "slideOutDown",
		"animateIn": "fadeIn",
		"items": 1,
		"smartSpeed": 1000, 
  "autoplay": false, 
  "autoplayTimeout": 6000, 
		"autoplayHoverPause": true,
		"nav": true,
  "navText": ["<span class=\"icon-up-arrow\"></span>","<span class=\"icon-down-arrow\"></span>"],
		"dots": false,
		"margin": 0
	    }'
        >
          <div className="item">
            {/* slider item start */}
            <div className="main-slider-two__item">
              {/* bg image start */}
              <div
                className="main-slider-two__bg"
                style={{
                  backgroundImage: `url(${bgImage1})`
                }}
              />
              {/* bg image end */}
              <div className="main-slider-two__shape-1">
                <img src="assets/images/shapes/slider-2-shape-1.png" alt="nisoz" />
              </div>
              {/* shape-one */}
              <div className="container">
                <div className="row">
                  <div className="col-xl-8">
                    <div className="main-slider-two__content">
                      <h5 className="main-slider-two__sub-title mb-2">Australia's No. 1 Investor's Reward Club</h5>
                      {/* slider-title */}
                      {/* <h3 class="main-slider-two__mid-title">Creative</h3><!-- slider-title */}
                      <h2 className="main-slider-two__title">
                        <span className="main-slider-two__title-anim">Shopping Tool And</span>
                        <span className="main-slider-two__title-anim">Rewards Club.</span>
                      </h2>
                      {/* slider-title */}
                      <h5 className="main-slider-two__sub-title mb-4 text-lower">
                        With over 850+ businesses across 1000+ stores where you can access exclusive discounts Australia Wide from only
                        $19.99 per month, opt-out anytime
                      </h5>
                      <div className="main-slider-two__btn d-flex justify-content-between align-items-center">
                        <div className="main-slider-two__btn">
                          <Link to="/signup" className="nisoz-btn">
                            <span className="nisoz-btn__shape" />
                            <span className="nisoz-btn__shape" />
                            <span className="nisoz-btn__shape" />
                            <span className="nisoz-btn__shape" />
                            <span className="nisoz-btn__text">Sign Up</span>
                          </Link>
                          {/* /.btn */}
                        </div>
                        <div className="flex-app social-btns">
                          <Link className="app-btn blu flex-app-1 vert" to="https://apple.com" target="_blank">
                            <i className="fab fa-apple" />
                            <p>
                              Available on the <br />
                              <span className="big-txt">App Store</span>
                            </p>
                          </Link>
                          <Link className="app-btn blu flex-app-1 vert" to="https://play.google.com/" target="_blank">
                            <img src="assets/images/playstore.png" />
                            <p>
                              Get it on <br />
                              <span className="big-txt">Google Play</span>
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* slider item end */}
        <div
          className="main-slider-two__carousel nisoz-owl__carousel owl-carousel"
          data-owl-options='{
		"loop": true,
		"animateOut": "slideOutDown",
		"animateIn": "fadeIn",
		"items": 1,
		"smartSpeed": 1000, 
  "autoplay": false, 
  "autoplayTimeout": 6000, 
		"autoplayHoverPause": true,
		"nav": true,
  "navText": ["<span class=\"icon-up-arrow\"></span>","<span class=\"icon-down-arrow\"></span>"],
		"dots": false,
		"margin": 0
	    }'
        >
          <div className="item">
            {/* slider item start */}
            <div className="main-slider-two__item">
              {/* bg image start */}
              <div
                className="main-slider-two__bg"
                style={{
                  backgroundImage: 'url(assets/images/backgrounds/bg-3.jpg)'
                }}
              />
              {/* bg image end */}
              <div className="main-slider-two__shape-1">
                <img src="assets/images/shapes/slider-2-shape-1.png" alt="nisoz" />
              </div>
              {/* shape-one */}
              <div className="container">
                <div className="row">
                  <div className="col-xl-8">
                    <div className="main-slider-two__content">
                      <h5 className="main-slider-two__sub-title mb-2">Australia's No. 1 Investor's Reward Club</h5>
                      {/* slider-title */}
                      {/* <h3 class="main-slider-two__mid-title">Creative</h3><!-- slider-title */}
                      <h2 className="main-slider-two__title">
                        <span className="main-slider-two__title-anim">Shopping Tool And</span>
                        <span className="main-slider-two__title-anim">Rewards Club.</span>
                      </h2>
                      {/* slider-title */}
                      <h5 className="main-slider-two__sub-title mb-4 text-lower">
                        With over 850+ businesses across 1000+ stores where you can access exclusive discounts Australia Wide from only
                        $19.99 per month, opt-out anytime
                      </h5>
                      <div className="main-slider-two__btn d-flex justify-content-between align-items-center">
                        <div className="main-slider-two__btn">
                          <Link to="#" className="nisoz-btn">
                            <span className="nisoz-btn__shape" />
                            <span className="nisoz-btn__shape" />
                            <span className="nisoz-btn__shape" />
                            <span className="nisoz-btn__shape" />
                            <span className="nisoz-btn__text">Sign Up</span>
                          </Link>
                          {/* /.btn */}
                        </div>
                        <div className="flex-app social-btns">
                          <Link className="app-btn blu flex-app-1 vert" to="https://apple.com" target="_blank">
                            <i className="fab fa-apple" />
                            <p>
                              Available on the <br />
                              <span className="big-txt">App Store</span>
                            </p>
                          </Link>
                          <Link className="app-btn blu flex-app-1 vert" to="https://play.google.com/" target="_blank">
                            <img src="assets/images/playstore.png" />
                            <p>
                              Get it on <br />
                              <span className="big-txt">Google Play</span>
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* slider item end */}
      </Slider>
    </div>
  );
}

export default HomeSlider;
