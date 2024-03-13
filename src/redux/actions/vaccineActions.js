import { SET_AEFI_VACCINES } from '../constants/vaccineConstants'

export const setAEFIVaccines = (vaccines) => (dispatch) => {
  dispatch({
    type: SET_AEFI_VACCINES,
    payload: vaccines,
  })
}
