import PersistentDrawerLeft from "../../common/SideNav";
import { Box } from "@mui/material";
import DrawerHeader from "../../common/DrawerHeader";
import StoreTable from './StoreTable'
import AddProduct from './AddProduct'
// import TestAccordian from "./Test";

export default function Store() {
  return (
    <div style={{ display: "flex" }}>
      <PersistentDrawerLeft />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Box>
      
          <StoreTable/>
        </Box>
      </Box>
    </div>
  );
}
