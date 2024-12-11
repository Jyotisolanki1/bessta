import PersistentDrawerLeft from "../../common/SideNav";
import { Box } from "@mui/material";
import DrawerHeader from "../../common/DrawerHeader";
import React from 'react'
import Announcement from "./Announcement";
import { useLocation } from "react-router-dom";

export default function Winners() {


  const location = useLocation()

  
 
  return (
    <div style={{ display: "flex" }}>
      <PersistentDrawerLeft />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
          <Announcement drawid = {location.state}/>
      </Box>
    </div>
  );
}
