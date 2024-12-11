/* eslint-disable lines-around-directive */
'use client';
import { Skeleton, TableCell, TableRow } from '@mui/material';
import React from 'react';

function Skeleten({ count }) {
  const skeletonArray = Array.from({ length: count });
  const rowArray = Array.from({ length: 10 });

  return (
    <>
      {rowArray.map((_, indexRow) => (
        <TableRow hover key={indexRow}>
          {skeletonArray.map((_, index) => (
            <TableCell key={index}>
              <Skeleton variant="text" width={70} height={50} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export default Skeleten;
