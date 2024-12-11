import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postApi } from "../components/apicalls";



export const fetchParticipitants = createAsyncThunk("fetchparticpitants" , async  (drawid) => {
     
        const res = await  postApi("/draw-user-list",{
            draw_id: drawid
        })
     
        return res.data
})


export const fetchWinners = createAsyncThunk("fetchwinner" , async (drawid) => {
       
        const res = await postApi("/winner", {
            draw_id: drawid
        })
        return res.data
})


const initialState = {
    loader:true,
    Participitants :[],
    winner:{}
}


const WinnerSlice = createSlice({
    name:"WinnerSlice",
    initialState,
    reducer:{},
    extraReducers: (builder) => {
            builder.addCase(fetchParticipitants.fulfilled, (state,action) =>{
                    if(action.payload.success){
                        state.Participitants = action.payload
                        state.loader = false
                    }
            })

            builder.addCase(fetchWinners.fulfilled , (state,action) => {
                    if(action.payload.success){
                        state.winner = action.payload
                        state.loader = false
                    }
            } )
    }
})

export default WinnerSlice.reducer