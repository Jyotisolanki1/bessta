import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetPlansApi } from '../../Slices/PlanSlice';
import { GetProfileApi } from '../../Slices/LoginSlice';
import { GetPlanCategoriesApi } from '../../Slices/PlanCategorySlice';
import Loader from '../../Common/Loader';
import parse from 'html-react-parser';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { UpdateSubscriptionApi } from '../../Slices/Subscription';
import { CancelSubscriptionApi } from '../../Slices/Subscription';
import FixedPlan from './fixed';

const MemberShip = () => {
  const Plans = useSelector((state) => state.planAction);
  const Profile = useSelector((state) => state.loginAction);
  const { isSubcription, ProfileData } = Profile;
  const Categories = useSelector((state) => state.planCategoryAction);
  const [action, setAction] = useState(false);
  const { userToken } = useSelector((state) => state.loginAction);
  const navigate = useNavigate();

  const [activePlan, setActivePlan] = useState(0);
  const [activeCategory, setActiveCategory] = useState('');
  const [planFound, setPlanFound] = useState(false);

  const dispatch = useDispatch();
  const activeData = Categories?.PlanCategories.filter((item) => item.status === 'active' || item.status === 'enabled');

  const Plansdata = Plans?.PlansData.filter((item) => item.status === 'active' || item.status === 'enabled');

  const [buttonState, setButtonState] = useState({});

  const GetPlansAndCategories = async () => {
    await dispatch(GetProfileApi(userToken));
    await dispatch(GetPlansApi('plans?type=fixed'));
    const response = await dispatch(GetPlanCategoriesApi());

    if (response.success) {
      const activeCatData = response?.data?.filter((item) => item.status === 'active' || item.status === 'enabled');
      setActiveCategory(activeCatData[0]?._id);
    }
  };

  useEffect(() => {
    GetPlansAndCategories();
  }, []);

  const handleACtivePlan = (index, id) => {
    setActivePlan(index);
    setActiveCategory(id);
  };

  const ReadMore = ({ children, maxHeight = 250 }) => {
    if (window.innerWidth <= 420) {
      maxHeight = 250;
    }
    if (window.innerWidth > 420 && window.innerWidth <= 440) {
      maxHeight = 250;
    }
    if (window.innerWidth > 440 && window.innerWidth <= 499) {
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
            position: 'relative'
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
                fontSize: '16px'
              }}
            >
              {isExpanded ? <span style={{ color: 'black' }}>Read Less ▲</span> : <span style={{ color: 'black' }}>Read More ▼</span>}
            </button>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (Plans?.PlansData) {
      const anyVideosFound = Plans?.PlansData.some((eachCourse) => eachCourse?.category?._id?.includes(activeCategory));
      setPlanFound(anyVideosFound);
    }
  }, [Plans, activeCategory, planFound]);

  const handleUpdateCancelSubScribe = async (path, planData, activePlanId) => {
    const buttonId = `${planData._id}-button`;

    // If already processing, return
    if (buttonState[buttonId] === 'processing') return;

    // Set button to processing
    setButtonState((prev) => ({ ...prev, [buttonId]: 'processing' }));

    if (activePlanId === planData?._id) {
      const result = window.confirm('Are you sure you want to cancel the membership?');
      if (result) {
        const res = await dispatch(CancelSubscriptionApi(userToken));
        if (res.success) {
          await dispatch(GetProfileApi(userToken));
          setAction((prevState) => !prevState);
          toast.success('Subscription Cancelled Successfully');
        } else {
          setAction((prevState) => !prevState);
        }
      }
    } else {
      const result = window.confirm(
        `Upgrades/downgrades are only allowed once in a billing cycle and all entries upgrades will be updated in the next billing cycle. If you wish to add more entries to your current billing cycle, you should purchase package members`
      );
      if (result) {
        const res = await dispatch(UpdateSubscriptionApi({ plan_id: planData._id }, userToken));
        if (res.success) {
          await dispatch(GetProfileApi(userToken));
          setAction((prevState) => !prevState);
          toast.success(res?.message);
        } else {
          toast.error(res?.message);
        }
        setButtonState((prev) => ({ ...prev, [buttonId]: res.success ? (activePlanId === planData._id ? 'Cancel' : 'Upgrade') : 'Error' }));
      }
    }

    // Update button text after action
  };

  const handleSubScribe = (path, planData) => {
    navigate(path, { state: planData });
  };

  return (
    <div>
      {Categories.loading || Plans.loading || Profile.loading ? (
        <Loader />
      ) : (
        <div className="container">
          <div className="category-div" style={{ marginBottom: '2%' }}>
            <FixedPlan />
            {activeData.map((each, index) => {
              const plans = Plans.PlansData.filter((plan) => plan.category._id === each._id);
              return (
                <div key={index} className="category-section">
                  <button
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
                    className="cateogry"
                  >
                    {each.name}
                  </button>
                  <div className="pricingtablecontainer2">
                    {plans.map((eachPlan, i) => {
                      let priceDivide = eachPlan.price / 30;
                      return (
                        <div
                          key={i}
                          className={eachPlan?.mostPopuler === 'true' ? 'wow fadeInUp animated card-active' : 'wow fadeInUp animated'}
                        >
                          {eachPlan?.mostPopuler === 'true' && (
                            <div className="card-pricingtable-head">
                              <h2>Most Popular</h2>
                            </div>
                          )}
                          <div
                            className={eachPlan?.mostPopuler === 'true' ? 'card-pricingtable' : 'pricingtable'}
                            style={{ border: '1px solid #f28500', borderTop: '6px solid #f28500' }}
                          >
                            <div className="main-head">
                              <h2>{eachPlan.name}</h2>
                            </div>
                            <ul className="popular">
                              <li
                                className="pricingtable__highlight js-montlypricing"
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center'
                                }}
                              >
                                ${eachPlan.price}
                                <span>/{eachPlan.intervalType}</span>
                              </li>
                              <div
                                className="section-title mb-2"
                                style={{
                                  borderBottom: '0.5px solid #80808045'
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
                              <ul className="planUl">
                                <li
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start'
                                  }}
                                >
                                  <ReadMore>{parse(eachPlan.discription)}</ReadMore>
                                </li>
                              </ul>
                              <div
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  justifyContent: 'center'
                                }}
                              >
                                {isSubcription ? (
                                  <button
                                    id={`${eachPlan._id}-button`}
                                    style={{
                                      width: '80%',
                                      border: 'none',
                                      backgroundColor: Profile?.ProfileData?.subcription?.plan_id?._id === eachPlan._id && 'green!important'
                                    }}
                                    onClick={(e) =>
                                      handleUpdateCancelSubScribe(
                                        `/payments?planid=${eachPlan._id}`,
                                        eachPlan,
                                        Profile.ProfileData?.subcription?.plan_id?._id
                                      )
                                    }
                                    className={
                                      Profile.ProfileData?.subcription?.plan_id?._id === eachPlan._id
                                        ? 'e-btn-active e-btn'
                                        : eachPlan?.mostPopuler === 'true'
                                        ? 'populzarbtn'
                                        : 'e-btn e-btn-2'
                                    }
                                  >
                                    {buttonState[`${eachPlan._id}-button`] === 'processing'
                                      ? 'Processing...'
                                      : Profile.ProfileData?.subcription?.plan_id?._id === eachPlan._id
                                      ? 'Cancel'
                                      : Profile?.ProfileData?.subcription?.plan_id?.price > eachPlan.price
                                      ? 'Downgrade'
                                      : 'Upgrade'}
                                  </button>
                                ) : (
                                  <button
                                    style={{ width: '80%', border: 'none' }}
                                    onClick={() => handleSubScribe(`/payments?planid=${eachPlan._id}`, eachPlan)}
                                    className={eachPlan?.mostPopuler === 'true' ? 'populzarbtn' : 'e-btn e-btn-2'}
                                  >
                                    Purchase
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberShip;
