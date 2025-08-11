import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserRole = 'patient' | 'doctor' | 'admin';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, phone?: string, birthdate?: string, gender?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  userRole: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile and role after successful auth
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Add retry logic for network failures
      const retryFetch = async (operation: () => Promise<any>, retries = 3): Promise<any> => {
        for (let i = 0; i < retries; i++) {
          try {
            return await operation();
          } catch (error: any) {
            if (i === retries - 1) throw error;
            if (error.message?.includes('Load failed') || error.message?.includes('network')) {
              await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
              continue;
            }
            throw error;
          }
        }
      };

      // Fetch profile with retry logic
      const profileResult = await retryFetch(async () => {
        return await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
      });

      if (profileResult.error && profileResult.error.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileResult.error);
      } else if (profileResult.data) {
        setProfile(profileResult.data);
      }

      // Fetch user role with retry logic - prioritize admin > doctor > patient
      const roleResult = await retryFetch(async () => {
        return await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId);
      });

      if (roleResult.error && roleResult.error.code !== 'PGRST116') {
        console.error('Error fetching user role:', roleResult.error);
      } else if (roleResult.data && roleResult.data.length > 0) {
        // Prioritize roles: admin > doctor > patient
        const roles = roleResult.data.map((r: any) => r.role);
        let userRole: UserRole = 'patient'; // default
        
        if (roles.includes('admin')) {
          userRole = 'admin';
        } else if (roles.includes('doctor')) {
          userRole = 'doctor';
        } else if (roles.includes('patient')) {
          userRole = 'patient';
        }
        
        console.log('User roles found:', roles, 'Selected role:', userRole);
        setUserRole(userRole);
      } else {
        // No roles assigned yet - default to patient for basic access
        console.log('No roles found for user; defaulting to patient');
        setUserRole('patient');
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      // Set loading to false even on error to prevent infinite loading state
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, phone?: string, birthdate?: string, gender?: string) => {
    try {
      console.log('Starting signup process for:', email);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            birthdate: birthdate,
            gender: gender,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return { error };
      }

      console.log('Signup successful for:', email);
      
      // Check if user needs email confirmation
      if (data.user && !data.user.email_confirmed_at) {
        toast.success('Please check your email to confirm your account before signing in.');
      } else {
        toast.success('Account created successfully!');
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account. Please try again.');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting signin process for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          toast.error('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials.');
        } else {
          toast.error(error.message);
        }
        return { error };
      }

      console.log('Signin successful for:', email);
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please try again.');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Successfully signed out');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast.error('Error updating profile');
        return { error };
      }

      // Update local state
      if (profile) {
        setProfile({ ...profile, ...updates });
      }
      
      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
