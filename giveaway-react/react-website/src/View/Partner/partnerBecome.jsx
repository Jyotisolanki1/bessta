/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IMAGES_FILE_SUPPORTED_FORMATS, handleKeyBlock } from '../../Helper/CountryData';
import { useSelector, useDispatch } from 'react-redux';
import { BecomeAPartnerAPi, GetCatAPi } from '../../Slices/BecomeAPartner';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Spinner } from 'reactstrap';
// import sweetalert from "sweetalert/typings/modules/state";

const BecomePartner = () => {
  const [otherCat, setOtherCat] = useState(false);
  const fileRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { category } = useSelector((state) => state.BecomeAPartnerAction);

  useEffect(() => {
    dispatch(GetCatAPi());
  }, []);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    if (e.target.value == 'Others') {
      formik.setFieldValue('category', e.target.value);
      setOtherCat(true);
    } else {
      setOtherCat(false);
      formik.setFieldValue('category', e.target.value);
    }
  };
  const handleEyePress = () => {
    handleTogglePassword();
  };
  const initialValues = {
    business_name: '',
    business_url: '',
    abn: '',
    address: '',
    city: '',
    state: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    profile_pic: '',
    other_category: '',
    category: ''
  };
  const validationSchema = Yup.object({
    abn: Yup.string()
      .required('ABN is required')
      .min(11, 'ABN number should not be less than 11 digits.')
      .max(11, 'ABN cannot be greater than 11 digits.'),

    address: Yup.string().trim().required('Street address is required').max(50, 'Address should be less than or equal to 50 characters'),
    city: Yup.string()
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Only alphabets are allowed with single space between words')
      .max(35, 'Enter the city name')
      .required('City is required'),
    state: Yup.string()
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'Only alphabets are allowed with single space between words')
      .max(35, 'Enter the state name')
      .required('State/Province is required'),
    business_name: Yup.string()
      .matches(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'Only alphanumeric characters are allowed with a single space between words')
      .required('Business name is required'),
    business_url: Yup.string().url('Invalid website format').required('Business website is required'),
    profile_pic: Yup.mixed()
      .required('Company logo field is required')
      .test('FILE_FORMAT', 'Invalid file type', (value) => value && IMAGES_FILE_SUPPORTED_FORMATS.includes(value.type.toString()))
      .test('FILE_SIZE', 'Please select an image smaller than 10 MB', (value) => !value || (value && value.size <= 1024 * 1024 * 10)),
    category: Yup.string().required('Category is required'),
    other_category: Yup.string().when('category', {
      is: 'other',
      then: (schema) =>
        schema
          .required('Other category is required')
          .max(35, 'Other category should be less than or equal to 35 characters')
          .matches(
            /^[^\s]+(\s[^\s]+)*$/,
            'Multiple consecutive spaces are not allowed, and spaces are not permitted at the beginning or end.'
          ),
      otherwise: (schema) => schema.notRequired()
    })
  });

  const onSubmit = async (values) => {
    console.log(values.profile_pic)
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('bussiness_name', values.business_name);
    formData.append('abn', values.abn);
    formData.append('address', values.address);
    formData.append('city', values.city);
    formData.append('state', values.state);
    formData.append('bussiness_url', values.business_url);
    formData.append('image', values.profile_pic);
    if (!values.other_category) {
      formData.append('category', values.category);
    } else {
      formData.append('other_category', values.other_category);
    }
    // console.log('formData', formData);
    await dispatch(BecomeAPartnerAPi(formData))
      .then((response) => {
        if (response.success) {
          navigate('/partner-payments', { state: response.data });
          setIsSubmitting(false);
          toast.success('Fill your Card Details to make payment');
        } else {
          setIsSubmitting(false);
          toast.error(response.message);
        }
      })
      .catch((err) => {
        // console.log('err', err);
        setIsSubmitting(false);
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: true,
    validateOnBlur: true
  });

  return (
    <section
      className="become-partner-section"
      style={{
        backgroundImage: 'url(assets/images/backgrounds/city_dark.jpg)',
        backgroundColor: 'rgba(255, 255, 255, 0.92)'
      }}
    >
      <section className="partner-page">
        <div className="container">
          <div className="becomePartner">
            <div className="becomePartner-container">
              <div className="row">
                <div className="col-lg-6 wow fadeInUp animated" data-wow-delay="300ms">
                  <div className="form-container">
                    <p className="price-info">
                      <b>Contact Details </b>
                    </p>
                    <form className="partner-form" onSubmit={formik.handleSubmit}>
                      <div className="input-container">
                        <label className="form-label">
                          Business Name<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="business_name"
                          aria-label="Business Name"
                          placeholder="Business Name..."
                          required=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.business_name}
                          style={{
                            borderColor: formik.touched.business_name && formik.errors.business_name ? 'red' : ''
                          }}
                          maxLength={50}
                        />
                        {formik.touched.business_name && formik.errors.business_name && (
                          <label
                            style={{
                              color: 'red',
                              fontFamily: 'cursive',
                              fontSize: '13px'
                            }}
                          >
                            {formik.errors.business_name}
                          </label>
                        )}
                      </div>

                      <div className="input-container">
                        <label className="form-label">
                          Category<span style={{ color: 'red' }}>*</span>
                        </label>
                        <select
                          onChange={handleChange}
                          name="category"
                          style={{ cursor: 'pointer' }}
                          value={formik.values.category}
                          onBlur={formik.handleBlur}
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          {category?.data?.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))}
                          <option value="Others">Others</option>
                        </select>

                        {formik.touched.category && formik.errors.category && (
                          <label
                            style={{
                              color: 'red',
                              fontFamily: 'cursive',
                              fontSize: '13px'
                            }}
                          >
                            {formik.errors.category}
                          </label>
                        )}
                      </div>
                      {otherCat ? (
                        <div className="input-container">
                          <label className="form-label">
                            Other Category<span style={{ color: 'red' }}>*</span>
                          </label>
                          <input
                            type="text"
                            name="other_category"
                            aria-label="Other_Category"
                            placeholder="Other Category"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.other_category}
                            style={{
                              borderColor: formik.touched.other_category && formik.errors.other_category ? 'red' : ''
                            }}
                            maxLength={50}
                          />
                          {formik.touched.other_category && formik.errors.other_category && (
                            <label
                              style={{
                                color: 'red',
                                fontFamily: 'cursive',
                                fontSize: '13px'
                              }}
                            >
                              {formik.errors.other_category}
                            </label>
                          )}
                        </div>
                      ) : (
                        ''
                      )}

                      <div className="input-container">
                        <label className="form-label">
                          Business website<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="business_url"
                          aria-label="Business website"
                          placeholder="Business website..."
                          required=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.business_url}
                          style={{
                            borderColor: formik.touched.business_url && formik.errors.business_url ? 'red' : ''
                          }}
                        />
                        {formik.touched.business_url && formik.errors.business_url && (
                          <label
                            style={{
                              color: 'red',
                              fontFamily: 'cursive',
                              fontSize: '13px'
                            }}
                          >
                            {formik.errors.business_url}
                          </label>
                        )}
                      </div>
                      <div className="input-container">
                        <label className="form-label">
                          ABN<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          type="number"
                          name="abn"
                          onKeyDown={handleKeyBlock}
                          aria-label="ABN"
                          placeholder="ABN..."
                          required=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.abn}
                          style={{
                            borderColor: formik.touched.abn && formik.errors.abn ? 'red' : ''
                          }}
                          maxLength={11}
                        />
                        {formik.touched.abn && formik.errors.abn && (
                          <label
                            style={{
                              color: 'red',
                              fontFamily: 'cursive',
                              fontSize: '13px'
                            }}
                          >
                            {formik.errors.abn}
                          </label>
                        )}
                      </div>

                      <div className="input-container">
                        <label className="form-label">
                          Company Logo<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          ref={fileRef}
                          type="file"
                          name="profile_pic"
                          onChange={(event) => {
                            formik.setFieldValue('profile_pic', event.target.files[0]);
                          }}
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            marginBottom: '5px ',
                            marginTop: '5px ',
                            borderColor: formik.touched.profile_pic && formik.errors.profile_pic ? 'red' : ''
                          }}
                          // error={
                          //   formik.touched.profile_pic &&
                          //   Boolean(formik.errors.profile_pic)
                          // }
                          // helperText={
                          //   formik.touched.profile_pic &&
                          //   formik.errors.profile_pic
                          // }
                          accept={IMAGES_FILE_SUPPORTED_FORMATS.join(',')}
                          onBlur={formik.handleBlur}
                        />
                        <label>(Note: Only JPEG, JPG, PNG, GIF image type allowed)</label>
                        {formik.touched.profile_pic && formik.errors.profile_pic && (
                          <label
                            style={{
                              color: 'red',
                              fontFamily: 'cursive',
                              fontSize: '13px'
                            }}
                          >
                            {formik.errors.profile_pic}
                          </label>
                        )}
                        {/* <Typography variant="h6">(Note: Only JPEG, JPG, PNG, GIF image type allowed)</Typography> */}
                      </div>
                      <p className="price-info mt-4">
                        <b>Business Address </b>
                      </p>

                      <div className="input-container">
                        <label className="form-label">
                          Street Address<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          aria-label="Street Address"
                          placeholder="Street Address..."
                          required=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.address}
                          style={{
                            borderColor: formik.touched.address && formik.errors.address ? 'red' : ''
                          }}
                        />
                        {formik.touched.address && formik.errors.address && (
                          <label
                            style={{
                              color: 'red',
                              fontFamily: 'cursive',
                              fontSize: '13px'
                            }}
                          >
                            {formik.errors.address}
                          </label>
                        )}
                      </div>
                      <div className="input-container">
                        <label className="form-label">
                          State / Province<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          aria-label="State / Province"
                          placeholder="State / Province..."
                          required=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.state}
                          style={{
                            borderColor: formik.touched.state && formik.errors.state ? 'red' : ''
                          }}
                          maxLength={35}
                        />
                        {formik.touched.state && formik.errors.state && (
                          <label
                            style={{
                              color: 'red',
                              fontFamily: 'cursive',
                              fontSize: '13px'
                            }}
                          >
                            {formik.errors.state}
                          </label>
                        )}
                      </div>
                      <div className="input-container">
                        <label className="form-label">
                          City<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          aria-label="City"
                          placeholder="City..."
                          required=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.city}
                          style={{
                            borderColor: formik.touched.city && formik.errors.city ? 'red' : ''
                          }}
                          maxLength={35}
                        />
                        {formik.touched.city && formik.errors.city && (
                          <label
                            style={{
                              color: 'red',
                              fontFamily: 'cursive',
                              fontSize: '13px'
                            }}
                          >
                            {formik.errors.city}
                          </label>
                        )}
                      </div>

                      {/* <p className="price-info mt-4">
                      <b>Credit Card Information </b>
                    </p>
                    <div className="input-container">
                      <div className="card-icon">
                        <i className="fa-regular fa-credit-card" />
                        <input
                          className="pl-40"
                          type="text"
                          name="cardNumber"
                          aria-label="Card Number"
                          placeholder="Card Number..."
                          required=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.cardNumber}
                          style={{
                            borderColor:
                              formik.touched.cardNumber &&
                              formik.errors.cardNumber
                                ? "red"
                                : "",
                          }}
                        />
                        {formik.touched.cardNumber &&
                          formik.errors.cardNumber && (
                            <label
                              style={{
                                color: "red",
                                fontFamily: "cursive",
                                fontSize: "13px",
                              }}
                            >
                              {formik.errors.cardNumber}
                            </label>
                          )}
                      </div>
                      <svg
                        className="icon"
                        width={24}
                        height={24}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g fill="none" fillRule="evenodd">
                          <circle fill="#FF7979" cx={12} cy={12} r={12} />
                          <rect
                            fill="#FFF"
                            x={11}
                            y={6}
                            width={2}
                            height={9}
                            rx={1}
                          />
                          <rect
                            fill="#FFF"
                            x={11}
                            y={17}
                            width={2}
                            height={2}
                            rx={1}
                          />
                        </g>
                      </svg>
                      <p className="message" />
                    </div>
                    <div className="input-container">
                      <div className="card-icon-flex">
                        <input
                          className="pl-40"
                          placeholder="MM"
                          type="text"
                          name="expiryMonth"
                          aria-label="MM"
                          required=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.expiryMonth}
                          style={{
                            borderColor:
                              formik.touched.expiryMonth &&
                              formik.errors.expiryMonth
                                ? "red"
                                : "",
                          }}
                        />
                        <input
                          className="pl-40"
                          placeholder="Year"
                          type="text"
                          name="expiryYear"
                          aria-label="Year"
                          required=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.expiryYear}
                          style={{
                            borderColor:
                              formik.touched.expiryYear &&
                              formik.errors.expiryYear
                                ? "red"
                                : "",
                          }}
                        />
                        <input
                          className="pl-40"
                          placeholder="CVV"
                          type="text"
                          name="cvv"
                          aria-label="CVV"
                          required=""
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.cvv}
                          style={{
                            borderColor:
                              formik.touched.cvv && formik.errors.cvv
                                ? "red"
                                : "",
                          }}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between border-bottom">
                      <span className="Itemheading">
                        <b>Item</b>
                      </span>
                      <span className="Itemheading">
                        <b>Price</b>
                      </span>
                    </div>
                    <div className="d-flex justify-content-between bg-1 mt-3 mb-4">
                      <span className="Itemheading price d-flex">
                        <input
                          className="radio btn"
                          type="radio"
                          id=""
                          name=""
                          defaultValue=""
                        />
                        <label htmlFor="html">
                          $99 BESTTA Once Off Setup Fee
                        </label>
                      </span>
                      <span className="Itemheading">$99</span>
                    </div> */}
                      {/* <button type="submit">
                      {!isSubmitting ? "" : "Continue To Payment...."}
                    </button> */}
                      <button
                        disabled={isSubmitting}
                        style={{
                          backgroundColor: '#f28500 ',
                          padding: '10px 25px',
                          borderRadius: '30px'
                        }}
                        type="submit"
                        id="continuetopay"
                      >
                        {isSubmitting ? (
                          <>
                            Processing ...
                            <Spinner color="secondary" size="sm" type="grow" style={{ marginLeft: '10px' }} />
                          </>
                        ) : (
                          'Continue To Payment'
                        )}
                      </button>
                      <p className="terms-of-service text-center">
                        Signing up agrees to the BESTTA partner program
                        <Link to="/termsandcondition" target="_blank">
                          {' '}
                          Terms &amp; Conditions.{' '}
                        </Link>
                      </p>
                      <img className="width-300 mt-4" src="assets/images/backgrounds/credit-only.png" />
                    </form>
                  </div>
                </div>
                <div className="col-lg-6 wow fadeInUp animated" data-wow-delay="400ms">
                  <div className="login-page__wrap">
                    <div className="section-title mb-2">
                      <h2 className="section-title__title_partner" style={{ fontSize: '40px !important' }}>
                        Setup fee: $99
                      </h2>
                    </div>{' '}
                    <div className="section-title mb-2">
                      <h2 className="section-title__title_partner">What's Included:</h2>
                    </div>
                    <ul className="login-points">
                      <li>
                        <i className="fa fa-fw fa-check" />
                        <b>Exposure: </b>Be seen by millions through our Multi-Million Dollar marketing strategy!
                      </li>
                      <li>
                        <i className="fa fa-fw fa-check" />
                        <b>Featured: </b> Diamond and Platnum Partners will be featured on our social media platforms, website and email,
                        displaying their logos.
                      </li>
                      <li>
                        <i className="fa fa-fw fa-check" />
                        <b>Customers: </b> Convert our followers into your customers via your special offers promoted by BESTTA via our
                        platform and marketing strategy. Diamond partner's Logo will be bigger than the Platnum Partner and will link their
                        logos to their website while enjoying the weekly mentoring personally by Peter Huang for his 20 no or little money
                        down strategies (Big Corporations can be pure sponsors and may or may not nominate staff to attend the mentoring
                        sessions)
                        <br />
                        <br />
                        All our trade partners MUST be one of our "Accumulating Members" or "Mentoring Members" from Broze to Diamond, so
                        their membership level corresponds to their partnership level, eg, a Broze member becomes a Broze Partner, a Diamond
                        Member becomes a Diamond Partner, so they can enjoy more benefits of extra fun, promotion, networking, million
                        dollars mentoring, or potentially win $100,000 cash. There is only a one-off set-up fee of $99 +GST for each of the
                        partners to set up your logo and a brief introduction within the member's page. A genuine 5-30% discount minimum off
                        your advertised RRP rate MUST be offered to our members to help you generate more business or branding awareness.
                        <br />
                        <br />
                        The partnership is optional and the above menbers do not have to be our partners.
                      </li>
                      <br />
                      {/* <li>
                      <i className="fa fa-fw fa-check" />
                      &nbsp;All our trade partners MUST be one of our
                      "Accumulating Members" or "Mentoring Members"
                      from 66 cent per day, so they can enjoy more benefits of
                      some extra fun, promotion, networking, million dollars
                      mentoring, or potentially win $100,000 cash or more. There
                      is only a one-off set-up fee of $99 +GST for normal
                      partners to set up your logo and a brief introduction from
                      the page inclusive to all of our members. A genuine 5-30%
                      discount minimum off your advertised RRP rate MUST be
                      offered to our BESTTA Investors Club members to help you
                      generate more businesses or branding awareness. The VIP
                      partners will be paying $1,997 + GST a year includig set
                      up fee or equivalent membership. Diamond partner will be
                      paying $4,997 + GST a year including set up fee or
                      equivalent membership. The prices are subject to change
                      based on the inflation or market conditions
                    </li> */}
                    </ul>
                    {/* <ul className="login-points">
                    <li>
                      <i className="fa fa-fw fa-check" />
                      <b> Customers: </b>Convert our followers into your
                      customers via your special offers promoted by BESTTA via
                      our platform and marketing strategy.
                    </li>
                  </ul> */}
                    {/* <div className="section-title mt-4 mb-2">
                    <h2 className="section-title__title">BONUSES:</h2>
                  </div>
                  <ul className="login-points">
                    <li>
                      <i className="fa fa-fw fa-check" />
                      <b> Invitations: </b> Get VIP invitations to BESTTA
                      functions and events
                    </li>
                    <li>
                      <i className="fa fa-fw fa-check" />
                      <b> Account Manager: </b>Have your own account manager
                      dedicated to helping your needs.
                    </li>
                  </ul>
                  <div className="login-logo mt-5 mb-5">
                    <img className="text-center" src="assets/images/logo.png" />
                  </div>
                  <ul className="login-points">
                    <li className="li-points">
                      <img
                        className="text-center"
                        src="assets/images/resources/seal1.webp"
                      />
                      <span className="li-points-1">
                        <b> 100% Satisfaction Guaranteed </b>
                        <br />
                        We guarantee 100% satisfaction when partnering with
                        BESTTA of exposing your business to our audience via our
                        marketing strategy.
                      </span>
                    </li>
                    <li className="li-points">
                      <img
                        className="text-center"
                        src="assets/images/resources/grey-lock.webp"
                      />
                      <span className="li-points-1">
                        <b> Secure Processing </b>
                        <br />
                        Each order is processed through a secure, 256-bit
                        encrypted payment processing gateway to ensure your
                        privacy.
                      </span>
                    </li>
                  </ul> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default BecomePartner;
