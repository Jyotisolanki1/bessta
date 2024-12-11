import PersistentDrawerLeft from "../../common/SideNav";
import { Box, Typography } from "@mui/material";
import DrawerHeader from "../../common/DrawerHeader";
// import Card from "@mui/material";
import Card from '@mui/material/Card';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import GroupIcon from '@mui/icons-material/Group';
import ShopIcon from '@mui/icons-material/Shop';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import {LineCharts ,PieCharts} from "./Graph";

export default function Dashboard() {
  
  const Data = [
    {
      id: 1,
      year: 2016,
      userGain: 80000,
      userLost: 823
    },
    {
      id: 2,
      year: 2017,
      userGain: 45677,
      userLost: 345
    },
    {
      id: 3,
      year: 2018,
      userGain: 78888,
      userLost: 555
    },
    {
      id: 4,
      year: 2019,
      userGain: 90000,
      userLost: 4555
    },
    {
      id: 5,
      year: 2020,
      userGain: 4300,
      userLost: 234
    }
  ];

return (
    <div style={{ display: "flex" }}>
      <PersistentDrawerLeft />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Box >
         <Box sx = {{display:"flex",justifyContent:"center",flexWrap:"wrap",height:"30vh"}}>
          <Card sx = {{width:"300px",display:"flex",height:"100px",marginRight:"20px"}}>
                <Box sx = {{backgroundColor:"#FF0042",width:"50%",display:"flex",justifyContent:"center",alignItems:"center"}}>
                    <GroupIcon sx = {{color:"#fff",fontSize:"50px"}}/>
                </Box>
                <Box sx = {{display:"flex",justifyContent:"center",alignItems:"center",width:"50%"}}> 
                  <Typography sx = {{color:"#FF0042",fontSize:"20px",fontWeight:900}}>Users</Typography>
                </Box>
          </Card>
          <Card sx = {{width:"300px",display:"flex",height:"100px",marginRight:"20px"}}>
                <Box sx = {{backgroundColor:"#FFBA00",width:"50%",display:"flex",justifyContent:"center",alignItems:"center"}}>
                    <ShoppingBagIcon sx = {{color:"#fff",fontSize:"50px"}}/>
                </Box>
                <Box sx = {{display:"flex",justifyContent:"center",alignItems:"center",width:"50%"}}> 
                  <Typography sx = {{color:"#FFBA00",fontSize:"20px",fontWeight:900}}>Orders</Typography>
                </Box>
          </Card>
          <Card sx = {{width:"300px",display:"flex",height:"100px",marginRight:"20px"}}>
                <Box sx = {{backgroundColor:"#0853FE",width:"50%",display:"flex",justifyContent:"center",alignItems:"center"}}>
                    <EmojiEventsIcon sx = {{color:"#fff",fontSize:"50px"}}/>
                </Box>
                <Box sx = {{display:"flex",justifyContent:"center",alignItems:"center",width:"50%"}}> 
                  <Typography sx = {{color:"#0853FE",fontSize:"20px",fontWeight:900}}>Events</Typography>
                </Box>
          </Card>
          <Card sx = {{width:"300px",display:"flex",height:"100px",marginRight:"20px"}}>
                <Box sx = {{backgroundColor:"#00AA92",width:"50%",display:"flex",justifyContent:"center",alignItems:"center"}}>
                    <AccountBalanceIcon sx = {{color:"#fff",fontSize:"50px"}}/>
                </Box>
                <Box sx = {{display:"flex",justifyContent:"center",alignItems:"center",width:"50%"}}> 
                  <Typography sx = {{color:"#00AA92",fontSize:"20px",fontWeight:900}}>Winners</Typography>
                </Box>
          </Card>
          </Box>
          <Box sx = {{marginTop:"50px",display:"flex",justifyContent:"center",height:"30vh",alignItems:"center"}}>
            <LineCharts/>
            <PieCharts/>
          </Box>
        </Box>
       
      </Box>
    </div>
  );
}
