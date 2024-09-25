import React, { useEffect, useRef, useCallback } from 'react'
import { embedDashboard } from '@superset-ui/embedded-sdk'
import { useApiRequest } from '../api/useApiRequest'

const DASHBOARD_ID = import.meta.env.VITE_DASHBOARD_ID
const SUPERSET_DOMAIN = import.meta.env.VITE_SUPERSET_DOMAIN

const SupersetDashboard = () => {
  const dashboardRef = useRef(null)
  const { get } = useApiRequest()

  const fetchGuestToken = useCallback(async () => {
    try {
      const { token } = await get('/auth/provider/superset-token')
      return token
    } catch (error) {
      console.error('Error fetching guest token:', error)
      throw error
    }
  }, [get])

  const embedDashboardFunc = useCallback(async () => {
    if (!dashboardRef.current) return

    try {
      await embedDashboard({
        id: DASHBOARD_ID,
        supersetDomain: SUPERSET_DOMAIN,
        mountPoint: dashboardRef.current,
        fetchGuestToken,
        dashboardUiConfig: {
          hideTitle: true,
          hideChartControls: true,
        },
      })
    } catch (error) {
      console.error('Error embedding dashboard:', error)
    }
  }, [fetchGuestToken])

  useEffect(() => {
    embedDashboardFunc()
  }, [embedDashboardFunc])

  return (
    <div ref={dashboardRef} className="mt-4 w-full min-h-screen superset-dashboard" />
  )
}

export default SupersetDashboard
