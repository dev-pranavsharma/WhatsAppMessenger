import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user:{},
    tenant:{},
    phoneNumbers:'',
    templates:[]
}

const dataSlice = createSlice({
    name:'data',
    initialState,
    reducers:{
        setUser :(state,action)=>{            
            state.user = action.payload
        },
        setTenant:(state,action)=>{
            state.tenant = action.payload
        },
        setPhoneNumbers:(state,action)=>{
            state.phoneNumbers = action.payload
        },
        setTemplates:(state,action)=>{
            state.templates = action.payload
        }
    }
})
export const {setUser,setTenant,setPhoneNumbers,setTemplates} =  dataSlice.actions
export default dataSlice.reducer