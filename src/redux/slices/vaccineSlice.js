import { createSlice } from '@reduxjs/toolkit'

const vaccineSlice = createSlice({
  name: 'vaccine',
  initialState: {
    selectedVaccines: [],
    vaccineSchedules: [],
    vaccineLevels: {},
    vaccineAccess: {},
  },
  reducers: {
    setSelectedVaccines(state, action) {
      state.selectedVaccines = action.payload
    },
    setVaccineSchedules(state, action) {
      state.vaccineSchedules = action.payload
    },
    setVaccineLevels(state, action) {
      state.vaccineLevels = action.payload
    },
    setVaccineAccess(state, action) {
      state.vaccineAccess = action.payload
    },
  },
})

export const {
  setSelectedVaccines,
  setVaccineSchedules,
  setVaccineLevels,
  setVaccineAccess,
} = vaccineSlice.actions

export default vaccineSlice.reducer
