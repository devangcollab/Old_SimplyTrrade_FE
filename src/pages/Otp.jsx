// import React from "react";
// import logo from "../assets/Group 18763.png";
// import sideImage from "../assets/Group 18754.png";
// import OtpInput from "react-otp-input";
// import "../css/Opt.css";

// const Otp = () => {
//   const [otp, setOtp] = React.useState("");

//   return (
//     <div>
//       <div className="opt-container">
//         <div className="o-container">
//           <div className="opt-logo">
//             <img src={logo} alt="" />
//           </div>
//           <h2 className="opt-title">ENTER OTP</h2>
//           <div className="otp-input-container">
//             <OtpInput
//               value={otp}
//               onChange={setOtp}
//               numInputs={6}
//               renderSeparator={<span style={{ margin: "0 8px " }}> </span>}
//               renderInput={(props) => (
//                 <input style={{ padding: "20px" }} {...props} />
//               )}
//             />
//           </div>
//           <button className="opt-btn" type="submit">
//             Verify
//           </button>
//         </div>
//         <div className="opt-img-container">
//           <img className="opt-img" src={sideImage} alt="" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Otp;

import React from "react";
import { Box, Grid } from "@mui/material";
import sideImage from "../assets/Group 18754.png";
import Logo from "../components/Logo";
import SignupForm from "../components/SignupForm";
import SigninForm from "../components/SignInForm";
import OtpForm from "../components/OtpForm";

const OtpPage = () => {
  return (
    <Box sx={{ flexGrow: 1, height: "100vh" }}>
      <Grid container spacing={2}>
        {/* Left Section: Logo and Signup Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Logo />
          <OtpForm />
        </Grid>

        {/* Right Section: Illustration (Hidden on mobile) */}
        <Grid
          item
          xs={0}
          md={6}
          sx={{
            display: { xs: "none", md: "flex" }, // Hide on xs, show on md and up
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <img
            src={sideImage}
            alt="Illustration"
            style={{
              marginLeft: "5.2rem",
              height: "100vh",
              width: "89%",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OtpPage;
