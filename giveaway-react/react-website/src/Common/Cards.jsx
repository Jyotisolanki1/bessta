import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetPlansApi } from '../Slices/PlanSlice';
import { GetProfileApi } from '../Slices/LoginSlice';
import { GetPlanCategoriesApi } from '../Slices/PlanCategorySlice';
import Loader from '../Common/Loader';
import parse from 'html-react-parser';
import { Link, useNavigate } from 'react-router-dom';
import { SetSubscriptionPlan } from '../Slices/CommonSlice';
import Skeleton from 'react-loading-skeleton';

const Cards = () => {
  const Plans = useSelector((state) => state.planAction);
  const { isAuthenticated, isSubcription } = useSelector((state) => state.loginAction);
  const Profile = useSelector((state) => state.loginAction);
  const Categories = useSelector((state) => state.planCategoryAction);
  const [action, setAction] = useState(false);
  const { userToken } = useSelector((state) => state.loginAction);
  const navigate = useNavigate();

  const [activePlan, setActivePlan] = useState(0);
  const [activeCategory, setActiveCategory] = useState('');
  const [planFound, setPlanFound] = useState(false);

  const dispatch = useDispatch();
  const activeData = Categories?.PlanCategories.filter((item) => item?.status === 'active' || item?.status === 'enabled');

  const GetPlansAndCategories = async () => {
    await dispatch(GetProfileApi(userToken));
    await dispatch(GetPlansApi('plans?type=fixed'));
    const response = await dispatch(GetPlanCategoriesApi());

    if (response.success) {
      const activeCatData = response?.data?.filter((item) => item.status === 'active' || item.status === 'enabled');
      setActiveCategory(activeCatData[0]._id);
    }
  };

  useEffect(() => {
    GetPlansAndCategories();
  }, []);

  const handleACtivePlan = (index, id) => {
    setActivePlan(index);
    setActiveCategory(id);
  };

  useEffect(() => {
    if (Plans?.PlansData) {
      const anyVideosFound = Plans?.PlansData.some(
        (eachCourse) =>
          eachCourse?.category._id?.includes(activeCategory) &&
          (eachCourse?.status === 'active' || eachCourse?.status === 'enabled')
      );
      setPlanFound(anyVideosFound);
    }
  }, [Plans, activeCategory]);

  const handleClick = (data) => {
    dispatch(SetSubscriptionPlan(data));
    localStorage.setItem('subsciptionPlan', data);
  };

  // ReadMore Component
  const ReadMore = ({ children, maxHeight = 250 }) => {
    if(window.innerWidth<=420){
      maxHeight = 250;
    }
    if(window.innerWidth>420 && window.innerWidth<=440){
      maxHeight = 250;
    }
    if(window.innerWidth>440 && window.innerWidth<=499){
      maxHeight = 260;
    }
    const [isExpanded, setIsExpanded] = useState(false);
    const [needsReadMore, setNeedsReadMore] = useState(false);
    const contentRef = useRef(null);
  
    useEffect(() => {
      if (contentRef.current) {
        setNeedsReadMore(contentRef.current.scrollHeight > maxHeight);
      }
    }, [maxHeight]);
  
    const toggleReadMore = () => setIsExpanded(!isExpanded);
  
    return (
      <div>
        <div
          ref={contentRef}
          style={{
            maxHeight: isExpanded || !needsReadMore ? 'none' : `${maxHeight}px`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {children}
        </div>
        {needsReadMore && (
          <div
            style={{
              textAlign: 'right',
              marginTop: '10px'
            }}
          >
            <button
              onClick={toggleReadMore}
              style={{
                background: 'none',
                border: 'none',
                color: '#007BFF',
                cursor: 'pointer',
                padding: '10px 0',
                fontSize: '16px',
              }}
            >
              {isExpanded ? (
                <span style={{ color: "black" }}>Read Less ▲</span>
              ) : (
                <span style={{ color: "black" }}>Read More ▼</span>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };
  

  return (
    <div>
      {Categories.loading || Plans.loading || Profile.loading ? (
        <Loader />
      ) : (
        <div className="container">
          {activeData.map((each, index) => {
            const plans = Plans.PlansData.filter((plan) => plan.category._id === each._id);
            return (
              <div key={index} className="category-section" >
              <button
              className='cateogry'
                style={{
                  background: '#f28500',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  padding: '10px 20px',
                  border: 'none',
                  marginLeft: '40%',
                  marginTop: '10%'
                }}
              >
                {each.name}
              </button>

                <div className="pricingtablecontainer2">
                  {plans ? (
                    plans.map((eachPlan, i) => {
                      let priceDivide = eachPlan.price / 30;
                      return (
                        <div
                          key={i}
                          className={
                            eachPlan?.mostPopuler === 'true'
                              ? 'wow fadeInUp animated card-active'
                              : 'wow fadeInUp animated'
                          }
                          data-wow-delay="100ms"
                          style={{
                            visibility: 'visible',
                            animationDelay: '100ms',
                            animationName: 'fadeInUp',
                          }}
                        >
                          {eachPlan?.mostPopuler === 'true' ? (
                            <div className="card-pricingtable-head">
                              <h2>Most Popular</h2>
                            </div>
                          ) : (
                            ''
                          )}
                          <div
                            className={
                              eachPlan?.mostPopuler === 'true'
                                ? 'card-pricingtable'
                                : 'pricingtable'
                            }
                            style={{
                              border: '1px solid #f28500',
                              borderTop: '6px solid #f28500',
                            }}
                          >
                            <div className="main-head">
                              <h2>{eachPlan.name}</h2>
                            </div>
                            <ul className="popular">
                              <li
                                className="pricingtable__highlight js-montlypricing"
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                              >
                                ${eachPlan.price}
                                <span>/{eachPlan.intervalType}</span>
                              </li>
                              <div
                                className="section-title mb-2"
                                style={{
                                  borderBottom: '0.5px solid #80808045',
                                }}
                              >
                                <h6 className="section-plan__tagline">
                                  <b>
                                    <span>(${priceDivide.toFixed(2)}/day)</span>
                                  </b>
                                </h6>
                                <h6 className="section-plan__tagline">
                                  Entries:&nbsp;{eachPlan?.entries} <br />
                                  Interval Count:&nbsp;{eachPlan?.intervalCount} ({eachPlan?.intervalType})
                                </h6>
                              </div>
                            </ul>
                            <div className="price-feature">
                              <ul
                              className="planUl"
                                
                              >
                                <li
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                  }}
                                >
                                  <ReadMore>{parse(eachPlan.discription)}</ReadMore>
                                </li>
                              </ul>

                              {!isAuthenticated && (
                                <Link className="e-btn e-btn-2" to="/signup" onClick={() => handleClick(eachPlan)}>
                                  Sign Up
                                </Link>
                              )}
                              {isAuthenticated && !isSubcription && (
                                <Link className="e-btn e-btn-2" to={`/purchase?planid=${eachPlan._id}`} state={eachPlan}>
                                  Purchase
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="pricingtablecontainer2">
                      <Skeleton style={{ height: '500px', width: '400px' }} />
                      <Skeleton style={{ height: '500px', width: '400px' }} />
                      <Skeleton style={{ height: '500px', width: '400px' }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cards;
