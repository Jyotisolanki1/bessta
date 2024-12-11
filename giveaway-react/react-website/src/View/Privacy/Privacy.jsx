import React from "react";

import Loader from "../../Common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { GetContentsApi } from "../../Slices/StaticContentSlice";
import parse from "html-react-parser";

const Privacy = () => {
  // console.log("Firing ")
  const { loading, contents } = useSelector(
    (state) => state?.staticContentAction
  );

  // // console.log(loading , contents , "priovacy policy")

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetContentsApi("Privacy Policy"));
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
          <section className="cms mb-5">
            <div className="section-title text-center mb-5">
              <h2 className="cms__title">Privacy Policy</h2>
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

export default Privacy;
