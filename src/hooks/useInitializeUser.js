import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createUserProfile, getUserProfile } from '../utils/db';

export function useInitializeUser() {
  const { user } = useAuth();

  useEffect(() => {
    async function initializeUser() {
      if (!user) {
        console.log('No user logged in');
        return;
      }

      console.log('Initializing user:', user.uid);

      try {
        // Check if user profile exists
        const profile = await getUserProfile(user.uid);
        console.log('Existing profile:', profile);
        
        // If no profile exists, create one
        if (!profile) {
          console.log('Creating new profile for user:', user.uid);
          await createUserProfile(user.uid, {
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
          });
          console.log('Profile created successfully');
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    }

    initializeUser();
  }, [user]);
} 