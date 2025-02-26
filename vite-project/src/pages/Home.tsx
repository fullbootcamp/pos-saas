import React, { useState } from 'react';
import axios from 'axios';

interface ApiResponse {
  message: string;
  token?: string;
}

const Home: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(true); // Toggle between register/login
  const [message, setMessage] = useState('');
  const [showResendEmail, setShowResendEmail] = useState(false); // Control visibility of resend email UI

  // Handle registration
  const handleRegister = async () => {
    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/register', {
        name,
        email,
        password,
      });
      setMessage(response.data.message);
      setShowResendEmail(true); // Show resend email UI after successful registration
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Registration failed');
      } else {
        setMessage('An unexpected error occurred');
      }
      setShowResendEmail(false); // Hide resend email UI if registration fails
    }
  };

  // Handle login
  const handleLogin = async () => {
    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token || ''); // Store token in localStorage
      setMessage('Login successful!');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Login failed');
      } else {
        setMessage('An unexpected error occurred');
      }
    }
  };

  // Handle resend verification email
  const handleResendEmail = async () => {
    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/resend-verification-email', {
        email,
      });
      setMessage(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Error resending email');
      } else {
        setMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <h1>{isRegistering ? 'Register' : 'Login'}</h1>

      {message && <p>{message}</p>}

      {isRegistering && (
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}

      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={isRegistering ? handleRegister : handleLogin}>
        {isRegistering ? 'Register' : 'Login'}
      </button>

      {isRegistering && showResendEmail && (
        <>
          <p>
            <strong>Note:</strong> Please check your spam folder if you don't see the email in your inbox.
          </p>
          <p>
            Didn't receive the email?{' '}
            <button onClick={handleResendEmail}>Resend Email</button>
          </p>
        </>
      )}

      <p>
        {isRegistering ? 'Already have an account? ' : 'Need an account? '}
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
};

export default Home;