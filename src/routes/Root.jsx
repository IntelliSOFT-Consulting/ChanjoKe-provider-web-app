import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidenav from '../components/Sidenav'
import { SharedStateProvider } from '../shared/sharedState'
import { useSelector } from 'react-redux'

export default function Root() {
  const { user } = useSelector((state) => state.userInfo)

  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [user, navigate])

  return (
    <SharedStateProvider>
      {user && (
        <div>
          <Sidenav />
          <main className="py-10 lg:pl-72">
            <div className="px-4 sm:px-6 lg:px-8">
              <Navbar />

              <Outlet />
            </div>
          </main>
        </div>
      )}
    </SharedStateProvider>
  )
}
