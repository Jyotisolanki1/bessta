// import React from "react";

import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.loginAction);
  return (
    <>
      <footer className="main-footer">
        <div
          className="main-footer__bg"
          style={{
            backgroundImage: 'url(/assets/images/shapes/footer-bg-1.png)'
          }}
        />
        <div className="container">
          <div
            className="main-footer__top wow fadeInUp animated"
            data-wow-delay="100ms"
            style={{
              visibility: 'visible',
              animationDelay: '100ms',
              animationName: 'fadeInUp'
            }}
          >
            <NavLink to="/" className="main-footer__logo">
              <img src="/assets/images/logo-white.png" alt="nisoz" width={96} height={34} />
            </NavLink>
            {/* /.footer-logo */}
            <div className="main-footer__social">
              <Link target="_blank" to="https://www.facebook.com/people/Bestta-Investors-Club/61557651255361/">
                <i className="fab fa-facebook" />
              </Link>{' '}
              <NavLink to="https://www.pinterest.com/">
                <i className="fab fa-pinterest" />
              </NavLink>
              <NavLink to="https://www.snapchat.com/">
                <i className="fab fa-snapchat" />
              </NavLink>
              <NavLink to="https://www.instagram.com/">
                <i className="fab fa-instagram" />
              </NavLink>
              <NavLink to="https://www.youtube.com/">
                <i className="fa-brands fa-youtube"></i>
              </NavLink>
              <NavLink to="https://www.tiktok.com/">
                <i className="fa-brands fa-tiktok"></i>
              </NavLink>
              <NavLink to="https://www.linkedin.com/">
                <i className="fa-brands fa-linkedin"></i>
              </NavLink>
              <NavLink to="https://x.com/">
                <i className="fa-brands fa-x-twitter" />
              </NavLink>
            </div>
            {/* /.footer-social */}
          </div>
          {/* footer-top */}
          <div className="d-flex justify-content-between newnavbarmenu flex-wrap">
            <div
              className=" wow fadeInUp animated quick"
              data-wow-delay="200ms"
              style={{
                visibility: 'visible',
                animationDelay: '200ms',
                animationName: 'fadeInUp'
              }}
            >
              <div className="main-footer__navmenu ">
                <h4>QUICK LINKS</h4>
                <ul>
                  <li>
                    <NavLink to="/privacypolicy">Privacy Policy</NavLink>
                  </li>
                  {/* <li>
                    <NavLink to="/membertermsandcondition">
                      Membership T&amp;C{" "}
                    </NavLink>
                  </li> */}
                  <li>
                    <NavLink to="/termsandcondition">Terms and Conditions</NavLink>
                  </li>
                  <li>
                    <NavLink to="/faq">FAQs</NavLink>
                  </li>
                  <li>
                    <NavLink to="/about-us">About</NavLink>
                  </li>
                  {!isAuthenticated && (
                    <li>
                      <NavLink to="/login" className="fooote-btn">
                        Login
                      </NavLink>
                    </li>
                  )}
                  {!isAuthenticated && (
                    <li>
                      <NavLink to="/plans" className="fooote-btn">
                        Sign Up
                      </NavLink>
                    </li>
                  )}
                </ul>
                {/* /.list-unstyled */}
              </div>
              {/* /.footer-menu */}
            </div>
            <div
              className=" wow fadeInUp animated support"
              data-wow-delay="300ms"
              style={{
                visibility: 'visible',
                animationDelay: '300ms',
                animationName: 'fadeInUp'
              }}
            >
              <div className="main-footer__navmenu  ">
                <h4>SUPPORT CENTER</h4>
                <ul className="main-footer__about__info">
                  <li>
                    <span className="fas fa-phone-square" />
                    Support: (+61 7) 3373 9888 <br /> (Mon - Fri, 8:30am to 5pm, except public holidays)
                  </li>
                  <li>
                    <span className="fas fa-envelope" />
                    Email: <NavLink to="mailto:support@bestta.com.au">support@bestta.com.au</NavLink>
                  </li>
                </ul>
              </div>
              {/* /.footer-menu */}
            </div>
            <div
              className=" wow fadeInUp animated contact"
              data-wow-delay="400ms"
              style={{
                visibility: 'visible',
                animationDelay: '400ms',
                animationName: 'fadeInUp'
              }}
            >
              <div className="main-footer__about main-footer__navmenu ">
                <h4>Contact Address</h4>
                <p className="main-footer__about__text">Pacific Centre</p>
                <p className="main-footer__about__text">
                  Block A, Level 1,
                  <br /> Suite 18, 223 Calam rd, <br /> Sunnybank Hills
                </p>
                <p className="main-footer__about__text"> Qld 4019, Australia</p>
              </div>
          
              {/* /.footer-about */}
            </div>
          </div>
          {/* /.row */}
        </div>
        {/* /.container */}
      </footer>
      <section className="copyright text-center">
        <div className="container wow fadeInUp" data-wow-delay="500ms">
          <p className="copyright__text">
            © 2024 <span className="dynamic-year" />
            {/* /.dynamic-year */} by
            <NavLink to="/"> BESTTA Investors Club,</NavLink> All Rights Reserved
          </p>
        </div>
        {/* /.container */}
      </section>
    </>
  );
};

export default Footer;
