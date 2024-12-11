import React from "react";

import Loader from "../../Common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { GetContentsApi } from "../../Slices/StaticContentSlice";
import parse from "html-react-parser";

const MemberTermsAndConditions = () => {
  const { loading, contents } = useSelector(
    (state) => state.staticContentAction
  );
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(GetContentsApi("Member Terms and Condition"));
  }, []);
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
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
              style={{ backgroundPosition: "left top", opacity: "0.9" }}
            />
            {/* /.page-header__shape3 */}
            <div className="container"></div>
            {/* /.container */}
          </section>
          {/* /.page-header */}
          {/*Main Slider End*/}
          <section className="community-section mb-5">
            <div className="section-title text-center mb-5">
              <h2 className="section-title__title">BESTTA Community</h2>
            </div>
            <div className="community-text">
              <p>{parse(contents?.data?.content)}</p>
            </div>
          </section>
     
        </>
      )}
    </div>
  );
};

export default MemberTermsAndConditions;
