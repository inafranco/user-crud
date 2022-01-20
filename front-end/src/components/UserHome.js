import React, { useState, useEffect } from 'react'

function UserHome(props) {
  const [userInfo, setUserInfo] = useState({ address: {}})

  useEffect(() => {
    (async () => {
      const result = await fetch(
        `http://localhost:8000/users/me`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }).then((response) => {
        return response.json()
      })
      setUserInfo(result)
    })()
  }, [])

  if (!userInfo) {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    )
  }
  props.setUser(userInfo)
  return (
    <div className='Card'>
      <h3>{'Olá ' + userInfo.name}</h3>
      <div className='UserFieldsList'>
        <ul>
          <h4>Nome:</h4>
          <p>{userInfo.name}</p>
        </ul>
        <ul>
          <h4>Email:</h4>
          <p>{userInfo.email}</p>
        </ul>
        <ul>
          <h4>CPF:</h4>
          <p>{userInfo.cpf}</p>
        </ul>
        <ul>
          <h4>PIS:</h4>
          <p>{userInfo.pis}</p>
        </ul>
        <ul>
          <h4>País:</h4>
          <p>{userInfo.address.country}</p>
        </ul>
        <ul>
          <h4>Estado:</h4>
          <p>{userInfo.address.state}</p>
        </ul>
        <ul>
          <h4>Cidade:</h4>
          <p>{userInfo.address.city}</p>
        </ul>
        <ul>
          <h4>Rua:</h4>
          <p>{userInfo.address.street}</p>
        </ul>
        <ul>
          <h4>Número:</h4>
          <p>{userInfo.address.number}</p>
        </ul>
        <ul>
          <h4>Complemento:</h4>
          <p>{userInfo.address.complement}</p>
        </ul>
        <ul>
          <h4>CEP:</h4>
          <p>{userInfo.address.cep}</p>
        </ul>
      </div>
    </div>
  );
}

export default UserHome