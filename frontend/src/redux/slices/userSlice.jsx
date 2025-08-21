import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user:{},
    tenant:{},
    phoneNumbers:''
}

const UserSlice = createSlice({
    name:'user',
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
        }
    }
})
export const {setUser,setTenant,setPhoneNumbers} =  UserSlice.actions
export default UserSlice.reducer