import { createSlice } from '@reduxjs/toolkit'

const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    currentPatient: {},
  },
  reducers: {
    setCurrentPatient(state, action) {
      state.currentPatient = action.payload
    },
  },
})

export const { setCurrentPatient } = patientSlice.actions

export default patientSlice.reducer
