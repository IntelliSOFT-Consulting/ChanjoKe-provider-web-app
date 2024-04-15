import { configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import { setCurrentPatientReducer } from './reducers/patientReducer'
import { setSelectedVaccinesReducer } from './reducers/vaccineReducers'
import { loginReducer } from './reducers/userReducers'

const practitioner = localStorage.getItem('practitioner')


const initialState = practitioner
  ? { userInfo: { user: JSON.parse(practitioner) } }
  : {}

const reducer = {
  currentPatient: setCurrentPatientReducer,
  selectedVaccines: setSelectedVaccinesReducer,
  userInfo: loginReducer,
}

export const store = configureStore({
  reducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})
export default store
