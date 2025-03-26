// import React from 'react'
import React from 'react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  // redirect to auth page if not logged in
  React.useEffect(() => {
    if (!username) {
      navigate('/auth');
    }
  }
    , [navigate, username]);


  return (
    <>
      <h1>Home</h1>
      <button onClick={() => {
        localStorage.clear();
        navigate('/auth');
      }}
    >Logout</button >
    </>
  )
}

export default Home
