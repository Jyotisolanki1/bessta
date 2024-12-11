import React from 'react'
import { MuiOtpInput } from 'mui-one-time-password-input'
import { Box, Button, Card } from '@mui/material'
import PasswordField from 'material-ui-password-field'

 const SubmitOtp = () => {
  const [otp, setOtp] = React.useState('')

  const handleChange = (newValue) => {
    setOtp(newValue)
  }

  return (
    <Box sx = {{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Card>
            <Box sx = {{width:"400px",padding:"15px"}}>
                <MuiOtpInput value={otp} onChange={handleChange} length = {4} />
                <Button sx = {{backgroundColor:"#000",color:"orange",width:"100%",marginTop:"20px"}}>Submit</Button>
            </Box>
        </Card>
    </Box>
  )
}

export default SubmitOtp




// import React, { useState, useRef } from 'react';


// function SubmitOtp(props) {
//   const [otp, setOtp] = useState(['', '', '', '']);
//   const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
//   // const {email} = useParams()
// //   const navigate = useNavigate()

//   const otpInputStyle = {
//     width: '3rem',
//     height: '3rem',
//     fontSize: '1.5rem',
//     textAlign: 'center',
//     marginRight: '0.5rem',
//     border: '1px solid #ccc',
//     borderRadius: '4px',
//     outline:'none'
//   };

//   const handleOtpChange = (e, index) => {
//     const { value } = e.target;
//     if (isNaN(value)) return;
//     const updatedOtp = [...otp];
//     updatedOtp[index] = value;
//     setOtp(updatedOtp);

//     if (value && index < 3) {
//       otpInputRefs[index + 1].current.focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === 'Backspace' && index > 0 && !otp[index]) {
//       otpInputRefs[index - 1].current.focus();
//     }
//   };

 
//   return (
//     <div style = {{"box-sizing":"border-box" ,height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
//                   <form className = "form-main-container" style = {{width:"350px",boxShadow:"0px 0px 4px 0px",borderRadius:"5px",padding:"10px"}}>
//                           <div className='text-logo-container'>
//                               {/* <img src = {logo} alt = "logo" style = {{height:"75px",width:"75px"}}/> */}
//                               <h2 style = {{"font-size":"16px","font-weight":"500","margin-top":"0px","margin-bottom":"20px",textAlign:"center"}}> Please Enter the Otp received To Your Email
//                               </h2>
                              
//                           </div>
//                           <div className="form-group">
                         
//                                 <div style={{ display: 'flex' ,"justify-content":"center"}}>
//                                   {otp.map((digit, index) => (
//                                     <input
//                                       key={index}
//                                       type="text"
//                                       value={digit}
//                                       onKeyDown={(e) => handleKeyDown(e, index)}
//                                       onChange={(e) => handleOtpChange(e, index)}
//                                       ref={otpInputRefs[index]}
//                                       maxLength={1}
//                                       style={otpInputStyle}
//                                     />
//                                   ))}
//                                 </div>
//                           </div>
//                           <div className="form-group" style = {{"text-align":"center"}}>
//                                   <button style = {{width:"70%","background-color":"#000",padding:"10px 20px","border-radius":"4px",border:"none",color:"orange",marginTop:"20px",marginBottom:"10px"}}>Submit Otp</button>
//                           </div>
              
//                 </form>
//           </div>
//   );
// }

// export default SubmitOtp;



 

