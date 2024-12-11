import Skeleton from 'react-loading-skeleton';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GetDrawsApi, applyDrawEntriesApi } from '../../Slices/DrawsSlice';
// import Loader from '../../Common/Loader';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { REACT_API_URL } from '../../../config';
import { toast } from 'react-toastify';

const MemberGiveAwayDetails = () => {
  const dispatch = useDispatch();
  // const { GetDraws } = useSelector((state) => state.drawAction);
  const { loading, GetDraws } = useSelector((state) => state.drawAction);
  const navigate = useNavigate();

  // const loading = true;
  const [loadingData, setLoadingData] = useState(true);
  // // console.log("🚀 ~  loading:", loading);
  const { id } = useParams();
  const [drawDetail, setDrawDetail] = useState('');
  // // console.log("🚀 ~ MemberGiveAwayDetails ~ drawDetail:", drawDetail);

  const token = localStorage.getItem('userToken');
  const Prize = ['1st Prize', '2nd Prize', '3rd Prize'];

  const getDraws = async () => {
    const res = await dispatch(GetDrawsApi());
    if (res.success) {
      const filterDraws = res?.data?.filter((eachDraw) => eachDraw._id === id);
      setLoadingData(false);
      setDrawDetail(filterDraws[0]);
    }
  };

  const applyDrawEntries = async () => {
    // // console.log('applyDrawEntries');
    const res = await dispatch(
      applyDrawEntriesApi({
        subcription_id: localStorage.getItem('applyToDraw'),
        draw_id: id
      })
    );
    if (res.success) {
      toast.success(res.message);
      localStorage.removeItem('applyToDraw');
      navigate('/subscription-history');
    } else {
      toast.error(res.message);
      localStorage.removeItem('applyToDraw');
      navigate('/subscription-history');
    }
  };

  useEffect(() => {
    getDraws();
  }, []);

  const isAuth = localStorage.getItem('userToken');

  return (
    <div>
      {/* {loading ? (
        <Loader />
      ) : ( */}
      <>
        <div className="stricky-header stricked-menu main-menu main-menu-with-border">
          <div className="sticky-header__content" />
          {/* /.sticky-header__content */}
        </div>
        {/* /.stricky-header */}
        {/*Main Slider Start*/}
        <section className="page-header merch">
          {/* /.page-header__shape3 */}
          <div
            className="page-header__shape3"
            data-wow-delay="300ms"
            style={{
              backgroundImage: 'url(assets/images/backgrounds/coverphoto.webp)',
              backgroundPosition: 'left top',
              opacity: 1,
              top: 112,
              backgroundRepeat: 'repeat'
            }}
          />
          {/* /.page-header__shape3 */}
          {/* <div className="container" /> */}
          {/* <div className="container" /> */}
          {/* /.container */}
        </section>
        {/* /.page-header */}
        {/*Main Slider End*/}
        <section className="product-details">
          <div className="container pt-50">
            {/* /.product-details */}
            <div className="row pt-50">
              <div className="col-lg-6 col-xl-6 wow fadeInLeft" data-wow-delay="200ms">
                {loadingData ? (
                  <Skeleton height="400px" />
                ) : (
                  <div className="product-details__img product-imgs">
                    <div className="img-display">
                      <div className="img-showcase" style={{ height: '400px', width: '100%' }}>
                        <img src={`${REACT_API_URL}${drawDetail?.image}`} alt="" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>
                )}
                {/* <Skeleton height="400px" /> */}
              </div>
              {/* /.column */}
              <div className="col-lg-6 col-xl-6 wow fadeInRight" data-wow-delay="300ms">
                <div className="product-details__content">
                  {/* <Skeleton height="100px" /> */}
                  {loadingData ? (
                    <Skeleton height="100px" />
                  ) : (
                    <div className="product-details__top">
                      <h3 className="product-details__title">{drawDetail?.name}</h3>
                    </div>
                  )}
                  {/* /.product-title */}
                  {/* <div className="product-details__price"> {}</div> */}
                  {/* /.product-price */}
                  <div className="product-details__divider" />
                  {/* /.divider */}
                  {loadingData ? (
                    <Skeleton height="100px" />
                  ) : (
                    <div className="product-details__excerpt">
                      <p className="product-details__excerpt-text1">{drawDetail?.discription}</p>
                      {drawDetail?.prizes?.map((each, index) => {
                        return (
                          <h3 key={index}>
                            {Prize[index]} {drawDetail.prizes > 1 ? index + 1 : ''} : {each?.description}
                          </h3>
                        );
                      })}

                      <h3>{drawDetail.entry} Entiries Applied</h3>
                      <h2>
                        Schedule Date:
                        {new Date(drawDetail?.scheduleDate).getDate() +
                          ' - ' +
                          (parseInt(new Date(drawDetail?.scheduleDate).getMonth()) + 1) +
                          ' - ' +
                          new Date(drawDetail?.scheduleDate).getFullYear()
                           +
                          ' ' +
                          new Date(drawDetail?.scheduleDate).toLocaleTimeString()}
                      </h2>
                    </div>
                  )}

                  {/* /.excerp-text */}
                  {loadingData ? (
                    <Skeleton height="80px" width="30%" />
                  ) : (
                    <div className="product-details__buttons" style={{ marginTop: '20px' }}>
                      {token && (
                        <NavLink to={isAuth ? `/entryplans/?drawid=${drawDetail._id}` : '/login'} className="nisoz-btn" id="upcomingBtn">
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__text">Add More Entries</span>
                        </NavLink>
                      )}
                      {token && localStorage.getItem('applyToDraw') && (
                        <button
                          className="nisoz-btn"
                      
                          style={{marginLeft:"1%"}}
                          onClick={() => (confirm('Are you sure you want to apply entries in this draw?') ? applyDrawEntries() : '')}
                        >
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__text">Apply Entries</span>
                        </button>
                      )}
                    </div>
                  )}
                  {/* /.qty-btn */}

                  {/* <div className="product-detail-size">
                    <img src="assets/images/product/Screen_Shot_2021-08-14_at_10.58.43_am_480x480.avif" />
                  </div> */}
                </div>
              </div>
            </div>
            {/* /.product-details */}
          </div>
        </section>
      </>
      {/* )} */}
    </div>
  );
};

export default MemberGiveAwayDetails;
