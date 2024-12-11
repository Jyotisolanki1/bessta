// import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useEffect } from 'react';

import { GetMyOrdersApi } from '../../Slices/MyOrdersSlice';

import Loader from '../../Common/Loader';
// import { Table } from 'reactstrap';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Orders = () => {
  const dispatch = useDispatch();
  const { loading, Orders } = useSelector((state) => state.ordersAction);
  // // console.log(Orders, 'Orders');
  // let arr = [];
  // const filter =
  //   Orders &&
  //   Orders?.map((eachOrder) => {
  //     eachOrder.lineItems.forEach((eachItem) => {
  //       let obj = {
  //         image: eachItem?.productInfo?.variableProducts[0]?.image,
  //         name: eachItem?.productInfo?.name,
  //         quantity: eachItem?.quantity,
  //         price: eachItem?.price,
  //         status: eachOrder.status
  //       };
  //       arr.push(obj);
  //     });
  //   });

  useEffect(() => {
    dispatch(GetMyOrdersApi());
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <section className="cart-page">
          <div className="container mt-5">
            <div className="table-responsive">
              <table className="table cart-page__table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Price</th>
                    <th>Total Items</th>
                    <th>Date & Time</th> {/* Fixed a typo in "Time" */}
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Orders.length <= 0 && (
                    <tr>
                      <td colSpan={5}>Order not found!</td>
                      <td></td>
                    </tr>
                  )}
                  {Orders.map((eachItem, i) => (
                    <tr key={i}>
                      <td>
                        <div className="cart-page__table__meta">
                          {/* <div className="cart-page__table__meta-img"> */}
                          {/* <img
                          src={`${REACT_API_URL}${eachItem?.image}`}
                          alt="nisoz"
                        /> */}
                          Order ID - {eachItem?._id}
                          {/* </div> */}
                          <h3 className="cart-page__table__meta-title">
                            <a href="product-details.html">{eachItem?.name}</a>
                          </h3>
                        </div>
                      </td>
                      <td>$ {eachItem?.total}</td>
                      {/* <td>{eachItem?.quantity}</td> */}
                      <td>{eachItem?.lineItems?.length}</td>
                      <td>{moment(eachItem?.createdAt).format('DD-MM-YYYY hh:mm:ss a')}</td>
                      <td style={{ textTransform: 'capitalize' }}>{eachItem?.status}</td>
                      <td>
                        <Link
                          to={`/orders/order-details/${eachItem?._id}?status=${eachItem?.status}`}
                          // to={{
                          //   pathname: `/orders/order-details/${eachItem?._id}`,
                          //   state: { data: eachItem },
                          // }}
                          // href="cart.html"
                          style={{
                            border: '2px solid #f28500',
                            textAlign: 'center',
                            borderRadius: '50px',
                            padding: '5px 0'
                          }}
                          className="table cart-page__table__remove"
                        >
                          View Details
                        </Link>
                        {eachItem?.status !== 'cancelled' || eachItem?.status !== 'delivered' ? (
                          <Link
                            to=""
                            style={{
                              border: '2px solid #161617',
                              textAlign: 'center',
                              borderRadius: '50px',
                              padding: '5px 0'
                            }}
                            className="table cart-page__table__remove"
                          >
                            Track
                          </Link>
                        ) : (
                          ''
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Orders;
