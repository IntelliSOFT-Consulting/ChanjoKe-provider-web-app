import { createBrowserRouter } from 'react-router-dom'
import Root from './Root'
import Login from '../pages/Login'
import Home from '../pages/Home'
import SearchClient from '../pages/SearchClient'
import RegisterClient from '../pages/RegisterClient'
import UpdateClientHistory from '../pages/UpdateClientHistory'
import AdministerVaccine from '../pages/AdministerVaccine'
import AEFI from '../pages/AEFI'
import StockManagement from '../pages/StockManagement'
import DefaulterTracing from '../pages/DefaulterTracing'
import Profile from '../pages/Profile'
import ForgotPassword from '../pages/ForgotPassword'
import ClientDetailsView from '../pages/ClientDetailsView'
import UpdateVaccineHistory from '../components/UpdateClientHistory/UpdateVaccineHistory'
import FAQs from '../pages/FAQs'
import User from '../pages/AdminManagement/User'
import Facility from '../pages/AdminManagement/Facility'
import AddUser from '../pages/AdminManagement/AddUser'
import AddFacility from '../pages/AdminManagement/AddFacility'
import VaccinationReports from '../pages/VaccinationReports'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/search-client', element: <SearchClient /> },
      { path: '/admin-users', element: <User /> },
      { path: '/admin-facilities', element: <Facility /> },
      { path: '/admin-add-user', element: <AddUser /> },
      { path: '/admin-add-facility', element: <AddFacility /> },
      { path: '/register-client', element: <RegisterClient /> },
      { path: '/update-client-history', element: <UpdateClientHistory /> },
      { path: '/administer-vaccine', element: <AdministerVaccine /> },
      { path: '/aefi', element: <AEFI /> },
      { path: '/defaulter-tracing', element: <DefaulterTracing /> },
      { path: '/stock-management', element: <StockManagement /> },
      { path: '/reports', element: <VaccinationReports />},
      { path: '/profile', element: <Profile /> },
      { path: '/client-details', element: <ClientDetailsView /> },
      { path: '/update-vaccine-history', element: <UpdateVaccineHistory /> },
      { path: '/frequently-asked-questions', element: <FAQs /> }
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