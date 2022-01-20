import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)

  const submit = async (e) => {
    e.preventDefault()

    await fetch(
      'http://localhost:8000/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `username=${email}&password=${password}`
    }).then((response) => {
      return response.json()
    })

    setRedirect(true)
  }

  if (redirect) {
    return <Navigate replace to='/user' />
  }
  return (
    <div className='Card'>
      <h3>Entrar</h3>
      <form>
        <ul>
          <li className='FormItem'>
            <label>Email, CPF ou PIS:</label>
            <input placeholder='Email, CPF ou PIS' onChange={(e) => { setEmail(e.target.value) }} />
          </li>
          <li className='FormItem'>
            <label>Senha:</label>
            <input type='password' placeholder='senha' onChange={(e) => { setPassword(e.target.value) }} />
          </li>
        </ul>
      </form>
      <button className='SubmitButton' onClick={(e) => submit(e)}>
        Entrar
      </button>
    </div>
  );
}

export default Login