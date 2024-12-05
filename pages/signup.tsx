import { useState } from 'react';
import { useRouter } from 'next/router';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (username: string, email: string, password: string) => {
    console.log('Signup attempt:', { username, email }); // Added logging
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        if (response.ok) {
          console.log('Signup successful');
          router.push('/login');
        } else {
          console.error('Signup failed:', data);
          setError(data.message || 'Something went wrong');
        }
      } else {
        // If the response is not JSON, log the text content
        const text = await response.text();
        console.error('Unexpected response:', text);
        setError('An unexpected error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='max-w-md w-full bg-white/15 backdrop-blur-lg shadow-xl rounded-lg p-8'>
        <h2 className='text-center text-4xl font-extrabold text-lime-300 neon-text'>Sign Up</h2>
        <p className='mt-6 text-center text-sm text-gray-300'>
          Enter your credentials to continue the adventure.
        </p>
        {error && (
          <p className='mt-4 text-center text-sm text-red-600 bg-red-900 bg-opacity-50 p-2 rounded'>
            {error}
          </p>
        )}
        <SignupForm onSubmit={handleSignup} />
        <p className='mt-6 text-center text-sm text-gray-300'>
          Already have an account.{' '}
          <a href='/login' className='text-lime-500 font-medium hover:underline'>
            Login
          </a>
        </p>
      </div>
    </div>
  );

  ////signup
};

export default SignupPage;
