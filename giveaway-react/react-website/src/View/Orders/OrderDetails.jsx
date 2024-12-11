import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Rate_Review from './Rate_review';
import { useLocation } from 'react-router-dom';
import Loader from '../../Common/Loader';
import { REACT_API_URL } from '../../../config';

const OrderDetails = () => {
  const [open, setOpen] = React.useState(false);
  const [productId, setProductId] = React.useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');

  const handleClickOpen = (id) => {
    setProductId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // const { data } = props.location.state;
  const { id } = useParams();
  // // console.log("🚀 ~ OrderDetails ~ data:", data);

  const { loading, Orders } = useSelector((state) => state.ordersAction);

  // // console.log(Orders, "Orders");
  const filteredOrders = Orders?.filter((eachItem) => eachItem?._id === id);

  //   let arr = [];
  //   const filter =
  //     Orders &&
  //     Orders?.map((eachOrder) => {
  //       eachOrder.lineItems.forEach((eachItem) => {
  //         let obj = {
  //           image: eachItem?.productInfo?.variableProducts[0]?.image,
  //           name: eachItem?.productInfo?.name,
  //           quantity: eachItem?.quantity,
  //           price: eachItem?.price,
  //           status: eachOrder.status,
  //         };
  //         arr.push(obj);
  //       });
  //     });

  // useEffect(() => {
  //   dispatch(GetMyOrdersApi());
  // }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <section className="cart-page">
          <div className="container mt-5">
            <div className="table-responsive">
              <Rate_Review open={open} handleClose={handleClose} productId={productId} />
              <table className="table cart-page__table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th></th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders[0]?.lineItems?.map((eachItem, i) => (
                 
                    <tr key={i}>
                      <td>
                        <div className="cart-page__table__meta">
                          <div className="cart-page__table__meta-img">
                            <img src={`${REACT_API_URL}${eachItem?.productData?.images[0]}`} alt="nisoz" />
                          </div>
                          <h3 className="cart-page__table__meta-title">
                            <a href="product-details.html">{eachItem?.name}</a>
                          </h3>
                        </div>
                      </td>

                      {status == 'paid' ? (
                        <td>
                          <img src="/assets/images/rate.png" alt="nisoz" width={50} height={50} />
                          <span style={{ cursor: 'pointer', color: '#4a4ac7' }} onClick={() => handleClickOpen(eachItem.product)}>
                            {' '}
                            Rate & Review Product
                          </span>
                        </td>
                      ) : (
                        <td></td>
                      )}

                      <td>${eachItem?.price}</td>
                      <td>{eachItem?.quantity}</td>
                      <td>${eachItem?.price * eachItem?.quantity}</td>
                      <td>
                        <Link
                          style={{
                            border: '2px solid #f28500',
                            textAlign: 'center',
                            borderRadius: '50px',
                            padding: '5px 0'
                          }}
                          className="table cart-page__table__remove"
                          to={`/store/${eachItem.product}`}
                          // className="table cart-page__table__remove"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row d-flex justify-content-end">
              <div className="col-xl-4 col-lg-5">
                <ul className="cart-page__cart-total list-unstyled">
                  <li>
                    <span>Subtotal</span>
                    <span className="cart-page__cart-total-amount">$ {filteredOrders[0]?.subTotal}</span>
                  </li>
                  <li>
                    <span>Shipping cost</span>
                    <span className="cart-page__cart-total-amount">$ 0.00</span>
                  </li>
                  <li>
                    <span>Discount </span>
                    <span className="cart-page__cart-total-amount">
                      - ${filteredOrders[0]?.subTotal - filteredOrders[0]?.total}
                      {/* {billingDetails?.totalCartPrice -
                              billingDetails?.totalPriceAfterDiscount} */}
                    </span>
                  </li>
                  <li>
                    <span>Total</span>
                    <span className="cart-page__cart-total-amount">$ {filteredOrders[0]?.total}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default OrderDetails;

{
  /* <section className="cart-page">
<div className="container mt-5">
  <div className="table-responsive">
    <table className="table cart-page__table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Track</th>
        </tr>
      </thead>
      <tbody>
        {arr.map((eachItem) => {
          return (
            <tr>
              <td>
                <div className="cart-page__table__meta">
                  <div className="cart-page__table__meta-img">
                    <img
                      src={`${REACT_API_URL}${eachItem?.image}`}
                      alt="nisoz"
                    />
                  </div>
                  <h3 className="cart-page__table__meta-title">
                    <a href="product-details.html">
                      {eachItem?.name}
                    </a>
                  </h3>
                </div>
              </td>
              <td>$ {eachItem?.price}</td>
              <td>{eachItem?.quantity}</td>
              <td>${eachItem.price * eachItem.quantity}</td>
              <td>
                <a
                  href="cart.html"
                  className="table cart-page__table__remove"
                >
                  
                  <div>track</div>
                </a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>
</section> */
}
