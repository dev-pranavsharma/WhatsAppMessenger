// src/redux/slices/librarySlice.js
import { libraryService } from "@/services/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// thunks for multiple static data
export const fetchGenders = createAsyncThunk(
  "library/fetchGenders",
  async (_, { rejectWithValue }) => {
    try {
      const response =  await libraryService.genders();
      return response.data
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching genders");
    }
  }
);

export const fetchCountryCodes = createAsyncThunk(
  "library/fetchCountryCodes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await libraryService.countryCodes();
      return response.data
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching country codes");
    }
  }
);

const librarySlice = createSlice({
  name: "lib",
  initialState: {
    genders: [],
    countryCodes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Genders
      .addCase(fetchGenders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenders.fulfilled, (state, action) => {
        state.loading = false;
        state.genders = action.payload;
      })
      .addCase(fetchGenders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Country Codes
      .addCase(fetchCountryCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountryCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.countryCodes = action.payload;
      })
      .addCase(fetchCountryCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default librarySlice.reducer;
