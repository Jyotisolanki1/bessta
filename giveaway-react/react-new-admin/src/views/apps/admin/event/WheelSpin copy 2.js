/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable import/no-relative-packages */
/* eslint-disable lines-around-directive */
/* eslint-disable import/newline-after-import */
'use client';

import React, { useState, useEffect } from 'react';
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
import Image from '../../../../../node_modules/next/image';
import { getUsers, getWinnerList } from 'store/slices/events';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useReactMediaRecorder } from 'react-media-recorder';
const wheelImage = '/assets/images/wheelImage.png';
const cracker = '/assets/images/cracker.gif';
const girl = '/assets/images/girl.gif';
const logoSpin = '/assets/images/logoSpin.png';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);
const WheelSpin = ({ open, close, item }) => {
  const dispatch = useDispatch();
  // const [status, setStatus] = useState(1);
  const [spin, setSpin] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [congPage, setCongPage] = useState(false);
  const [congrate, setCongrate] = useState(false);
  const user = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6'];
  const winner = ['user1', 'user2', 'user3'];
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

  const spining = () => {
    // Start spinning after component mounts
    setSpin(true);
    // Stop spinning after 5 seconds
    const timer = setTimeout(() => {
      setSpin(false);
      setCongrate(true);
    }, 10000);
  };

  //   return () => clearTimeout(timer); // Clear the timer on component unmount
  // };

  let interval;
  useEffect(() => {
    if (spin) {
      interval = setInterval(() => {
        // Randomly select a user from the users array
        const randomIndex = Math.floor(Math.random() * user.length);
        setSelectedUser(user[randomIndex]);
        // setCongrate(false)
      }, 100); // Adjust the interval as needed
    } else {
      // setSelectedUser(`${firstWinner?.firstname} ${firstWinner?.lastname}`);
    }
    if (status && status === 'stopped') {
      downloadRecording();
    }

    return () => clearInterval(interval);
  }, [spin, user, selectedUser]);

  useEffect(() => {
    if (congrate) {
      const timer = setTimeout(() => {
        setCongPage(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [congrate]);

  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      keepMounted
      // onClose={close}
      aria-describedby="alert-dialog-slide-description"
    >
      {/* <DialogTitle className="background_color">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            Spin Wheel
          </Grid>
          <Grid item xs={6}>
            <IconButton
              color="inherit"
              onClick={() => {
                close(false);
              }}
              aria-label="close"
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle> */}
      <DialogContent sx={{ justifyContent: 'center' }} className="background_color">
        <DialogContentText id="alert-dialog-slide-description">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              {/* Spin Wheel */}
            </Grid>
            <Grid item xs={6}>
              <IconButton
                color="black"
                onClick={() => {
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
            {/* <Image src={wheelImage} width={512} height={512} /> */}
            {!congPage ? (
              <>
                <div className="main">
                  <div className="custom-button">
                    <p className="userDiv">{selectedUser}</p>
                  </div>
                  <img
                    className={`spinner ${spin ? 'spin-animation' : ''}`}
                    src={wheelImage}
                    alt="Spinner"
                    style={{ position: 'absolute', left: '60%', top: '7%' }}
                  />
                </div>
                <div>
                  {/* <p>{status}</p> */}
                  <button type="button" onClick={spining}>
                    Spin
                  </button>
                  &nbsp;
                  {(status === 'idle' || status === 'stopped') && (
                    <button type="button" onClick={startRecording}>
                      Start Recording
                    </button>
                  )}
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
                </div>

                <div className="right text">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <img src={logoSpin} width={100} height={100} />
                  </div>
                  <h1
                    style={{
                      fontSize: '4em',
                      textAlign: 'center',
                      color: 'rgb(113 63 18 )'
                    }}
                  >
                    Congratulations
                  </h1>
                  {winner.length === 1 ? (
                    <div>
                      <p className="winnerRank">Winner</p>
                      <h1>{winner[0]}</h1>
                      <p className="Email_prize">user****@*****email.com</p>
                    </div>
                  ) : (
                    <div>
                      <div className="winnerList">
                        <p className="winnerRank">First Winner</p>
                        <h1>{winner[0]}</h1>
                        <p className="Email_prize">{winner[0]}****@*****email.com</p>
                        <p className="Email_prize">2</p>
                      </div>
                      <div className="remainingWinnner">
                        <div>
                          <p className="winnerRank">Second Winner</p>
                          <h1>{winner[1]}</h1>
                          <p className="Email_prize">{winner[1]}****@*****email.com</p>
                          <p className="Email_prize">2</p>
                        </div>
                        <div>
                          <p className="winnerRank">Third Winner</p>
                          <h1> {winner[2]}</h1>
                          <p className="Email_prize">{winner[2]}****@*****email.com</p>
                          <p className="Email_prize">2</p>
                        </div>
                      </div>
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
