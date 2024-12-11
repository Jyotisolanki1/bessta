import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchLogin } from "../../slices/LoginSlice";
import { useDispatch } from "react-redux";
import { successNotification } from "../notification";
import { errorNotification } from "../notification"

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function SignInForm() {


  const [userdetails, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    };


  const dispatch = useDispatch()

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userdetails, [name]: value });
  };




  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { email, password } = userdetails;
    // alert(`You are login with email: ${email} and password: ${password}`);
    if(email === '' && password === ''){
      return alert("Email and Password are Mandatory")
    } 

    if(email === ''){
      return alert("Email is Mandatory")
    }

    if(password === ''){
      return alert('Password is Mandatory')
    }

   
    const response = await dispatch(fetchLogin(userdetails))
   
    if(response.payload.success){
        localStorage.setItem("adminToken", response?.payload?.data?.token?.accessToken);
        successNotification("Login Successfull")
         navigate("/bestta-admin/");
    }else{
      errorNotification(response?.payload?.message)
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
        <div className="social-container">
          <h2 style = {{fontSize:"15px",fontWeight:500}}>Welcome To  Bestta Admin</h2>
        </div>
        {/* <span>or use your account</span> */}
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={userdetails.email}
          onChange={handleOnChange}
        />
        <div className="password-input-container">
                <input
                type={showPassword ? "text" : "password"}
               
                name="password"
                placeholder="Password"
                value={userdetails.password}
                onChange={handleOnChange}
                />
                <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? (
                <VisibilityIcon  />
                ) : (
                <VisibilityOffIcon />
                )}
                </span>
                </div>
      
        {/* <a href="/bestta-admin/sendotp">Forgot your password?</a> */}
        <button>Sign In</button>
        
      </form>
    </div>
  );
}

export default SignInForm;






// import Paper from "@mui/material/Paper";
// import { Box } from "@mui/material";
// import TextField from "@mui/material/TextField";
// import { Typography } from "@mui/material";
// import Button from "@mui/material/Button";
// import ButtonGroup from "@mui/material/ButtonGroup";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { fetchLogin } from "../../slices/LoginSlice";
// import { useDispatch } from "react-redux";

// export default function Login() {
//   const [userdetails, setUserDetails] = useState({
//     email: "",
//     password: "",
//   });

//   const dispatch = useDispatch()

//   const navigate = useNavigate();

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setUserDetails({ ...userdetails, [name]: value });
//   };

//   const handleLogin = async () => {

//     const response = await dispatch(fetchLogin(userdetails))
   
//     if(response.payload.success){
//         localStorage.setItem("adminToken", response?.payload?.data?.token?.accessToken);
//          navigate("/bestta-admin/");
//     }
   
//   };

//   return (
//     <Box
//       sx={{
//         height: "100vh",
//         display: "flex",
//         justifyContent: "Center",
//         alignItems: "center",
//       }}
//     >
//       <Paper sx={{ width: "400px", padding: "20px" }}>
//         <Typography variant="h3" component="h2" sx={{ textAlign: "center" }}>
//           Login{" "}
//         </Typography>
//         <TextField
//           value={userdetails.email}
//           name="email"
//           onChange={handleOnChange}
//           id="outlined-basic"
//           label="Email"
//           variant="filled"
//           type="email"
//           sx={{ width: "100%", marginBottom: "20px" }}
//         />
//         <TextField
//           value={userdetails.password}
//           name="password"
//           onChange={handleOnChange}
//           id="outlined-basic"
//           label="password"
//           variant="filled"
//           type="password"
//           sx={{ width: "100%" }}
//         />

//         <Button
//           onClick={handleLogin}
//           sx={{
//             marginTop: "20px",
//             width: "400px",
//             backgroundColor: "#0275d8",
//             color: "#fff",
//           }}
//         >
//           Login
//         </Button>
//       </Paper>
//     </Box>
//   );
// }
