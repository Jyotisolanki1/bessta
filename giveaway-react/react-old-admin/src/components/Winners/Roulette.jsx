import React, { useState, useEffect } from "react";

import SpinnerImage from "../../assets/wheelImage.png";
import pointerImg from "../../assets/pointer.png";
import { Card } from "@mui/material";
import winnerGiff from "../../assets/winnervec.avif";
import { useNavigate } from "react-router-dom";


import Spinner from "../../assets/wheel-spine.gif"


export default function Roulette(props) {



const {participitants , winner} = props

 

  // const list = [
  //   {
  //     id: 0,
  //     name: "Muthyala Nithin",
  //   },
  //   {
  //     id: 1,
  //     name: "Virat Kohli",
  //   },
  //   {
  //     id: 2,
  //     name: "Siddu Bro",
  //   },
  //   {
  //     id: 3,
  //     name: "Ajay Bro",
  //   },
  //   {
  //     id: 4,
  //     name: "Thiru Bro",
  //   },
  //   {
  //     id: 5,
  //     name: "Abhu Sid",
  //   },
  //   {
  //     id: 6,
  //     name: "Yogesh D",
  //   },
  //   {
  //     id: 7,
  //     name: "Mahesh B",
  //   },
  //   {
  //     id: 8,
  //     name: "Anil S",
  //   },
  //   {
  //     id: 9,
  //     name: "Lahitha",
  //   },
  //   {
  //     id: 10,
  //     name: "Nikhilesh A",
  //   },
  //   {
  //     id: 11,
  //     name: "Abhisheik Chau",
  //   },
  //   {
  //     id: 12,
  //     name: "Kanika B",
  //   },
  //   {
  //     id: 13,
  //     name: "Swaraj",
  //   },
  //   {
  //     id: 14,
  //     name: "Shivangi",
  //   },
  //   {
  //     id: 14,
  //     name: "Shika",
  //   },
  // ];

  // const list = props?.Participitants


  const list = participitants
  const navigate = useNavigate();

  //  In useEffect hit handStartStop and isRunnig becomes true  after setTimeout it becomes false

  const [isRunning, setIsRunning] = useState(false);

  //  iterater Names List

  const [currentItem, setCurrentItem] = useState("");

  // show Giff in useEffect hit handstartstop show Giff becomes true  after setTimeout set false

  const [showGif, setShowGif] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // this state is used to update display none for the names and giff container this is updated in setTimeout inside setTimeo2ut handle start stop
  const [dispayval, setDisplayVal] = useState("");

  // winner profile initial set to none after displayval becomes none it becomes inline in handle start stop insude setTimeout ,setTimeour

  const [displayProfile, setDisplayProfile] = useState("none");

  const [winnerName, setWinnerName] = useState("");


  const [winnerStatus , setWinnerStatus] = useState(false)


  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  useEffect(() => {
    let timerId;

    if (isRunning) {
      timerId = setInterval(() => {
        changeNameFunc();
      }, 300);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [isRunning]); // Run effect when isRunning changes

  const changeNameFunc = () => {
    setCurrentItem((prevItem) => (prevItem + 1) % list.length);
  };

  const handleStartStop = () => {
    // setTimeout(() => {
    // console.log("firing");
    // setIsRunning((prevState) => !prevState); // Toggle isRunning state
    setIsRunning(true);
    // setShowGif(prevState => !prevState)
    setShowGif(true);
    // console.log(isRunning);
    // },2000)
    setTimeout(() => {
      // setIsRunning((prevState) => !prevState);
      setIsRunning(false);
      // setShowGif(prevState => !prevState)
      setShowGif(false);
      setWinnerName(winner)
      setWinnerStatus(true)
      setTimeout(() => {
        setDisplayVal("none");
        setDisplayProfile("flex");
        // console.log(winner ,"winner")
        navigate("/bestta-admin/winners",{state:winner});
      }, 2000);

    }, 8000);
   
  };

  useEffect(() => {
    handleStartStop();
  }, []);

  return (
    <div>
      <div style={{ display: dispayval }}>
        <div>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "150px",
                width: "500px",
                border: "15px solid #f9b233",
                borderRadius: "65px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                backgroundColor: "#f19b00",
              }}
            >
              <span
                style={{ color: "#fff", fontSize: "30px", fontWeight: "bold" }}
              >
                {!winnerStatus ? list[currentItem]?.firstname : winner?.firstname}
              </span>
              <img
                src={pointerImg}
                alt="pointer"
                style={{ marginLeft: "20px" }}
              />
            </div>

            <div>
              {showGif ? (
                <img
                  style={{ display: isImageLoaded ? "block" : "none" }}
                  // src={Spinner}
                  src={Spinner}
                  onLoad={handleImageLoad}
                />
              ) : (
                <img style={{ height: "512px" }} src={SpinnerImage} />
              )}
            </div>

            {/* <Test/> */}
          </div>
     
        </div>
      </div>
      
    </div>
  );
}
