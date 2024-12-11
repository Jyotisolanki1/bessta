/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GetPlansLevelApi } from '../../Slices/PlanSlice';
import Loader from '../../Common/Loader';
import parse from 'html-react-parser';
import { useNavigate, useLocation } from 'react-router-dom';
import swal from 'sweetalert';

const EntryPlans = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const drawid = queryParams.get('drawid');

  const { PlansLevelLoading, PlansLevelData } = useSelector((state) => state.planAction);

  useEffect(() => {
    dispatch(GetPlansLevelApi());
  }, [dispatch]);

  const onCheck = (data) => {
    swal({
      title: `Are you sure you want to delete ${data.name}?`,
      icon: 'warning',
      buttons: ['No', 'Yes'],
      dangerMode: true,
      closeOnClickOutside: false
    }).then((willDelete) => {
      if (willDelete) {
        const newData = {
          status: 3,
          category_id: data.id
        };

        // Implement the delete functionality here
      }
    });
  };

  const ReadMore = ({ children, maxHeight = 260 }) => {
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
  const handleAddEntries = (plandetails) => {
    navigate(`/payments?drawid=${drawid}&planid=${plandetails?._id}`, { state: { ...plandetails, drawid: drawid } });
  };

  // Filter the plans to include only active ones
  const activePlans = PlansLevelData?.filter((plan) => plan?.status === 'active');

  return (
    <div>
      {PlansLevelLoading ? (
        <Loader />
      ) : (
        <div className="pricing-table-bg pt-4" style={{ background: '#f4f4f4' }}>
          <div className="pricing-table pt-5">
            <div className="container">
              <div className="plan-details-flex"></div>
              <div className="second-sec pt-5">
                <h2 className="fourthcominggiveaway">MANAGE YOUR ENTRIES</h2>
                {activePlans && activePlans[0]?.category?.status != 'disabled' && (
                  <div className="slideToggle">
                    <button
                      style={{
                        background: '#f28500',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: 600,
                        padding: '10px 20px',
                        border: 'none'
                      }}
                    >
                      Package Membership
                    </button>
                  </div>
                )}

                {activePlans && activePlans[0]?.category?.status == 'disabled' && (
                  <h3 className="text-center text-danger"> Package not found!</h3>
                )}
              </div>
              {activePlans && activePlans[0]?.category?.status != 'disabled' && (
                <div className="pricingtablecontainer1">
                  {activePlans?.map((eachPlan) => (
                    <div
                      className="wow fadeInUp animated"
                      data-wow-delay="100ms"
                      style={{
                        visibility: 'visible',
                        animationDelay: '100ms',
                        animationName: 'fadeInUp'
                      }}
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
                          <h2>{eachPlan.name}</h2>
                        </div>
                        <ul className="popular">
                          <li className="pricingtable__highlight js-montlypricing" style={{ display: 'flex' }}>
                            ${eachPlan.price}
                          </li>
                          <li
                            style={{
                              fontSize: '18px',
                              fontWeight: 'bold'
                            }}
                          >
                            Interval Type:
                            <span style={{ paddingLeft: '10px' }}>
                              {eachPlan.intervalType[0].toUpperCase() + eachPlan.intervalType.slice(1, eachPlan.intervalType.length)}
                            </span>
                          </li>
                          <li
                            style={{
                              fontSize: '18px',
                              fontWeight: 'bold'
                            }}
                          >
                            Entries:
                            <span style={{ paddingLeft: '10px' }}>{eachPlan.entries}</span>
                          </li>
                        </ul>

                        <div className="price-feature FixedPlan">
                          <ul className="fixedplanUl">
                            <ReadMore>{parse(eachPlan.discription)}</ReadMore>
                          </ul>
                          <div
                            className={eachPlan?.mostPopuler == 'true' ? 'btnapplyentry ' : 'e-btn e-btn-2'}
                            style={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleAddEntries(eachPlan)}
                          >
                            Get Entries
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryPlans;
