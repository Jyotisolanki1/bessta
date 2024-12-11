import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetPlansApi, GetPlansHistoryApi } from '../../Slices/PlanSlice';
import parse from 'html-react-parser';
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Table } from 'reactstrap';
import Loader from '../../Common/Loader';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';

const SubscriptionHistory = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [fixedSubscriptions, setFixedSubscriptions] = useState([]);
  const [recurringSubscriptions, setRecurringSubscriptions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await dispatch(GetPlansHistoryApi());
    setLoading(false);
  };

  const { PlanshistoryData } = useSelector((state) => state.planAction);

  useEffect(() => {
    if (PlanshistoryData.length > 0) {
      const fixed = PlanshistoryData.filter((subscriptionType) => subscriptionType._id === 'fixed');
      const recurring = PlanshistoryData.filter((subscriptionType) => subscriptionType._id === 'recurring');
      setFixedSubscriptions(fixed);
      setRecurringSubscriptions(recurring);
    }
  }, [PlanshistoryData]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const selectDraw = (subcriptionId) => {
    console.log(subcriptionId);
    localStorage.setItem('applyToDraw', subcriptionId);
    navigate('/upcoming-giveaways');
  };

  return (
    <div className="profile-sec">
      <div className="container">
        <h2 className="pro-cicle">Subscription History</h2>
        <Nav tabs className="justify-content-center">
          <NavItem>
            <NavLink className={activeTab === '1' ? 'active' : ''} onClick={() => toggleTab('1')} style={{ cursor: 'pointer' }}>
              Draws Entries
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === '2' ? 'active' : ''} onClick={() => toggleTab('2')} style={{ cursor: 'pointer' }}>
              Subscription History
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1" style={{ width: '100% !impotant' }}>
            <div className="table-responsive">
              {' '}
              {/* Add this wrapper */}
              <Table striped>
                <thead>
                  <tr>
                    <th>Plan Name</th>
                    <th>Draw Name</th>
                    <th>Price</th>
                    <th>Entries</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6">
                        <Loader />
                      </td>
                    </tr>
                  ) : fixedSubscriptions[0]?.subcription ? (
                    fixedSubscriptions[0]?.subcription.map((subscription, index) => (
                      <tr key={index}>
                        <td>{subscription?.plans?.name}</td>
                        <td>
                          {subscription?.type === 'fixed' && subscription?.draw_id ? (
                            subscription?.draws?.name
                          ) : (
                            <button onClick={() => selectDraw(subscription._id)}>Apply Entries</button>
                          )}
                        </td>
                        <td>${subscription?.amount}</td>
                        <td>{subscription?.entries}</td>
                        <td>{moment(subscription?.createdAt).format('DD-MM-YYYY')}</td>
                        <td>{subscription.status === 'active' ? 'Active' : 'Cancelled'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" align="center">
                        No Data Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </TabPane>
          <TabPane tabId="2">
            <div className="table-responsives">
              {' '}
              {/* Add this wrapper */}
              <Table striped>
                <thead>
                  <tr>
                    <th>Plan Name</th>
                    <th>Price</th>
                    <th>Entries</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5">
                        <Loader />
                      </td>
                    </tr>
                  ) : recurringSubscriptions[0]?.subcription ? (
                    recurringSubscriptions[0]?.subcription.map((subscription, index) => (
                      <tr key={index}>
                        <td>{subscription?.plans?.name}</td>
                        <td>${subscription?.amount}</td>
                        <td>{subscription?.entries}</td>
                        <td>{moment(subscription?.createdAt).format('DD-MM-YYYY')}</td>
                        <td>
                          {subscription.status === 'active'
                            ? 'Active'
                            : subscription.status === 'update'
                            ? 'Updated'
                            : subscription.status === 'cancel'
                            ? 'Cancelled'
                            : subscription.status === 'resume'
                            ? 'Pending'
                            : ''}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" align="center">
                        No Data Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default SubscriptionHistory;
