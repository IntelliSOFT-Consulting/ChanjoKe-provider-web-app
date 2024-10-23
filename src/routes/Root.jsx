import { useEffect } from 'react'
import { useLocation, Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidenav from '../components/Sidenav'
import { SharedStateProvider } from '../shared/sharedState'
import { useSelector } from 'react-redux'
import AutoLogout from '../components/AutoLogout'
import { useStockCheck } from '../hooks/useStockCheck'
import { Alert, Breadcrumb, Button } from 'antd'
import { DoubleLeftOutlined } from '@ant-design/icons'
export default function Root() {
  const { user } = useSelector((state) => state.userInfo)

  const navigate = useNavigate()
  const { belowMinimumStock, aboveMaximumStock } = useStockCheck()

  useEffect(() => {
    if (!user?.access_token) {
      navigate('/user-auth')
    }
  }, [user, navigate])

  const { pathname } = useLocation()

  const isHome = pathname === '/' || pathname === '/dashboard'

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
              {!isHome && (
                <div className="flex items-center gap-2 my-2">
                  <Button
                    type="primary"
                    className="text-gray-500 font-semibold bg-gray-100"
                    onClick={() => navigate(-1)}
                    icon={<DoubleLeftOutlined />}
                  >
                    Back
                  </Button>
                </div>
              )}

              <Outlet />
            </div>
          </main>
        </div>
      )}
    </SharedStateProvider>
  )
}
