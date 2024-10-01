import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { useSelector } from 'react-redux'

export default function Error404() {
  const navigate = useNavigate()

  return (
    <div className="error404">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Button onClick={() => navigate('/')}>Go back</Button>
    </div>
  )
}
