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
            backgroundImage: 'url(../../assets/images/backgrounds/5.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            
            // opacity: 0.8,
          }}
        >
        <div style={{marginLeft:"7%"}}>
        <div className="title" data-swiper-parallax="-300" style={{ marginBottom: '14px' }}>
        Australia's No. 1 Investor's Reward Club
      </div>
      <div className="subtitle" data-swiper-parallax="-200">
        Almost guaranteed win in the end - more securely become millionaires, multi-millionaires or billionaires for each of our
        long-term Mentoring Members with the right mindset and persistent action under Peter Huang's weekly mentoring and
        potential JV
      </div>
      <div className="text" data-swiper-parallax="-100">
        <p>
          Feel free to choose any of the below packages! Enjoy the exclusive access for discount with everything you need in your life
          to have some fun, save, network, self promotion, learn "20 no or little money down strategies"  win $100,000 cash more from
          66cent per day, payable monthly, opt-out anytime
        </p>
      </div>
      <div
        className="d-flex justify-content-between align-items-center"
        // style={{ marginTop: "10px" }}
      >
        <div className="">
          {/* <Link to="/signup" className="nisoz-btn"> */}
          <a href="/plans" className="nisoz-btn">
            <span className="nisoz-btn__shape" />
            <span className="nisoz-btn__shape" />
            <span className="nisoz-btn__shape" />
            <span className="nisoz-btn__shape" />
            <span className="nisoz-btn__text">Sign Up</span>
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
          <Link className="app-btn blu flex-app-1 vert" to="https://play.google.com/" target="_blank" style={{marginRight:"3%"}}>
            <img src="assets/images/playstore.png" />
            <p>
              Get it on <br />
              <span className="big-txt">Google Play</span>
            </p>
          </Link>
        </div>
      </div>
        </div>
        
          <section  style={{ backgroundColor: 'rgb(72, 71, 77, 0.8', paddingleft: '100px' ,width:"100vw !important"}}>
          <div style={{width:"100vw"}}>
            <div className="row">
              <div className="col-xl-12">
                <div className="about-two__thumb featured wow fadeInLeft" data-wow-delay="300ms" style={{margin:"0px !important"}}>
                  <div className="section-title">
                    <h2 className="section-title__feature" style={{ marginTop: '2px' }}>
                      The Peter Huang was featured on
                    </h2>
                  </div>
                  <div className="row d-flex justify-content-center">
                    <div className="col-lg-3 col-md-6 mb-60">
                      <img src="assets/images/brand/Artboard-1-copy-2-1536x877.png" alt="nisoz" />
                    </div>
                    <div className="col-lg-3 col-md-6 mb-60">
                      <img
                        src="assets/images/brand/abc2.png"
                        alt="nisoz"
                        style={{
                          background: 'black',
                          marginTop: '45px'
                        }}
                      />
                    </div>
                    {/* <div className="col-lg-3 col-md-6 mb-60">
                      <img
                        src="assets/images/brand/Artboard-1-copy-1536x877.png"
                        alt="nisoz"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mb-60">
                      <img
                        src="assets/images/brand/Artboard-1-1536x877.png"
                        alt="nisoz"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mt-4 offset-md-3">
                      <img
                        src="assets/images/brand/West-Coast-Customs-logo-colour-1-1536x935.png"
                        alt="nisoz"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mt-4">
                      <img
                        src="assets/images/brand/2021-sema-show-logo-01-v2-768x234.webp"
                        alt="nisoz"
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </SwiperSlide>
        <SwiperSlide
          style={{
            backgroundImage: 'url(../../assets/images/backgrounds/6.png)',
            // backgroundImage: `url(${bgImage1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
           
            // opacity: 0.8,
          }}
        >
        <div style={{marginLeft:"7%"}}>
        <div className="title" data-swiper-parallax="-300" style={{ marginBottom: '14px' }}>
        Australia's No. 1 Investor's Reward Club
      </div>
      <div className="subtitle" data-swiper-parallax="-200">
        Almost guaranteed win in the end - more securely become millionaires, multi-millionaires or billionaires for each of our
        long-term Mentoring Members with the right mindset and persistent action under Peter Huang's weekly mentoring and
        potential JV
      </div>
      <div className="text" data-swiper-parallax="-100">
        <p>
          Feel free to choose any of the below packages! Enjoy the exclusive access for discount with everything you need in your life
          to have some fun, save, network, self promotion, learn "20 no or little money down strategies"  win $100,000 cash more from
          66cent per day, payable monthly, opt-out anytime
        </p>
      </div>
      <div
        className="d-flex justify-content-between align-items-center"
        // style={{ marginTop: "10px" }}
      >
        <div className="">
          {/* <Link to="/signup" className="nisoz-btn"> */}
          <a href="/plans" className="nisoz-btn">
            <span className="nisoz-btn__shape" />
            <span className="nisoz-btn__shape" />
            <span className="nisoz-btn__shape" />
            <span className="nisoz-btn__shape" />
            <span className="nisoz-btn__text">Sign Up</span>
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
          <Link className="app-btn blu flex-app-1 vert" to="https://play.google.com/" target="_blank" style={{marginRight:"3%"}}>
            <img src="assets/images/playstore.png" />
            <p>
              Get it on <br />
              <span className="big-txt">Google Play</span>
            </p>
          </Link>
        </div>
      </div>
        </div>
        
          <section  style={{ backgroundColor: 'rgb(72, 71, 77, 0.8', paddingleft: '100px' ,width:"100vw !important"}}>
          <div style={{width:"100vw"}}>
            <div className="row">
              <div className="col-xl-12">
                <div className="about-two__thumb featured wow fadeInLeft" data-wow-delay="300ms" style={{margin:"0px !important"}}>
                  <div className="section-title">
                    <h2 className="section-title__feature" style={{ marginTop: '2px' }}>
                      The Peter Huang was featured on
                    </h2>
                  </div>
                  <div className="row d-flex justify-content-center">
                    <div className="col-lg-3 col-md-6 mb-60">
                      <img src="assets/images/brand/Artboard-1-copy-2-1536x877.png" alt="nisoz" />
                    </div>
                    <div className="col-lg-3 col-md-6 mb-60">
                      <img
                        src="assets/images/brand/abc2.png"
                        alt="nisoz"
                        style={{
                          background: 'black',
                          marginTop: '45px'
                        }}
                      />
                    </div>
                    {/* <div className="col-lg-3 col-md-6 mb-60">
                      <img
                        src="assets/images/brand/Artboard-1-copy-1536x877.png"
                        alt="nisoz"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mb-60">
                      <img
                        src="assets/images/brand/Artboard-1-1536x877.png"
                        alt="nisoz"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mt-4 offset-md-3">
                      <img
                        src="assets/images/brand/West-Coast-Customs-logo-colour-1-1536x935.png"
                        alt="nisoz"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mt-4">
                      <img
                        src="assets/images/brand/2021-sema-show-logo-01-v2-768x234.webp"
                        alt="nisoz"
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
     
        </SwiperSlide>
        <SwiperSlide
          style={{
            backgroundImage: 'url(assets/images/backgrounds/7.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            
          }}
        >
        <div style={{marginLeft:"7%"}}>
        <div className="title" data-swiper-parallax="-300" style={{ marginBottom: '14px' }}>
        Australia's No. 1 Investor's Reward Club
      </div>
      <div className="subtitle" data-swiper-parallax="-200">
        Almost guaranteed win in the end - more securely become millionaires, multi-millionaires or billionaires for each of our
        long-term Mentoring Members with the right mindset and persistent action under Peter Huang's weekly mentoring and
        potential JV
      </div>
      <div className="text" data-swiper-parallax="-100">
        <p>
          Feel free to choose any of the below packages! Enjoy the exclusive access for discount with everything you need in your life
          to have some fun, save, network, self promotion, learn "20 no or little money down strategies"  win $100,000 cash more from
          66cent per day, payable monthly, opt-out anytime
        </p>
      </div>
      <div
        className="d-flex justify-content-between align-items-center"
        // style={{ marginTop: "10px" }}
      >
        <div className="">
          {/* <Link to="/signup" className="nisoz-btn"> */}
          <a href="/plans" className="nisoz-btn">
            <span className="nisoz-btn__shape" />
            <span className="nisoz-btn__shape" />
            <span className="nisoz-btn__shape" />
            <span className="nisoz-btn__shape" />
            <span className="nisoz-btn__text">Sign Up</span>
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
          <Link className="app-btn blu flex-app-1 vert" to="https://play.google.com/" target="_blank" style={{marginRight:"3%"}}>
            <img src="assets/images/playstore.png" />
            <p>
              Get it on <br />
              <span className="big-txt">Google Play</span>
            </p>
          </Link>
        </div>
      </div>
        </div>
        
          <section  style={{ backgroundColor: 'rgb(72, 71, 77, 0.8', paddingleft: '100px' ,width:"100vw !important"}}>
          <div style={{width:"100vw"}}>
            <div className="row">
              <div className="col-xl-12">
                <div className="about-two__thumb featured wow fadeInLeft" data-wow-delay="300ms" style={{margin:"0px !important"}}>
                  <div className="section-title">
                    <h2 className="section-title__feature" style={{ marginTop: '2px' }}>
                      The Peter Huang was featured on
                    </h2>
                  </div>
                  <div className="row d-flex justify-content-center">
                    <div className="col-lg-3 col-md-6 mb-60">
                      <img src="assets/images/brand/Artboard-1-copy-2-1536x877.png" alt="nisoz" />
                    </div>
                    <div className="col-lg-3 col-md-6 mb-60">
                      <img
                        src="assets/images/brand/abc2.png"
                        alt="nisoz"
                        style={{
                          background: 'black',
                          marginTop: '45px'
                        }}
                      />
                    </div>
                    {/* <div className="col-lg-3 col-md-6 mb-60">
                      <img
                        src="assets/images/brand/Artboard-1-copy-1536x877.png"
                        alt="nisoz"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mb-60">
                      <img
                        src="assets/images/brand/Artboard-1-1536x877.png"
                        alt="nisoz"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mt-4 offset-md-3">
                      <img
                        src="assets/images/brand/West-Coast-Customs-logo-colour-1-1536x935.png"
                        alt="nisoz"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mt-4">
                      <img
                        src="assets/images/brand/2021-sema-show-logo-01-v2-768x234.webp"
                        alt="nisoz"
                      />
                    </div> */}
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
