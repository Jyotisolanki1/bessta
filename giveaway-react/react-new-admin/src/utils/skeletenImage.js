/* eslint-disable lines-around-directive */
'use client';
import { Skeleton } from '@mui/material';
import React from 'react';

function SkeletenImage() {
  return (
    <>
      <Skeleton variant="text" width={40} height={40} />
    </>
  );
}

export default SkeletenImage;
