import React, { useEffect, useRef } from 'react'
import { embedDashboard } from '@superset-ui/embedded-sdk'
import { useApiRequest } from '../api/useApiRequest'

const id = process.env.REACT_APP_DASHBOARD_ID
const domain = process.env.REACT_APP_SUPERSET_DOMAIN

console.log({id, domain})

const SupersetDashboard = () => {
  const dashboardRef = useRef(null)
  const { get } = useApiRequest()

  useEffect(() => {
    const embedDashboardFunc = async () => {
      try {
        const data = await get('/auth/provider/superset-token')
        const token = data?.token
        await embedDashboard({
          id,
          supersetDomain: domain,
          mountPoint: dashboardRef.current,
          fetchGuestToken: () => token,
          dashboardUiConfig: {
            hideTitle: true,
            hideChartControls: true,
          },
        })

        console.log('Dashboard embedded successfully')
      } catch (error) {
        console.error('Error embedding dashboard:', error)
      }
    }

    embedDashboardFunc()
  }, [])

  return (
    <div
      ref={dashboardRef}
      className="mt-4"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}

export default SupersetDashboard
