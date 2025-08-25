import { configureStore } from '@reduxjs/toolkit'
import UserSlice from './slices/dataSlice'

const store = configureStore({
    reducer: {
        data: UserSlice,
    }
})
export default store