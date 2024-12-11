import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postApi } from "../components/apicalls";
import { getApi } from "../components/apicalls";
import { imagesApi } from "../components/apicalls";

export const fetchProducts = createAsyncThunk("fetchproducts" , async  () => {
        const res = await getApi("/admin/product")
        return res.data
})

export const addProducts = createAsyncThunk("addproduct" , async  (data) => {
        const res  = await postApi("/admin/product",data)
        return res.data
})

export const updateProducts = createAsyncThunk("updateproduct" , async  (data) => {
        const res = await postApi("/admin/update-product",data)
        return res.data
})

export const imageApi = createAsyncThunk("imagesurl" ,async  (data) => {
        const res = await imagesApi("/admin/upload-image" , data)
       
        return res.data
})

const initialState = {
    loader:true,
    Products:[]
}


const productSlice = createSlice({
    name:"ProductSlice",
    initialState,
    reducer:{

    },
    extraReducers:(builder) => {
                builder.addCase(fetchProducts.pending , (state,action) => {
                            state.loader = true
                })
                builder.addCase(fetchProducts.fulfilled , (state,action) => {
                            if(action.payload.success){
                                state.Products = action.payload 
                                state.loader = false
                            }
                })

              
                builder.addCase(addProducts.fulfilled)

              
                builder.addCase(updateProducts.fulfilled )
                builder.addCase(imageApi.pending , (state,action) => {
                        state.loader = true
                })
                builder.addCase(imageApi.fulfilled ,(state,action) => {
                        if(action.payload.success){
                                state.loader = false
                        }
                })      
    }
})


export default productSlice.reducer