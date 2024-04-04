import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT
} from '../constants/userConstants'

export const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_REQUEST:
      return { loading: true }
    case GET_USER_SUCCESS:
      return { loading: false, user: action.payload }
    case GET_USER_FAILURE:
      return { loading: false, error: action.payload }
    case LOGOUT:
      return {}
    default:
      return state
  }
}
