import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

function Logout(props) {
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    (async () => {
      await fetch(
        `http://localhost:8000/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      setRedirect(true)

    })()
  }, [])

  if (!redirect) {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    )
  }
  props.setUser({})
  return (
    <Navigate replace to='/' />
  );
}

export default Logout