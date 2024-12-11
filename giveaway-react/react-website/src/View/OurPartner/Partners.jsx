import { useDispatch, useSelector } from 'react-redux';
import { REACT_API_URL } from '../../../config';
import { useEffect, useState, useRef } from 'react';
import { GetPartnersApi } from '../../Slices/GetPartners';
import PartnerDetails from './ParternerDetails';
// import { FaSearch } from 'react-icons/fa';
// import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const OurPartner = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]); // Your data array
  const [currentPage, setCurrentPage] = useState(1);
  const { getPartnersList, getPartnersFilteredList, loading } = useSelector((state) => state.getPartnerAction);
  const [active, setActive] = useState(false);
  const [partnerContent, setPartnerContent] = useState('');

  const [search, setSearch] = useState({
    filter: 'All',
    search: ''
  });

  const [dataLoaded, setDataLoaded] = useState(false); // New state variable to track data loading

  useEffect(() => {
    dispatch(GetPartnersApi()).then((res) => {
      setData(res.data);
      setDataLoaded(true); // Set dataLoaded to true after data fetching is completed
    });
  }, []);

  useEffect(() => {
    if (!getPartnersFilteredList?.length) {
      setData(getPartnersFilteredList);
    }
  }, [dispatch, getPartnersFilteredList]);

  const itemsPerPage = 6;

  const handleClickNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // const selectRef = useRef(null);
  useEffect(() => {
    dispatch(GetPartnersApi()).then((res) => {
      setData(res.data);
    });
  }, []);

  useEffect(() => {
    if (!getPartnersFilteredList == []) {
      setData(getPartnersFilteredList);
    }
  }, [dispatch, getPartnersFilteredList]);

  // const getSelectWidth = () => {
  //   // Use a temporary element to calculate the width of the option text
  //   const tempElement = document.createElement('div');
  //   tempElement.style.display = 'inline-block';
  //   tempElement.style.visibility = 'hidden';
  //   tempElement.style.fontSize = '16px'; // Match the font size of the select box
  //   tempElement.innerText = search?.filter;
  //   document.body.appendChild(tempElement);
  //   const width = tempElement.offsetWidth + 54; // Add extra padding for better spacing
  //   document.body.removeChild(tempElement);
  //   return width;
  // };

  const handleParnter = (e, item) => {
    e.preventDefault();

    setActive(true);
    setPartnerContent(item);
  };

  // const selectWidth = getSelectWidth();

  // const handleSearch = async () => {
  //   // Trim the search string to remove leading and trailing whitespace
  //   const trimmedSearch = search.search.trim();

  //   // Check if the trimmed search string is empty
  //   if (!trimmedSearch) {
  //     toast.error('Empty string not allowed'); // Changed to "not allowed" assuming you don't want to allow empty strings
  //     return;
  //   }

  //   // If the search string is not empty, proceed with the search
  //   try {
  //     dispatch(SearchPartnerApi(search)).then((res) => {
  //       setData(res.data);
  //     });
  //   } catch (err) {
  //     // console.log(err);
  //   }
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === 'search' && value === '') {
  //     dispatch(GetPartnersApi()).then((res) => {
  //       setData(res.data);
  //     });
  //   }
  //   setSearch({
  //     ...search,
  //     [name]: value
  //   });
  // };

  const handleClickPrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const renderData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex).map((item, index) => (
      // Render your item here
      <div className="our-logos" key={item._id}>
        {/* <img
          src={`${REACT_API_URL}${item.image}`}
          // width={300}
          // height={150}
          key={item._id}
          style={{ margin: "25px" }}
        /> */}
        {item?.bussiness_url !== '' ? (
          <div onClick={(e) => handleParnter(e, item)}>
            {/* <div className="logos"> */}
            <img src={`${REACT_API_URL}${item?.image}`} className="outImages" alt={`Image ${index}`} />
            <br />
            <h4 style={{ color: 'black', marginLeft: '8%' }}>{item?.firstname + ' ' + item?.lastname}</h4>
            {/* </div> */}
          </div>
        ) : (
          <div className="">
            <img
              src={`${REACT_API_URL}${item}`}
              // width={300}
              // height={150}
              style={{ margin: '25px' }}
              alt={`Image ${index}`}
            />
            <br />
            <h4 style={{ textAlign: 'center' }}>{item?.firstname + ' ' + item?.lastname}</h4>
          </div>
        )}
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

      <section className="partnerMargin">
        <div className="container"></div>
      </section>
      <div>
        <div className="container">
          <div>
            <div style={{ borderBottom: '1px solid', display: 'grid' }} className="searchPartner">
              <span style={{ gridRow: '6', textAlign: 'center', fontWeight: '600', fontSize: '40px' }}>Our Partners</span>
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
              {loading || !dataLoaded ? (
                <div style={{ height: '20px', marginLeft: '30rem', marginTop: '30px' }}>
                  <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                  </Box>
                </div>
              ) : (
                <div>
                  {data.length > 0 ? (
                    <div className="row">
                      <div className="griddata" style={{}}>
                        {renderData()}
                      </div>
                      <div className="col-md-12 d-flex justify-content-center changemargintop" style={{ marginTop: '4%' }}>
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
                    <h1 style={{ textAlign: 'center' }}>No Partner Found</h1>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {active && <PartnerDetails active={active} setActive={setActive} partnerContent={partnerContent} />}
        {/* /.container */}
      </div>
    </>
  );
};

export default OurPartner;
