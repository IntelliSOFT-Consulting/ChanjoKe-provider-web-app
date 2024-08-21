import { createSlice } from '@reduxjs/toolkit'

const vaccineSlice = createSlice({
  name: 'vaccine',
  initialState: {
    selectedVaccines: [],
    vaccineSchedules: [],
  },
  reducers: {
    setSelectedVaccines(state, action) {
      state.selectedVaccines = action.payload
    },
    setVaccineSchedules(state, action) {
      state.vaccineSchedules = action.payload
    },
  },
})

export const { setSelectedVaccines, setVaccineSchedules } = vaccineSlice.actions

export default vaccineSlice.reducer
