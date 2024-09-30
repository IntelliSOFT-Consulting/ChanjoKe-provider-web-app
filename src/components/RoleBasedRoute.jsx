import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RoleBasedRoute = ({ allowedRoles, element }) => {
  const { user } = useSelector((state) => state.userInfo)

  if (
    !user ||
    (!allowedRoles.includes(user.practitionerRole) &&
      !allowedRoles.includes('ALL'))
  ) {
    return <Navigate to="/404" />
  }

  return element
}

export default RoleBasedRoute
