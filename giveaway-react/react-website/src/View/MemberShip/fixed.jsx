/* eslint-disable react/jsx-key */
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetPlansApi, GetPlansLevelApi } from '../../Slices/PlanSlice';
// import { GetProfileApi } from '../../Slices/LoginSlice';
import { GetAllPlanCategoriesApi } from '../../Slices/PlanCategorySlice';
import Loader from '../../Common/Loader';
import parse from 'html-react-parser';
import { SetSubscriptionPlan } from '../../Slices/CommonSlice';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const FixedPlan = () => {
  const Plans = useSelector((state) => state.planAction);

  const Profile = useSelector((state) => state.loginAction);
  const Categories = useSelector((state) => state.planCategoryAction);
  const [catpack, setcatpack] = useState([]);

  const { isAuthenticated, isSubcription } = useSelector((state) => state.loginAction);
  // const { userToken } = useSelector((state) => state.loginAction);

  const [activePlan, setActivePlan] = useState(0);
  const [activeCategory, setActiveCategory] = useState('');
  const dispatch = useDispatch();

  // useEffect(()=>{
  //   if(Categories?.AllCategories){
  //     var activeFixedPlan = Categories?.AllCategories?.filter(item => item.status === 'active');
  //     setActiveData(activeFixedPlan)
  //     if(activeFixedPlan){
  //       setcatpack(activeFixedPlan[0])
  //     }
  //   }

  // },[])

  const { PlansLevelData } = useSelector((state) => state.planAction);
  const ReadMore = ({ children, maxHeight = 270 }) => {
    if (window.innerWidth <= 420) {
      maxHeight = 250;
    }
    if (window.innerWidth > 420 && window.innerWidth <= 481) {
      maxHeight = 200;
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

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between', // Optional: Adjust spacing between items
    alignItems: 'center', // Optional: Align items vertically
    gap: '3%'
  };

  const GetPlansAndCategories = async () => {
    // await dispatch(GetProfileApi(userToken));
    await dispatch(GetPlansApi('plans?type=fixed'));

    const response = await dispatch(GetAllPlanCategoriesApi('all'));
    if (response?.success) {
      var activeFixedPlan = response?.data?.filter((item) => item?.status === 'active' || item?.status === 'enabled');
      setActiveCategory(activeFixedPlan[0]?._id);
      setcatpack([activeFixedPlan[0]]);
    }
  };

  useEffect(() => {
    GetPlansAndCategories();
    dispatch(GetPlansLevelApi());
  }, [dispatch]);

  const handleACtivePlan = (index, id) => {
    setActivePlan(index);
    setActiveCategory(id);
  };

  const handleClick = (data) => {
    dispatch(SetSubscriptionPlan(data));
    localStorage.setItem('subsciptionPlan', data);
  };

  return (
    <div>
      {Categories?.loading || Plans?.loading || Profile?.loading ? (
        <Loader />
      ) : (
        <div className="container" style={{ padding: '10px', marginTop: '68px' }}>
          {/* Toggle  */}
          {PlansLevelData && PlansLevelData[0]?.category?.status != 'disabled' && (
            <div className="fixedPlans">
              <button
                style={{
                  background: '#f28500',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  padding: '10px 20px',
                  border: 'none'
                }}
                id="packageCategoryBtn"
              >
                Package Membership
              </button>
            </div>
          )}
          {/* Price */}

          <>
            {activeCategory ? (
              <div className="pricingtablecontainer1">
                {PlansLevelData &&
                  PlansLevelData?.map((eachPlan, i) => {
                    if (activeCategory === eachPlan?.category?._id && eachPlan.status == 'active') {
                      //let priceDivide = eachPlan?.price / 30;
                      return (
                        <div
                          className={i === 2 ? 'wow fadeInUp animated card-active' : 'wow fadeInUp animated'}
                          data-wow-delay="100ms"
                          style={{
                            visibility: 'visible',
                            animationDelay: '100ms',
                            animationName: 'fadeInUp'
                          }}
                          key={i}
                        >
                          {eachPlan?.mostPopuler == 'true' ? (
                            <div className="card-pricingtable-head">
                              <h2>Most Popular</h2>
                            </div>
                          ) : (
                            ''
                          )}
                          <div className={eachPlan?.mostPopuler == 'true' ? 'card-pricingtable' : 'pricingtable'}>
                            <div className="main-head">
                              <h2>{eachPlan?.name}</h2>
                            </div>
                            <ul className="popular">
                              <li
                                className="pricingtable__highlight js-montlypricing"
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center'
                                }}
                              >
                                ${eachPlan?.price}
                              </li>
                              <div
                                className="section-title mb-2"
                                style={{
                                  borderBottom: '0.5px solid #80808045'
                                }}
                              >
                                <h6 className="section-plan__tagline">One time payment</h6>
                              </div>
                            </ul>
                            <div className="price-feature FixedPlan">
                              <ul className="fixedplanUl">
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
                                {/*<Link  className="e-btn e-btn-2" onClick={() => handleClick(eachPlan)}>
                                {!isAuthenticated && 'Sign Up'}
                                {isAuthenticated && !isSubcription && 'Purchase'}
                                </Link>*/}
                                <Link
                                  className="e-btn e-btn-2"
                                  to={`/purchase?planid=${eachPlan._id}`}
                                  id="fixedplanbutton"
                                  state={eachPlan}
                                >
                                  Purchase
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            ) : (
              <div className="pricingtablecontainer1">
                <div
                  // className="wow fadeInUp animated card-active"
                  style={{
                    visibility: 'visible',
                    animationDelay: '100ms',
                    animationName: 'fadeInUp'
                  }}
                >
                  <Skeleton className="fixedSkeleton" />
                </div>
                <div
                  // className="wow fadeInUp animated card-active"
                  style={{
                    visibility: 'visible',
                    animationDelay: '100ms',
                    animationName: 'fadeInUp'
                  }}
                >
                  <Skeleton className="fixedSkeleton" />
                </div>
                <div
                  // className="wow fadeInUp animated card-active"
                  style={{
                    visibility: 'visible',
                    animationDelay: '100ms',
                    animationName: 'fadeInUp'
                  }}
                >
                  <Skeleton className="fixedSkeleton" />
                </div>
                <div
                  // className="wow fadeInUp animated card-active"
                  style={{
                    visibility: 'visible',
                    animationDelay: '100ms',
                    animationName: 'fadeInUp'
                  }}
                >
                  <Skeleton className="fixedSkeleton" />
                </div>
                <div
                  // className="wow fadeInUp animated card-active"
                  style={{
                    visibility: 'visible',
                    animationDelay: '100ms',
                    animationName: 'fadeInUp'
                  }}
                >
                  <Skeleton className="fixedSkeleton" />
                </div>
              </div>
            )}
          </>
        </div>
      )}
    </div>
  );
};

export default FixedPlan;
