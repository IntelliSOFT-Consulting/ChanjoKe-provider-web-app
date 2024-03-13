import { configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import {setCurrentPatientReducer} from './reducers/patientReducer'
import { setAEFIVaccinesReducer } from './reducers/vaccineReducers'


const reducer = {
  currentPatient: setCurrentPatientReducer,
  AEFIVaccines: setAEFIVaccinesReducer,
}

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})
export default store
