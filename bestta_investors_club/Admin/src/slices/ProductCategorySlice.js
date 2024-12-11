import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postApi } from "../components/apicalls";
import { getApi } from "../components/apicalls";

export const fetchProductCategories = createAsyncThunk("fetchproductcategiries",async  () => {
            const res = await getApi("/admin/category")
            return res.data
})

export const addProductCategories = createAsyncThunk("addproductcategories",async (data) => {
            const res = await postApi("/admin/category",data)
            return res.data
})


export const updateProductCategories = createAsyncThunk("updateproductcategories" , async (data) => {
            const res = await  postApi("/admin/update-category",data)
            return res.data
})


const initialState = {
    loader : true,
    ProductCategories: []
}


const ProductCategorySlice = createSlice({
    name:"ProductCategorySlice",
    initialState,
    reducer:{},
    extraReducers:(builder) => {
            // builder.addCase(fetchProductCategories.pending, (state ,action) => {
            //             state.loader = true
            // })
            builder.addCase(fetchProductCategories.fulfilled , (state,action) => {
                    if(action.payload.success){
                        state.ProductCategories = action.payload
                        state.loader = false
                    }
            })

            builder.addCase(addProductCategories.pending , (state,action) => {
                        state.loader = true
            })
            builder.addCase(addProductCategories.fulfilled , (state,action) => {
                        if(action.payload.success){
                            state.loader = false
                        }
            })

            builder.addCase(updateProductCategories.pending , (state,action) => {
                        state.loader = true
            })
            builder.addCase(updateProductCategories.fulfilled , (state,action) => {
                        if(action.payload.success){
                            state.loader = false
                        }
            })
    }
})


export default ProductCategorySlice.reducer