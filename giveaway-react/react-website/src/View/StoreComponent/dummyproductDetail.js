/* eslint-disable react/jsx-key */
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { ProductDetailsApi } from '../../Slices/ProductDetailsSlice';
import { NavLink } from 'react-router-dom';
import { AddToCartApi } from '../../Slices/AddToCartSlice';
import { GetSuggestProductApi } from '../../Slices/StoreSlice';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { REACT_API_URL } from '../../../config';
import { SetAuthCartId } from '../../Slices/LoginSlice';
import { GetCartItemsApi } from '../../Slices/CartSlice';
import { Rating } from '@mui/material';
import Skeleton from 'react-loading-skeleton';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { cardIdLength } = useSelector((state) => state.loginAction);
  const { loading, ProductDetails } = useSelector((state) => state.productDetailsAction);
  const { suggestedProduct } = useSelector((state) => state.storeAction);
  

  const filteredProducts = suggestedProduct?.filter((item, index) => index < 3 && item._id !== id);
  let reviewLimit = ProductDetails[0]?.reviews?.filter((item, index) => index < 1 );

  const [priceObject, setPriceObject] = useState('');
  const [variableProductDetails, setVariableProductDetails] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeStore, setSizeStore] = useState(0);
  const [heroImage, setHeroImage] = useState('');
  const [more,setMore] = useState(false)

  useEffect(() => {
    if (ProductDetails) {
      dispatch(GetSuggestProductApi(ProductDetails[0]?.category?._id));
    }
  }, [ProductDetails[0]?.category?._id],filteredProducts);


  useEffect(()=>{
    if( ProductDetails[0]?.reviews?.length > 1){
      setMore(true);
    }
  },[ProductDetails[0]?.reviews])



  

  const GetProductDetails = async () => {
    const response = await dispatch(ProductDetailsApi(id));

    if (response.success) {
      const formatVariableProduct = response?.data[0]?.variableProducts?.map((eachProduct) => {
        return {
          size: eachProduct?.attributes[0]?.value,
          price: eachProduct?.price,
          variableId: eachProduct?._id
        };
      });
      // setProductId(response?.data[0]._id);
      setVariableProductDetails(formatVariableProduct);
     
      // setSizeStore(formatVariableProduct[0]);
    }
  };

  useEffect(() => {
    GetProductDetails();
  }, [id]);

  const onSizeSelected = (e) => {
    const filterProductDetails = variableProductDetails.filter((eachItem) => e.target.value === eachItem.variableId);
    setPriceObject(filterProductDetails[0]);
  };

  const handleAddToCart = async () => {
    if (!priceObject) {
      toast.error("Please select a size before adding to cart");
      return;
    }
  
    const cartDetails = {
      product_id: id,
      variable_id: priceObject.variableId,
      quantity: quantity
    };
  
    try {
      const cartId = localStorage?.getItem('cartid');
      if (cartId) {
        cartDetails.cart_id = cartId;
      }
      const res = await dispatch(AddToCartApi(cartDetails));
      dispatch(SetAuthCartId(res?.data?._id));
      if (res.success) {
        dispatch(GetCartItemsApi(cardIdLength));
        localStorage.setItem('cartid', res.data._id);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const handleIncrement = () => {
    setQuantity((quantity) => parseInt(quantity) + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((quantity) => parseInt(quantity) - 1);
    } else {
      setQuantity(1);
    }
  };

  const handleQuantity = (e) => {
    setQuantity(e.target.value);
  };


  const handleMore = () =>{
    setMore(false)
    reviewLimit = ProductDetails[0].reviews
    // console.log(reviewLimit)
  }
  // // console.log(priceObject, "...........<>");
  return (
    <div>
      <section className="product-details">
        <div className="container pt-50">
          <div className="row pt-50">
            <div className="col-lg-6 col-xl-6 wow fadeInLeft" data-wow-delay="200ms">
              <div className="product-details__img product-imgs">
                <div className="img-display">
                  {/* {ProductDetails &&
                    ProductDetails[0]?.images?.map((each, i) => (
                      <div
                        className="img-showcase"
                        style={{ height: "500px" }}
                        key={i}
                      >
                        <img
                          src={`${REACT_API_URL}${each}`}
                          alt=""
                          style={{ width: "100%" }}
                        />
                      </div>
                    ))} */}

                  {loading ? (
                    <Skeleton height="600px" />
                  ) : (
                    <div className="img-showcase" style={{ height: '500px' }}>
                      {heroImage === '' ? (
                        <img src={`${REACT_API_URL}${ProductDetails[0]?.images[0]}`} alt="" style={{ width: '100%' }} />
                      ) : (
                        <img src={`${REACT_API_URL}${heroImage}`} alt="" style={{ width: '100%' }} />
                      )}
                    </div>
                  )}
                </div>
                <div className="img-select" style={{ overflowX: 'scroll' }}>
                  {ProductDetails &&
                    ProductDetails[0]?.images?.map((eachItem, i) => (
                      <div className="img-item" key={i}>
                        <Link to="" data-id={1}>
                          <img
                            src={`${REACT_API_URL}${eachItem}`}
                            alt=""
                            style={{ height: '150px', width: '150px' }}
                            onClick={() => setHeroImage(eachItem)}
                          />
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-6 wow fadeInRight" data-wow-delay="300ms" style={{ display: 'flex' }}>
              <div className="product-details__content" style={{ width: '100%' }}>
                {loading ? (
                  <Skeleton height="60px" />
                ) : (
                  <div className="product-details__top">
                    <h3 className="product-details__title">{ProductDetails[0]?.name}</h3>
                    <div className="product-details__price">$ {priceObject?.price ? priceObject?.price : sizeStore}</div>
                  </div>
                )}

                {loading ? (
                  <Skeleton height="30px" />
                ) : (
                  <div style={{ display: 'flex' }}>
                    <Rating
                      name="read-only"
                      defaultValue={ProductDetails[0]?.avgRating ? Number(ProductDetails[0]?.avgRating) : 0}
                      readOnly
                      precision={0.5}
                    />
                    &nbsp; &nbsp;{ProductDetails[0]?.avgRating ? ProductDetails[0]?.avgRating : 0} Ratings
                  </div>
                )}

                <div className="product-details__divider" />
                {loading ? (
                  <>
                    <Skeleton height="80px" />
                    <Skeleton height="30px" style={{ marginTop: '20px' }} />
                  </>
                ) : (
                  <div className="product-details__excerpt">
                    <p className="product-details__excerpt-text1">{ProductDetails[0]?.description}</p>
                    <p className="product-details__excerpt-text2">
                      {ProductDetails[0]?.stock !== 0 ? <>Available in store {ProductDetails[0]?.stock}</> : 'Out Of Stock'}
                    </p>
                  </div>
                )}

                {/* /.excerp-text */}
                <div className="row ">
                  <div className="col-lg-6 col-md-12">
                    {loading ? <Skeleton height="10px" /> : <label htmlFor="size">Select Size</label>}

                    <div className="custom-select">
                      {/* {loading ? (
                        <Skeleton height="20px" />
                      ) : (
                        <div className="product-details__excerpt">
                          <p className="product-details__excerpt-text1">{ProductDetails[0]?.description}</p>
                          <p className="product-details__excerpt-text2">
                            {ProductDetails[0]?.stock !== 0 ? <>Available in store {ProductDetails[0]?.stock}</> : 'Out Of Stock'}
                          </p>
                        </div>
                      )} */}

                      {loading ? (
                        <Skeleton height="40px" />
                      ) : (
                        <>
                          <select id="size" name="size" className="form-control" onChange={onSizeSelected}>
                          <option value="jjuoiuiuiu"  selected="true">Choose Size</option>
                            {ProductDetails[0]?.variableProducts &&
                              ProductDetails[0]?.variableProducts?.map((each, i) => {
                                return (
                                  <option
                                    value={each._id}
                                    key={i}
                                    disabled={each?.stock === 0}
                                    onChange={() => {
                                      setSizeStore(each?.price);
                                    }}
                                  >
                                    {each?.attributes[0]?.value} ({each?.stock})
                                  </option>
                                );
                              })}
                          </select>
                          <div className="arrow-down"></div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    {loading ? (
                      <Skeleton height="40px" style={{ marginTop: '30px' }} />
                    ) : (
                      <div className="product-details__quantity">
                        <h3 className="product-details__quantity-title">Quantity</h3>
                        <div className="quantity-box">
                          <button type="button" className="sub" onClick={handleDecrement}>
                            <i className="fa fa-minus" />
                          </button>
                          <input type="number" id="quantity" value={quantity} onChange={handleQuantity} />
                          <button type="button" className="add" onClick={handleIncrement}>
                            <i className="fa fa-plus" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* /.quantity */}
                  </div>
                </div>
                {loading ? (
                  <Skeleton height="50px" width="200px" style={{ marginTop: '20px', borderRadius: '30px' }} />
                ) : (
                  <div onClick={handleAddToCart}>
                    <Link to="" className="nisoz-btn">
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__shape" />
                      <span className="nisoz-btn__text">Add to cart</span>
                    </Link>
                  </div>
                )}

                {/* /.qty-btn */}
                {/* <div className="product-detail-poinys">
                    <h4>OG Black T-Shirt</h4>
                    <ul>
                      <li>Black&nbsp;Colour Tee</li>
                      <li>
                        Regular fit short sleeve t-shirt
                        <br />
                      </li>
                      <li>Ribbed crew neck</li>
                      <li>Printed logo</li>
                      <li>100% cotton</li>
                      <li>Made&nbsp;in&nbsp;Australia</li>
                    </ul>
                  </div> */}
                <div className="product-detail-size">
                  {/* <img src="assets/images/product/Screen_Shot_2021-08-14_at_10.58.43_am_480x480.avif" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div style={{ marginLeft: '3%', fontSize: '30px', fontWeight: '600' }}>
        <p style={{ paddingBottom: '1%' }}>Suggested Products</p>
      </div>

      <div
        style={{
          margin: '0px 15px 15px 0px',
          display: 'flex',
          flexDirection: 'row'
        }}
        data-wow-delay="200ms"
      >
        {filteredProducts?.length > 0 &&
          filteredProducts?.map((each, i) => {
            const isOutOfStock = each?.stock === 0;

            return (
              <div
                style={{
                  margin: '0px 15px 15px 0px'
                }}
                className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay="200ms"
                key={i}
              >
                <NavLink
                  to={isOutOfStock ? '' : `/store/${each?._id}`}
                  disabled={isOutOfStock}
                  // className="nisoz-btn"
                  style={{ color: '#000', cursor: 'pointer' }}
                >
                  <div className="product__item">
                    <div className="product__item__img">
                      <div style={{ height: '250px' }}>
                        <img
                          src={`${REACT_API_URL}${each?.images[0]}`}
                          alt="nisoz"
                          style={{
                            width: '100%',
                            opacity: isOutOfStock ? 0.5 : 1
                          }}
                        />
                        {isOutOfStock && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              fontWeight: '600',
                              fontSize: '20px'
                            }}
                          >
                            Out of stock
                          </div>
                        )}
                      </div>
                      <div className="product__item__btn">
                        {/* <Link to="">
                      <i className="far fa-heart" />
                    </Link> */}
                        <Link to={isOutOfStock ? '' : `/store/${each?._id}`}>
                          <i className="fas fa-eye" />
                        </Link>
                      </div>
                    </div>

                    <div className="product__item__content">
                      <h4 className="product__item__title">
                        <Link to={isOutOfStock ? '' : `/store/${each?._id}`}>{each?.name}</Link>
                      </h4>

                      <div className="product__item__price">${each?.variableProducts ? each?.variableProducts[0]?.price : ''}</div>

                      <Rating name="read-only" value={each?.avgRating ? each?.avgRating : 0} readOnly precision={0.5} />
                      {/* {each?.avgRating ? each?.avgRating : 0} */}

                      {/* <NavLink
                    to={isOutOfStock ? '' : `/store/${each?._id}`}
                    disabled={isOutOfStock}
                    className="nisoz-btn"
                    style={{ padding: '10px 20px' }}
                  >
                    <span className="nisoz-btn__shape" />
                    <span className="nisoz-btn__shape" />
                    <span className="nisoz-btn__shape" />
                    <span className="nisoz-btn__shape" />
                    <span className="nisoz-btn__text">Add to cart</span>
                  </NavLink> */}
                    </div>
                  </div>
                </NavLink>
              </div>
            );
          })}
      </div>
      <div style={{ marginLeft: '3%' }}>
        <p style={{ fontWeight: '600', fontSize: '30px' }}>Reviews</p>
        {more?reviewLimit &&
          reviewLimit.map((item) => (
            <>
              <Rating name="read-only" value={item?.rating ? item?.rating : 0} readOnly precision={0.5} />
              <p style={{ borderBottom: '1px solid #CECECE', paddingBottom: '1%' }}>{item.comment}</p>
              
            </>
          )):ProductDetails[0]?.reviews?.map((item) => (
            <>
              <Rating name="read-only" value={item?.rating ? item?.rating : 0} readOnly precision={0.5} />
              <p style={{ borderBottom: '1px solid #CECECE', paddingBottom: '1%' }}>{item.comment}</p>
              
            </>
          ))}
          {more&&<p style={{fontWeight:"600",cursor:"pointer",paddingBottom:"1%"}} onClick={handleMore} >View more review ...</p>}
      </div>
    </div>
  );
};

export default ProductDetail;
