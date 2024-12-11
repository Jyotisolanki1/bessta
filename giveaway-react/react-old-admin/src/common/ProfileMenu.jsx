import React from 'react';
import Paper from '@mui/material/Paper';
import {BiSolidKey} from 'react-icons/bi'
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { NavLink } from 'react-router-dom';
import {useNavigate} from 'react-router-dom'

const listStyle = {
  "list-style-type":"none",
  // width:"200px",
  color:"#212529",
  "font-size":"13px",
  "padding-left":"13px",
  // "padding-bottom":"13px",
  "font-weight":500,
  display:"flex",
  "align-items":"center"
}

function ProfileInfoCard({ open, onClose }) {

  const navigate = useNavigate() 

  function handleLogout(){

    const result = window.confirm("Are you Sure you want to Logout");

    // console.log(result)
    if(result){
      localStorage.removeItem('data')
   
    localStorage.clear()
    navigate("/bestta-admin/login")
    window.location.reload();
    }
    

  
  };
   

  

  return (
    <div className={`profile-info-card ${open ? 'open' : ''}`} style = {{backgroundColor:"#f0f8ff"}}>
      <Paper elevation={10} sx={{ padding: '10px', position: 'absolute', top: '50px', right: '30px', zIndex:1}}>
        <li style = {listStyle}>
          <NavLink style = {{color:"#000000",'text-decoration':"none",display:"flex"}} to = "/bestta-admin/changepassword">
          <BiSolidKey style = {{color:"#000000","font-size":"13px","font-weight":"bold"}}/>
          <span style = {{"padding-left":"10px",color:"#000"}}>Change Password</span>
          </NavLink>
          </li>
     
        <li  style = {listStyle}>
          {/* <NavLink style = {{color:"#000",'text-decoration':"none"}} > */}
            <button onClick = {handleLogout} style  = {{backgroundColor:"transparent",border:'none',outline:'none',paddingLeft:"2px",display:"flex"}}>
        <LogoutIcon style = {{color:"#000","font-size":"13px","font-weight":"bold"}}/>
          <span style = {{"padding-left":"10px",color:"#000",textTransform:"none"}}>LogOut</span>
          </button>
          {/* </NavLink> */}
          </li>


          
      </Paper>
   
    </div>
  );
}

export default ProfileInfoCard;
