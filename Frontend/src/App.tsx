
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useState } from 'react'

import './App.css'

import Auth from './pages/Auth/auth';
import Home from './pages/Home/home';
import NotFound from './pages/NotFound/notFound';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='auth' element={<Auth/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}

export default App
