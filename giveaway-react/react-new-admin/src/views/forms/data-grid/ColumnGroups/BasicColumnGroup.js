'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { Box, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// project import
import MainCard from 'components/ui-component/cards/MainCard';
import CardSecondaryAction from 'components/ui-component/cards/CardSecondaryAction';
import CSVExport from 'views/forms/tables/tbl-exports';

// table data
const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'firstName',
    headerName: 'First name',
    flex: 1,
    minWidth: 150
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    flex: 1,
    minWidth: 150
  },
  {
    field: 'age',
    headerName: 'Age',
    flex: 0.5,
    minWidth: 110
  }
];

export const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
];

const columnGroupingModel = [
  {
    groupId: 'Internal',
    description: '',
    children: [{ field: 'id' }]
  },
  {
    groupId: 'Basic info',
    children: [
      {
        groupId: 'Full name',
        children: [{ field: 'lastName' }, { field: 'firstName' }]
      },
      { field: 'age' }
    ]
  }
];

function BasicGroupingDemo({ Selected }) {
  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        experimentalFeatures={{ columnGrouping: true }}
        rows={rows}
        columns={columns}
        autoHeight
        checkboxSelection
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5
            }
          }
        }}
        pageSizeOptions={[5]}
        onRowSelectionModelChange={(newSelectionModel) => {
          const selectedIDs = new Set(newSelectionModel);
          const selectedRowData = rows.filter((row) => selectedIDs.has(row.id));
          Selected(selectedRowData);
        }}
        columnGroupingModel={columnGroupingModel}
      />
    </Box>
  );
}

BasicGroupingDemo.propTypes = {
  Selected: PropTypes.func
};

// ==============================|| BASIC COLUMN GROUP DATA GRID ||============================== //

export default function BasicGrouping() {
  const headers = [];
  columns.map((item) => headers.push({ label: item.headerName, key: item.field }));

  const [selectedValue, setSelectedValue] = useState([]);
  const handlerClick = (data) => {
    setSelectedValue(data);
  };

  const NewValue = selectedValue.length > 0 ? selectedValue : rows;

  return (
    <MainCard
      content={false}
      title="Basic Column Group"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          <CSVExport data={NewValue} filename="basic-group-data-grid-table.csv" header={headers} />
          <CardSecondaryAction link="https://mui.com/x/react-data-grid/column-groups/#define-column-groups" />
        </Stack>
      }
    >
      <BasicGroupingDemo Selected={handlerClick} />
    </MainCard>
  );
}
