import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'auth',
  initialState : (
    
  )
  reducers: {
    

    decrement(state) {
      state.value--
    },
    incrementByAmount(state, action) {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer