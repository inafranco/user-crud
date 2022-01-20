import React from 'react'
import { Link } from 'react-router-dom'

function LoggedTopbar() {
  return (
    <nav className='Topbar'>
      <ul>
        <h3 className="Title">
          Inã Franco
        </h3>
        <div className='Space'></div>
        <div className="LoginSpace"></div>
        <Link to='/logout' className="LoginButton">
          Sair
        </Link>
        <Link to='/edit' className='IconButton' >{'⚙'}</Link>
      </ul>
    </nav>
  );
}

export default LoggedTopbar