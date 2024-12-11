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

export default function MembershipShipTermsAndConditions() {
  const dispatch = useDispatch();
  const { loader, Contents } = useSelector((state) => state.Contents);
  const  [data , setData] = useState('')

  const getData = async () => {
    const res = await dispatch(fetchContents());

     setData(res?.payload?.data?.filter((each) => each.type === "Member Terms and Condition")[0].content
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
            type:"Member Terms and Condition",
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
        <h1> MembershipShip Terms And Conditions</h1>
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



// import PersistentDrawerLeft from "../../common/SideNav";
// import { Box } from "@mui/material";
// import DrawerHeader from "../../common/DrawerHeader";
// import PrivacyPolicy from "./PrivacyPolicy";
// import React, { useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// export default function MembershipShipTermsAndConditions() {

//   const [value, setValue] = useState(`
//   Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
// `);

//   const handleOnchange = (content, delta, source, editor) => {
//     console.log(content);
//   };

//   return (
//     <div style={{ display: "flex" }}>
//       <PersistentDrawerLeft />
//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         <DrawerHeader />
//         <h1> Member Terms</h1>
//         {/* <PrivacyPolicy/>
//          */}
//          <ReactQuill theme="snow" value={value} onChange={handleOnchange} style  = {{height:"400px"}}/>;
//       </Box>
//     </div>
//   );
// }
