import { createBrowserRouter } from 'react-router-dom'
import Root from './Root'
import Login from '../pages/Login'
import Home from '../pages/Home'
import SearchClient from '../pages/SearchClient'
import RegisterClient from '../pages/RegisterClient'
import UpdateClientHistory from '../pages/UpdateClientHistory'
import AdministerVaccine from '../pages/AdministerVaccine'
import AEFI from '../pages/AEFI'

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
      }
    ]
  },
  {
    path: '/auth',
    element: <Login />
  }
])

export default router