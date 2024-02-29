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
import ReceiveStock from '../components/StockManagement/ReceiveStock'
import IssueStock from '../components/StockManagement/IssueStock'
import StockCount from '../components/StockManagement/StockCount'
import Adjustments from '../components/StockManagement/Adjustments'
import VVMStatusChange from '../components/StockManagement/VVMStatusChange'
import NewOrder from '../components/StockManagement/NewOrder'
import ReceivedOrders from '../components/StockManagement/ReceivedOrders'
import SentOrders from '../components/StockManagement/SentOrders'
import Ledger from '../components/StockManagement/Ledger'

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