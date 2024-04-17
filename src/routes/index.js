import {
  createBrowserRouter,
  useParams,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { useSelector } from 'react-redux'
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
import CreateAEFI from '../components/AEFI/CreateAEFI'
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
import ReferralDetails from '../pages/ReferralDetails'
import NewAppointment from '../components/ClientDetailsView/NewAppointment'

function SearchInterfaceWrapper() {
  const { searchType } = useParams()

  return <SearchInterface searchType={searchType} />
}


const AuthRoute = ({ element }) => {
  const { user } = useSelector((state) => state.userInfo)

  const authRoutes = ['/auth', '/forgot-password']

  const location = useLocation()

  return user && authRoutes.includes(location.pathname) ? (
    <Navigate to="/" />
  ) : (
    element
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/search/:searchType',
        element: <SearchInterfaceWrapper />,
      },
      { path: '/admin-users', element: <User /> },
      {
        path: '/admin-facilities',
        element: <Facility />,
      },
      {
        path: '/admin-add-user',
        element: <AddUser />,
      },
      {
        path: '/admin-add-facility',
        element: <AddFacility />,
      },
      {
        path: '/register-client/:clientID',
        element: <RegisterClient />,
      },
      {
        path: '/defaulter-tracing',
        element: <DefaulterTracing />,
      },
      {
        path: '/stock-management',
        children: [
          { path: '/stock-management', element: <StockManagement /> },
          {
            path: '/stock-management/receive-stock',
            element: <ReceiveStock status={'receive'} />,
          },
          {
            path: '/stock-management/issue-stock',
            element: <IssueStock status={'issue'} />,
          },
          { path: '/stock-management/stock-count', element: <StockCount /> },
          {
            path: '/stock-management/positive-adjustment',
            element: <Adjustments polarity={'positive'} />,
          },
          {
            path: '/stock-management/negative-adjustment',
            element: <Adjustments polarity={'negative'} />,
          },
          {
            path: '/stock-management/vvm-status',
            element: <VVMStatusChange />,
          },
          { path: '/stock-management/new-order', element: <NewOrder /> },
          {
            path: '/stock-management/received-orders',
            element: <ReceivedOrders />,
          },
          { path: '/stock-management/sent-orders', element: <SentOrders /> },
          { path: '/stock-management/ledger', element: <Ledger /> },
        ],
      },
      {
        path: '/reports',
        element: <VaccinationReports />,
      },
      { path: '/profile', element: <Profile /> },
      {
        path: '/aefi-report',
        element: <CreateAEFI />,
      },
      {
        path: '/client-details/:clientID',
        element: <ClientDetailsView />,
      },
      {
        path: '/client-records/:clientID',
        element: <ClientRecords />,
      },
      {
        path: '/update-vaccine-history',
        element: <UpdateVaccineHistory />,
      },
      {
        path: '/update-client-history/:clientID',
        element: <UpdateClientHistory />,
      },
      {
        path: '/administer-vaccine',
        element: <BatchNumbers />,
      },
      {
        path: '/add-contraindication',
        element: <Contraindications />,
      },
      {
        path: '/not-administered',
        element: <NotAdministered />,
      },
      {
        path: '/view-vaccination/:vaccinationID',
        element: <VaccinationDetails />,
      },
      {
        path: '/new-appointment/:userID',
        element: <NewAppointment />,
      },
      {
        path: '/view-contraindication/:contraindicationID',
        element: <ContraindicationDetails />,
      },
      {
        path: '/frequently-asked-questions',
        element: <FAQs />,
      },
      {
        path: '/referral-details',
        element: <ReferralDetails />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthRoute element={<Login />} />,
  },
  {
    path: '/forgot-password',
    element: <AuthRoute element={<ForgotPassword />} />,
  },
])

export default router
