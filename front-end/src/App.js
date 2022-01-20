import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import NotLoggedTopbar from './components/NotLoggedTopbar';
import LoggedTopbar from './components/LoggedTopbar';
import Home from './components/Home';
import UserHome from './components/UserHome';
import EditUser from './components/EditUser';
import Login from './components/Login';
import Logout from './components/Logout';

function App() {
  const [user, setUser] = useState({})

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<NotLoggedTopbar />} />
          <Route exact path="/login" element={<NotLoggedTopbar />} />
          <Route exact path="/signup" element={<NotLoggedTopbar />} />
          <Route exact path="/user" element={<LoggedTopbar />} />
          <Route exact path="/edit" element={<LoggedTopbar />} />
          <Route exact path="/logout" element={<LoggedTopbar />} />
        </Routes>
        <main>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/user" element={
              <UserHome
                setUser={setUser}
              />
            } />
            <Route exact path="/login" element={
              <Login />
            } />
            <Route exact path="/logout" element={
              <Logout
                setUser={setUser}
              />
            } />
            <Route exact path="/edit" element={
              <EditUser
                method='PUT'
                user={user}
                title='Editar Dados Pessoais'
                submitLabel='Salvar'
              />
            } />
            <Route exact path="/signup" element={
              <EditUser
                method='POST'
                title='Cadastro'
                submitLabel='Se Cadastrar'
              />
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
