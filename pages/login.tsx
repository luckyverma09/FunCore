import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import LoginForm from '../components/auth/LoginForm';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      toast.success('Logged in successfully!');
      router.push('/');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='max-w-md w-full bg-white/15 backdrop-blur-lg shadow-xl rounded-lg p-8'>
        <h2 className='text-center text-4xl font-extrabold text-lime-300 neon-text'>Sign In</h2>
        <p className=' mt-6 text-center text-sm text-gray-300'>
          Enter your credentials to continue the adventure.
        </p>
        {error && (
          <p className='mt-4 text-center text-sm text-red-600 bg-red-900 bg-opacity-50 p-3 rounded'>
            {error}
          </p>
        )}
        <LoginForm onSubmit={handleLogin} />

        <p className='mt-6 text-center text-sm text-gray-300'>
          New to the game?{' '}
          <a href='/signup' className='text-lime-500 font-medium hover:underline'>
            Create an account
          </a>
        </p>
      </div>
    </div>
  );

  ///login
};

export default LoginPage;
