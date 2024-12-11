/* eslint-disable react/no-danger-with-children */
import React, { lazy, useEffect, useState } from 'react';
import Cards from '../../Common/Cards';
// import { REACT_API_URL } from '../../../config';
// const FirstImage = lazy(() => import("../../assets/images/backgrounds/bg-1.jpg"));
// const FirstImage = lazy(() => import("assets/images/backgrounds/bg-1.jpg"));

import CountUp from 'react-countup';
import { Link, useNavigate } from 'react-router-dom';
import { GetPartnersApi } from '../../Slices/GetPartners';
import { useDispatch, useSelector } from 'react-redux';
import { REACT_API_URL } from '../../../config';
import { Virtual, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import NewHomeSilder from './NewHomeSilder';
import FixedPlan from './FixedPlan';
import { GetPastWinnersApi } from '../../Slices/PastWinners';
import Faq from 'react-faq-component';
import { GetFaqApi } from '../../Slices/FaqSlice';
import star from '../../../public/assets/images/star.png';
import Skeleton from 'react-loading-skeleton';
import Forthcoming from './forthcoming.jsx';
import { GetDrawsApi } from '../../Slices/DrawsSlice.js';
import moment from 'moment';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const { getPartnersList } = useSelector((state) => state.getPartnerAction);
  const { GetDraws } = useSelector((state) => state.drawAction);
  const { FaqObj, loading } = useSelector((state) => state.FaqAction);
  // // console.log("🚀 ~ Home ~ getPartnersList:", getPartnersList);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [spaceBetween, setSpaceBetween] = useState(40);
  const [pastWinner, setPastWinnerData] = useState();
  const [arrow, setArrow] = useState(false);
  const downArrow = '../../../assets/images/downArrow.png';
  const upArrow = '../../../assets/images/uparrow.png';
  const prizeArr = ['1st Prize', '2nd Prize', '3rd Prize'];
  // const styles = {
  //   bgColor: '#bdbbb5',
  //   titleTextColor: '#f28500',
  //   rowTitleColor: 'black',
  //   arrowColor: '#f28500',
  // };

  const handleContent = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const formattedData = FaqObj.slice(0, 3).map((item, index) => ({
    title: (
      <div className="faq-item" key={index}>
        <img src={star} className="starimg" height="40" width="40" alt="star" />
        <span className="faq-title">{item.title}</span>
        <img
          src={openIndex === index ? upArrow : downArrow}
          height="35"
          width="35"
          className="toggle-arrow"
          onClick={() => handleContent(index)}
          alt={openIndex === index ? 'up arrow' : 'down arrow'}
          style={{ cursor: 'pointer' }}
        />
      </div>
    ),
    content: item.content
  }));
  // const data = {
  //   rows: formattedData
  // };
  // const config = {
  //   animate: true,
  //   arrowIcon: 'V
  //   tabFocus: true
  // };

  useEffect(() => {
    dispatch(GetPartnersApi());
    dispatch(GetFaqApi());
    const handleResize = () => {
      // // console.log('Window width:', window.innerWidth);
      if (window.innerWidth <= 768) {
        setSlidesPerView(2);
        setSpaceBetween(90);
      } else if (window.innerWidth >= 770 && window.innerWidth <= 1024) {
        setSlidesPerView(2);
        setSpaceBetween(20);
      } else if (window.innerWidth >= 1024 && window.innerWidth <= 1300) {
        setSlidesPerView(3);
        setSpaceBetween(20);
      } else {
        setSlidesPerView(4);
        setSpaceBetween(20);
      }
      dispatch(GetPastWinnersApi()).then((data) => setPastWinnerData(data.data));
    };

    handleResize(); // Initial call to set properties based on initial screen size

    window.addEventListener('resize', handleResize); // Add event listener for window resize

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup event listener on component unmount
    };
  }, []); // Empty dependency array to run the effect only once on mount

  const handleImageClick = (url) => {
    if (url) {
      window.open(url, '_blank'); // Opens the URL in a new tab
    }
  };

  useEffect(() => {
    dispatch(GetDrawsApi('old'));
  }, [dispatch]);
  // const imagesArray = getPartnersList.map((eachImage) => eachImage?.image);
  const slides = getPartnersList?.map((el, index) => {
    // // console.log("🚀 ~ slides ~ el:", el);
    return (
      <React.Fragment key={index}>
        {el?.bussiness_url !== '' ? (
          <a href={el?.bussiness_url} target="_blank" rel="noopener noreferrer">
            <div className="logos">
              <img src={`${REACT_API_URL}${el?.image}`} style={{ margin: '25px', cursor: 'pointer' }} alt={`Image ${index}`} />
            </div>
          </a>
        ) : (
          <div className="logos">
            <img src={`${REACT_API_URL}${el}`} width={300} height={300} style={{ margin: '25px' }} alt={`Image ${index}`} />
          </div>
        )}
      </React.Fragment>
    );
  });

  return (
    <>
      {/* /.main-header */}
      <div className="stricky-header stricked-menu main-menu main-menu-with-border">
        <div className="sticky-header__content" />
        {/* /.sticky-header__content */}
      </div>

      {/* <HomeSlider /> */}
      <NewHomeSilder />
      {/*Main Slider End*/}
         <div className="pricing-table">
        <div className="container">
          <div className="section-title mynewbottom" id="accessPackage">
            <h2 className="HomeAccessHeading">Choose Your Access Level</h2>
            <h5 className=" mynewtagline" id="selectpack">
              Select A Package Below To Get Access To Australia's No. 1 Investor's Rewards Club
            </h5>
          </div>
          <div className="pricingtablecontainer" style={{ display: 'block' }}>
            <FixedPlan />
            <Cards />
          </div>
        </div>
      </div>
      {/* <div className="about-us">
        <h2>ABOUT US</h2>

        <div className="content">
          <div className="image">
            <img src="../../../assets/images/home/aboutus2.png" alt="Pool at the BESTTA Investor's Club" className="aboutimageclass" />
          </div>
          <div className="abouttext">
            <h3>What is the Investor's Club?</h3>
            <p className="aboutPtag">
              Peter's mission extends to creating one of the largest charities in Australia under Claybourn Foundation and Yong Foundation,
              supporting various registered charities in Australia, including the Royal Women's Hospital Foundation, Mater Foundation, Royal
              Flying Doctors, Guide Dogs, Teen Challenges, Rotary Club, Redcross, and other approved charities.
            </p>
            <p className="aboutPtag">
              A portion of BESTTA Investor's Club profits will be donated to Claybourn Foundation and Yong Foundation, both ACNA-registered
              charities.
            </p>
          </div>
        </div>
      </div> */}
      {/* <section className="aboutUsContainer">
      //   <div>
      //     <h1 style={{ fontWeight: '600', textAlign: 'center', color: 'black', marginBottom: '49px' }}>ABOUT US</h1>
      //   </div>
      //   <div className="aboutUs">
      //     <div className="aboutUsLeft" style={{ border: 'solid 4px black' }}>
      //       <div className="aboutUsImage">
      //         <img src="../../../public/assets/images/home/aboutus.jpeg" height="350" />
      //       </div>
      //     </div>
      //     <div className="aboutRight">
      //       <h1 style={{ fontWeight: '600', color: 'black', marginBottom: '49px' }}>What is investor's club</h1>
      //       <p style={{ fontSize: '18px', color: 'black' }}>
      //         Peter, a trailblazer in the investor's giveaway industry in Australia, having gifted five brand new Toyota and Lexus cars
      //         exclusively to his real estate clients between 2012 and 2015, now initiates $100,000 cash giveaways to members of the BESTTA
      //         Investors Club, established in 2024. This is accessible from once-off $10 or 66 cents per day while enjoying fun, discounted
      //         savings and more. His overarching mission is not solely to propel his conglomerate of companies under BESTTA Group to a
      //         billion-dollar status but, more crucially, to elevate all Mentoring Members to enduring millionaires,
      //         multi-millionaires, or even billionaires. This includes potential joint ventures with members.
      //       </p>
      //     </div>
      //   </div>
     </section>*/}
      <div style={{ background: '#48474d' }}>
        <div style={{ width: '100%', margin: '0px auto', padding: '4%' }}>
          {/* <h2>Our Partners</h2> */}
          <h2 className="ourpartnerHome">
            <span style={{ color: 'white' }}>Some of our Partners</span>
          </h2>
          <div
            style={{
              // backgroundImage: `url(${partner})`,
              // backgroundSize: "cover",
              // height: "400px",
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Swiper
              modules={[Virtual, Autoplay]}
              spaceBetween={spaceBetween}
              slidesPerView={slidesPerView}
              virtual
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              className="my-swiper"
            >
              {slides.map((slideContent, index) => (
                <SwiperSlide key={index} virtualIndex={index} className="w-fit">
                  {slideContent}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="container">
          {/* <h2 className="ourpartnerHome pb-60">
            <span>Some of our Partners</span>
          </h2> */}
          {/* section-title */}
          {/* <div
            className="client-carousel__one nisoz-owl__carousel owl-theme owl-carousel mb-4 mt-4"
            data-owl-options='{
      "items": 5,
      "margin": 65,
      "smartSpeed": 700,
      "loop":true,
      "autoplay": 6000,
      "nav":false,
      "dots":false,
      "navText": ["<span class=\"fa fa-angle-left\"></span>","<span class=\"fa fa-angle-right\"></span>"],
      "responsive":{
          "0":{
              "items":1,
              "margin": 0
          },
          "360":{
              "items":2,
              "margin": 0
          },
          "575":{
              "items":3,
              "margin": 30
          },
          "768":{
              "items":3,
              "margin": 40
          },
          "992":{
              "items": 4,
              "margin": 40
          },
          "1200":{
              "items": 3,
					"margin": 40
          }
      }
      }'
          >
            {!loading && getPartnersList.length > 0 ? (
              getPartnersList?.map((list, index) => (
                <div
                  className="client-carousel__one__item img-height"
                  key={index}
                >
                  <img src={REACT_API_URL + list?.image} alt="nisoz" />
                </div>
              ))
            ) : loading ? (
              <Spinner color="primary">Loading...</Spinner>
            ) : (
              <div className="client-carousel__one__item img-height">
                <h2 className="section-title__title text-center pb-60">
                  <span>No Found Partners</span>
                </h2>
              </div>
            )}
          </div> */}
        </div>
        {/* /.container */}
      </div>
      {/* /.client-carousel */}
      {/* Video Start*/}
      <section className="video-one">
        <div className="container">
          <div className="video-one__banner wow fadeInUp" data-wow-delay="100ms">
            <img src="assets/images/backgrounds/video-bg-1-1.jpg" alt="nisoz" style={{ height: '100%' }} />
            <div className="video-one__border-wrap wow fadeInLeft" data-wow-delay="300ms">
              <div className="video-one__border-one" />
              <div className="video-one__border-two" />
            </div>
            <div className="video-one__content">
              {/* video btn start */}
              <Link to="https://www.youtube.com/watch?v=ByAn8DF8Ykk" className="video-popup">
                <span className="fa fa-play" />
              </Link>
              {/* video btn end */}
              <h2 className="video-one__content__title">Most Trusted Rewards club</h2>
            </div>
          </div>
        </div>
      </section>
      {/* Video Start*/}
      <section className="fact-two">
        <div className="bg-video-wrap">
          <video src="https://designsupply-web.com/samplecontent/vender/codepen/20181014.mp4" loop="" muted="" autoPlay=""></video>
          <div className="overlay"></div>
          <div className="container content-absolute d-flex justify-content-center">
            <div className="row">
              <div className="col-lg-12 wow fadeInUp animated" data-wow-delay="100ms">
                <div className="fact-two__wrapper">
                  {/* <div className="fact-two__item text-center">
                    <div className="fact-two__item__icon">
                      <span className="">
                        <i className="fa-regular fa-handshake" />
                      </span>
                    </div>
                    <div className="fact-two__item__count">
                      <span className="count-box">
                        <span
                          className="count-text"
                          data-stop={850}
                          data-speed={1500}
                        />
                        <CountUp end={850} duration={1} />
                        <span>+</span>
                      </span>
                    </div>
                    <h3 className="fact-two__item__title">
                      Australian business partners
                    </h3>
                  </div> */}
                  {/* /.fact-two__item */}
                  <div className="fact-two__item text-center">
                    <div className="fact-two__item__icon">
                      <span className="">
                        <i className="fa-regular fa-flag" />
                      </span>
                    </div>
                    {/* /.fact-two__icon */}
                    <div className="fact-two__item__count">
                      <span className="count-box">
                        <span className="count-text" data-stop={1000} data-speed={1500} />
                        $<CountUp end={1000} duration={1} />
                        's
                      </span>
                    </div>
                    {/* /.fact-two__count */}
                    <h3 className="fact-two__item__title">In savings through our mates rates discounts</h3>
                    {/* /.fact-two__title */}
                  </div>
                  {/* /.fact-two__item */}
                  {/* <div className="fact-two__item text-center">
                    <div className="fact-two__item__icon">
                      <span className="">
                        <i className="fa-solid fa-globe" />
                      </span>
                    </div>
                    <div className="fact-two__item__count">
                      <span className="count-box">
                        <span
                          className="count-text"
                          data-stop={1000}
                          data-speed={1500}
                        />
                        <CountUp end={850} duration={1} />
                        <span>+</span>
                      </span>
                    </div>
                    <h3 className="fact-two__item__title">
                      stores you can redeem offers In person or online
                    </h3>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Service Start */}
      <div />
      <section className="membership-section">
        <div style={{ backgroundColor: 'black', margin: '0', padding: '56px', opacity: '.7' }}>
          <div className="container">
            <div>
              <div className="section-title color-white mb-5">
                <h5 className="section-title__tagline privilegeTitle">WHAT IS BESTTA?</h5>
                <h2 className="PrivilegesMembership">Membership Has Its Privileges</h2>
              </div>
              <div className="member-grid  mouse-wheel" style={{ opcaticy: '2' }}>
                {/* <img src="assets/images/shapes/Car-blue.png" alt="" class="car"> */}
                {/* <span class="center-dashed-line"></span> */}
                <div className="member-flex1 member-flex">
                  <div className="member-flex-1">
                    <h5 className="textcenter">COMMUNITY OF ENTHUSIASTS</h5>
                    <p className="textrightmargin">
                      Join a community of smart property investors and aspiring entrepreneurs, while sharing the excitement, anticipation
                      and the joy of winning now or the everlasting property and business portfolios in the end!
                    </p>
                  </div>
                  <span className="imgoi">
                    <i className="fa-solid fa-users" />
                  </span>
                </div>
                <div className="member-flex2 member-flex">
                  <span className="imgoi2">
                    <i className="fa-solid fa-percent" />
                  </span>
                  <div className="member-flex-1">
                    <h5 className="execlusive">EXCLUSIVE DISCOUNTS</h5>
                    <p className="textrightmargin">
                      Unlock access to substantial discounts at businesses across Australia, all from an affordable membership fee.
                    </p>
                  </div>
                </div>
                <div className="member-flex1 member-flex">
                  <div className="member-flex-1 newmemberflex1">
                    <h5 className="textcenter">EXPERT SUPPORT</h5>
                    <p className="textrightmarginnew">
                      Got questions or need assistance? Our professional and trusted in-house support team is always ready to help, based on
                      our own building, Pacific Centre in Brisbane, developed by us in 2001, so we are always there as one of Qld's top 400
                      private companies.
                    </p>
                  </div>
                  <span className="imgoi3">
                    <i className="fa-solid fa-headset" />
                  </span>
                </div>
                <div className="member-flex2 member-flex">
                  <span className="imgoi4">
                    <i className="fa-solid fa-circle-pause newclasshhh" />
                  </span>
                  <div className="member-flex-1">
                    <h5 className="textcenter">FLEXIBILITY TO OPT-OUT</h5>
                    <p className="textrightmargin">
                      We value your freedom. Not feeling the ride or want more secured win? Cancel, upgrade or downgrade your membership at
                      any time, no strings attached.
                    </p>
                  </div>
                </div>
                <div className="member-flex1 member-flex">
                  <div className="member-flex-1">
                    <h5 className="textcenter">A GROWING FLEET</h5>
                    <p className="textrightmargin">
                      We continually work with our partners and Mentoring Members to bring you bigger and better prizes and quickly build
                      your ever-lasting property and or business portfolios like no others using our "20 no or little money down strategies
                    </p>
                  </div>
                  <span className="imgoi3">
                    <i className="fa-solid fa-car-side" />
                  </span>
                </div>
                <div className="member-flex2 member-flex">
                  <span className="imgoi4">
                    <i className="fa-solid fa-handshake" />
                  </span>
                  <div className="member-flex-1">
                    <h5>TRUSTED PARTNERSHIPS</h5>
                    <p className="textrightmargin">
                      We have partnered with reputable businesses nationwide to ensure our members receive only the best deals and offers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*Testimonial Start*/}

      <section className="portfolio-two">
        <div className="Investorsclub">
          <div className="section-title text-center mb-5">
            <h2 className="fourthcominggiveaway">FORTHCOMING CASH GIVEAWAY OF $100,000</h2>
          </div>
        </div>
        <Forthcoming />
        {/*
        <div className="Investorsclub">
          <div className="section-title text-center mb-5">
            <h2 className="section-title__title">FORTHCOMING CASH GIVEAWAY OF $100,000</h2>
            <h5 className="section-title__tagline">Follow us on social media</h5>
           
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6">
              <Link to="javascript:void(0)">
                <div className="portfolio-two__item portfolio-two__item-sm">
                  <div className="portfolio-two__thumb">
                    <img src="/assets/images/myteam/1.png" alt="nisoz" />
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6">
              <Link to="javascript:void(0)">
                <div className="portfolio-two__item portfolio-two__item-sm">
                  <div className="portfolio-two__thumb">
                    <img src="/assets/images/myteam/5.jpg" alt="nisoz" />
                    
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6">
              <Link to="javascript:void(0)">
                <div className="portfolio-two__item portfolio-two__item-sm">
                  <div className="portfolio-two__thumb">
                    <img src="/assets/images/myteam/3.png" alt="nisoz" />
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6">
              <Link to="javascript:void(0)">
                <div className="portfolio-two__item portfolio-two__item-sm">
                  <div className="portfolio-two__thumb">
                    <img src="/assets/images/myteam/4.jpg" alt="nisoz" />
                  
                </div>
              </Link>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6">
              <Link to="javascript:void(0)">
                <div className="portfolio-two__item portfolio-two__item-sm">
                  <div className="portfolio-two__thumb">
                    <img src="/assets/images/myteam/2.png" alt="nisoz" />
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <Link to="javascript:void(0)">
                <div className="portfolio-two__item portfolio-two__item-sm">
                  <div className="portfolio-two__thumb">
                    <img src="/assets/images/myteam/image13.png" alt="nisoz" />
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <Link to="javascript:void(0)">
                <div className="portfolio-two__item portfolio-two__item-sm">
                  <div className="portfolio-two__thumb">
                    <img src="/assets/images/myteam/image14.png" alt="nisoz" />
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <Link to="javascript:void(0)">
                <div className="portfolio-two__item portfolio-two__item-sm">
                  <div className="portfolio-two__thumb">
                    <img src="/assets/images/myteam/image15.png" alt="nisoz" />
                  </div>
                </div>
              </Link>
            </div>

           
          </div>
        </div> */}
      </section>

      <section className="portfolio-two" style={{ backgroundColor: '#e2c3c3' }}>
        <div className="container">
          <div className="section-title text-center mb-5">
            <h2 className="homepastwinners">Past Winners</h2>
          </div>
          <div className="row">
            {pastWinner ? (
              <>
                {pastWinner.map((year, index) => (
                  <>
                    <div className="col-xl-3 col-lg-4 col-md-6" key={index}>
                      <div
                        className="vc_col-sm-3 wpb_column column_container vc_column_container col child_column no-extra-padding inherit_tablet inherit_phone one-fourths right-edge"
                        data-padding-pos="all"
                        data-has-bg-color="false"
                        data-bg-color=""
                        data-bg-opacity="1"
                        data-animation=""
                        data-delay="0"
                      >
                        <div className="vc_column-inner">
                          <div className="wpb_wrapper">
                            <div
                              className="nectar-fancy-box using-img"
                              style={{ minHeight: '500px' }}
                              data-style="hover_desc"
                              data-border-radius="default"
                              data-animation=""
                              data-bg-animation="long_zoom"
                              data-border=""
                              data-delay=""
                              data-alignment="left"
                              data-color="accent-color"
                            >
                              <div className="box-bg loaded" style={{ backgroundImage: `url(${REACT_API_URL}${year.image})` }}></div>
                              <div className="inner">
                                <div className="heading-wrap" style={{ transform: 'translateY(0px)' }}>
                                  <h3>{`${year.winners[0].prize} in year ${year?.year}`}</h3>
                                </div>
                                <div className="hover-content">
                                  {year?.winners.map((win, index) => (
                                    <>
                                      {win?.name ? <p style={{ margin: '0' }}> {`${prizeArr[index]} ${win.prize} : ${win.name} `}</p> : ''}
                                    </>
                                  ))}
                                </div>
                              </div>{' '}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </section>

   
      <div className="orangeLine"></div>
      <section className="landingFaqs" style={{ paddingBottom: '7%' }}>
        <div>
          <h1 style={{ fontWeight: '600', textAlign: 'center', color: 'black', marginBottom: '49px', marginTop: '60px' }}>
            FREQUENTLY ASKED QUESTIONS
          </h1>
        </div>
        <div className="marginfaqsection" style={{ marginRight: '15%', marginLeft: '15%' }}>
          {loading ? (
            <div>
              <div
                className="faq-section"
                style={{
                  marginBottom: '3%',
                  padding: '2%'
                }}
              >
                <Skeleton
                  className="skeleton"
                  style={{
                    marginBottom: '3%',
                    padding: '2%'
                  }}
                />
                <Skeleton
                  style={{
                    marginBottom: '3%',
                    padding: '2%'
                  }}
                />
                <Skeleton
                  style={{
                    marginBottom: '3%',
                    padding: '2%'
                  }}
                />
              </div>
            </div>
          ) : formattedData.length > 0 ? (
            <div>
              {formattedData.map((item, index) => (
                <div
                  key={index}
                  className="faq-section"
                  style={{
                    marginBottom: '3%',
                    backgroundColor: '#dedad9',
                    padding: '2%',
                    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
                  }}
                >
                  {item.title}
                  {openIndex === index && (
                    <div
                      className="faq-answer"
                      style={{ color: 'black', marginLeft: '4%' }}
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  )}
                </div>
              ))}
              <Link to="/faq" className="buttonFAQ">
                CLICK HERE FOR MORE FAQS
              </Link>
            </div>
          ) : (
            'not found'
          )}
        </div>
      </section>

      {/* /.copyright */}
    </>
  );
};

export default Home;
