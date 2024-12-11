import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { Box, Card } from '@mui/material'

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword , setShowConfirmPassword] = useState(false)
  const [passwordDetails , setPasswordDetails] = useState({
    password:"",
    confirm_password:""
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handlePassword = (e) => {
            const {name , value} = e.target 
            setPasswordDetails({
                ...passwordDetails, [name] : value
            })
  }
 
  return (
    <Box sx = {{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",height:"100vh"}}>
        <Card sx = {{width:"400px" , padding:"15px"}}>
            <TextField
            variant="filled"
            size="small"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={passwordDetails.password}
            name = "password"
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
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            name = "confirm_password"
            value={passwordDetails.confirm_password}
            onChange={handlePassword}
            required={true}
            InputProps={{
                endAdornment: (
                <InputAdornment position="end">
                    <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickConfirmPassword}
                    edge="end"
                    >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
                ),
            }}
            fullWidth
            />
            <Button sx = {{backgroundColor:"#000",color:"orange",width:"100%",fontSize:"14px",fontWeight:500}}>Submit </Button>
        </Card>
    </Box>
  );
};

export default ResetPassword;



// import PasswordField from 'material-ui-password-field'
// import { Box, Card } from '@mui/material'
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { IconButton, InputAdornment, TextField } from "@mui/material";
// import { useState } from "react";


//  const ResetPassword = () => {
//     const [showPassword, setShowPassword] = useState(false);

//     const handleClickShowPassword = () => {
//       setShowPassword(!showPassword);
//     };
  
//     return <Box sx = {{height:"100vh",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
//                 <Card sx = {{width:"400px",padding:"15px"}}>
              


   
//     <TextField
//       size="small"
//       type="password"
//       label="Password"
//       value={password}
//       onChange={handlePassword}
//       required={true}
//       InputProps={{
//         endAdornment: (
//           <InputAdornment position="end">
//             <IconButton
//               aria-label="toggle password visibility"
//               onClick={handleClickShowPassword}
//               edge="end"
//             >
//               {showPassword ? <VisibilityOff /> : <Visibility />}
//             </IconButton>
//           </InputAdornment>
//         ),
//       }}
//       fullWidth
//     />

//                 </Card>
//             </Box>
// }

// export default ResetPassword