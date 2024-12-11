/* eslint-disable react/jsx-key */
import React, { useEffect, useRef } from 'react';
import { GetProfileApi } from '../../Slices/LoginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { GetCourseApi } from '../../Slices/CourseSlice';
import { GetCourseCategoryApi } from '../../Slices/CourseCategorySlice';
import Loader from '../../Common/Loader';
import { useState } from 'react';
import VideoModel from './VideoModel';
import MemberShip from '../MemberShip/MemberShip';
import moment from 'moment/moment';

import { Virtual, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Skeleton from 'react-loading-skeleton';
import { GetPartnersApi } from '../../Slices/GetPartners';
import { REACT_API_URL } from '../../../config';
import { Link, useNavigate } from 'react-router-dom';

const Landing = () => {
  const dispatch = useDispatch();
  const [videosFound, setVideosFound] = useState(false); 
  // const profileDetails = useSelector((state) => state.profileAction);
  // const { isSubcription, ProfileData } = profileDetails;
  const { userToken, isSubcription, ProfileData, profileLoading } = useSelector((state) => state.loginAction);
  const profileDetails = useSelector((state) => state.loginAction);
  const CourseData = useSelector((state) => state.courseAction);
  const [active, setActive] = useState(false);
  const [courseCategoryId, setCourseCategoryId] = useState('');
  const Categories = useSelector((state) => state.courseCategoryAction);
  const { getPartnersList } = useSelector((state) => state.getPartnerAction);
  const [totalEntries, setTotalEntries] = useState();

  //navigate
  const navigate = useNavigate();

  // const imagesArray = getPartnersList?.map((eachImage) => eachImage?.image);

  // // console.log("🚀 ~ Landing ~ userToken:", userToken);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;

    dispatch(GetProfileApi(userToken));
    dispatch(GetCourseApi());
    dispatch(GetCourseCategoryApi());
    dispatch(GetPartnersApi());
  }, [dispatch, userToken]);
  const selectDraw = (subcriptionId) => {
    localStorage.setItem('applyToDraw', subcriptionId);
    navigate('/upcoming-giveaways');
  };

  useEffect(() => {
    if (CourseData?.Courses) {
      const anyVideosFound = CourseData.Courses.some((eachCourse) => eachCourse?.category?._id?.includes(courseCategoryId));
      setVideosFound(anyVideosFound);
    }
  }, [CourseData, courseCategoryId]);

  useEffect(() => {
    if (ProfileData) setTotalEntries(ProfileData?.myentries + profileDetails?.ProfileData?.packageEntry);
  }, [ProfileData]);
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
                style={{ cursor: 'pointer' }}
                alt={`Image ${index}`}
              />
            </div>
          </a>
        ) : (
          <div className="logos">
            <img
              src={`${REACT_API_URL}${el}`}
              // width={300}
              // height={150}
              style={{ margin: '25px' }}
              alt={`Image ${index}`}
            />
          </div>
        )}
      </React.Fragment>
    );
  });

  const handlePlayButton = (e, coursedetails) => {
    e.preventDefault();
    localStorage.setItem('video', JSON.stringify(coursedetails));
    navigate('/video');
    setActive(true);
  };

  const handleCategoryId = (e) => {
    setCourseCategoryId(e.target.value);
  };

  // handle upgrate
  const handleSubcription = () => {
    if (isSubcription) {
      const upgrate = window.confirm(`Are you sure you want to update the membership?\nSubscription cost will be change accordingly.`);

      // const upgrate = confirm('Are you sure you want to upgrate your membership,Subscription cost will be changed as well?');
      if (upgrate) {
        navigate('/membership');
      }
    } else {
      navigate('/membership');
    }
  };

  // console.log('ProfileData', profileLoading, ProfileData);
  return (
    <div>
      {profileDetails?.loading || CourseData?.Courses?.loading || Categories?.loading ? (
        <Loader />
      ) : (
        <>
          <div className="bg-sec">
            <div>
              <div className="container">
                <div className="landingpage">
                  <div className="upper-tag pt-5">
                    <div className="icons pt-3"></div>
                    <h5>Dashboard</h5>
                  </div>

                  {profileLoading && !profileDetails?.ProfileData ? (
                    'waiting'
                  ) : (
                    <div
                      className={
                        profileDetails?.ProfileData?.packagePlan != null && !profileDetails?.ProfileData?.packagePlan?.draw_id
                          ? 'profile-card1'
                          : 'profile-card'
                      }
                    >
                      <div className="user-info cash-img Dashboard" style={{ margin: '0 !importtant' }}>
                        {ProfileData?.user?.image === '' ? (
                          <img src="assets/images/avtar.png" loading="lazy" />
                        ) : (
                          <img src={`${REACT_API_URL}${ProfileData?.user?.image}?${Date.now()}`} loading="lazy" />
                        )}
                        <div className="user-details">
                          <h3>
                            {ProfileData?.user?.firstname ? (
                              <>
                                {ProfileData?.user?.firstname.charAt(0).toUpperCase() +
                                  ProfileData?.user?.firstname.slice(1) +
                                  ' ' +
                                  ProfileData?.user?.lastname}
                              </>
                            ) : (
                              <>
                                <Skeleton height="20px" width="50%" />
                                <Skeleton height="20px" width="50%" />
                                <Skeleton height="20px" width="50%" />
                              </>
                            )}
                          </h3>
                          <p className="member-status"> {profileDetails?.ProfileData?.subcription?.plan_id?.name || <br />}</p>
                          <p className="member-since" style={{ marginTop: '3%' }}>
                            {isSubcription ? (
                              `Since:- ${moment(profileDetails?.ProfileData?.subcription?.createdAt).format('DD-MM-YYYY')}`
                            ) : (
                              <br />
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="entries-section" style={{ marginBottom: '17px' }}>
                        <h3>
                          {ProfileData?.user?.firstname ? (
                            <p>Accumulating Member Entries - {ProfileData?.myentries}</p>
                          ) : (
                            <>
                              <Skeleton height="30px" width="50%" />
                            </>
                          )}
                        </h3>

                        <p className="package-entry">
                          {profileDetails?.ProfileData?.packageEntry ? (
                            <p style={{ color: '#429ef5', fontSize: '18px' }}>
                              Package Member Entries : {profileDetails?.ProfileData?.packageEntry}
                            </p>
                          ) : (
                            <p style={{ marginBottom: '12px' }} />
                          )}
                        </p>
                        <p className="total-events">
                          {ProfileData?.user?.firstname ? (
                            <> Total Entries - {totalEntries}</>
                          ) : (
                            <>
                              <Skeleton height="20px" width="50%" />
                            </>
                          )}
                        </p>
                        {profileDetails?.ProfileData?.packagePlan != null && !profileDetails?.ProfileData?.packagePlan?.draw_id ? (
                          <>
                            <p
                              className="nisoz-btn "
                              style={{
                                border: '1px solid #f28500',
                                background: 'none',
                                color: 'black',
                                margin: 0
                              }}
                              onClick={() => selectDraw(profileDetails?.ProfileData?.packagePlan?._id)}
                            >
                              <span className="applyentrybtn">Apply Entries</span>
                            </p>
                            <h5 style={{ color: 'red' }}>This is a one-time off entries for the incoming giveaway.</h5>
                          </>
                        ) : (
                          <p>
                            <br />
                            <br />
                          </p>
                        )}
                      </div>
                      <div className="actions" style={{ marginBottom: '25px' }}>
                        {ProfileData?.user?.firstname ? (
                          <div className="main-slider-two__btn transform-none">
                            <button className="nisoz-profile" onClick={handleSubcription} style={{ zIndex: 'unset' }}>
                              {isSubcription ? 'Update' : 'Add Plan'}
                            </button>
                            <br />
                          </div>
                        ) : (
                          <>
                            <Skeleton height="30px" width="50%" />
                          </>
                        )}

                        {ProfileData?.user?.firstname ? (
                          <Link style={{ color: '#429ef5', fontSize: '20px' }} to="/profile" className="applyEntries">
                            Edit Profile
                          </Link>
                        ) : (
                          <>
                            <Skeleton height="30px" width="50%" />
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="container mt-5">
                <div className="d-flex flex-md-row justify-content-between align-items-center pt-md-5 pb-3 pb-md-50 eventCount">
                  <div className="Entries mb-3 mb-md-0">
                    <span>{profileDetails?.ProfileData?.totalevent}</span>
                    <span>Total Events</span>
                  </div>
                  <div className="Entries mb-3 mb-md-0">
                    <span>{profileDetails?.ProfileData?.currentevent}</span>
                    <span>Current Events</span>
                  </div>
                  {/* {isSubcription && ( */}
                  <div className="main-slider-two__btn transform-none">
                    <Link
                      to="/upcoming-giveaways"
                      className="nisoz-btn-view-all-landing"
                      style={{
                        border: '1px solid #f28500',
                        background: 'none'
                      }}
                    >
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__text">View All</span>
                    </Link>
                  </div>
                  {/* )} */}
                  {/* /.btn */}
                </div>
              </div>
            </div>
          </div>
          {(isSubcription || profileDetails?.ProfileData?.packagePlan) && (
            <div>
              <div className="container ">
                <div className="second-sec d-flex justify-content-between">
                  <h2 className="coachingvideo">Coaching Videos</h2>
                  <div className=" transform-none">
                    <select
                      onChange={handleCategoryId}
                      value={courseCategoryId}
                      style={{
                        height: '40px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        marginTop: '10px'
                      }}
                    >
                      <option value="">Filter By Course Categories</option>
                      {Categories?.CoursesCategories &&
                        Categories?.CoursesCategories?.map((eachCategory) => {
                          return (
                            <option value={eachCategory._id} key={eachCategory._id}>
                              {eachCategory?.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="videoContainer">
                <div className="container">
                  <div className="row pt-5">
                    {videosFound ? (
                      CourseData?.Courses?.map((eachCourse, i) => {
                        // Check if the course belongs to the specified category and has an active status
                        if (
                          eachCourse?.category?._id?.includes(courseCategoryId) &&
                          eachCourse?.status === 'active' &&
                          eachCourse?.category?.status === 'enabled'
                        ) {
                          return (
                            <div
                              className="col-xl-3 col-lg-4 col-md-6 videoClass"
                              onClick={(e) => handlePlayButton(e, eachCourse)}
                              style={{ cursor: 'pointer' }}
                              key={i}
                            >
                              <div className="portfolio-two__item portfolio-two__item-sm">
                                <div className="portfolio-two__thumb height-change">
                                  {eachCourse?.videoType === 'youtube' ? (
                                    <img src={`https://img.youtube.com/vi/${eachCourse?.video}/hqdefault.jpg`} alt="nisoz" />
                                  ) : (
                                    <img src={`https://vumbnail.com/${eachCourse?.video}.jpg`} alt="nisoz" />
                                  )}
                                  <span className="icon-play">
                                    <i className="fa-regular fa-circle-play" />
                                  </span>
                                </div>
                                <h3 className="ProductBlock mt-3">{eachCourse.name}</h3>
                              </div>
                            </div>
                          );
                        }
                        return null; // Return null for items that don't match the condition
                      })
                    ) : (
                      <div className="col-md-12 d-flex justify-content-center">
                        <h5>No videos found</h5>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <section>
            <MemberShip />
          </section>

          {!isSubcription && !profileDetails?.ProfileData?.packagePlan && (
            <div className="row py-4 my-4">
              <div
                className="col-md-12 d-flex"
                style={{
                  justifyContent: 'center'
                }}
              >
                <img src="assets/images/error.png" alt="nisoz" width="250px" />
              </div>
              <div
                className="col-md-12 d-flex"
                style={{
                  justifyContent: 'center'
                }}
              >
                <h5 className="video-one__content__title font-change mt-5" style={{ color: 'black' }}>
                  Unlock exclusive events by upgrading your subscription
                </h5>
              </div>
            </div>
          )}
          {/* <section className="video-one pt-3 pb-5 mb-5">
              <div className="container">
                <div
                  className="video-one__banner landing-content wow fadeInUp"
                  data-wow-delay="100ms"
                >
                  <img
                    src="assets/images/error.png"
                    alt="nisoz"
                  />
                  <div className="video-one__content">
                    <h5 className="video-one__content__title font-change mt-5">
                      Unlock exclusive events by upgrading your subscription
                    </h5>
                  </div>
                </div>
              </div>
            </section> */}

          <div className="client-carousel " style={{ backgroundColor: 'rgb(72, 71, 77) !important' }}>
            <div style={{ width: '80%', margin: '0px auto', backgroundColor: 'rgb(72, 71, 77)' }}>
              <h2 style={{ color: 'white', fontSize: '30px' }} className="loginOurPartner">
                Our Partners
              </h2>
              <div
                className="swiper-div"
                style={{
                  // Add any additional styles you want for the container
                  display: 'flex',
                  alignItems: 'center',
                  // Add media query for responsiveness
                  '@media (max-width: 768px)': {
                    // Adjust styles for smaller screens
                    flexDirection: 'column'
                  }
                }}
              >
                <Swiper
                  modules={[Virtual, Autoplay]}
                  spaceBetween={15}
                  slidesPerView={3}
                  virtual
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  // Add breakpoints for responsive settings
                  breakpoints={{
                    // when window width is <= 320px
                    320: {
                      slidesPerView: 2
                    },

                    // when window width is <= 768px
                    768: {
                      slidesPerView: 2
                    },
                    // when window width is <= 992px
                    992: {
                      slidesPerView: 3
                    }
                  }}
                >
                  {slides?.map((slideContent, index) => (
                    <SwiperSlide key={index} virtualIndex={index} className="w-fit">
                      {slideContent}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Landing;
