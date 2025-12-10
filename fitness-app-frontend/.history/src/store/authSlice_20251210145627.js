import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
/*************  ✨ Windsurf Command 🌟  *************/
    incrementCounter(state) {
      state.value += 1
    increment(state) {
      state.value++
    },
/*******  9e2ca2b3-b7e9-443f-a921-67c7859fe892  *******/
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