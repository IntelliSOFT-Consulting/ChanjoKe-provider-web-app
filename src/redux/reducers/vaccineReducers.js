import { SET_SELECTED_VACCINES } from '../constants/vaccineConstants'

export const setSelectedVaccinesReducer = (state = null, action) => {
  switch (action.type) {
    case SET_SELECTED_VACCINES:
      return action.payload
    default:
      return state
  }
}
