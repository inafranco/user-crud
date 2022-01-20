import React from 'react'
import { Link } from 'react-router-dom'

function NotLoggedTopbar() {
  return (
    <nav className='Topbar'>
      <ul>
        <h3 className="Title">
          Inã Franco
        </h3>
        <div className='Space'></div>
        <Link to='/signup' className="LoginButton">
          Cadastre-se
        </Link>
        <Link to='/login' className="LoginButton">
          Entrar
        </Link>
        <div className='IconSpace'>
        </div>
      </ul>
    </nav>
  );
}

export default NotLoggedTopbar