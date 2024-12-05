import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setMessage('Logged in successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 rounded-lg'>
      {error && <p className='text-red-500'>{error}</p>}
      {message && <p className='text-green-500'>{message}</p>}
      <div>
        <label htmlFor='email' className='block text-sm font-medium text-lime-500'>
          Email
        </label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mt-1 block w-full rounded-md border-gray-700 shadow-sm bg-black text-lime-500 focus:border-lime-500 focus:ring focus:ring-lime-200 focus:ring-opacity-50 p-2'
          required
        />
      </div>
      <div>
        <label htmlFor='password' className='block text-sm font-medium text-lime-500'>
          Password
        </label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mt-1 block w-full rounded-md border-gray-700 shadow-sm bg-black text-lime-500 focus:border-lime-500 focus:ring focus:ring-lime-200 focus:ring-opacity-50 p-2'
          required
        />
      </div>
      <button
        type='submit'
        className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-lime-500 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400'
      >
        Log in
      </button>
    </form>
  );

  ///loginform
};

export default LoginForm;
