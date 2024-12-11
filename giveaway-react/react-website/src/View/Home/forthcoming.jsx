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

const Forthcoming = () => {
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
    {console.timeLog("GetUpcomingDraws",GetUpcomingDraws)}
      <div className="container">
        <div className="product-grid" style={{ marginBottom: '40px' }}>
          {GetUpcomingDraws.length > 0 &&
            GetUpcomingDraws?.map((eachDraw, i) => {
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
                    </div>
                  </div>
                  <div className="winner_image">
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
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Forthcoming;
