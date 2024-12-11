'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// material-ui
import { styled } from '@mui/material/styles';
import { Box, IconButton, ClickAwayListener } from '@mui/material';

// assets
import MoodTwoToneIcon from '@mui/icons-material/MoodTwoTone';

// third-party
import { SkinTones } from 'emoji-picker-react';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

// ==============================|| EMOJI PICKER ||============================== //

const RootStyle = styled(Box)({
  position: 'relative'
});

const PickerStyle = styled('div')(({ theme }) => ({
  bottom: 40,
  overflow: 'hidden',
  position: 'absolute',
  left: -16,
  boxShadow: theme.customShadows.z20,
  borderRadius: 4,
  '& .emoji-mart': {
    border: 'none',
    backgroundColor: theme.palette.background.paper
  },
  '& .emoji-mart-anchor': {
    color: theme.palette.text.disabled,
    '&:hover, &:focus, &.emoji-mart-anchor-selected': {
      color: theme.palette.text.primary
    }
  },
  '& .emoji-mart-bar': { borderColor: theme.palette.divider },
  '& .emoji-mart-search input': {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    borderColor: theme.palette.grey[500],
    '&::placeholder': {
      ...theme.typography.body2,
      color: theme.palette.text.disabled
    }
  },
  '& .emoji-mart-search-icon svg': {
    opacity: 1,
    fill: theme.palette.text.disabled
  },
  '& .emoji-mart-category-label span': {
    ...theme.typography.subtitle2,
    color: theme.palette.text.primary
  },
  '& .emoji-mart-title-label': { color: theme.palette.text.primary },
  '& .emoji-mart-category .emoji-mart-emoji:hover:before': {
    backgroundColor: theme.palette.action.selected
  },
  '& .emoji-mart-emoji': { outline: 'none' },
  '& .emoji-mart-preview-name': {
    color: theme.palette.text.primary
  },
  '& .emoji-mart-preview-shortname, .emoji-mart-preview-emoticon': {
    color: theme.palette.text.secondary
  }
}));

export default function EmojiPicker({ disabled, value, setValue, alignRight = false, ...other }) {
  const [emojiPickerState, SetEmojiPicker] = useState(false);

  // handle emoji
  const onEmojiClick = (emojiObject) => {
    setValue(value + emojiObject.emoji);
  };

  let emojiPicker;
  if (emojiPickerState) {
    emojiPicker = (
      <>
        <Picker onEmojiClick={onEmojiClick} defaultSkinTone={SkinTones.DARK} autoFocusSearch={false} />
      </>
    );
  }

  const triggerPicker = (event) => {
    event.preventDefault();
    SetEmojiPicker(!emojiPickerState);
  };

  const handleClickAway = () => {
    SetEmojiPicker(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <RootStyle {...other}>
        <PickerStyle
          sx={{
            ...(alignRight && {
              right: -2,
              left: 'auto !important'
            })
          }}
        >
          {emojiPicker}
        </PickerStyle>
        <IconButton disabled={disabled} size="small" onClick={triggerPicker}>
          <MoodTwoToneIcon />
        </IconButton>
      </RootStyle>
    </ClickAwayListener>
  );
}

EmojiPicker.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string,
  setValue: PropTypes.func,
  alignRight: PropTypes.bool
};
