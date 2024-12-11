import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { GetDrawsApi } from '../../Slices/DrawsSlice';
import { Link } from 'react-router-dom';
import { REACT_API_URL } from '../../../config';
import Skeleton from 'react-loading-skeleton';
import { Carousel, Carousel2 } from './Carousel';
import { GetPastWinnersApi } from '../../Slices/PastWinners';

// Previous Draws

const MembersDraws = () => {
  const [pastWinner, setPastWinnerData] = useState();
  const { loading, GetDraws } = useSelector((state) => state.drawAction);
  const { isAuthenticated } = useSelector((state) => state.loginAction);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetDrawsApi('old'));
    dispatch(GetPastWinnersApi()).then((data) => setPastWinnerData(data.data));
  }, [dispatch]);

  return (
    <>
      <div className="stricky-header stricked-menu main-menu main-menu-with-border">
        <div className="sticky-header__content" />
        {/* /.sticky-header__content */}
      </div>
      {/* /.stricky-header */}
      {/*Main Slider Start*/}
      {/*Main Slider End*/}
      <div className="container" style={{marginTop:"70px"}}>
        <div className="second-sec">
          <h2 id="pastwinnres">
            PAST <span> WINNERS</span>
          </h2>
        </div>
      </div>
      <div className="container">
        {loading ? (
          <div>
            <Skeleton className="product_box mb-5" style={{ height: '30rem' }} />
          </div>
        ) : (
          <div className="product-grid">
            {pastWinner && pastWinner?.length > 0 ? (
              <>
                {pastWinner?.map((eachDraw, index) => (
                  <div className="product_box" id="" key={index}>
                    <div className="product_image ">
                      <img src={`${REACT_API_URL}${eachDraw.image}`} alt="" id="winnerImage"/>
                    </div>
                    <div className="product_header">
                      <div className="product_title text-center">
                        <br />
                        <h5 className="mb-4">
                          <strong>Draw Year : </strong>
                          {eachDraw.year}
                        </h5>
                      </div>
                      <Carousel2 eachDraw={eachDraw} />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div>
                <Skeleton className="product_box mb-5" style={{ height: '30rem' }} />
              </div>
            )}
          </div>
        )}
      </div>{' '}
      <div className="section-title mb-5">
        {/* <h2 className="section-title__title">Choose Your Access Level</h2> */}
        <h5
          className="section-title__tagline"
          style={{
            padding: '10px 80px',
            fontSize: '22px',
            textTransform: 'none'
          }}
        >
          You could be one of the lucky winners from 66cent a day or more securely and almost guaranteed to create millions, tens of
          millions or billions of dollars in wealth in your life for our Mentoring Members with right mindset and consistent action
          under Peter Huang's weekly guidance implementing Peter's 20 No or Little Money Down Strategies
        </h5>
        <div className=" row d-flex justify-content-center">
          <div className="col-md-12"></div>
          {isAuthenticated ? (
            <Link
            className='investor_club'
              to="/landing"
              style={{
                textAlign: 'center',
                fontSize: '14px',
                padding: '15px 30px',
                textTransform: 'none',
                fontWeight: 700,
                letterSpacing: '3px',
                borderRadius: '17px',
                backgroundColor: '#f28500',
                color: '#fff',
                textDecoration: 'none',
                display: 'block',
                marginTop: '15px',
                width: '30%'
              }}
            >
              Join BESTTA Investors Club Now
            </Link>
          ) : (
            <Link
              to="/plans"
             
              id="investres"
            >
              Join BESTTA Investors Club Now
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default MembersDraws;
