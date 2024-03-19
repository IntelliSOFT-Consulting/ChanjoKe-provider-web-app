import { createBrowserRouter, useParams, Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
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
import ClientRecords from '../pages/ClientRecords'
import Facility from '../components/AdminManagement/Facility'
import AddUser from '../components/AdminManagement/AddUser'
import AddFacility from '../components/AdminManagement/AddFacility'
import VaccinationReports from '../pages/VaccinationReports'
import SearchInterface from '../pages/SearchInterface'
import AEFIType from '../components/AEFI/AEFIType'
import AEFIAction from '../components/AEFI/AEFIAction'
import Appointments from '../pages/Appointments'
import ReceiveStock from '../components/StockManagement/ReceiveStock'
import IssueStock from '../components/StockManagement/IssueStock'
import StockCount from '../components/StockManagement/StockCount'
import Adjustments from '../components/StockManagement/Adjustments'
import VVMStatusChange from '../components/StockManagement/VVMStatusChange'
import NewOrder from '../components/StockManagement/NewOrder'
import ReceivedOrders from '../components/StockManagement/ReceivedOrders'
import SentOrders from '../components/StockManagement/SentOrders'
import Ledger from '../components/StockManagement/Ledger'
import UpdateClientHistory from '../components/UpdateClientHistory/updateClientHistory'
import BatchNumbers from '../components/AdministerVaccines/BatchNumbers'
import Contraindications from '../components/AdministerVaccines/Contraindications'
import NotAdministered from '../components/AdministerVaccines/NotAdministered'
import VaccinationDetails from '../pages/VaccinationDetails'
import ContraindicationDetails from '../pages/ContraindicationDetails'

function SearchInterfaceWrapper() {
    const { searchType } = useParams()

    return <SearchInterface searchType={searchType} />
}

function RegisterClientWrapper() {
  const { clientID } = useParams()
  return <RegisterClient editClientID={clientID} />
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
          { path: '/register-client/:clientID', element: <ProtectedRoute element={<RegisterClientWrapper />} /> },
          { path: '/defaulter-tracing', element: <ProtectedRoute element={<DefaulterTracing />} /> },
          {
              path: '/stock-management',
              children: [
                  { path: '/stock-management', element: <StockManagement /> },
                  { path: '/stock-management/receive-stock', element: <ReceiveStock status={'receive'} /> },
                  { path: '/stock-management/issue-stock', element: <IssueStock status={'issue'} /> },
                  { path: '/stock-management/stock-count', element: <StockCount /> },
                  { path: '/stock-management/positive-adjustment', element: <Adjustments polarity={'positive'} /> },
                  { path: '/stock-management/negative-adjustment', element: <Adjustments polarity={'negative'} /> },
                  { path: '/stock-management/vvm-status', element: <VVMStatusChange /> },
                  { path: '/stock-management/new-order', element: <NewOrder /> },
                  { path: '/stock-management/received-orders', element: <ReceivedOrders /> },
                  { path: '/stock-management/sent-orders', element: <SentOrders /> },
                  { path: '/stock-management/ledger', element: <Ledger /> },
              ]
          },
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
          { path: '/view-vaccination/:vaccinationID', element: <ProtectedRoute element={<VaccinationDetails />} /> },
          { path: '/view-contraindication/:contraindicationID', element: <ProtectedRoute element={<ContraindicationDetails />} /> },
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
  ]
)

export default router