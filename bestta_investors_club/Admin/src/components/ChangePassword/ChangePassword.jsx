
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { Box, Card } from '@mui/material'
import PersistentDrawerLeft from "../../common/SideNav";
import DrawerHeader from "../../common/DrawerHeader";
import {useDispatch} from 'react-redux'
import { changePassword } from "../../slices/ChangePasswordSlice";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword , setNewConfirmNewPassword] = useState(false)
  const [showConfirmNewpassword , setConfirmNewPassword] = useState(false)
  const [passwordDetails , setPasswordDetails] = useState({
    old_password:"",
    new_password:"",
    confirm_password:""
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNewPassword = () => {
    setNewConfirmNewPassword(!newPassword)
  }

  const handleClickConfirmNewPassword = () => {
    setConfirmNewPassword(!showConfirmNewpassword)
  }
  const handlePassword = (e) => {
            const {name , value} = e.target 
            setPasswordDetails({
                ...passwordDetails, [name] : value
            })
  }

  const handleChangePassword = async () => {
        console.log(passwordDetails, "check details")
        const response = await dispatch(changePassword(passwordDetails))
        console.log(response, "from change passowrd")
        if(response.payload.success){
              navigate("/")
        }
  }
 
  return (
    <div style={{ display: "flex" }}>
    <PersistentDrawerLeft />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <DrawerHeader />
      <Box sx = {{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",height:"100vh"}}>
<Card sx = {{width:"400px" , padding:"15px"}}>
    <TextField
    variant="filled"
    size="small"
    type={showPassword ? "text" : "password"}
    label="Password"
    value={passwordDetails.password}
    name = "old_password"
    onChange={handlePassword}
    required={true}
    InputProps={{
        endAdornment: (
        <InputAdornment position="end">
            <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            edge="end"
            >
            {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
        ),
    }}
    fullWidth
    />
    <TextField
     variant="filled"
    sx = {{marginTop:"20px",marginBottom:"20px"}}
    size="small"
    type={newPassword ? "text" : "password"}
    label="New  Password"
    name = "new_password"
    value={passwordDetails.new_password}
    onChange={handlePassword}
    required={true}
    InputProps={{
        endAdornment: (
        <InputAdornment position="end">
            <IconButton
            aria-label="toggle password visibility"
            onClick={handleNewPassword}
            edge="end"
            >
            {newPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
        ),
    }}
    fullWidth
    />
    <TextField
    variant="filled"
    size="small"
    type={showConfirmNewpassword ? "text" : "password"}
    label="Confirm New Password"
    value={passwordDetails.confirm_password}
    name = "confirm_password"
    onChange={handlePassword}
    required={true}
    InputProps={{
        endAdornment: (
        <InputAdornment position="end">
            <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickConfirmNewPassword}
            edge="end"
            >
            {showConfirmNewpassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
        ),
    }}
    fullWidth
    />
    <div style = {{textAlign:"center",marginTop:"20px"}}>
    <button  onClick = {handleChangePassword}>Change Password </button>
    </div>
</Card>
</Box> 
      
    </Box>
  </div>
  );
};


export default ChangePassword

