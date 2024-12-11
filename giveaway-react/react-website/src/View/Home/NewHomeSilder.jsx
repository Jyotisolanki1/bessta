import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import bgImage1 from '../../assets/images/backgrounds/bg-1.jpg';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './CSS/styles.css';

// import required modules
import { Parallax, Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';

export default function NewHomeSilder() {
  return (
    <div className="swiper-container">
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
          height: 'auto'
        }}
        // autoplay={{
        //   delay: 2500,
        //   disableOnInteraction: false,
        // }}
        speed={600}
        parallax={true}
        navigation={true}
        modules={[Parallax, Pagination, Navigation]}
        className="mySwiper"
      >
        <div slot="container-start" className="parallax-bg" data-swiper-parallax="-23%"></div>
        <SwiperSlide
          style={{
            // backgroundImage: "url(../../assets/images/backgrounds/bg-2.jpg)",
            backgroundImage: 'url(assets/images/home/slider3.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'

            // opacity: 0.8,
          }}
        >
          <div className="content-container" style={{ marginLeft: '7%' }}>
            <div
              className="title content-title"
              data-swiper-parallax="-300"
              style={{ marginBottom: '14px', fontFamily: 'Acumin Pro Condensed Black' }}
            >
              Transferring gambling to Investing
            </div>
            <div
              className="title content-title"
              data-swiper-parallax="-300"
              style={{ marginBottom: '14px', marginTop: '0px', fontFamily: 'Brush Script MT Italic' }}
            >
              Australia's No. 1 Investor's Reward Club
            </div>
            <div className=" newFont content-text" data-swiper-parallax="-200">
              Almost guaranteed win in the end - more securely become millionaires, multi-millionaires or billionaires for each of our
              long-term Mentoring Members with the right mindset and persistent action under Peter Huang's weekly mentoring and potential JV
            </div>
            <div className=" newFont content-text" data-swiper-parallax="-100">
              <p className="paratext">
                Feel free to choose any of the below packages! Enjoy exclusive access to discounts to have some fun, then gradually have
                more fun by learning the "20 No or Little Money Down Property and Business Investment Strategies" with "3 in 1" success in
                property, career and family while potentially winning $100k cash, from 66 cents per day, payable monthly, opt-out anytime
              </p>
            </div>
            <div
              className="d-sm-flex justify-content-sm-between align-items-sm-center newdesign"
              // style={{ marginTop: "10px" }}
            >
              <div className="">
                {/* <Link to="/signup" className="nisoz-btn"> */}
                <a href="/plans" className="nisoz-btn" style={{ padding: '10px 70px' }}>
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__text" style={{ color: 'black', fontSize: '16px' }}>
                    Sign Up
                  </span>
                </a>
              </div>
              <div className="flex-app social-btns">
                <Link className="app-btn blu flex-app-1 vert" to="https://apple.com" target="_blank">
                  <i className="fab fa-apple" />
                  <p>
                    Available on the <br />
                    <span className="big-txt">App Store</span>
                  </p>
                </Link>
                <Link className="app-btn blu flex-app-1 vert" to="https://play.google.com/" target="_blank" style={{ marginRight: '3%' }}>
                  <img src="assets/images/playstore.png" />
                  <p>
                    Get it on <br />
                    <span className="big-txt">Google Play</span>
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* <section style={{ backgroundColor: 'rgb(72, 71, 77, 0.8', paddingleft: '100px', width: '100vw !important' }}>
            <div style={{ width: '100vw' }}>
              <div className="row">
                <div className="col-xl-12">
                  <div className="about-two__thumb featured wow fadeInLeft" data-wow-delay="300ms" style={{ margin: '0px !important' }}>
                    <div className="section-title">
                      <h2 className="section-title__feature" style={{ marginTop: '2px' }}>
                        The Peter Huang was featured on
                      </h2>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-lg-3 col-md-6 mb-60">
                        <img src="../../../assets/images/featured1.png" alt="nisoz" height={80} width={100} style={{ color: 'white' }} />
                      </div>
                      <div className="col-lg-3 col-md-6 mb-60">
                        <img src="../../../assets/images/featured2.png" alt="nisoz" height={80} width={100} />
                      </div>
                      <div className="col-lg-3 col-md-6 mb-60">
                        <img src="../../../assets/images/featured3.png" alt="nisoz" height={80} width={100} />
                      </div>
                    
                 
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section> */}

          <section style={{ backgroundColor: 'rgb(72, 71, 77, 0.8', paddingleft: '100px', width: '100vw !important' }}>
            <div style={{ width: '100vw' }}>
              <div>
                <div className="col-xl-12">
                  <div className="featured wow fadeInLeft sliderImageContianer" data-wow-delay="300ms" style={{ margin: '0px !important' }}>
                    <div className="section-title">
                      <h2 className="section-title__feature" style={{ marginTop: '2px' }}>
                        Featured on
                      </h2>
                    </div>
                    <div className=" d-flex justify-content-center flex-wrap featuredImageContainer">
                      <div>
                        <img
                          src="../../../assets/images/featured1.png"
                          alt="nisoz"
                          height={80}
                          width={100}
                          style={{ color: 'white' }}
                          className="slideImage"
                        />
                      </div>
                      <div>
                        <img src="../../../assets/images/featured2.png" alt="nisoz" height={80} width={100} className="slideImage" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>

        <SwiperSlide
          style={{
            backgroundImage: 'url(assets/images/home/slider2.jpg)',
            // backgroundImage: `url(${bgImage1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'

            // opacity: 0.8,
          }}
        >
          <div className="content-container" style={{ marginLeft: '7%' }}>
            <div
              className="title content-title"
              data-swiper-parallax="-300"
              style={{ marginBottom: '14px', fontFamily: 'Acumin Pro Condensed Black' }}
            >
              Transferring gambling to Investing
            </div>
            <div
              className="title content-title"
              data-swiper-parallax="-300"
              style={{ marginBottom: '14px', marginTop: '0px', fontFamily: 'Brush Script MT Italic' }}
            >
              Australia's No. 1 Investor's Reward Club
            </div>
            <div className="newFont content-text" data-swiper-parallax="-200">
              Almost guaranteed win in the end - more securely become millionaires, multi-millionaires or billionaires for each of our
              long-term Mentoring Members with the right mindset and persistent action under Peter Huang's weekly mentoring and potential JV
            </div>
            <div className="newFont content-text" data-swiper-parallax="-100">
              <p className="paratext">
                Feel free to choose any of the below packages! Enjoy exclusive access to discounts to have some fun, then gradually have
                more fun by learning the "20 No or Little Money Down Property and Business Investment Strategies" with "3 in 1" success in
                property, career and family while potentially winning $100k cash, from 66 cents per day, payable monthly, opt-out anytime
              </p>
            </div>
            <div
              className="d-sm-flex justify-content-sm-between align-items-sm-center newdesign"
              // style={{ marginTop: "10px" }}
            >
              <div className="">
                {/* <Link to="/signup" className="nisoz-btn"> */}
                <a href="/plans" className="nisoz-btn" style={{ padding: '10px 70px' }}>
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__text" style={{ color: 'black' }}>
                    Sign Up
                  </span>
                </a>
              </div>
              <div className="flex-app social-btns">
                <Link className="app-btn blu flex-app-1 vert" to="https://apple.com" target="_blank">
                  <i className="fab fa-apple" />
                  <p>
                    Available on the <br />
                    <span className="big-txt">App Store</span>
                  </p>
                </Link>
                <Link className="app-btn blu flex-app-1 vert" to="https://play.google.com/" target="_blank" style={{ marginRight: '3%' }}>
                  <img src="assets/images/playstore.png" />
                  <p>
                    Get it on <br />
                    <span className="big-txt">Google Play</span>
                  </p>
                </Link>
              </div>
            </div>
          </div>

          <section style={{ backgroundColor: 'rgb(72, 71, 77, 0.8', paddingleft: '100px', width: '100vw !important' }}>
            <div style={{ width: '100vw' }}>
              <div>
                <div className="col-xl-12">
                  <div className="featured wow fadeInLeft sliderImageContianer" data-wow-delay="300ms" style={{ margin: '0px !important' }}>
                    <div className="section-title">
                      <h2 className="section-title__feature" style={{ marginTop: '2px' }}>
                        Featured on
                      </h2>
                    </div>
                    <div className=" d-flex justify-content-center flex-wrap featuredImageContainer">
                      <div>
                        <img
                          src="../../../assets/images/featured1.png"
                          alt="nisoz"
                          height={80}
                          width={100}
                          style={{ color: 'white' }}
                          className="slideImage"
                        />
                      </div>
                      <div>
                        <img src="../../../assets/images/featured2.png" alt="nisoz" height={80} width={100} className="slideImage" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>

        <SwiperSlide
          style={{
            backgroundImage: 'url(assets/images/home/slider1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="content-container" style={{ marginLeft: '7%' }}>
            <div
              className="title content-title"
              data-swiper-parallax="-300"
              style={{ marginBottom: '14px', fontFamily: 'Acumin Pro Condensed Black' }}
            >
              Transferring gambling to Investing
            </div>
            <div
              className="title content-title"
              data-swiper-parallax="-300"
              style={{ marginBottom: '14px', marginTop: '0px', fontFamily: 'Brush Script MT Italic' }}
            >
              Australia's No. 1 Investor's Reward Club
            </div>
            <div className=" newFont" data-swiper-parallax="-200">
              Almost guaranteed win in the end - more securely become millionaires, multi-millionaires or billionaires for each of our
              long-term Mentoring Members with the right mindset and persistent action under Peter Huang's weekly mentoring and potential JV
            </div>
            <div className=" newFont" data-swiper-parallax="-100">
              <p className="paratext">
                Feel free to choose any of the below packages! Enjoy exclusive access to discounts to have some fun, then gradually have
                more fun by learning the "20 No or Little Money Down Property and Business Investment Strategies" with "3 in 1" success in
                property, career and family while potentially winning $100k cash, from 66 cents per day, payable monthly, opt-out anytime
              </p>
            </div>
            <div
              className="d-sm-flex justify-content-sm-between align-items-sm-center newdesign"
              // style={{ marginTop: "10px" }}
            >
              <div className="">
                {/* <Link to="/signup" className="nisoz-btn"> */}
                <a href="/plans" className="nisoz-btn" style={{ padding: '10px 70px' }}>
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__shape" />
                  <span className="nisoz-btn__text" style={{ color: 'black' }}>
                    Sign Up
                  </span>
                </a>
              </div>
              <div className="flex-app social-btns">
                <Link className="app-btn blu flex-app-1 vert" to="https://apple.com" target="_blank">
                  <i className="fab fa-apple" />
                  <p>
                    Available on the <br />
                    <span className="big-txt">App Store</span>
                  </p>
                </Link>
                <Link className="app-btn blu flex-app-1 vert" to="https://play.google.com/" target="_blank" style={{ marginRight: '3%' }}>
                  <img src="assets/images/playstore.png" />
                  <p>
                    Get it on <br />
                    <span className="big-txt">Google Play</span>
                  </p>
                </Link>
              </div>
            </div>
          </div>

          <section style={{ backgroundColor: 'rgb(72, 71, 77, 0.8', paddingleft: '100px', width: '100vw !important' }}>
            <div style={{ width: '100vw' }}>
              <div>
                <div className="col-xl-12">
                  <div className="featured wow fadeInLeft sliderImageContianer" data-wow-delay="300ms" style={{ margin: '0px !important' }}>
                    <div className="section-title">
                      <h2 className="section-title__feature" style={{ marginTop: '2px' }}>
                        Featured on
                      </h2>
                    </div>
                    <div className=" d-flex justify-content-center flex-wrap featuredImageContainer">
                      <div>
                        <img
                          src="../../../assets/images/featured1.png"
                          alt="nisoz"
                          height={80}
                          width={100}
                          style={{ color: 'white' }}
                          className="slideImage"
                        />
                      </div>
                      <div>
                        <img src="../../../assets/images/featured2.png" alt="nisoz" height={80} width={100} className="slideImage" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
