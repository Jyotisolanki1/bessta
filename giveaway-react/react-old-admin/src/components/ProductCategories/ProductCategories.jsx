

import PersistentDrawerLeft from "../../common/SideNav";
import { Box } from "@mui/material";
import DrawerHeader from "../../common/DrawerHeader";
// import StoreTable from './StoreTable'
// import FormDialog from './AddProduct'
import ProductCategoriesTable from "./ProductCategoriestable";
import AddProductCategory from "./AddProductCategories";


export default function ProductCatgories() {
  return (
    <div style={{ display: "flex" }}>
      <PersistentDrawerLeft />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Box>
           
            
          <ProductCategoriesTable/>
          
       
        </Box>
      </Box>
    </div>
  );
}
