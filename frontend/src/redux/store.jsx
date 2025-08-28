import { configureStore } from '@reduxjs/toolkit'
import UserSlice from './slices/dataSlice'
import LibrarySlice from './slices/libSlice'

const store = configureStore({
    reducer: {
        data: UserSlice,
        lib:LibrarySlice
    }
})
export default store