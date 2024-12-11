'use client';

import PropTypes from 'prop-types';

// material-ui
import { Box, Button, Divider, Stack } from '@mui/material';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid, GridColumnMenuFilterItem, GridColumnMenuSortItem, GridColumnMenuColumnsItem } from '@mui/x-data-grid';

// project import
import MainCard from 'components/ui-component/cards/MainCard';
import CardSecondaryAction from 'components/ui-component/cards/CardSecondaryAction';
import CSVExport from 'views/forms/tables/tbl-exports';

function MenuCloseComponent(onClick) {
  return (
    <Button color="primary" onClick={onClick}>
      Close Menu
    </Button>
  );
}

// MenuCloseComponent.propTypes = {
//   onClick: PropTypes.func
// };

function CustomColumnMenu(props) {
  const itemProps = {
    // eslint-disable-next-line
    colDef: props.colDef,
    // eslint-disable-next-line
    onClick: props.hideMenu
  };
  return (
    <>
      <Stack px={0.5} py={0.5}>
        <GridColumnMenuSortItem {...itemProps} />
        {/* Only provide filtering on desk */}
        {itemProps.colDef.field === 'desk' ? <GridColumnMenuFilterItem {...itemProps} /> : null}
      </Stack>
      <Divider />
      <Stack px={0.5} py={0.5}>
        <GridColumnMenuColumnsItem {...itemProps} />
        <MenuCloseComponent {...itemProps} />
      </Stack>
    </>
  );
}

CustomColumnMenu.propTypes = {
  colDef: PropTypes.object,
  hideMenu: PropTypes.func
};

// ==============================|| CUSTOM MENU COMPONENT DATA GRID ||============================== //

export default function CustomMenu() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 5,
    maxColumns: 8
  });

  const headers = [];
  data.columns.map((item) => headers.push({ label: item.headerName, key: item.field }));

  return (
    <MainCard
      content={false}
      title="Custom Menu Component"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          <CSVExport data={data.rows} filename="custom-menu-data-grid-table.csv" header={headers} />
          <CardSecondaryAction link="https://mui.com/x/react-data-grid/column-menu/#custom-menu-component" />
        </Stack>
      }
    >
      <Box sx={{ width: '100%' }}>
        <DataGrid {...data} autoHeight hideFooter slots={{ columnMenu: CustomColumnMenu }} />
      </Box>
    </MainCard>
  );
}
