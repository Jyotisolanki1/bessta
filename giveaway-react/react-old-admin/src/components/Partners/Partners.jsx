import PersistentDrawerLeft from "../../common/SideNav";
import { Box } from "@mui/material";
import DrawerHeader from "../../common/DrawerHeader";
import AddPartner from "./AddPartners";
import PartnersTable from "./PartnerTable";

export default function Partners() {
  return (
    <div style={{ display: "flex" }}>
      <PersistentDrawerLeft />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <AddPartner/>
        <PartnersTable/>
      </Box>
    </div>
  );
}
