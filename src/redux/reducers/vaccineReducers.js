import { SET_AEFI_VACCINES } from '../constants/vaccineConstants'

export const setAEFIVaccinesReducer = (state = null, action) => {
  switch (action.type) {
    case SET_AEFI_VACCINES:
      return action.payload
    default:
      return state
  }
}
