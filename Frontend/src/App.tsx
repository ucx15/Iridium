import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthPage from './pages/Auth/auth';
import HomePage from './pages/Home/home';
import UserPage from './pages/User/user';
import NotFoundPage from './pages/NotFound/notFound';

// Styles
import './App.css'


function App() {

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='auth' element={<AuthPage />} />
          <Route path='/u/:userID' element={<UserPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
