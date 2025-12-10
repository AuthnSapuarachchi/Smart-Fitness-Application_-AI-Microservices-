import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'auth',
  initialState : {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null
  },
  reducers: {
    setCredentials: (state, action) => {
      
    },
    logout: (state) => {
      
    },
  },
})

export const { setCredentials, logout } = authS.actions
export default counterSlice.reducer