import MOHLogo from '../assets/moh-logo.png'
import { useNavigate } from 'react-router-dom'
import ProfileDropdown from './ProfileDropdown'
import { Button } from 'antd'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <div className="hidden sm:block bg-[#F9FAFB]">
      <div className="flex flex-wrap bg-[#f9fafb00] items-center gap-6 rounded-lg px-4 sm:flex-nowrap sm:px-6 lg:px-8 shadow py-4">
        <img className="h-12" src={MOHLogo} alt="Ministry of Health" />
        <Button
          onClick={() => navigate('/frequently-asked-questions')}
          type="primary"
          className='ml-auto'
        >
          FAQ's
        </Button>

        <ProfileDropdown />
      </div>
    </div>
  )
}
