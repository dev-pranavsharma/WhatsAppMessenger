import { tenantService } from "@/services/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    user:{},
    tenant:{},
    phoneNumbers:'',
    templates:[]
}

// thunks for multiple static data
export const fetchTenant = createAsyncThunk(
  "library/fetchTenant",
  async (_, { rejectWithValue }) => {
    try {
      const response =  await tenantService.tenantById;
      return response.data
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching genders");
    }
  }
);

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
    },
    extraReducers: (builder) => {
        builder
          // Genders
        .addCase(fetchTenant.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTenant.fulfilled, (state, action) => {
          state.loading = false;
          state.genders = action.payload;
        })
        .addCase(fetchTenant.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
    }
})
export const {setUser,setTenant,setPhoneNumbers,setTemplates} =  dataSlice.actions
export default dataSlice.reducer