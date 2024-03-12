import { configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import {setCurrentPatientReducer} from './reducers/patientReducer'


const reducer = {
  currentPatient: setCurrentPatientReducer
}

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})
export default store
