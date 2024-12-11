import Cards from '../../Common/Cards';
import { useDispatch, useSelector } from 'react-redux';
import { REACT_API_URL } from '../../../config';
import { useEffect, useState, useRef } from 'react';
import { GetPartnersApi, SearchPartnerApi } from '../../Slices/GetPartners';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const OurPartner = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]); // Your data array
  const [currentPage, setCurrentPage] = useState(1);
  const { getPartnersList, loading } = useSelector((state) => state.getPartnerAction);

  const [search, setSearch] = useState({
    filter: 'All',
    search: ''
  });

  const selectRef = useRef(null);
  useEffect(() => {
    dispatch(GetPartnersApi()).then((res) => {
      setData(res.data);
    });
  }, [dispatch]);

  const itemsPerPage = 8;

  const handleClickNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const getSelectWidth = () => {
    // Use a temporary element to calculate the width of the option text
    const tempElement = document.createElement('div');
    tempElement.style.display = 'inline-block';
    tempElement.style.visibility = 'hidden';
    tempElement.style.fontSize = '16px'; // Match the font size of the select box
    tempElement.innerText = search.filter;
    document.body.appendChild(tempElement);
    const width = tempElement.offsetWidth + 54; // Add extra padding for better spacing
    document.body.removeChild(tempElement);
    return width;
  };

  const selectWidth = getSelectWidth();

  const handleSearch = async () => {
    // Trim the search string to remove leading and trailing whitespace
    const trimmedSearch = search.search.trim();

    // Check if the trimmed search string is empty
    if (!trimmedSearch) {
      toast.error('Empty string not allowed'); // Changed to "not allowed" assuming you don't want to allow empty strings
      return;
    }

    // If the search string is not empty, proceed with the search
    try {
      dispatch(SearchPartnerApi(search)).then((res) => {
        setData(res.data);
      });
    } catch (err) {
      // console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'search' && value === '') {
      dispatch(GetPartnersApi()).then((res) => {
        setData(res.data);
      });
    }
    setSearch({
      ...search,
      [name]: value
    });
  };

  const handleClickPrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const renderData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex).map((item, index) => (
      // Render your item here
      <div className="col-md-3 our-logos" key={item._id}>
        {/* <img
          src={`${REACT_API_URL}${item.image}`}
          // width={300}
          // height={150}
          key={item._id}
          style={{ margin: "25px" }}
        /> */}
        {item?.bussiness_url !== '' ? (
          <a href={item?.bussiness_url} target="_blank" rel="noopener noreferrer">
            {/* <div className="logos"> */}
            <img
              src={`${REACT_API_URL}${item?.image}`}
              width={150}
              height={150}
              style={{ margin: '25px', cursor: 'pointer' }}
              alt={`Image ${index}`}
            />
            {/* </div> */}
          </a>
        ) : (
          <div className="">
            <img
              src={`${REACT_API_URL}${item}`}
              // width={300}
              // height={150}
              style={{ margin: '25px' }}
              alt={`Image ${index}`}
            />
          </div>
        )}
        <br />
        <h4 style={{ textAlign: 'center' }}>{item?.firstname + ' ' + item?.lastname}</h4>
      </div>
    ));
  };

  const imagesArray = getPartnersList.map((eachImage) => eachImage?.image);
  const slides = imagesArray?.map((el, index) => (
    // <img src={el} style={{ padding: "20px" }} key={index} />
    <img src={`${REACT_API_URL}${el}`} width={300} height={150} key={index} style={{ margin: '25px' }} />
  ));

  return (
    <>
      <div className="stricky-header stricked-menu main-menu main-menu-with-border">
        <div className="sticky-header__content" />
        {/* /.sticky-header__content */}
      </div>
      {/* /.stricky-header */}
      {/*Main Slider Start*/}
      {/* <HomeSlider/> */}

      <section className="about-two">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="about-two__thumb featured wow fadeInLeft" data-wow-delay="300ms"></div>
            </div>
          </div>
        </div>
      </section>
      <div
        className="client-carousel @@extraClassName"
        style={{
          backgroundImage: 'url(assets/images/backgrounds/partnerimage.jpg)'
        }}
      >
        <div className="container">
          <div>
            <div style={{ borderBottom: '1px solid', display: 'grid', gap: '15px', padding: '3%' }} className="searchPartner">
              <span style={{ gridRow: '6', textAlign: 'center', fontWeight: '600', fontSize: '40px' }}>Our Partners</span>
              <div style={{ display: 'flex', gridRow: '6' }} className="searchsection">
                <div className="left" style={{ marginLeft: '35%', borderRadius: '22px 0 0 22px' }}>
                  <select
                    ref={selectRef}
                    name="filter"
                    onChange={handleChange}
                    style={{
                      backgroundColor: '#495057',
                      color: 'white',
                      width: selectWidth + 'px',
                      padding: '15px',
                      border: 'none',
                      borderRadius: '22px 0 0 22px'
                    }}
                  >
                    <option value="all" selected>
                      All
                    </option>
                    <option value="category">Category</option>
                    <option value="city">City</option>
                    <option value="state">State</option>
                  </select>
                </div>
                <div className="fill">
                  <input
                    type="text"
                    placeholder="Search by filters"
                    name="search"
                    onChange={handleChange}
                    value={search.search}
                    style={{ padding: '15px', border: 'none', width: '18em' }}
                  />
                </div>
                <div className="right">
                  <button
                    onClick={handleSearch}
                    style={{ backgroundColor: '#f28500', padding: '15px', border: 'none', borderRadius: '0 22px 22px 0' }}
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div></div>

          {/* section-title */}
          <div style={{ width: '100%', margin: '0px auto' }}>
            {/* <h2>Our Partners</h2> */}
            <div
              style={{
                // backgroundImage: `url(${partner})`,
                // backgroundSize: "cover",
                // height: "400px",
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {loading ? (
                <div style={{ height: '20px', marginLeft: '3em' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                  </Box>
                </div>
              ) : (
                <>
                  {data?.length > 0 && !loading ? (
                    <div className="row">
                      {renderData()}
                      <div className="col-md-12 d-flex justify-content-center">
                        <button onClick={handleClickPrev} disabled={currentPage === 1} className="nisoz-btn mx-2">
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__text">View Less</span>
                        </button>
                        <button onClick={handleClickNext} disabled={currentPage * itemsPerPage >= data.length} className="nisoz-btn mx-2">
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__shape" />
                          <span className="nisoz-btn__text">View More</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <h1 style={{ text: 'center' }}>No Partner Found</h1>
                  )}
                </>
              )}

              {/* <Swiper
                modules={[Virtual, Autoplay]}
                spaceBetween={40}
                slidesPerView={4}
                virtual
                autoplay={{ delay: 2500, disableOnInteraction: false }}
              >
                {slides.map((slideContent, index) => (
                  <SwiperSlide
                    key={index}
                    virtualIndex={index}
                    className="w-fit"
                  >
                    {slideContent}
                  </SwiperSlide>
                ))}
              </Swiper> */}
            </div>
          </div>
        </div>

        {/* /.container */}
      </div>
      <div className="pricing-table">
        <div className="container">
          <div className="section-title mb-5">
            <h2 className="section-title__title">Choose Your Access Level</h2>
            <h5 className="section-title__tagline">Select A Package Below To Get Access To Australia's No. 1 Investor's Rewards Club</h5>
          </div>
          <div className="pricingtablecontainer" style={{ display: 'block' }}>
            <Cards />
          </div>
        </div>
      </div>

      <section className="video-one">
        <div className="container">
          <div className="video-one__banner wow fadeInUp" data-wow-delay="100ms">
            <img src="assets/images/backgrounds/video-bg-1-1.jpg" alt="nisoz" />
            <div className="video-one__border-wrap wow fadeInLeft" data-wow-delay="300ms">
              <div className="video-one__border-one" />
              <div className="video-one__border-two" />
            </div>
            <div className="video-one__content">
              <a href="https://www.youtube.com/watch?v=kXShLPXfWZA" className="video-popup">
                <span className="fa fa-play" />
              </a>

              <h2 className="video-one__content__title">Most Trusted Rewards club</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="fact-two">
        <section className="cta-one jarallax" data-jarallax="" data-speed="0.3" data-imgposition="50% -100%">
          <div
            className="cta-one__bg jarallax-img"
            style={{
              backgroundImage: 'url(assets/images/backgrounds/cta-bg-1.jpg)'
            }}
          />
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-xl-8 wow fadeInLeft" data-wow-delay="200ms">
                <div className="section-title">
                  <h2 className="section-title__title">We Only Work With The Best</h2>
                </div>
              </div>
              {/* <div
                className="col-md-4 col-xl-4 text-end wow fadeInRight"
                data-wow-delay="300ms"
              >
                <button
                  // to="/become-partner"
                  // target="_blank"
                  className="nisoz-btn"
                  style={{ zIndex: 999 }}
                  onClick={() => {
                    // console.log("click");
                    navigate("/become-partner");
                  }}
                >
                  Click here to Become a Partner
                </button>
              </div> */}
            </div>
            <div className="cta-one__text wow fadeInUp" data-wow-delay="400ms">
              {/* <div class="section-title__triangle"> */}
              {/* <span class="section-title__triangle-left"></span> */}
              {/* <span class="section-title__triangle-right"></span> */}
              {/* </div> */}
              <p>Feature Your Business And Become An BESTTA Partner</p>
            </div>
          </div>
        </section>
        {/* Call To Action End */}
      </section>
    </>
  );
};

export default OurPartner;
