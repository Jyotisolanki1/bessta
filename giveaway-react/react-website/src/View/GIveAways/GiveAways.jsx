
/* eslint-disable react/no-unescaped-entities */
import React from "react";

const GiveAways = () => {
  return (
    <>
      <div className="stricky-header stricked-menu main-menu main-menu-with-border">
        <div className="sticky-header__content" />
        {/* /.sticky-header__content */}
      </div>
      {/* /.stricky-header */}
      {/*Main Slider Start*/}
      <section className="page-header">
        <div
          className="page-header__shape3 "
          data-wow-delay="300ms"
          style={{
            backgroundImage: "url(assets/images/backgrounds/bg-giveawys.jpg)",
            backgroundPosition: "left top",
            opacity: "0.8",
          }}
        />
        {/* /.page-header__shape3 */}
        <div className="container">
          <h2 className="page-header__title text-center">
            The Famous BESTTA Giveaways
          </h2>
        </div>
        {/* /.container */}
      </section>
      {/* /.page-header */}
      {/*Main Slider End*/}
      <section className="choose-two">
        <div
          className="choose-two__bg wow slideInRight"
          data-wow-delay="200ms"
        />
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 wow slideInLeft" data-wow-delay="200ms">
              <div className="">
                <div className="choose-two__thumb">
                  <img
                    src="assets/images/resources/block-house.jpeg"
                    alt="ogency"
                  />
                  {/* <div class="choose-two__content wow fadeInUp" style="background-image: url(assets/images/shapes/choose.png);" data-wow-delay="500ms"> */}
                  {/* </div><!-- choose-content */}
                </div>
              </div>
            </div>
            <div className="col-xl-6 wow fadeInUp" data-wow-delay="400ms">
              <div className="section-title mb-3">
                <h2 className="section-title__title" style={{ fontSize: 38 }}>
                  Drawn Sunday the 25th of February at 8:30 pm AEDT!
                </h2>
                <h5 className="section-title__tagline">SALE NOW ON</h5>
              </div>
              {/* section-title */}
              <div className="choose-two__box">
                <p className="choose-two__box__text">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s,
                </p>
              </div>
              {/* icon-box */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GiveAways;
