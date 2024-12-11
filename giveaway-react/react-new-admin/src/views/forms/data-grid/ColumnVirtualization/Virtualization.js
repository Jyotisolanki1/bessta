'use client';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { Box, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// project import
import MainCard from 'components/ui-component/cards/MainCard';
import CardSecondaryAction from 'components/ui-component/cards/CardSecondaryAction';
import CSVExport from 'views/forms/tables/tbl-exports';

function useData(rowLength, columnLength) {
  const [data, setData] = useState({ columns: [], rows: [] });

  useEffect(() => {
    const rows = [];

    for (let i = 0; i < rowLength; i += 1) {
      const row = {
        id: i
      };

      for (let j = 1; j <= columnLength; j += 1) {
        row[`price${j}M`] = `${i.toString()}, ${j} `;
      }

      rows.push(row);
    }

    const columns = [];

    for (let j = 1; j <= columnLength; j += 1) {
      columns.push({ field: `price${j}M`, headerName: `${j}M` });
    }

    setData({
      rows,
      columns
    });
  }, [rowLength, columnLength]);

  return data;
}

useData.propTypes = {
  rowLength: PropTypes.array,
  columnLength: PropTypes.array,
  columns: PropTypes.array,
  rows: PropTypes.array
};

// ==============================|| COLUMN VIRTUALIZATION DATA GRID ||============================== //

export default function Virtualization() {
  const data = useData(100, 1000);
  const headers = [];
  data.columns.map((item) => headers.push({ label: item.headerName, key: item.field }));

  return (
    <MainCard
      content={false}
      title="Column Virtualization"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          <CSVExport data={data.rows} filename="column-virtualization-data-grid-table.csv" header={headers} />
          <CardSecondaryAction link="https://mui.com/x/react-data-grid/virtualization/#column-virtualization" />
        </Stack>
      }
    >
      <Box sx={{ height: 670, width: '100%' }}>
        <DataGrid hideFooter {...data} columnBuffer={2} columnThreshold={2} />
      </Box>
    </MainCard>
  );
}
