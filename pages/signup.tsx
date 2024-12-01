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
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Create your account
        </h2>
        {error && <p className='text-red-500 text-center'>{error}</p>}
        <SignupForm onSubmit={handleSignup} />
      </div>
    </div>
  );
};

export default SignupPage;
