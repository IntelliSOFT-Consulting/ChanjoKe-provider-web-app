import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidenav from '../components/Sidenav'

export default function Root() {
  return (
    <>
      <div>
        <Sidenav />

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">

            <Navbar />

            <Outlet />
          </div>
        </main>
      </div>
    </>
  )
}
