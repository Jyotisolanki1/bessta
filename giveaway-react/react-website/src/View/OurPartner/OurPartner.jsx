import Partners from './Partners.jsx';
import SideFilter from './SideFilter.jsx';
import './OurPartner.css';
import Cards from '../../Common/Cards';
import FixedPlan from '../Home/FixedPlan.jsx';
import { useSelector } from 'react-redux';

function OurPartner() {
  const { isAuthenticated, isSubcription } = useSelector((state) => state.loginAction);
  return (
    <div className="main-contaner">
      <div>
        <div
          className="partner-container"
          style={
            {
              // // backgroundImage: 'url(assets/images/backgrounds/partnerimage.jpg)',
              // marginTop: '-53px'
            }
          }
        >
          <div className="partner-filter">
            <SideFilter />
          </div>
          <div className="partners">
            <Partners />
          </div>
          
        </div>
        <div className="parnerSection" style={{marginRight:"4%",marginLeft:"4%"}}>
        <div>
          <div style={{ borderBottom: '1px solid', display: 'grid' }} className="searchPartner mt-5">
            <span style={{ gridRow: '6', textAlign: 'center', fontWeight: '600', fontSize: '40px' }}>Partners Benefits</span>
          </div>
        </div>
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
              <b>Featured: </b> Diamond and Platnum Partners will be featured on our social media platforms, website and email, displaying
              their logos.
            </li>
            <li>
              <i className="fa fa-fw fa-check" />
              <b>Customers: </b> Convert our followers into your customers via your special offers promoted by BESTTA via our platform and
              marketing strategy. Diamond partner's Logo will be bigger than the Platnum Partner and will link their logos to their
              website while enjoying the weekly mentoring personally by Peter Huang for his 20 no or little money down strategies (Big
              Corporations can be pure sponsors and may or may not nominate staff to attend the mentoring sessions)
              <br />
              <br />
              All our trade partners MUST be one of our "Accumulating Members" or "Mentoring Members" from Broze to Diamond, so their
              membership level corresponds to their partnership level, eg, a Broze member becomes a Broze Partner, a Diamond Member
              becomes a Diamond Partner, so they can enjoy more benefits of extra fun, promotion, networking, million dollars mentoring,
              or potentially win $100,000 cash. There is only a one-off set-up fee of $99 +GST for each of the partners to set up your
              logo and a brief introduction within the member's page. A genuine 5-30% discount minimum off your advertised RRP rate MUST
              be offered to our members to help you generate more business or branding awareness.
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
      <div>
        {isAuthenticated ? (
          ''
        ) : (
          <>
            <div className="pricing-table">
              <div className="container">
                <div className="section-title mb-5">
                  <h2 className="HomeAccessHeading">Choose Your Access Level</h2>
                  <h5 className="oupartnerPackage1">Select A Package Below To Get Access To Australia's No. 1 Investor's Rewards Club</h5>
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
              </section>
              {/* Call To Action End */}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default OurPartner;
