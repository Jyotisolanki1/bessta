import PersistentDrawerLeft from "../../common/SideNav";
import { Box } from "@mui/material";
import DrawerHeader from "../../common/DrawerHeader";
import CouponsTable from "./CouponsTable";
import AddCoupon from "./AddCoupon";

export default function Coupons() {
  return (
    <div style={{ display: "flex" }}>
      <PersistentDrawerLeft />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {/* <h1> Coupons</h1> */}
        {/* <AddCoupon/> */}

        <CouponsTable/>
      </Box>
    </div>
  );
}
