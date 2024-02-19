import { createBrowserRouter, useParams } from 'react-router-dom'
import Root from './Root'
import Login from '../pages/Login'
import Home from '../pages/Home'
import RegisterClient from '../pages/RegisterClient'
import StockManagement from '../pages/StockManagement'
import DefaulterTracing from '../pages/DefaulterTracing'
import Profile from '../pages/Profile'
import ForgotPassword from '../pages/ForgotPassword'
import ClientDetailsView from '../pages/ClientDetailsView'
import UpdateVaccineHistory from '../components/UpdateClientHistory/UpdateVaccineHistory'
import FAQs from '../pages/FAQs'
import User from '../components/AdminManagement/User'
import Facility from '../components/AdminManagement/Facility'
import AddUser from '../components/AdminManagement/AddUser'
import AddFacility from '../components/AdminManagement/AddFacility'
import VaccinationReports from '../pages/VaccinationReports'
import SearchInterface from '../pages/SearchInterface'
import AEFIType from '../components/AEFI/AEFIType'
import AEFIAction from '../components/AEFI/AEFIAction'
import Appointments from '../pages/Appointments'

function SearchInterfaceWrapper() {
  const { searchType } = useParams()

  return <SearchInterface searchType={searchType} />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/search/:searchType', element: <SearchInterfaceWrapper /> },
      { path: '/admin-users', element: <User /> },
      { path: '/admin-facilities', element: <Facility /> },
      { path: '/admin-add-user', element: <AddUser /> },
      { path: '/admin-add-facility', element: <AddFacility /> },
      { path: '/register-client', element: <RegisterClient /> },
      { path: '/defaulter-tracing', element: <DefaulterTracing /> },
      { path: '/stock-management', element: <StockManagement /> },
      { path: '/reports', element: <VaccinationReports />},
      { path: '/profile', element: <Profile /> },
      { path: '/aefi-report', element: <AEFIType /> },
      { path: '/aefi-action', element: <AEFIAction /> },
      { path: '/client-details/:clientID', element: <ClientDetailsView /> },
      { path: '/update-vaccine-history', element: <UpdateVaccineHistory /> },
      { path: '/frequently-asked-questions', element: <FAQs /> },
      { path: '/appointments', element: <Appointments />}
    ]
  },
  {
    path: '/auth',
    element: <Login />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  }
])

export default router