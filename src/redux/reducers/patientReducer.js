import { SET_CURRENT_PATIENT } from '../constants/patientConstants'

export const setCurrentPatientReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_CURRENT_PATIENT:
      return action.payload
    default:
      return state
  }
}
