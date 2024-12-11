/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */

import { useEffect } from 'react';
import '../../assets/css/prize.css';

import { useSelector, useDispatch } from 'react-redux';
import { GetUpcomingDrawsApi } from '../../Slices/DrawsSlice';
import Skeleton from 'react-loading-skeleton';

import { Link, useNavigate } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';
import { REACT_API_URL } from '../../../config';

// Upcoming Draws

function MyTimer({ expiryTimestamp }) {
  const { totalSeconds, seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn('onExpire called')
  });

  const timerContainerLi = {
    height: '70px',
    width: '20%'
  };

  return (
    <div style={{ fontSize: '20px' }}>
      {/* <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
      <span>{seconds}</span> */}
      <div id="countdown">
        <ul
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            paddingLeft: '0px'
          }}
        >
          <li style={timerContainerLi}>
            <span id="days">{days}</span>
            days
          </li>
          <li style={timerContainerLi}>
            <span id="hours">{hours}</span>
            Hours
          </li>
          <li style={timerContainerLi}>
            <span id="minutes">{minutes}</span>
            Minutes
          </li>
          <li style={timerContainerLi}>
            <span id="seconds">{seconds}</span>
            Seconds
          </li>
        </ul>
      </div>
    </div>
  );
}

const MemberGiveAway = () => {
  const { GetUpcomingDraws, loading } = useSelector((state) => state.drawAction);
  const { isAuthenticated, isSubcription } = useSelector((state) => state.loginAction);
  // console.log(isSubcription, isAuthenticated);
  // const profileDetails = useSelector((state) => state.profileAction);
  // const { isSubcription, ProfileData } = profileDetails;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(GetUpcomingDrawsApi('upcoming'));
  }, []);

  const prize = ['1st Prize', '2nd Prize', '3rd Prize'];
  // // console.log(
  //   "isAuthenticated && isSubcription",
  //   isAuthenticated && isSubcription
  // );
  return (
    <div>
      <div className="bg-sec">
        <div className="container">
          <div className="main-sec1">
            {/*<h1>LOYALTY MEMBER WEEKLY GIVEAWAYS</h1>*/}
            <h1></h1>
            {!loading ? (
              <div className="bg-up">
                {GetUpcomingDraws[0] ? (
                  <div className="upcoming-event">
                    <div className="cash-img">
                      <img src={`${REACT_API_URL}${GetUpcomingDraws[0]?.image}`} />
                    </div>
                    <div className="value-text">
                      <div className="btn-style mx-auto">Upcoming giveaway</div>
                      <h3>{GetUpcomingDraws[0]?.name}</h3>
                      {GetUpcomingDraws[0]?.prizes?.map((item, index) => (
                        <p className="prize">
                          {prize[index]}: {item.description}
                        </p>
                      ))}
                      <p className="prize">
                        Schedule Date:
                        {new Date(GetUpcomingDraws[0]?.scheduleDate).getDate() +
                          ' - ' +
                          (parseInt(new Date(GetUpcomingDraws[0]?.scheduleDate).getMonth()) + 1) +
                          ' - ' +
                          new Date(GetUpcomingDraws[0]?.scheduleDate).getFullYear() +
                          ' ' +
                          new Date(GetUpcomingDraws[0]?.scheduleDate).toLocaleTimeString()}
                      </p>

                      <div className="winnerdraw d-flex justify-content-center">
                        {isAuthenticated ? (
                          <Link
                            to={`/upcoming-giveaways/${GetUpcomingDraws[0]?._id}`}
                            // target="_blank"
                            style={{ width: '50% !important' }}
                          >
                            Add More Entries
                          </Link>
                        ) : (
                          ''
                        )}

                        {isAuthenticated && localStorage.getItem('applyToDraw') && (
                          <Link
                            to={`/upcoming-giveaways/${GetUpcomingDraws[0]?._id}`}
                            // target="_blank"
                            style={{ width: '50% !important', marginLeft: '2%' }}
                          >
                            Apply Entries
                          </Link>
                        )}

                        {!isAuthenticated && !isSubcription && (
                          <Link to="/plans" style={{ width: '50% !important' }}>
                            Join Now
                          </Link>
                        )}
                        {/*
                      {isAuthenticated && !isSubcription && !localStorage.getItem('applyToDraw') && (
                            <Link to={`/membership`} style={{ width: '50% !important' }}>
                              Join Now
                            </Link>
                          )}           */}
                      </div>
                      <div className="flex items-center justify-center" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="timer-sec mt-3" style={{ width: '400px' }}>
                          <div id="countdown2">
                            <MyTimer expiryTimestamp={new Date(GetUpcomingDraws[0]?.scheduleDate)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <h1 style={{ color: 'black' }}>Not found</h1>
                )}
              </div>
            ) : (
              <div className="bg-up">
                <div className="upcoming-event">
                  <div className="cash-img">
                    <Skeleton style={{ height: '200px', width: '200px' }} />
                  </div>
                  <div className="value-text">
                    <Skeleton height="80px" width="30%" />
                    <div className="winnerdraw d-flex justify-content-center">
                      <Skeleton height="80px" width="40%" />
                    </div>
                    <div className="flex items-center justify-center" style={{ display: 'flex', justifyContent: 'center' }}>
                      <div className="timer-sec mt-3" style={{ width: '400px' }}>
                        <div id="countdown2">
                          <Skeleton />
                          <Skeleton />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="second-sec">
          <p  id="membershipupcoming">
            Upcoming <span>Giveaways</span>
          </p>
          <h4 className="sub-heading " id="headingChange">Don’t miss your chance, join now!</h4>
        </div>
      </div>
      <div className="container">
        <div className="product-grid" style={{ marginBottom: '40px' }}>
          {GetUpcomingDraws.length > 1 &&
            GetUpcomingDraws.slice(1, GetUpcomingDraws.length)?.map((eachDraw, i) => {
              return (
                <div
                  className="product_box big-box"
                  id="productbox_285"
                  key={i}
                  // onClick={() =>
                  //   navigate(`/upcoming-giveaways/${eachDraw._id}`)
                  // }
                >
                  <div className="product_header">
                    <div className="product_title">
                      <h4 className="heading">{eachDraw?.name}</h4>
                      <div style={{ heigth: '1%' }}>
                        {eachDraw?.prizes?.map((item, index) => (
                          <p className={`class${index}`}>
                            {prize[index]}: {item.description}
                          </p>
                        ))}
                      </div>
                      <p className="class2">
                        Schedule Date:
                        {new Date(eachDraw?.scheduleDate).getDate() +
                          ' - ' +
                          (parseInt(new Date(eachDraw?.scheduleDate).getMonth()) + 1) +
                          ' - ' +
                          new Date(eachDraw?.scheduleDate).getFullYear() +
                          ' ' +
                          new Date(eachDraw?.scheduleDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="product_image">
                    <img src={`${REACT_API_URL}${eachDraw?.image}`} alt="" />
                  </div>
                  <div className="winnerdraw ">
                    {isAuthenticated ? (
                      <Link
                        to={`/upcoming-giveaways/${eachDraw?._id}`}
                        // target="_blank"
                        style={{ width: '50% !important' }}
                      >
                        Add More Entries
                      </Link>
                    ) : (
                      ''
                    )}

                    {isAuthenticated && localStorage.getItem('applyToDraw') && (
                      <Link
                        to={`/upcoming-giveaways/${eachDraw?._id}`}
                        // target="_blank"
                        style={{ width: '50% !important' }}
                      >
                        Apply Entries
                      </Link>
                    )}

                    {!isAuthenticated && !isSubcription && (
                      <Link to="/plans" style={{ width: '50% !important' }}>
                        Join Now
                      </Link>
                    )}
                  </div>
                  <div className="custLftRT">
                    <div className="w-full  flex items-center justify-center">
                      <div className="timer-sec mt-4">
                        <div id="countdown2">
                          <MyTimer expiryTimestamp={new Date(eachDraw?.scheduleDate)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MemberGiveAway;
