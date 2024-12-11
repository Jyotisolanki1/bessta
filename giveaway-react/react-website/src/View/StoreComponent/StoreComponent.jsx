/* eslint-disable react/jsx-key */
import { useSelector, useDispatch } from 'react-redux';
import { ProductGetApi } from '../../Slices/StoreSlice';
import { useEffect, useState } from 'react';
import Loader from '../../Common/Loader';
import { Link, NavLink } from 'react-router-dom';
import { GetProductCategoriesApi } from '../../Slices/ProductCategoriesSlice';
import { REACT_API_URL } from '../../../config';
import { Rating } from '@mui/material';
import { ClearProductDetails } from '../../Slices/ProductDetailsSlice';

const StoreComponent = () => {
  const { Products } = useSelector((state) => state.storeAction);
  const [productNotFound,setProductNotFound] = useState(false);


  const [active, setactive] = useState(0);
  const ProductCategory = useSelector((state) => state.ProductCategoriesAction);

  const { ProductCategories } = ProductCategory;

  // // console.log(ProductCategories);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(GetProductCategoriesApi());
    dispatch(ProductGetApi());
  }, []);

  useEffect(() => {
    if (Products) {
      const anyProductFound = Products.some(
        eachProduct => eachProduct?.category?._id === ProductCategories[active]?._id
      );
      setProductNotFound(!anyProductFound); // Set to true if no product found
    }
  }, [Products, active, ProductCategories]);

  const handleActiveCategory = (i) => {
    setactive(i);
  };

  return (
    <>
      <section className="topbar">
        <div className="container-fluid">
          <div className="">
            <span className="top-head">SPEND $99 TO UNLOCK FREE SHIPPING</span>
          </div>
        </div>
      </section>
      <div className="stricky-header stricked-menu main-menu main-menu-with-border">
        <div className="sticky-header__content" />
        {/* /.sticky-header__content */}
      </div>
      {/* /.stricky-header */}
      {/*Main Slider Start*/}

      {/* /.page-header */}
      {/*Main Slider End*/}
      <section className="product">
        <div className="container">
          <div className="section-title text-center pt-50">
            <h2 className="section-title__title">BESTTA MERCH!</h2>
            <h5 className="section-title__tagline">Free Shipping Over $99!</h5>
          </div>
          <div className="col-md-8 col-xl-8 wow fadeInLeft" data-wow-delay="200ms"></div>
          {/* <div className="product__info-top">
            <div className="product__showing-text-box">
              <p className="product__showing-text">Showing 1–9 of 12 Results</p>
            </div>
            <div className="product__showing-sort">
              <select
                className="selectpicker"
                aria-label="Default select example"
              >
                <option selected="">Sort by popular</option>
                <option value={1}>Sort by view</option>
                <option value={2}>Sort by price</option>
                <option value={3}>Sort by ratings</option>
              </select>
            </div>
          </div> */}
          <div className="row">
            {ProductCategories?.loading ? (
              <Loader />
            ) : (
              <div>
                <h2>Categories</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', padding: '15px' }}>
                  {ProductCategories &&
                    ProductCategories.length > 0 &&
                    ProductCategories?.map((eachCategories, index) => {
                      const activeProd = index === active ? '#f28500' : '#fff';
                      return (
                        <div
                          style={{
                            textAlign: 'center',
                            margin: '15px'
                          }}
                          key={index}
                        >
                          <img
                            src={`${REACT_API_URL}${eachCategories.icon}`}
                            alt={eachCategories.name}
                            style={{
                              borderRadius: '50%',
                              height: '75px',
                              width: '75px',
                              border: `3px solid ${activeProd}`
                            }}
                            onClick={() => handleActiveCategory(index)}
                          />
                          <h4>{eachCategories.name}</h4>
                        </div>
                      );
                    })}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly'
                  }}
                >
             {!productNotFound ?
              <>
              {Products?.length > 0 &&
                Products?.map((each, i) => {
                  if (each?.category?._id === ProductCategories[active]?._id) {
                    {
                      /* const isOutOfStock = each?.variableProducts[0]?.stock === 0; */
                    }
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
                          to={`/store/${each?._id}`}
                          disabled={isOutOfStock}
                          // className="nisoz-btn"
                          style={{ color: '#000', cursor: 'pointer' }}
                          onClick={() => dispatch(ClearProductDetails())}
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

                              <div className="product__item__price">
                                ${each?.variableProducts ? each?.variableProducts[0]?.price : ''}
                              </div>
                             
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
                  }
                })}
              </>:<h1>Products not found</h1>}                   
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Products End */}
    </>
  );
};

export default StoreComponent;
