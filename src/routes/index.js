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
import ClientRecords from '../pages/ClientRecords'
import UpdateClientHistory from '../components/UpdateClientHistory/updateClientHistory'
import BatchNumbers from '../components/AdministerVaccines/BatchNumbers'
import Contraindications from '../components/AdministerVaccines/Contraindications'
import NotAdministered from '../components/AdministerVaccines/NotAdministered'
import { useAuth } from '../AuthContext'
import { Navigate} from 'react-router-dom'

function SearchInterfaceWrapper() {
  const { searchType } = useParams()

  return <SearchInterface searchType={searchType} />
}

const ProtectedRoute = ({ element }) => {
  const { token } = useAuth();

  return token ? element : <Navigate to="/auth" />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <ProtectedRoute element={<Home />} /> },
      { path: '/search/:searchType', element: <ProtectedRoute element={<SearchInterfaceWrapper /> } /> },
      { path: '/admin-users', element: <ProtectedRoute element={<User />} /> },
      { path: '/admin-facilities', element: <ProtectedRoute element={<Facility />} /> },
      { path: '/admin-add-user', element: <ProtectedRoute element={<AddUser />} /> },
      { path: '/admin-add-facility', element: <ProtectedRoute element={<AddFacility />} /> },
      { path: '/register-client', element: <ProtectedRoute element={<RegisterClient />} /> },
      { path: '/defaulter-tracing', element: <ProtectedRoute element={<DefaulterTracing />} /> },
      { path: '/stock-management', element: <ProtectedRoute element={<StockManagement />} /> },
      { path: '/reports', element: <ProtectedRoute element={<VaccinationReports />} />},
      { path: '/profile', element: <ProtectedRoute element={<Profile />} /> },
      { path: '/aefi-report', element: <ProtectedRoute element={<AEFIType />} /> },
      { path: '/aefi-action', element: <ProtectedRoute element={<AEFIAction /> } />},
      { path: '/client-details/:clientID', element: <ProtectedRoute element={<ClientDetailsView />} /> },
      { path: '/client-records/:clientID', element: <ProtectedRoute element={<ClientRecords />} />},
      { path: '/update-vaccine-history', element: <ProtectedRoute element={<UpdateVaccineHistory /> } />},
      { path: '/update-client-history/:clientID', element: <ProtectedRoute element={<UpdateClientHistory />} />},
      { path: '/administer-vaccine', element: <ProtectedRoute element={<BatchNumbers />} />},
      { path: '/add-contraindication', element: <ProtectedRoute element={<Contraindications />} />},
      { path: '/not-administered', element: <ProtectedRoute element={<NotAdministered />} />},
      { path: '/frequently-asked-questions', element: <ProtectedRoute element={<FAQs /> } />},
      { path: '/appointments', element: <ProtectedRoute element={<Appointments />} />}
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