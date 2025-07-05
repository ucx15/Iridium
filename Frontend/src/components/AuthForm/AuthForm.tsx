import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import './authForm.css'; // Regular CSS (or use modules)

import BACKEND_URI from '../../config';

// utils
import * as LS from '../../utils/LocalStorage.js';

interface AuthResponse {
  message: string;
  status: 'success' | 'error';

  accessToken?: string | undefined;
  refreshToken?: string | undefined;
}


const AuthForm = () => {
  const navigate = useNavigate();
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // get form data

    const submitData = {
      username: '',
      email: '',
      name: '',
      password: '',
      cnfPassword: ''
    };

    const username: string = (document.getElementById('input-username') as HTMLInputElement).value.trim().toLowerCase();
    const password: string = (document.getElementById('input-password') as HTMLInputElement).value.trim();

    submitData['username'] = username;
    submitData['password'] = password;

    if (authType === 'signup') {
      const email: string = (document.getElementById('input-email') as HTMLInputElement).value.trim().toLowerCase();
      const name: string = (document.getElementById('input-name') as HTMLInputElement).value.trim();
      const cnfPassword: string = (document.getElementById('input-cnf-password') as HTMLInputElement).value.trim();

      submitData['email'] = email;
      submitData['name'] = name;
      submitData['cnfPassword'] = cnfPassword;
    }


    fetch(`${BACKEND_URI}/${authType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submitData)
    })
      .then(res => res.json() as Promise<AuthResponse>)
      .then(data => {
        console.log(data);

        if (
          data.status !== 'success' ||
          !(data.accessToken) ||
          !(data.refreshToken)
        ) {
          alert(data.message);
          return;
        }

        LS.setUsername(username);
        LS.setAccessToken(data.accessToken);
        LS.setRefreshToken(data.refreshToken);

        navigate('/');

      })
      .catch(err => {
        console.error(err);
      });
  }

  return (

    <form className='auth-form' onSubmit={handleSubmit}>
      <h2>{authType === 'login' ? 'Login' : 'Sign Up'}</h2>

      <input type="text" id='input-username' placeholder="Username" required />

      {authType === 'signup' && (
        <input type="email" id='input-email' placeholder="Email" required />
      )}

      {authType === 'signup' && (
        <input type="text" id='input-name' placeholder="Name" required />
      )}

      <input type="password" id='input-password' placeholder="Password" required />

      {authType === 'signup' && (
        <input type="password" id='input-cnf-password' placeholder="Confirm Password" required />
      )}

      <button className='btn-submit' type="submit">
        {authType === 'login' ? 'Login' : 'Sign Up'}
      </button>

      <footer>
        {authType === 'login' ? "Don't have an Account? " : "Already have an Account? "}
        <button className='btn-switch' onClick={() => setAuthType(authType === 'login' ? 'signup' : 'login')}>
          {authType === 'login' ? 'Sign Up' : 'Login'}
        </button>
      </footer>

    </form>

  );
};

export default AuthForm;
