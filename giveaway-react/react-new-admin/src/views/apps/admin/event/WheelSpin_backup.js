/* eslint-disable import/newline-after-import */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
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
// import Image from '../../../../../node_modules/next/image';
import { getUsers, getWinnerList } from 'store/slices/events';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
const wheelImage = '/assets/images/wheelImage.png';
const cracker = '/assets/images/cracker.gif';
const girl = '/assets/images/girl.gif';
const logoSpin = '/assets/images/logoSpin.png';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);
const WheelSpin = ({ open, close, item }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(1);
  const [spin, setSpin] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [user, setUser] = useState([]);
  const [winnerList, setWinnerList] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (spin) {
      interval = setInterval(() => {
        // Randomly select a user from the users array
        const randomIndex = Math.floor(Math.random() * user.length);
        setSelectedUser(user[randomIndex]);
        // setCongrate(false)
      }, 100); // Adjust the interval as needed
    }
    return () => clearInterval(interval);
  }, [spin, user, selectedUser]);

  useEffect(() => {
    if (status === 2) {
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000); // Update countdown every second

      // Stop countdown when it reaches 0
      if (countdown === 0) {
        clearInterval(countdownInterval);
        setStatus(3); // Change status to 3 when countdown reaches 0
        setSpin(true);
      }

      return () => clearInterval(countdownInterval);
    }
  }, [status, countdown]);

  useEffect(() => {
    if (spin === true) {
      // Start spinning the wheel
      spining();
      const fetchData = async () => {
        try {
          const resWinner = await dispatch(getWinnerList(item?._id));
          if (resWinner?.success === true) {
            // Update winner list and stop spinning
            setWinnerList(resWinner?.data?.winners);
            setSpin(false);
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

      // Call the API repeatedly until success
      const apiInterval = setInterval(fetchData, 1000);

      return () => clearInterval(apiInterval);
    }
  }, [spin]);

  const callApi = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getUsers(item?._id));
      if (res?.success === true) {
        setLoading(false);
        setUser(res?.data?.userList);
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
        setStatus(2);
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
            {status === 1 ? (
              <div className="main">
                {loading ? (
                  <div className="custom-button-start" onClick={callApi} style={{ cursor: 'progress !important' }}>
                    <p className="userDiv">Please wait ...</p>
                  </div>
                ) : (
                  <div className="custom-button-start" onClick={callApi}>
                    <p className="userDiv">Start</p>
                  </div>
                )}
              </div>
            ) : status === 2 ? (
              <>
                <div className="main">
                  <div className="countnumber">{countdown}</div>
                </div>
              </>
            ) : status === 3 ? (
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
                    style={{ position: 'absolute', left: '44%', top: '7%' }}
                  />
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
                  {winnerList.length === 1 ? (
                    <div className="winnerList">
                      <p className="winnerRank">First Winner</p>
                      <h1>{`${winnerList[0].firstname} ${winnerList[0].lastname}`}</h1>
                      <p className="Email_prize">{winnerList[1]?.email}</p>
                      <p className="Email_prize">{winnerList[1].description}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="winnerList">
                        <p className="winnerRank">First Winner</p>
                        <h1>{`${winnerList[0].firstname} ${winnerList[0].lastname}`}</h1>
                        <p className="Email_prize">{winnerList[1]?.email}</p>
                        <p className="Email_prize">{winnerList[1].description}</p>
                      </div>
                      <div className="remainingWinnner">
                        {winnerList.length === 2 && (
                          <div>
                            <p className="winnerRank">Second Winner</p>
                            <h1>{winnerList[1]}</h1>
                            <p className="Email_prize">{winnerList[1]?.email}</p>
                            <p className="Email_prize">{winnerList[1]?.description}</p>
                          </div>
                        )}
                        {winnerList.length === 3 && (
                          <>
                            <div>
                              <p className="winnerRank">Second Winner</p>
                              <h1>{winnerList[1]}</h1>
                              <p className="Email_prize">{winnerList[1]?.email}</p>
                              <p className="Email_prize">{winnerList[1]?.description}</p>
                            </div>
                            <div>
                              <p className="winnerRank">Third Winner</p>
                              <h1> {winnerList[2]}</h1>
                              <p className="Email_prize">{winnerList[1]?.email}</p>
                              <p className="Email_prize">{winnerList[1]?.description}</p>
                            </div>
                          </>
                        )}
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
