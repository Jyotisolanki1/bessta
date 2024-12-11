


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function SendOtp(){

        const [data,setData] = useState({username:""})
        const navigate = useNavigate()

        const handleChange = (e) => {
          setData({...data,username:e.target.value})
          // console.log(data)
        }

        const sendOtpClicked =  async (e) => {
              e.preventDefault()
              
             
        }

        return (
            <div className="form-container" style = {{"box-sizing":"border-box"}}>
                  <form onSubmit={sendOtpClicked}  className = "form-main-container" style = {{width:"350px",height:"400px"}}>
                          <div className='text-logo-container'>
                              {/* <img src = {logo} alt = "logo" height = "75px" width = "75px"/> */}
                              <h2 style = {{"margin-top":"0px","margin-bottom":"0px"}}>Forget password !!</h2>
                              <p style = {{"margin-bottom":"30px"}}>Please EnterThe  mail</p>
                          </div>
                          <div className="form-group">
                                <label htmlFor="username">Email</label>
                                <input
                                  type="email"
                                  id="username"
                                  name="username"
                                  value={data.username}
                                  onChange={handleChange}
                                placeholder='please enter the email address'
                                />
                          </div>
                          <div className="form-group">
                                  <button  style = {{width:"100%","background-color":"#cf1515",padding:"6px","border-radius":"4px",border:"none",color:"#ffffff"}}>Send Otp</button>
                          </div>
              
                </form>
          </div>
        )
}



// import { useState } from "react";

// import { useNavigate } from "react-router-dom";
// import FormControl from "@mui/material/FormControl";
// import TextField from "@mui/material/TextField";
// import { Button, Card } from "@mui/material";

// export default function SendOtp() {
//   const [data, setData] = useState({ username: "" });
//   const navigate = useNavigate();

//   return (
//     <FormControl
//       sx={{
//         height: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Card
//         sx={{
//           width: "400px",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           padding: "20px",
//         }}
//       >
//         {/* <input
//           type="email"
//           id="email"
//           name="Email"
//           //   value={data.username}
//           //   onChange={handleChange}
//           placeholder="please enter the email address"
//           style={{ width: "90%", padding: "10px 20px", cursor: "pointer" }}
//         /> */}
//         <TextField id="filled-basic" label="Email" variant="filled"  sx={{ width: "100%", cursor: "pointer" }}/>
//         <Button
//           sx={{
//             width: "100%",
//             backgroundColor: "#000",
//             color: "orange",
//             marginTop: "20px",
//             padding: "10px 20px",
//             borderRadius: "5px",
//           }}
//         >
//           {" "}
//           Send Otp
//         </Button>
//       </Card>
//     </FormControl>
//   );
// }
