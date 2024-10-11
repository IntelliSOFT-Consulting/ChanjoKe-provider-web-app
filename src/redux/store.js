import { configureStore } from '@reduxjs/toolkit'
import patientReducer from './slices/patientSlice'
import userReducer from './slices/userSlice'
import vaccinesReducer from './slices/vaccineSlice'
import newOrderReducer from './slices/stockSlice'

const reducer = {
  currentPatient: patientReducer,
  userInfo: userReducer,
  vaccineSchedules: vaccinesReducer,
  newOrder: newOrderReducer,
}

export default configureStore({
  reducer,
})
