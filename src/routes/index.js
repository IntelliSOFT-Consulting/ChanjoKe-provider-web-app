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
import RoleBasedRoute from '../components/RoleBasedRoute'
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
import Wastage from '../components/StockManagement/Wastage'
import NewOrder from '../components/StockManagement/NewOrder'
import ReceivedOrders from '../components/StockManagement/ReceivedOrders'
import SentOrders from '../components/StockManagement/SentOrders'
import Administration from '../components/StockManagement/Administration'
import Ledger from '../components/StockManagement/Ledger'
import BatchSummary from '../components/StockManagement/BatchSummary'
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
import MOH710 from '../pages/MOH710'
import MOH525 from '../pages/MOH525'
import ReceiveRegionalStock from '../components/StockManagement/ReceiveRegionalStock'
import Error404 from '../common/Error404'

function SearchInterfaceWrapper() {
  const { searchType } = useParams()

  return <SearchInterface searchType={searchType} />
}

const AuthRoute = ({ element }) => {
  const { user } = useSelector((state) => state.userInfo)

  const authRoutes = ['/auth', '/forgot-password']

  const location = useLocation()

  return user?.access_token && authRoutes.includes(location.pathname) ? (
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
        element: (
          <RoleBasedRoute
            element={<SearchInterfaceWrapper />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/admin-users',
        element: (
          <RoleBasedRoute
            element={<Users />}
            allowedRoles={[
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
              'COUNTY_SYSTEM_ADMINISTRATOR',
              'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
              'FACILITY_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/admin-facilities',
        element: (
          <RoleBasedRoute
            element={<Facility />}
            allowedRoles={[
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
              'COUNTY_SYSTEM_ADMINISTRATOR',
              'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/admin-add-user',
        element: (
          <RoleBasedRoute
            element={<AddUser />}
            allowedRoles={[
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
              'COUNTY_SYSTEM_ADMINISTRATOR',
              'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
              'FACILITY_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/admin-add-facility',
        element: (
          <RoleBasedRoute
            element={<AddFacility />}
            allowedRoles={[
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
              'COUNTY_SYSTEM_ADMINISTRATOR',
              'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/register-client/:clientID',
        element: (
          <RoleBasedRoute
            element={<RegisterClient />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/register-client',
        element: (
          <RoleBasedRoute
            element={<RegisterClient />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/defaulter-tracing',
        element: (
          <RoleBasedRoute
            element={<DefaulterTracing />}
            allowedRoles={[
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/stock-management',
        children: [
          {
            path: '/stock-management',
            element: (
              <RoleBasedRoute
                element={<StockManagement />}
                allowedRoles={[
                  'ADMINISTRATOR',
                  'NATIONAL_SYSTEM_ADMINISTRATOR',
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                  'ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/receive-stock',
            element: (
              <RoleBasedRoute
                element={<ReceiveStock status={'receive'} />}
                allowedRoles={[
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/receive-stock/:orderID',
            element: (
              <RoleBasedRoute
                element={<ReceiveStock status={'receive'} />}
                allowedRoles={[
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/receive-regional-stock',
            element: (
              <RoleBasedRoute
                element={<ReceiveRegionalStock status={'receive'} />}
                allowedRoles={['SUB_COUNTY_STORE_MANAGER']}
              />
            ),
          },
          {
            path: '/stock-management/issue-stock',
            element: (
              <RoleBasedRoute
                element={<IssueStock status={'issue'} />}
                allowedRoles={[
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/stock-count',
            element: (
              <RoleBasedRoute
                element={<StockCount />}
                allowedRoles={[
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/positive-adjustment',
            element: (
              <RoleBasedRoute
                element={<PositiveAdjustments />}
                allowedRoles={[
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/negative-adjustment',
            element: (
              <RoleBasedRoute
                element={<NegativeAdjustments />}
                allowedRoles={[
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/wastage',
            element: (
              <RoleBasedRoute
                element={<Wastage />}
                allowedRoles={[
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/new-order',
            element: (
              <RoleBasedRoute
                element={<NewOrder />}
                allowedRoles={[
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/received-orders',
            element: (
              <RoleBasedRoute
                element={<ReceivedOrders />}
                allowedRoles={[
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/sent-orders',
            element: (
              <RoleBasedRoute
                element={<SentOrders />}
                allowedRoles={[
                  'ADMINISTRATOR',
                  'NATIONAL_SYSTEM_ADMINISTRATOR',
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/administration',
            element: (
              <RoleBasedRoute
                element={<Administration />}
                allowedRoles={[
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                  'ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/ledger',
            element: (
              <RoleBasedRoute
                element={<Ledger />}
                allowedRoles={[
                  'ADMINISTRATOR',
                  'NATIONAL_SYSTEM_ADMINISTRATOR',
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/ledger/:vaccine',
            element: (
              <RoleBasedRoute
                element={<BatchSummary />}
                allowedRoles={[
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                  'ADMINISTRATOR',
                  'NATIONAL_SYSTEM_ADMINISTRATOR',
                ]}
              />
            ),
          },
          {
            path: '/stock-management/order-details/:orderID',
            element: (
              <RoleBasedRoute
                element={<OrderDetails />}
                allowedRoles={[
                  'SUB_COUNTY_STORE_MANAGER',
                  'FACILITY_STORE_MANAGER',
                  'FACILITY_SYSTEM_ADMINISTRATOR',
                ]}
              />
            ),
          },
        ],
      },
      {
        path: '/reports',
        element: (
          <RoleBasedRoute
            element={<VaccinationReports />}
            allowedRoles={['ALL']}
          />
        ),
      },
      {
        path: '/reports/moh-710',
        element: <RoleBasedRoute element={<MOH710 />} allowedRoles={['ALL']} />,
      },
      {
        path: '/reports/moh-525',
        element: <RoleBasedRoute element={<MOH525 />} allowedRoles={['ALL']} />,
      },
      {
        path: '/profile',
        element: (
          <RoleBasedRoute element={<Profile />} allowedRoles={['ALL']} />
        ),
      },
      {
        path: '/aefi-report/:clientID',
        element: (
          <RoleBasedRoute
            element={<CreateAEFI />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/aefi-details/:vaccinationID',
        element: (
          <RoleBasedRoute
            element={<AEFIDetails />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/client-details/:clientID/:activeTab',
        element: (
          <RoleBasedRoute
            element={<ClientDetailsView />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/client-records/:clientID',
        element: (
          <RoleBasedRoute
            element={<ClientRecords />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/update-vaccine-history/:clientID',
        element: (
          <RoleBasedRoute
            element={<UpdateVaccineHistory />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/update-client-history/:clientID',
        element: (
          <RoleBasedRoute
            element={<UpdateClientHistory />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/administer-vaccine/:clientID',
        element: (
          <RoleBasedRoute
            element={<Administer />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'CLERK',
            ]}
          />
        ),
      },
      {
        path: '/add-contraindication/:clientID',
        element: (
          <RoleBasedRoute
            element={<Contraindications />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'CLERK',
            ]}
          />
        ),
      },
      {
        path: '/not-administered/:clientID',
        element: (
          <RoleBasedRoute
            element={<NotAdministered />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'CLERK',
            ]}
          />
        ),
      },
      {
        path: '/view-vaccination/:vaccinationID',
        element: (
          <RoleBasedRoute
            element={<VaccinationDetails />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/new-appointment/:userID',
        element: (
          <RoleBasedRoute
            element={<NewAppointment />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'ADMINISTRATOR',
              'FACILITY_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/edit-appointment/:appointmentID/:userID',
        element: (
          <RoleBasedRoute
            element={<EditAppointment />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/view-contraindication/:contraindicationID',
        element: (
          <RoleBasedRoute
            element={<ContraindicationDetails />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/view-not-administered/:contraindicationID',
        element: (
          <RoleBasedRoute
            element={<ContraindicationDetails notAdministered={true} />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/frequently-asked-questions',
        element: <RoleBasedRoute element={<FAQs />} allowedRoles={['ALL']} />,
      },
      {
        path: '/referral-details/:id',
        element: (
          <RoleBasedRoute
            element={<ReferralDetails />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/referrals',
        element: (
          <RoleBasedRoute
            element={<Referrals />}
            allowedRoles={[
              'NURSE',
              'DOCTOR',
              'CLERK',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
            ]}
          />
        ),
      },
      {
        path: '/campaigns',
        element: (
          <RoleBasedRoute
            element={<Campaigns />}
            allowedRoles={[
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
              'COUNTY_SYSTEM_ADMINISTRATOR',
              'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'NURSE',
              'DOCTOR',
            ]}
          />
        ),
      },
      {
        path: '/new-campaign/:campaignID',
        element: (
          <RoleBasedRoute
            element={<NewCampaign />}
            allowedRoles={['COUNTY_SYSTEM_ADMINISTRATOR']}
          />
        ),
      },
      {
        path: '/campaign-site/:campaignID',
        element: (
          <RoleBasedRoute
            element={<CampaignSite />}
            allowedRoles={[
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
              'COUNTY_SYSTEM_ADMINISTRATOR',
              'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'NURSE',
              'DOCTOR',
            ]}
          />
        ),
      },
      {
        path: '/campaign/:campaignID',
        element: (
          <RoleBasedRoute
            element={<CampaignDetails />}
            allowedRoles={[
              'ADMINISTRATOR',
              'NATIONAL_SYSTEM_ADMINISTRATOR',
              'COUNTY_SYSTEM_ADMINISTRATOR',
              'SUB_COUNTY_SYSTEM_ADMINISTRATOR',
              'FACILITY_SYSTEM_ADMINISTRATOR',
              'NURSE',
              'DOCTOR',
            ]}
          />
        ),
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
  {
    path: '*',
    element: <Error404 />,
  },
])

export default router
