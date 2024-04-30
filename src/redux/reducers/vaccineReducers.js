import {
  SET_SELECTED_VACCINES,
  SET_VACCINE_SCHEDULE,
} from '../constants/vaccineConstants'

export const setSelectedVaccinesReducer = (state = null, action) => {
  switch (action.type) {
    case SET_SELECTED_VACCINES:
      return action.payload
    default:
      return state
  }
}

export const setVaccineSchedulesReducer = (state = null, action) => {
  switch (action.type) {
    case SET_VACCINE_SCHEDULE:
      return action.payload
    default:
      return state
  }
}
