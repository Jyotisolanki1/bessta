'use client';

// material-ui
import { Box, Stack } from '@mui/material';
import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';
import { randomCreatedDate, randomTraderName, randomUpdatedDate } from '@mui/x-data-grid-generator';

// project import
import MainCard from 'components/ui-component/cards/MainCard';
import CardSecondaryAction from 'components/ui-component/cards/CardSecondaryAction';
import CSVExport from 'views/forms/tables/tbl-exports';

const columns = [
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 180, editable: true },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    editable: true,
    align: 'left',
    flex: 0.5,
    minWidth: 100,
    headerAlign: 'left'
  },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    flex: 0.75,
    minWidth: 180,
    editable: true
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    flex: 0.75,
    minWidth: 180,
    editable: true
  }
];

const rows = [
  {
    id: 1,
    name: randomTraderName(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate()
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate()
  },
  {
    id: 3,
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate()
  },
  {
    id: 4,
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate()
  },
  {
    id: 5,
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate()
  }
];

// ==============================|| EDITING EVENTS DATA GRID ||============================== //

export default function DisableStopEditModeOnFocusOut() {
  const headers = [];
  columns.map((item) => headers.push({ label: item.headerName, key: item.field }));

  return (
    <MainCard
      content={false}
      title="Editing Events"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          <CSVExport data={rows} filename="editing-events-data-grid-table.csv" header={headers} />
          <CardSecondaryAction link="https://mui.com/x/react-data-grid/editing/#editing-events" />
        </Stack>
      }
    >
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          onCellEditStop={(params, event) => {
            if (params.reason === GridCellEditStopReasons.cellFocusOut) {
              event.defaultMuiPrevented = true;
            }
          }}
          hideFooter
          autoHeight
        />
      </Box>
    </MainCard>
  );
}
