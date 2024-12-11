/* eslint-disable arrow-body-style */
/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/iframe-has-title */
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Slide, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props} />);

const VideoPlay = ({ open, close, url }) => {
  const getYoutubeEmbedUrl = (url) => {
    return `https://www.youtube.com/embed/${url}`;
  };

  const getVimeoEmbedUrl = (url) => {
    return `https://player.vimeo.com/video/${url}`;
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="md"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            Video
          </Grid>
          <Grid item xs={6}>
            <IconButton color="inherit" onClick={() => close(false)} aria-label="close" sx={{ position: 'absolute', right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        {url && (
          <>
            {/* YouTube */}
            {url.length === 11 && (
              <iframe
                width="100%"
                height="315"
                src={getYoutubeEmbedUrl(url)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}

            {/* Vimeo */}
            {url.length !== 11 && (
              <iframe
                width="100%"
                height="315"
                src={getVimeoEmbedUrl(url)}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              ></iframe>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>{/* Add any additional actions if needed */}</DialogActions>
    </Dialog>
  );
};

export default VideoPlay;
