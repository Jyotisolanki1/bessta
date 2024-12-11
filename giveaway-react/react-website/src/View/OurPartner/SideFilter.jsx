import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetCatAPi } from '../../Slices/BecomeAPartner';
import { TextField } from '@mui/material';
import { SearchPartnerApi } from '../../Slices/GetPartners';
import _ from 'lodash';

const debouncedHandleSearch = _.debounce(async (dispatch, name, value) => {
  await dispatch(SearchPartnerApi({ name, value }));
}, 300); // Adjust the debounce delay as needed

export default function SideFilter() {
  const [opencat, setOpencat] = useState(false);
  const [openstate, setOpenstate] = useState(false);
  const [opencity, setOpencity] = useState(false);
  const [stateFil, setState] = useState([]);
  const [cityFil, setCity] = useState([]);
  const [catFil, setCat] = useState([])
  const [search, setSearch] = useState('')

  const dispatch = useDispatch();

  const states = ['NSW', 'QLD', 'SA', 'TAS', 'VIC', 'WA', 'ACT', 'NT'];
  const cities = ['indore', 'Delhi', 'nagpur', 'kota', 'raipur', 'kerla', 'hydrabad', 'lakhnow'];
  const { category } = useSelector((state) => state.BecomeAPartnerAction)

  useEffect(() => {
    dispatch(GetCatAPi())
  }, [opencat])

  useEffect(() => {
    setState(states);
    setCity(cities);
    if (category) {
      setCat(category?.data)
    }
  }, [opencat]);

  const handleChange = (value, name) => {
    if (name === 'state') {
      const filteredStates = states?.filter((state) => state?.toLowerCase().includes(value.toLowerCase()));
      setState(filteredStates);
    }
    if (name === 'city') {
      const filteredCities = cities?.filter((city) => city?.toLowerCase().includes(value.toLowerCase()));
      setCity(filteredCities);
    }
    if (name === 'category') {
      const filteredCats = category?.data.filter((cat) => cat?.name?.toLowerCase().includes(value.toLowerCase()));
      setCat(filteredCats);
    }
  };

  const handleClick = async (e, name) => {
    const value = e.target.innerHTML;
    setSearch(e.target.innerHTML)
    await dispatch(SearchPartnerApi({ name, value }))
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const name = e.target.name;
    debouncedHandleSearch(dispatch, name, value);
  };

  return (
    <div className='partnerFiltersection'>
      <TextField
        id="outlined-basic"
        label="Search by Category,City,State"
        style={{ backgroundColor: 'white', width: '100%', marginBottom: '13%' }}
        placeholder="Search by Category,City,State"
        variant="outlined"
        value={search}
        onChange={handleSearch}
        name="all"
      />

      <div className="catDiv">
        <div className="filter">
          <p className="filter-heading">Filter By Category </p>
          <span onClick={() => setOpencat(!opencat)} className="plus">
            {opencat ? '-' : '+'}
          </span>
        </div>

        {opencat && (
          <div style={{ marginTop: '2px' }}>
            <TextField
              id="standard-basic"
              label="Search Category"
              variant="standard"
              style={{ width: '100%', marginBottom: '9%', backgroundColor: "white" }}
              name="category"
              onChange={(e) => handleChange(e.target.value, e.target.name)}
              InputLabelProps={{
                style: { textAlign: 'center' }
              }}
            />

            <div className="openFilter">
              {catFil?.length > 0 ? (
                <>
                  {catFil.map((cat) => {
                    return (
                      <p className="content" key={cat.name} onClick={(e) => handleClick(e, "category")} style={{cursor:"pointer"}}>
                        {cat.name}
                      </p>
                    );
                  })}
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <p style={{ fontWeight: '600' }}>Category not found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="stateDiv">
        <div className="filter">
          <p className="filter-heading">Filter By State </p>
          <span onClick={() => setOpenstate(!openstate)} className="plus">
            {openstate ? '-' : '+'}
          </span>
        </div>
        {openstate && (
          <div style={{ marginTop: '2px' }}>
            <TextField
              id="standard-basic"
              label="Search State"
              variant="standard"
              style={{ width: '100%', marginBottom: '9%', backgroundColor: "white" }}
              onChange={(e) => handleChange(e.target.value, e.target.name)}
              name="state"
            />
            <div className="openFilter">
              {stateFil?.length > 0 ? (
                <>
                  {stateFil?.map((state) => {
                    return (
                      <p className="content" key={state} onClick={(e) => handleClick(e, "state")} style={{cursor:"pointer"}}>
                        {state}
                      </p>
                    );
                  })}
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <p style={{ fontWeight: '600' }}>State not found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="cityDiv">
        <div className="filter">
          <p className="filter-heading">Filter By City </p>
          <span onClick={() => setOpencity(!opencity)} className="plus">
            {opencity ? '-' : '+'}
          </span>
        </div>
        {opencity && (
          <div style={{ marginTop: '2px' }}>
            <TextField id="standard-basic" label="Search City" variant="standard" style={{ width: '100%', marginBottom: '9%', backgroundColor: "white" }} name="city" onChange={(e) => handleChange(e.target.value, e.target.name)} />
            <div className="openFilter">
              {cityFil && cityFil?.length > 0 ? (
                <>
                  {cityFil.map((city) => {
                    return (
                      <p className="content" key={city} onClick={(e) => handleClick(e, "city")} style={{cursor:"pointer"}} >
                        {city}
                      </p>
                    );
                  })}
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <p style={{ fontWeight: '600' }}>City not found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
