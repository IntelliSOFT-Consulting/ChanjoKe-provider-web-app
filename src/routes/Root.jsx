import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidenav from '../components/Sidenav'
import { SharedStateProvider } from '../shared/sharedState'
import { useSelector } from 'react-redux'
import AutoLogout from '../components/AutoLogout'
import { useStockCheck } from '../hooks/useStockCheck'
import { Alert } from 'antd'

export default function Root() {
  const { user } = useSelector((state) => state.userInfo)

  const navigate = useNavigate()
  const { belowMinimumStock, aboveMaximumStock } = useStockCheck()

  useEffect(() => {
    if (!user?.access_token) {
      navigate('/auth')
    }
  }, [user, navigate])

  const showAlert = () => {
    if (belowMinimumStock?.length > 0) {
      return (
        <Alert
          description={`${belowMinimumStock} below minimum stock. Please order more.`}
          banner
          className="py-2 text-sm"
        />
      )
    }
    if (aboveMaximumStock?.length > 0) {
      return (
        <Alert
          description={`${aboveMaximumStock} above maximum stock. `}
          banner
          className="py-2 text-sm"
        />
      )
    }
  }

  return (
    <SharedStateProvider>
      {user?.access_token && (
        <div>
          <AutoLogout />
          <Sidenav />
          <main className=" lg:pl-72">
            {showAlert()}
            <div className="px-4 mt-2 sm:px-6 lg:px-8">
              <Navbar />

              <Outlet />
            </div>
          </main>
        </div>
      )}
    </SharedStateProvider>
  )
}
