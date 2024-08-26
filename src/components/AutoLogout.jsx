import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/slices/userSlice'

const AUTO_LOGOUT_TIME = 2 * 60 * 60 * 1000

const AutoLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.userInfo)
  const timeoutRef = useRef(null)

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      if (user) {
        dispatch(logout())
        navigate('/auth')
      }
    }, AUTO_LOGOUT_TIME)
  }

  useEffect(() => {
    const events = ['mousedown', 'keypress', 'scroll', 'mousemove']

    const resetTimeoutOnActivity = () => {
      resetTimeout()
    }

    events.forEach((event) => {
      window.addEventListener(event, resetTimeoutOnActivity)
    })

    resetTimeout()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimeoutOnActivity)
      })
    }
  }, [user])

  return null
}

export default AutoLogout
