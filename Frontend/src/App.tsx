import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useState } from 'react'

import Auth from './pages/Auth/auth';
import Home from './pages/Home/home';
import NotFound from './pages/NotFound/notFound';

// Styles
import './App.css'


function App() {

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='auth' element={<Auth />} />
          <Route path='/home' element={<Home />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
