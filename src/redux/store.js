import { configureStore } from '@reduxjs/toolkit'
import patientReducer from './slices/patientSlice'
import userReducer from './slices/userSlice'
import vaccinesReducer from './slices/vaccineSlice'

const reducer = {
  currentPatient: patientReducer,
  userInfo: userReducer,
  vaccineSchedules: vaccinesReducer,
}

export default configureStore({
  reducer,
})
