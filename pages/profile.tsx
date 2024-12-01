import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ProfileForm from '../components/profile/ProfileForm';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const handleProfileUpdate = async (username: string, email: string) => {
    // Implement profile update logic here
    console.log('Update profile:', username, email);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Your Profile</h1>
      <ProfileForm
        initialUsername={session.user.name || ''}
        initialEmail={session.user.email || ''}
        onSubmit={handleProfileUpdate}
      />
    </div>
  );
};

export default ProfilePage;
