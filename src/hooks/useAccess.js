import { useSelector } from 'react-redux'
import { accessRules } from '../data/accessRules'

export const useAccess = () => {
  const { user } = useSelector((state) => state.userInfo)

  const canAccess = (rule) => {
    const { practitionerRole } = user
    const { cannot } = accessRules[practitionerRole]
    return !cannot.includes(rule)
  }

  return { canAccess }
}
