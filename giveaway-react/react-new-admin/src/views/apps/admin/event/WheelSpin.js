/* eslint-disable import/newline-after-import */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  InputLabel,
  MenuItem,
  Grid,
  Stack,
  FormHelperText,
  TextField,
  Select,
  CircularProgress,
  IconButton,
  FormControl,
  Typography
} from '@mui/material';
import { imgPath } from 'config';
import CloseIcon from '@mui/icons-material/Close';
import '../../../../styles/extra.css';
// import Image from '../../../../../node_modules/next/image';
import { getUsers, getWinnerList } from 'store/slices/events';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useReactMediaRecorder } from 'react-media-recorder';
// eslint-disable-next-line import/no-extraneous-dependencies
import Webcam from 'react-webcam';
const wheelImage = '/assets/images/wheelImage.png';
const cracker = '/assets/images/cracker.gif';
const girl = '/assets/images/girl.gif';
const logoSpin = '/assets/images/logoSpin.png';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);
const WheelSpin = ({ open, close, item }) => {
  const dispatch = useDispatch();
  const [statusnew, setStatus] = useState(1);
  const [spin, setSpin] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [user, setUser] = useState([]);
  const [winnerList, setWinnerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [intervalData, setIntervalData] = useState(false);
  const webcamRef = useRef(null);
  const [continuespin, setcontinue] = useState(0);

  const downloadRecordingPath = 'Screen_Recording_Demo';
  const downloadRecordingType = 'mp4';
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ screen: true });

  const downloadRecording = () => {
    const pathName = `${downloadRecordingPath}_${Date()}.${downloadRecordingType}`;
    try {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // for IE
        window.navigator.msSaveOrOpenBlob(mediaBlobUrl, pathName);
      } else {
        // for Chrome
        const link = document.createElement('a');
        link.href = mediaBlobUrl;
        link.download = pathName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pipVideo = () => {
    console.log('metadata', webcamRef.current.video);
    if (webcamRef.current.video) webcamRef.current.video.requestPictureInPicture();
  };
  useEffect(() => {
    if (!spin && continuespin > 0) {
      setStatus(2);
    }
  }, [spin, continuespin]);
  const spining = () => {
    // Start spinning after component mounts
    // setSpin(true);
    // Stop spinning after 5 seconds
    const timer = setTimeout(() => {
      setSpin(false);
      // setCongrate(true)
    }, 10000);

    return () => clearTimeout(timer); // Clear the timer on component unmount
  };
  let interval;
  useEffect(() => {
    if (spin) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      interval = setInterval(() => {
        // Randomly select a user from the users array
        const randomIndex = Math.floor(Math.random() * user.length);
        setSelectedUser(user[randomIndex]);
        // setCongrate(false)
      }, 10); // Adjust the interval as needed
      // setIntervalData(intervalDatas);
    }
    return () => clearInterval(interval);
  }, [spin, user, selectedUser]);

  useEffect(() => {
    if (mediaBlobUrl) {
      if (status === 4) setStatus(1);
      downloadRecording();
    }
  }, [mediaBlobUrl]);

  const handleSpinClick = useCallback(() => {
    setCountdown(5);
    setTimeout(() => {
      setCountdown(5);
      setSpin(false);
      setStatus(4);
    }, 10000);
    setcontinue((prev) => prev + 1);
    setStatus(3);
    setSpin(true);
  }, []);

  useEffect(() => {
    if (statusnew === 2) {
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000); // Update countdown every second

      // Stop countdown when it reaches 0
      if (continuespin === 0) {
        if (countdown === 0) {
          clearInterval(countdownInterval);
          setStatus(4);
        }
      } else if (continuespin > 0 && !spin && countdown === 0) {
        clearInterval(countdownInterval);
        setStatus(4);
      }

      return () => clearInterval(countdownInterval);
    }
  }, [statusnew, countdown]);

  // useEffect(() => {
  //   if (spin === true) {
  //     // Start spinning the wheel
  //     spining();
  //   }
  // }, [spin]);

  const fetchData = async () => {
    try {
      const resWinner = await dispatch(getWinnerList(item?._id));
      if (resWinner?.success === true) {
        // console.log('resWinner?.data?.winners', resWinner?.data?.winners);
        // Update winner list and stop spinning
        setWinnerList(resWinner?.data?.winners);
        // setTimeout(() => {
        //   setSpin(false);
        //   setSelectedUser(`${resWinner?.data?.winners[0].firstname} ${resWinner?.data?.winners[0].lastname}`);
        // }, 5000);
        setTimeout(() => {
          setStatus(2);
          setSpin(false);
        }, 5000);
      } else {
        // Handle error
        setLoading(false);
        dispatch(
          openSnackbar({
            open: true,
            message: resWinner?.message,
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          })
        );
      }
    } catch (error) {
      // Handle error
      setLoading(false);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Something went wrong. Please try again later.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        })
      );
    }
  };

  const callApi = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getUsers(item?._id));
      if (res?.success === true) {
        setLoading(false);
        // let userArr = res?.data?.userList;
        setUser(res?.data?.userList);
        fetchData();
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          })
        );
        setStatus(3);
        setSpin(true);
      } else {
        setLoading(false);
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message,
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          })
        );
      }
    } catch (error) {
      // console.log(error);
      setLoading(false);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Something went wrong. Please try again letar.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        })
      );
    }
  };

  return (
    <Dialog fullScreen open={open} TransitionComponent={Transition} keepMounted aria-describedby="alert-dialog-slide-description">
      <DialogContent sx={{ justifyContent: 'center' }} className="background_color">
        <DialogContentText id="alert-dialog-slide-description">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              {/* Spin Wheel */}
            </Grid>
            <Grid item xs={6}>
              <IconButton
                color="black"
                onClick={async () => {
                  // await document.exitPictureInPicture();
                  close(false);
                }}
                aria-label="close"
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Webcam ref={webcamRef} width="0" height="0" />
            {statusnew === 1 ? (
              <div className="main">
                {loading ? (
                  <div
                    className="custom-button-start"
                    onClick={callApi}
                    style={{
                      cursor: 'progress !important'
                    }}
                  >
                    <p className="userDiv">Please wait ...</p>
                  </div>
                ) : (
                  <>
                    {!mediaBlobUrl && (
                      <div className="custom-button-start" onClick={callApi}>
                        <p className="userDiv">Start</p>
                      </div>
                    )}
                    {!mediaBlobUrl && (status === 'idle' || status === 'stopped') && (
                      <div className="custom-button-start" style={{ top: '60%' }} onClick={startRecording}>
                        <p className="userDiv">Start Recording</p>
                      </div>
                    )}
                    {mediaBlobUrl && status && status === 'stopped' && (
                      <div className="custom-button-start" onClick={downloadRecording}>
                        <p className="userDiv">Download</p>
                      </div>
                    )}
                    {!mediaBlobUrl && (status === 'idle' || status === 'stopped') && (
                      <div className="custom-button-start" style={{ top: '80%' }} onClick={pipVideo}>
                        <p className="userDiv">Picture-in-picture</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : statusnew === 2 ? (
              <>
                <div className="main">
                  <div className="countnumber">{countdown}</div>
                </div>
              </>
            ) : statusnew === 3 ? (
              <>
                <div className="main">
                  <div className="custom-button">
                    <p className="userDiv">{selectedUser}</p>
                  </div>
                  <div className="custom-button">
                    <p className="userDiv">{selectedUser}</p>
                  </div>
                  <img
                    className={`spinner ${spin ? 'spin-animation' : ''}`}
                    src={wheelImage}
                    alt="Spinner"
                    style={{
                      position: 'absolute',
                      left: '60%',
                      top: '7%'
                    }}
                  />
                </div>
                <div>
                  &nbsp;
                  {status && status === 'recording' && (
                    <button type="button" onClick={stopRecording}>
                      Stop Recording
                    </button>
                  )}
                  &nbsp;
                  {mediaBlobUrl && status && status === 'stopped' && (
                    <Button
                      size="small"
                      onClick={downloadRecording}
                      type="primary"
                      icon="download"
                      className="downloadRecording margin-left-sm"
                    >
                      Download
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="container">
                <div className="left">
                  <div className="girl">
                    <img src={girl} style={{ borderRadius: '50%' }} width={300} height={300} />
                  </div>
                  <div>
                    <img src={cracker} width={700} height={700} />
                  </div>

                  <div>
                    &nbsp;
                    {status && status === 'recording' && (
                      <button type="button" onClick={stopRecording}>
                        Stop Recording
                      </button>
                    )}
                    &nbsp;
                    {mediaBlobUrl && status && status === 'stopped' && (
                      <Button
                        size="small"
                        onClick={downloadRecording}
                        type="primary"
                        icon="download"
                        className="downloadRecording margin-left-sm"
                      >
                        Download
                      </Button>
                    )}
                  </div>
                </div>

                <div className="right text">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={logoSpin} width={100} height={100} />
                  </div>
                  <h1 style={{ fontSize: '4em', textAlign: 'center', color: 'rgb(113 63 18 )' }}>Congratulations</h1>
                  {continuespin === 0 && (
                    <div className="winnerList">
                      <p className="winnerRank">Third Winner</p>
                      <h1>{`${winnerList[2].firstname} ${winnerList[2]?.lastname}`}</h1>
                      <p className="Email_prize">
                        {winnerList[2]?.email.replace(/^(.)(.*)(.@.*)/, (...a) => a[1] + a[2].replace(/./g, '*') + a[3])}
                      </p>
                      <p className="Email_prize">{winnerList[2]?.description}</p>
                      <Button onClick={handleSpinClick} style={{ backgroundColor: '#713f12', color: 'white' }}>
                        continue
                      </Button>
                    </div>
                  )}
                  {continuespin === 1 && (
                    <div className="winnerList">
                      <p className="winnerRank">Second Winner</p>
                      <h1>{`${winnerList[1]?.firstname} ${winnerList[1]?.lastname}`}</h1>
                      <p className="Email_prize">
                        {winnerList[1]?.email.replace(/^(.)(.*)(.@.*)/, (...a) => a[1] + a[2].replace(/./g, '*') + a[3])}
                      </p>
                      <p className="Email_prize">{winnerList[1].description}</p>
                      <Button onClick={handleSpinClick} style={{ backgroundColor: '#713f12', color: 'white' }}>
                        continue
                      </Button>
                    </div>
                  )}
                  {continuespin === 2 && (
                    <div className="winnerList">
                      <p className="winnerRank">First Winner</p>
                      <h1>{`${winnerList[0]?.firstname} ${winnerList[0].lastname}`}</h1>
                      <p className="Email_prize">
                        {winnerList[0]?.email.replace(/^(.)(.*)(.@.*)/, (...a) => a[1] + a[2].replace(/./g, '*') + a[3])}
                      </p>
                      <p className="Email_prize">{winnerList[0]?.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default WheelSpin;
