import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, AuthContextType } from '../lib/types';
import { Database } from '../lib/database.types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DEMO_AUTH_STORAGE_KEY = 'cercle_demo_auth_user';
const DEMO_ADMIN_EMAIL = 'admin@cercleatalanka.org';
const DEMO_ADMIN_PASSWORD = 'Kongo999@';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

function mapProfileToUser(profile: ProfileRow): User {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url || undefined,
    role: profile.role,
    createdAt: profile.created_at,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const ensureProfile = async (authUser: SupabaseUser) => {
    const fullName =
      authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Utilisateur';
    const avatarUrl = authUser.user_metadata?.avatar_url;

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: authUser.id,
          email: authUser.email || '',
          full_name: fullName,
          avatar_url: typeof avatarUrl === 'string' ? avatarUrl : null,
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapProfileToUser(data);
  };

  const syncUserFromAuth = async (authUser: SupabaseUser | null) => {
    if (!authUser) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const nextUser = data ? mapProfileToUser(data) : await ensureProfile(authUser);

    setUser(nextUser);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const storedUser = localStorage.getItem(DEMO_AUTH_STORAGE_KEY);

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch {
          localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
        }
      }

      setIsLoading(false);
      return;
    }

    let isActive = true;

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        await syncUserFromAuth(data.session?.user ?? null);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isActive) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void (async () => {
        try {
          await syncUserFromAuth(session?.user ?? null);
        } catch (error) {
          console.error('Error syncing auth state:', error);
          if (isActive) {
            setUser(null);
            setIsAuthenticated(false);
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      })();
    });

    void initializeAuth();

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      if (email.toLowerCase() !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
        throw new Error('Identifiants invalides pour le mode demo local.');
      }

      const demoUser: User = {
        id: 'demo-admin-user',
        email: DEMO_ADMIN_EMAIL,
        fullName: 'Admin Cercle Atalanka',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      await syncUserFromAuth(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Inscription desactivee en mode demo local. Configurez Supabase pour creer des comptes.');
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (!data.session) {
        throw new Error('Inscription creee. Confirmez votre email avant de vous connecter.');
      }

      await syncUserFromAuth(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      throw new Error('Aucun utilisateur connecte.');
    }

    if (!isSupabaseConfigured) {
      const updatedUser: User = {
        ...user,
        email: data.email ?? user.email,
        fullName: data.fullName ?? user.fullName,
        avatarUrl: data.avatarUrl ?? user.avatarUrl,
      };

      localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return;
    }

    let nextEmail = user.email;

    if (data.email && data.email !== user.email) {
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        email: data.email,
      });

      if (authError) {
        throw authError;
      }

      nextEmail = authData.user?.email || nextEmail;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        email: nextEmail,
        full_name: data.fullName ?? user.fullName,
        avatar_url: data.avatarUrl ?? user.avatarUrl ?? null,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    setUser(mapProfileToUser(profile));
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
