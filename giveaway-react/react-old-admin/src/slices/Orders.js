import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postApi } from "../components/apicalls";
import { getApi } from "../components/apicalls";

export const fetchOrders = createAsyncThunk("fetchorders" , async () => {
            const res = await getApi("/admin/order")
            return res.data
})


export const orderUpdate = createAsyncThunk("updateorderstatus" , async (data) => {
            const res = await postApi("/admin/update-order-status",data) 
            return res.data
})

const initialState = {
    loader : true,
    Orders: []
}

const orderSlice = createSlice({
    name:"OrderSlice",
    initialState,
    reducer:{},
    extraReducers:(builder) => {
        builder.addCase(fetchOrders.pending , (state,action) => {
                    state.loader = true
        })
        builder.addCase(fetchOrders.fulfilled , (state,action ) => {
                    if(action.payload.success){
                        state.Orders = action.payload
                        state.loader = false
                    }
        })

      
        builder.addCase(orderUpdate.fulfilled )
    }
})

export default orderSlice.reducer