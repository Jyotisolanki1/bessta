'use client';

import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';

// material-ui
import { Box, Button, Stack } from '@mui/material';
import { DataGrid, GridCellModes } from '@mui/x-data-grid';
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

// ==============================|| CONTROLLED EDITING DATA GRID ||============================== //

export default function StartEditButtonGrid() {
  const [selectedCellParams, setSelectedCellParams] = useState(null);
  const [cellModesModel, setCellModesModel] = useState({});

  const handleCellFocus = useCallback((event) => {
    const row = event.currentTarget.parentElement;
    const id = row.dataset.id;
    const field = event.currentTarget.dataset.field;
    setSelectedCellParams({ id, field });
  }, []);

  const cellMode = useMemo(() => {
    if (!selectedCellParams) {
      return 'view';
    }
    const { id, field } = selectedCellParams;
    return cellModesModel[id]?.[field]?.mode || 'view';
  }, [cellModesModel, selectedCellParams]);

  const handleCellKeyDown = useCallback(
    (params, event) => {
      if (cellMode === 'edit') {
        // Prevents calling event.preventDefault() if Tab is pressed on a cell in edit mode
        event.defaultMuiPrevented = true;
      }
    },
    [cellMode]
  );

  const handleCellEditStop = useCallback((params, event) => {
    event.defaultMuiPrevented = true;
  }, []);

  const headers = [];
  columns.map((item) => headers.push({ label: item.headerName, key: item.field }));

  const handleSaveOrEdit = () => {
    if (!selectedCellParams) {
      return;
    }
    const { id, field } = selectedCellParams;
    if (cellMode === 'edit') {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.View } }
      });
    } else {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.Edit } }
      });
    }
  };

  const handleCancel = () => {
    if (!selectedCellParams) {
      return;
    }
    const { id, field } = selectedCellParams;
    setCellModesModel({
      ...cellModesModel,
      [id]: {
        ...cellModesModel[id],
        [field]: { mode: GridCellModes.View, ignoreModifications: true }
      }
    });
  };

  const handleMouseDown = (event) => {
    // Keep the focus in the cell
    event.preventDefault();
  };

  return (
    <MainCard
      content={false}
      title="Controlled Editing"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ px: 1 }}>
            <Button onClick={handleSaveOrEdit} onMouseDown={handleMouseDown} disabled={!selectedCellParams} variant="outlined">
              {cellMode === 'edit' ? 'Save' : 'Edit'}
            </Button>
            <Button onClick={handleCancel} onMouseDown={handleMouseDown} disabled={cellMode === 'view'} variant="outlined" sx={{ ml: 1 }}>
              Cancel
            </Button>
          </Box>
          <CSVExport data={rows} filename="controlled-data-grid-table.csv" header={headers} />
          <CardSecondaryAction link="https://mui.com/x/react-data-grid/editing/#controlled-model" />
        </Stack>
      }
    >
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter
          autoHeight
          onCellKeyDown={handleCellKeyDown}
          cellModesModel={cellModesModel}
          onCellEditStop={handleCellEditStop}
          onCellModesModelChange={(model) => setCellModesModel(model)}
          slotProps={{
            toolbar: {
              cellMode,
              selectedCellParams,
              setSelectedCellParams,
              cellModesModel,
              setCellModesModel
            },
            cell: {
              onFocus: handleCellFocus
            }
          }}
        />
      </Box>
    </MainCard>
  );
}
