import { SET_SELECTED_VACCINES } from '../constants/vaccineConstants'

export const setSelectedVaccines = (vaccines) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_VACCINES,
    payload: vaccines,
  })
}
