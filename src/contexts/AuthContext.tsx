import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

type UserRole = 'student' | 'teacher';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signup: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role when session changes
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      setUserRole(data?.role as UserRole || null);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signup = async (email: string, password: string, fullName: string, role: UserRole) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      // Insert user role
      if (data.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role });
        
        if (roleError) throw roleError;
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      userRole, 
      login, 
      signup, 
      logout, 
      isLoggedIn: !!user,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};