import React, { lazy, useEffect, useState } from 'react';
import Cards from '../../Common/Cards';
// import { REACT_API_URL } from '../../../config';
// const FirstImage = lazy(() => import("../../assets/images/backgrounds/bg-1.jpg"));
// const FirstImage = lazy(() => import("assets/images/backgrounds/bg-1.jpg"));
import bgImage1 from '../../assets/images/backgrounds/bg-1.jpg';
import HomeSlider from './HomeSlider';
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
import '../../assets/css/nisoz.css';
import membershipImage from '../../../assets/images/home/Privilege.png';

const Home = () => {
  const formattedData = FaqObj.slice(0, 3).map((item, index) => ({
    title: (
      <div className="faq-item" key={index}>
        <img src={star} height="50" width="50" alt="star" className="faq-star" />
        <span className="faq-title">{item.title}</span>
        <img
          src={openIndex === index ? upArrow : downArrow}
          height="50"
          width="50"
          className="toggle-arrow"
          onClick={() => handleContent(index)}
          alt={openIndex === index ? 'up arrow' : 'down arrow'}
        />
      </div>
    ),
    content: item.content
  }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getPartnersList } = useSelector((state) => state.getPartnerAction);
  const { FaqObj } = useSelector((state) => state.FaqAction);
  // // console.log("🚀 ~ Home ~ getPartnersList:", getPartnersList);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [spaceBetween, setSpaceBetween] = useState(40);
  const [pastWinner, setPastWinnerData] = useState();

  const prizeArr = ['1st Prize', '2nd Prize', '3rd Prize'];
  const styles = {
    bgColor: '#bdbbb5',
    titleTextColor: '#f28500',
    rowTitleColor: 'black',
    rowContentColor: 'grey',
    rowContentMarginTop: '50px',
    margin: '4px',
    arrowColor: '#f28500'
  };

  const formattedData = FaqObj.slice(0, 3).map((item) => ({
    title: item.title,
    content: item.content
  }));

  const data = {
    rows: formattedData
  };
  const config = {
    animate: true,
    arrowIcon: 'V',
    tabFocus: true
  };

  useEffect(() => {
    dispatch(GetFaqApi());
    const handleResize = () => {
      // // console.log('Window width:', window.innerWidth);
      if (window.innerWidth <= 768) {
        setSlidesPerView(1);
        setSpaceBetween(10);
      } else if (window.innerWidth >= 770 && window.innerWidth <= 1024) {
        setSlidesPerView(2);
        setSpaceBetween(20);
      } else {
        setSlidesPerView(3);
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

  // const imagesArray = getPartnersList.map((eachImage) => eachImage?.image);
  const slides = getPartnersList?.map((el, index) => {
    // // console.log("🚀 ~ slides ~ el:", el);
    return (
      <React.Fragment key={index}>
        {el?.bussiness_url !== '' ? (
          <a href={el?.bussiness_url} target="_blank" rel="noopener noreferrer">
            <div className="logos">
              <img
                src={`${REACT_API_URL}${el?.image}`}
                // width={300}
                // height={150}
                style={{ margin: '25px', cursor: 'pointer' }}
                alt={`Image ${index}`}
              />
            </div>
          </a>
        ) : (
          <div className="logos">
            <img src={`${REACT_API_URL}${el}`} width={150} height={150} style={{ margin: '25px' }} alt={`Image ${index}`} />
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

      <section className="aboutUsContainer">
        <div>
          <h1 style={{ fontWeight: '600', textAlign: 'center', color: 'black', marginBottom: '49px' }}>ABOUT US</h1>
        </div>
        <div className="aboutUs">
          <div className="aboutUsLeft" style={{ border: 'solid 4px black' }}>
            <div className="aboutUsImage">
              <img src="../../assets/images/backgrounds/5.png" height="350" />
            </div>
          </div>
          <div className="aboutRight">
            <h1 style={{ fontWeight: '600', color: 'black', marginBottom: '49px' }}>What is investor's club</h1>
            <p style={{ fontSize: '18px', color: 'black' }}>
              Peter, a trailblazer in the investor's giveaway industry in Australia, having gifted five brand new Toyota and Lexus cars
              exclusively to his real estate clients between 2012 and 2015, now initiates $100,000 cash giveaways to members of the BESTTA
              Investors Club, established in 2024. This is accessible from once-off $10 or 66 cents per day while enjoying fun, discounted
              savings and more. His overarching mission is not solely to propel his conglomerate of companies under BESTTA Group to a
              billion-dollar status but, more crucially, to elevate all Mentoring Members to enduring millionaires,
              multi-millionaires, or even billionaires. This includes potential joint ventures with members.
            </p>
          </div>
        </div>
      </section>
      <div style={{ background: '#48474d' }}>
        <div style={{ width: '100%', margin: '0px auto' }}>
          {/* <h2>Our Partners</h2> */}
          <h2 className="section-title__title text-center">
            <span style={{ color: 'white' }}>Some of our Partners</span>
          </h2>
          <div
            style={{
              // backgroundImage: `url(${partner})`,
              // backgroundSize: "cover",
              // height: "400px",
              display: 'flex',
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
          {/* <h2 className="section-title__title text-center pb-60">
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
            <img src="assets/images/backgrounds/video-bg-1-1.jpg" alt="nisoz" />
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
      <section className="membership-section" style={{}}>
        <div className="container">
          <div className="container-small">
            <div className="section-title color-white mb-5">
              <h5 className="section-title__tagline">WHAT IS BESTTA?</h5>
              <h2 className="section-title__title">Membership Has Its Privileges</h2>
            </div>
            <div className="member-grid  mouse-wheel">
              {/* <img src="assets/images/shapes/Car-blue.png" alt="" class="car"> */}
              {/* <span class="center-dashed-line"></span> */}
              <div className="member-flex">
                <div className="member-flex-1">
                  <h5>COMMUNITY OF ENTHUSIASTS</h5>
                  <p>
                    Join a community of smart property investors and aspiring entrepreneurs, while sharing the excitement, anticipation and
                    the joy of winning now or the everlasting property and business portfolios in the end!
                  </p>
                </div>
                <span>
                  <i className="fa-solid fa-users" />
                </span>
              </div>
              <div className="member-flex">
                <span>
                  <i className="fa-solid fa-percent" />
                </span>
                <div className="member-flex-1">
                  <h5>EXCLUSIVE DISCOUNTS</h5>
                  <p>Unlock access to substantial discounts at businesses across Australia, all from an affordable membership fee.</p>
                </div>
              </div>
              <div className="member-flex">
                <div className="member-flex-1">
                  <h5>EXPERT SUPPORT</h5>
                  <p>
                    Got questions or need assistance? Our professional and trusted in-house support team is always ready to help, based on
                    our own building, Pacific Centre in Brisbane, developed by us in 2001, so we are always there as one of Qld's top 400
                    private companies.
                  </p>
                </div>
                <span>
                  <i className="fa-solid fa-headset" />
                </span>
              </div>
              <div className="member-flex">
                <span>
                  <i className="fa-solid fa-circle-pause" />
                </span>
                <div className="member-flex-1">
                  <h5>FLEXIBILITY TO OPT-OUT</h5>
                  <p>
                    We value your freedom. Not feeling the ride or want more secured win? Cancel, upgrade or downgrade your membership at
                    any time, no strings attached.
                  </p>
                </div>
              </div>
              <div className="member-flex">
                <div className="member-flex-1">
                  <h5>A GROWING FLEET</h5>
                  <p>
                    We continually work with our partners and Mentoring Members to bring you bigger and better prizes and quickly
                    build your ever-lasting property and or business portfolios like no others using our "20 no or little money down
                    strategies
                  </p>
                </div>
                <span>
                  <i className="fa-solid fa-car-side" />
                </span>
              </div>
              <div className="member-flex">
                <span>
                  <i className="fa-solid fa-handshake" />
                </span>
                <div className="member-flex-1">
                  <h5>TRUSTED PARTNERSHIPS</h5>
                  <p>
                    We have partnered with reputable businesses nationwide to ensure our members receive only the best deals and offers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*Testimonial Start*/}

      <section className="portfolio-two">
        <div className="container">
          <div className="section-title text-center mb-5">
            <h2 className="section-title__title">BESTTA Investors club</h2>
            <h5 className="section-title__tagline">Follow us on social media</h5>
          </div>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6">
              <Link to="javascript:void(0)">
                <div className="portfolio-two__item portfolio-two__item-sm">
                  <div className="portfolio-two__thumb">
                    <img src="/assets/images/myteam/1.png" alt="nisoz" height="200px" />
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6">
              <Link to="javascript:void(0)">
                <div className="portfolio-two__item portfolio-two__item-sm">
                  <div className="portfolio-two__thumb">
                    <img src="/assets/images/myteam/5.jpg" alt="nisoz" />
                    {/* <span className="icon-play">
                      <i className="fa-regular fa-circle-play" />
                    </span> */}
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
                    {/* <span className="icon-play">
                      <i className="fa-regular fa-circle-play" />
                    </span> */}
                  </div>
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

            {/* <div className="col-xl-3 col-lg-4 col-md-6">
              <Link to="javascript:void(0)">
                <div className="portfolio-two__item portfolio-two__item-sm">
                  <div className="portfolio-two__thumb">
                    <img
                      src="/assets/images/myteam/1.png"
                      alt="nisoz"
                    />
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6">
              <Link to="javascript:void(0)">
                <div className="portfolio-two__item portfolio-two__item-sm">
                  <div className="portfolio-two__thumb">
                    <img
                      src="/assets/images/myteam/1.png"
                      alt="nisoz"
                    />
                    <span className="icon-play">
                      <i className="fa-regular fa-circle-play" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6">
              <Link to="javascript:void(0)">
                <div className="portfolio-two__item portfolio-two__item-sm">
                  <div className="portfolio-two__thumb">
                    <img
                      src="/assets/images/myteam/1.png"
                      alt="nisoz"
                    />
                  </div>
                </div>
              </Link>
            </div> */}
          </div>
          <div className="d-flex justify-content-center mt-5">
            <Link to="javascript:void(0)" className="nisoz-btn">
              <span className="nisoz-btn__shape" />
              <span className="nisoz-btn__shape" />
              <span className="nisoz-btn__shape" />
              <span className="nisoz-btn__shape" />
              <span className="nisoz-btn__text">Load More</span>
            </Link>
            {/* /.btn */}
          </div>
        </div>
      </section>

      <section className="portfolio-two" style={{ backgroundColor: '#e2c3c3' }}>
        <div className="container">
          <div className="section-title text-center mb-5">
            <h2 className="section-title__title"> Forthcoming cash giveaway of $100,000</h2>
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
                                  <h3>{`${year.winners[0].prize} cash in year ${year?.year}`}</h3>
                                </div>
                                <div className="hover-content">
                                  {year?.winners.map((win, index) => (
                                    <>
                                      {`${prizeArr[index]} ${win.prize} : ${win.name} `}
                                      <br />
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

      <div className="pricing-table">
        <div className="container">
          <div className="section-title mb-5">
            <h2 className="section-title__title">Choose Your Access Level</h2>
            <h5 className="section-title__tagline">Select A Package Below To Get Access To Australia's No. 1 Investor's Rewards Club</h5>
          </div>
          <div className="pricingtablecontainer" style={{ display: 'block' }}>
            <Cards />
            <FixedPlan />
          </div>
        </div>
      </div>
      <div className="orangeLine"></div>
      <section className="landingFaqs">
        <div>
          <h1 style={{ fontWeight: '600', textAlign: 'center', color: 'black', marginBottom: '49px', marginTop: '60px' }}>
            FREQUENTLY ASK QUESTIONS
          </h1>
        </div>
        <div style={{ marginRight: '7%', marginLeft: '7%' }}>
          {data ? (
            <div className="faq-item">
              <div className="faq-question">
                <span>
                  <span className="star">&#9733;</span>What is your question? Kindly click the arrow down.
                </span>
                <span className="arrow down">&#9660;</span>
              </div>
              <div className="faq-answer">
                <p>This is the answer to the question. You can add more details here.</p>
              </div>
            </div>
          ) : (
            'not found'
          )}
        </div>
        <Link className="e-btn e-btn-2" style={{ width: '20%', margin: '60px auto', color: 'black' }} to="/faq">
          CLICK HERE FOR FAQS
        </Link>
      </section>

      {/* /.copyright */}
    </>
  );
};

export default Home;
