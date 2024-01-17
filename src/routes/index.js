import { createBrowserRouter } from 'react-router-dom'
import Root from './Root'
import Login from '../pages/Login'
import Home from '../pages/Home'
import SearchClient from '../pages/SearchClient'
import RegisterClient from '../pages/RegisterClient'
import UpdateClientHistory from '../pages/UpdateClientHistory'
import AdministerVaccine from '../pages/AdministerVaccine'
import AdminMamagement from '../pages/AdminManagement'
import AEFI from '../pages/AEFI'
import StockManagement from '../pages/StockManagement'
import DefaulterTracing from '../pages/DefaulterTracing'
import Profile from '../pages/Profile'
import ForgotPassword from '../pages/ForgotPassword'
import ClientDetailsView from '../pages/ClientDetailsView'
import UpdateVaccineHistory from '../components/UpdateClientHistory/UpdateVaccineHistory'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/search-client',
        element: <SearchClient />
      },
      {
        path: '/admin',
        element: <AdminMamagement />
      },
      {
        path: '/register-client',
        element: <RegisterClient />
      },
      {
        path: '/update-client-history',
        element: <UpdateClientHistory />
      },
      {
        path: '/administer-vaccine',
        element: <AdministerVaccine />
      },
      {
        path: '/aefi',
        element: <AEFI />
      },
      {
        path: '/defaulter-tracing',
        element: <DefaulterTracing />
      },
      {
        path: '/stock-management',
        element: <StockManagement />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/client-details',
        element: <ClientDetailsView />
      },
      {
        path: '/update-vaccine-history',
        element: <UpdateVaccineHistory />
      }
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