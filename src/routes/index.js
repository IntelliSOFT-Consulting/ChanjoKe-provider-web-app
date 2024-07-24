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
import Users from '../components/AdminManagement/Users'
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
import PositiveAdjustments from '../components/StockManagement/PositiveAdjustments'
import NegativeAdjustments from '../components/StockManagement/NegativeAdjustments'
import VVMStatusChange from '../components/StockManagement/VVMStatusChange'
import NewOrder from '../components/StockManagement/NewOrder'
import ReceivedOrders from '../components/StockManagement/ReceivedOrders'
import SentOrders from '../components/StockManagement/SentOrders'
import Administration from '../components/StockManagement/Administration'
import Ledger from '../components/StockManagement/Ledger'
import UpdateClientHistory from '../components/UpdateClientHistory/updateClientHistory'
import Administer from '../components/AdministerVaccines/Administer'
import Contraindications from '../components/AdministerVaccines/Contraindications'
import NotAdministered from '../components/AdministerVaccines/NotAdministered'
import VaccinationDetails from '../pages/VaccinationDetails'
import ContraindicationDetails from '../pages/ContraindicationDetails'
import ReferralDetails from '../pages/ReferralDetails'
import NewAppointment from '../components/ClientDetailsView/NewAppointment'
import AEFIDetails from '../components/AEFI/AEFIDetails'
import Referrals from '../pages/Referrals'
import Campaigns from '../pages/Campaigns'
import NewCampaign from '../components/Campaigns/NewCampaign'
import CampaignDetails from '../components/Campaigns/CampaignDetails'
import CampaignSite from '../components/Campaigns/CampaignSite'
import EditAppointment from '../components/ClientDetailsView/EditAppointment'
import OrderDetails from '../components/StockManagement/OrderDetails'

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
        path: '/search/:searchType/:campaignSite',
        element: <SearchInterfaceWrapper />,
      },
      { path: '/admin-users', element: <Users /> },
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
        path: '/register-client',
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
            path: '/stock-management/receive-stock/:orderID',
            element: <ReceiveStock status={'receive'} />,
          },
          {
            path: '/stock-management/issue-stock',
            element: <IssueStock status={'issue'} />,
          },
          { path: '/stock-management/stock-count', element: <StockCount /> },
          {
            path: '/stock-management/positive-adjustment',
            element: <PositiveAdjustments />,
          },
          {
            path: '/stock-management/negative-adjustment',
            element: <NegativeAdjustments />,
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
          {
            path: '/stock-management/administration',
            element: <Administration />,
          },
          { 
            path: '/stock-management/ledger', 
            element: <Ledger /> 
          },
          {
            path: '/stock-management/order-details/:orderID',
            element: <OrderDetails />,
          }
        ],
      },
      {
        path: '/reports',
        element: <VaccinationReports />,
      },
      { path: '/profile', element: <Profile /> },
      {
        path: '/aefi-report/:clientID',
        element: <CreateAEFI />,
      },
      {
        path: '/aefi-details/:vaccinationID',
        element: <AEFIDetails />,
      },
      {
        path: '/client-details/:clientID/:activeTab',
        element: <ClientDetailsView />,
      },
      {
        path: '/client-records/:clientID',
        element: <ClientRecords />,
      },
      {
        path: '/update-vaccine-history/:clientID',
        element: <UpdateVaccineHistory />,
      },
      {
        path: '/update-client-history/:clientID',
        element: <UpdateClientHistory />,
      },
      {
        path: '/administer-vaccine/:clientID',
        element: <Administer />,
      },
      {
        path: '/add-contraindication/:clientID',
        element: <Contraindications />,
      },
      {
        path: '/not-administered/:clientID',
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
        path: '/edit-appointment/:appointmentID/:userID',
        element: <EditAppointment />
      },
      {
        path: '/view-contraindication/:contraindicationID',
        element: <ContraindicationDetails />,
      },
      {
        path: '/view-not-administered/:contraindicationID',
        element: <ContraindicationDetails notAdministered={true} />,
      },
      {
        path: '/frequently-asked-questions',
        element: <FAQs />,
      },
      {
        path: '/referral-details/:id',
        element: <ReferralDetails />,
      },
      {
        path: '/referrals',
        element: <Referrals />,
      },
      {
        path: '/campaigns',
        element: <Campaigns />,
      },
      {
        path: '/new-campaign/:campaignID',
        element: <NewCampaign />,
      },
      {
        path: '/campaign-site/:campaignID',
        element: <CampaignSite />,
      },
      {
        path: '/campaign/:campaignID',
        element: <CampaignDetails />
      }
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
