import {
  SET_SELECTED_VACCINES,
  SET_VACCINE_SCHEDULE,
} from '../constants/vaccineConstants'

export const setSelectedVaccines = (vaccines) => ({
  type: SET_SELECTED_VACCINES,
  payload: vaccines,
})

export const setVaccineSchedules = (schedules) => ({
  type: SET_VACCINE_SCHEDULE,
  payload: schedules,
})
