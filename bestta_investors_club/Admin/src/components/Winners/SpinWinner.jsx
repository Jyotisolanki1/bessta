// import sparkImage from '../../assets/testspark2.png'
import { ControlPointSharp } from "@mui/icons-material";
import bestalogo from "../../assets/besstalogo.png";
import testSpark from "../../assets/testspark2.gif";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';

export default function SpinWinner() {
  const [showCard, setShowCard] = useState(false);

  const location = useLocation()


  useEffect(() => {
    setShowCard(true);
  }, []);

  return (
    <div style = {{
      minHeight:"100vh",
      backgroundColor: "#AFD6FB",
    }} >
      <div
        style={{
          
          height: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        {" "}
        <div style={{ width: "70%", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "500px",
                height: "350px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundSize: "cover",
              }}
            >
              <div>
                <img
                  style={{
                    height: "350px",
                    borderRadius: "50%",
                    width: "350px",
                  }}
                  src="https://c.tenor.com/_1lZJzf71L0AAAAC/tenor.gif"
                  alt="winner image"
                />
              </div>
            </div>
            <div style={{ color: "#13375b" }}>
              <div style={{ display: "flex", justifyContent: "Center" }}>
                <img src={bestalogo} alt="logo" />
              </div>
              <h2
                style={{
                  fontSize: "60px",
                  fontWeight: 900,
                  marginBottom: "0px",
                }}
              >
                Congratulations
              </h2>
              <h2
                style={{
                  marginTop: "0px",
                  marginBottom: "0px",
                  fontWeight: 900,
                  fontSize: "50px",
                }}
              >
                {location?.state?.firstname + " " + location?.state?.lastname }
              </h2>
              <h2>{location?.state?.email}</h2>
              <h2>Besta Rewards Club </h2>
            </div>
           
          </div>
          
        </div>
        
      </div>
      <div style = {{display:"flex",justifyContent:"center"}}><Link to = "/bestta-admin/" sx = {{display:"flex",justifyContent:"center",alignItems:"center"}}>  <HomeIcon/> </Link></div>
    </div>
  );
}
