import React from 'react'
import { Card } from 'antd'
import AefiIcon from '../assets/aefi.svg'
import AppointmentIcon from '../assets/appointments.svg'
import ReferralIcon from '../assets/note-add.svg'
import AdministerVaccineIcon from '../assets/post-treatment.svg'
import RegisterClientIcon from '../assets/register-client.svg'
import SearchIcon from '../assets/search.svg'
import StockManagementIcon from '../assets/stock-management.svg'
import UpdateClientHistoryIcon from '../assets/update-client-history.svg'
import UsersIcon from '../assets/users.png'

const Icons = {
  AefiIcon,
  AppointmentIcon,
  ReferralIcon,
  AdministerVaccineIcon,
  RegisterClientIcon,
  SearchIcon,
  StockManagementIcon,
  UpdateClientHistoryIcon,
  UsersIcon,
}

const StatCard = ({ name, stat, icon }) => {
  return (
    <Card>
      <div className="grid grid-cols-[1fr_2fr] h-full">
        <div className="flex justify-center items-center h-full">
          <img
            src={Icons[icon]}
            alt={icon}
            className="h-16 w-16 text-blue-500"
          />
        </div>

        <div className="flex flex-col justify-center items-center h-full w-full">
          <h3 className="text-xl font-bold mb-4 text-center">{name}</h3>

          <div className="text-5xl font-bold text-blue-900">{stat}</div>
        </div>
      </div>
    </Card>
  )
}

export default StatCard
