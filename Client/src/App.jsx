import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Profile from './components/Profile.jsx'
import Home from './components/Home.jsx'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default App