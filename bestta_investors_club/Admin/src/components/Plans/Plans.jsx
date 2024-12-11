import PersistentDrawerLeft from "../../common/SideNav";
import { Box } from "@mui/material";
import DrawerHeader from "../../common/DrawerHeader";
import PlansTable from "./PlansTable";
import AddPlan from "./AddPlans";

export default function Plans() {
  return (
    <div style={{ display: "flex" }}>
      <PersistentDrawerLeft />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {/* <h1> Plans</h1> */}
       {/* <AddPlan/> */}
       <PlansTable/>
      </Box>
    </div>
  );
}
