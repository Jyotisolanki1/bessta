/* eslint-disable react/prop-types */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import ReactPlayer from 'react-player';
import parse from 'html-react-parser';

export default function VideoModel() {
  const [courseContent, setCourseContent] = React.useState(JSON.parse(localStorage.getItem('video')));
  return (
    <React.Fragment>
      <div className="container" style={{marginTop:"100px"}}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {courseContent?.name}
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            overflowY: 'scroll',
            scrollbarWidth: 'none'
            // scrollbarColor: "orange transparent",
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {courseContent?.videoType == 'youtube' ? (
              <ReactPlayer url={`https://www.youtube.com/watch?v=${courseContent?.video}`} controls={true}/>
            ) : (
              <ReactPlayer url={`https://vimeo.com/${courseContent?.video}`} controls={true} />
            )}
          </div>
          <Typography
            gutterBottom
            sx={{
              fontSize: '1rem',
              lineHeight: '20px',
              margin: '20px 9px'
            }}
          >
            {courseContent?.instructor ? `Instructor Name:- ${courseContent?.instructor}` : ''}
          </Typography>{' '}
          <Typography
            gutterBottom
            sx={{
              fontSize: '1rem',
              lineHeight: '20px',
              margin: '20px 9px'
            }}
          >
            {courseContent?.instructor_intro ? `Instructor Information:-  ${parse(courseContent?.instructor_intro)}` : ''}
          </Typography>{' '}
          <Typography
            gutterBottom
            sx={{
              fontSize: '1rem',
              lineHeight: '20px',
              margin: '20px 9px'
            }}
          >
            By {courseContent?.videoType}
          </Typography>{' '}
          <Typography
            gutterBottom
            sx={{
              fontSize: '1rem',
              lineHeight: '20px',
              margin: '20px 9px'
            }}
          >
            {parse(courseContent?.description)}
          </Typography>
        </DialogContent>
        <DialogActions></DialogActions>
      </div>
    </React.Fragment>
  );
}
