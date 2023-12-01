import { createBrowserRouter } from 'react-router-dom'
import Root from './Root'
import Login from '../pages/Login'
import Home from '../pages/Home'
import SearchClient from '../pages/SearchClient'

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
      }
    ]
  },
  {
    path: '/auth',
    element: <Login />
  }
])

export default router