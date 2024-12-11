import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postApi } from "../components/apicalls";
import { getApi } from "../components/apicalls";

export const fetchCoupons = createAsyncThunk("fetchcoupons" , async () => {
        const res = await getApi("/admin/coupon")
        return res.data
})

 export const addCoupon = createAsyncThunk("addCoupon" ,async (data) => {
        const res = await postApi("/admin/add-coupon",data)
        return res.data
        })

export const updateCoupon = createAsyncThunk("updateCoupon" ,async (data) => {
        const res = await postApi("/admin/update-coupon",data)
        return res.data
})


const initialState = {
    loader:true,
    Coupons:[]
}

const CouponSlice = createSlice({
    name:"CouponSlice",
    initialState,
    reducer:{},
    extraReducers:(builder) => {
            builder.addCase(fetchCoupons.pending,(state,action) => {
                    state.loader = true
            })
            builder.addCase(fetchCoupons.fulfilled, (state,action) => {
                    if(action.payload.success){
                        state.Coupons = action.payload
                        state.loader = false
                    }
            })
           

            builder.addCase(addCoupon.fulfilled )
            builder.addCase(updateCoupon.fulfilled )
    }
})

export default CouponSlice.reducer