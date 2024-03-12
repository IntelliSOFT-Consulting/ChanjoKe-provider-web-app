import { SET_CURRENT_PATIENT } from '../constants/patientConstants'

export const setCurrentPatient = (patient) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_PATIENT,
    payload: patient,
  })
}
