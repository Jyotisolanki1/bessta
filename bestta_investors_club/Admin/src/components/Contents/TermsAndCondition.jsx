import PersistentDrawerLeft from "../../common/SideNav";
import { Box } from "@mui/material";
import DrawerHeader from "../../common/DrawerHeader";
// import PrivacyPolicy from "./PrivacyPolicy";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { fetchContents } from "../../slices/ContentsSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../common/Loader";
import { updateContents } from "../../slices/ContentsSlice";

export default function TermsAndConditions() {
  const dispatch = useDispatch();
  const { loader, Contents } = useSelector((state) => state.Contents);
  const  [data , setData] = useState('')

  const getData = async () => {
    const res = await dispatch(fetchContents());

     setData(res?.payload?.data?.filter((each) => each.type === "termsandcondition")[0].content
     )
  }

  useEffect( () => {

    getData()
    
  }, []);

  const handleOnchange = (content, delta, source, editor) => {
    // console.log(content);
    setData(content);
  };

  const handleUpdateContent = async  () => {
    
  
        const res = await   dispatch(updateContents({
            type:"termsandcondition",
            content:data
          }))

          if(res.payload.success){
            dispatch(fetchContents())
          }
  }


  return (
    <div style={{ display: "flex" }}>
      <PersistentDrawerLeft />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <h1> Terms and Condition</h1>
        <div style={{ textAlign: "right" }}>
          <button
          onClick = {handleUpdateContent}
            style={{
              backgroundColor: "#000",
              color: "orange",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            Update
          </button>
        </div>
        <div>
          {loader ? (
            <Loader />
          ) : (
            <ReactQuill
              theme="snow"
              value={data}
              onChange={handleOnchange}
              style={{ height: "150px" }}
            />
          )}
        </div>
      </Box>
    </div>
  );
}
