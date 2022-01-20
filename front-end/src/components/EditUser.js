import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'

function EditUser(props) {
  let user = { address: {} }
  if (props.method === 'PUT') {
    user = props.user || {}
    user.address = user.address || {}
  }

  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [confirmEmail, setConfirmEmail] = useState(user.email || '')
  const [password, setPassword] = useState(user.password || '')
  const [confirmPassword, setConfirmPassword] = useState(user.password || '')
  const [cpf, setCpf] = useState(user.cpf || '')
  const [pis, setPis] = useState(user.pis || '')
  const [country, setCountry] = useState(user.address.country || '')
  const [state, setState] = useState(user.address.state || '')
  const [city, setCity] = useState(user.address.city || '')
  const [street, setStreet] = useState(user.address.street || '')
  const [number, setNumber] = useState(user.address.number || '')
  const [complement, setComplement] = useState(user.address.complement || '')
  const [cep, setCep] = useState(user.address.cep || '')

  const [redirect, setRedirect] = useState(false)
  const [errors, setErrors] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    email: '',
    confirmEmail: '',
    cpf: '',
    pis: '',
    address: {
      country: '',
      state: '',
      city: '',
      street: '',
      number: '',
      cep: ''
    }
  })

  const isValid = () => {
    let formIsValid = true;
    const errorsFound = {
      name: '',
      password: '',
      confirmPassword: '',
      email: '',
      confirmEmail: '',
      cpf: '',
      pis: '',
      address: {
        country: '',
        state: '',
        city: '',
        street: '',
        number: '',
        cep: ''
      }
    };

    const emptyFields = []
    const emptyAddressFields = []

    if (!name) { emptyFields.push('name') }
    if (!password) { emptyFields.push('password') }
    if (!confirmPassword) { emptyFields.push('confirmPassword') }
    if (!email) { emptyFields.push('email') }
    if (!confirmEmail) { emptyFields.push('confirmEmail') }
    if (!cpf) { emptyFields.push('cpf') }
    if (!pis) { emptyFields.push('pis') }
    if (!country) { emptyAddressFields.push('country') }
    if (!state) { emptyAddressFields.push('state') }
    if (!city) { emptyAddressFields.push('city') }
    if (!street) { emptyAddressFields.push('street') }
    if (!number) { emptyAddressFields.push('number') }
    if (!cep) { emptyAddressFields.push('cep') }

    for (const field of emptyFields) {
      errorsFound[field] = "Cannot be empty";
    }
    for (const field of emptyAddressFields) {
      errorsFound.address[field] = "Cannot be empty";
    }
    if (emptyFields.length || emptyAddressFields.length) {
      formIsValid = false;
    }

    const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i
    if (emailRegex.test(email)) {
      formIsValid = false;
      errorsFound.email = "Invalid email";
    }

    if (email !== confirmEmail) {
      formIsValid = false;
      errorsFound.confirmEmail = "Different emails";
    }

    if (password !== confirmPassword) {
      formIsValid = false;
      errorsFound.confirmPassword = "Different passwords";
    }

    if (cpf.length !== 11) {
      formIsValid = false;
      errorsFound.cpf = "Invalid CPF";
    }

    if (pis.length !== 11) {
      formIsValid = false;
      errorsFound.pis = "Invalid PIS";
    }

    if (cep.length !== 8) {
      formIsValid = false;
      errorsFound.address.cep = "Invalid CEP";
    }

    setErrors(errorsFound)
    return formIsValid
  }

  const submit = (e) => {
    e.preventDefault()

    if (!isValid()) {
      console.log(errors)
      return
    }
    const user = {
      name,
      password,
      email,
      cpf,
      pis,
      active: true,
      address: {
        country,
        state,
        city,
        street,
        number,
        complement,
        cep
      }
    }

    if (props.method === 'POST') {
      fetch(
        'http://localhost:8000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }).then((response) => {
        return response.json()
      })
    } else {
      fetch(
        `http://localhost:8000/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }).then((response) => {
        return response.json()
      })
    }
    setRedirect(true)
  }

  const deleteUser = async (e) => {
    e.preventDefault()

    await fetch(
      'http://localhost:8000/users/me', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    setRedirect(true)
  }

  if (redirect) {
    if (props.method === 'PUT') {
      return <Navigate replace to='/user' />
    }
    return <Navigate replace to='/login' />
  }

  return (
    <div className='Card'>
      <h3>{props.title}</h3>
      <form>
        <ul>
          <li className='FormItem'>
            <div className='FormItemField'>
              <label>Name:</label>
              <input value={name} placeholder='Name' onChange={(e) => { setName(e.target.value) }} />
            </div>
            <span>{errors.name}</span>
          </li>
          {props.method === 'POST' &&
            <li className='FormItem'>
              <div className='FormItemField'>
                <label>Password:</label>
                <input type='password' placeholder='Password' onChange={(e) => { setPassword(e.target.value) }} />
              </div>
              <span>{errors.password}</span>
            </li>
          }
          {props.method === 'POST' &&
            <li className='FormItem'>
              <div className='FormItemField'>
                <label>Confirm Password:</label>
                <input type='password' placeholder='Password' onChange={(e) => { setConfirmPassword(e.target.value) }} />
              </div>
              <span>{errors.confirmPassword}</span>
            </li>
          }
          <li className='FormItem'>
            <div className='FormItemField'>
              <label>Email:</label>
              <input value={email} type='email' placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} />
            </div>
            <span>{errors.email}</span>
          </li>
          <li className='FormItem'>
            <div className='FormItemField'>
              <label>Confirm Email:</label>
              <input value={confirmEmail} type='email' placeholder='Email' onChange={(e) => { setConfirmEmail(e.target.value) }} />
            </div>
            <span>{errors.confirmEmail}</span>
          </li>
          <li className='FormItem'>
            <div className='FormItemField'>
              <label>CPF (Only numbers):</label>
              <input value={cpf} type='number' placeholder='000.000.000-00' onChange={(e) => { setCpf(String(e.target.value)) }} />
            </div>
            <span>{errors.cpf}</span>
          </li>
          <li className='FormItem'>
            <div className='FormItemField'>
              <label>PIS (Only numbers):</label>
              <input value={pis} type='number' placeholder='000.00000.00-0' onChange={(e) => { setPis(String(e.target.value)) }} />
            </div>
            <span>{errors.pis}</span>
          </li>
        </ul>
        <ul>
          <li className='FormItem'>
            <div className='FormItemField'>
              <label>Country:</label>
              <input value={country} placeholder='Country' onChange={(e) => { setCountry(e.target.value) }} />
            </div>
            <span>{errors.address.country}</span>
          </li>
          <li className='FormItem'>
            <div className='FormItemField'>
              <label>Region/State:</label>
              <input value={state} placeholder='Region/State' onChange={(e) => { setState(e.target.value) }} />
            </div>
            <span>{errors.address.state}</span>
          </li>
          <li className='FormItem'>
            <div className='FormItemField'>
              <label>City:</label>
              <input value={city} placeholder='City' onChange={(e) => { setCity(e.target.value) }} />
            </div>
            <span>{errors.address.city}</span>
          </li>
          <li className='FormItem'>
            <div className='FormItemField'>
              <label>Street:</label>
              <input value={street} placeholder='Street' onChange={(e) => { setStreet(e.target.value) }} />
            </div>
            <span>{errors.address.street}</span>
          </li>
          <li className='FormItem'>
            <div className='FormItemField'>
              <label>Number:</label>
              <input value={number} placeholder='Number' onChange={(e) => { setNumber(e.target.value) }} />
            </div>
            <span>{errors.address.number}</span>
          </li>
          <li className='FormItem'>
            <div className='FormItemField'>
              <label>Complement:</label>
              <input value={complement} placeholder='Complement' onChange={(e) => { setComplement(e.target.value) }} />
            </div>
            <span></span>
          </li>
          <li className='FormItem'>
            <div className='FormItemField'>
              <label>CEP (Only numbers):</label>
              <input value={cep} type='number' placeholder='00000-000' onChange={(e) => { setCep(String(e.target.value)) }} />
            </div>
            <span>{errors.address.cep}</span>
          </li>
        </ul>
      </form>
      <ul className='Buttons'>
        <button className='SubmitButton' type='submit' onClick={(e) => submit(e)}>
          {props.submitLabel}
        </button>
        {props.method === 'PUT' &&
          <button className='DeleteButton' type='submit' onClick={(e) => deleteUser(e)}>
            Delete User
          </button>
        }
      </ul>

    </div>
  );
}

export default EditUser