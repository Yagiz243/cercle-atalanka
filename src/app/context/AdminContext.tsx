import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminContextType } from '../lib/types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const AdminContext = createContext<AdminContextType | undefined>(undefined);
const DEMO_ADMIN_STORAGE_KEY = 'cercle_demo_admin_session';
const DEMO_ADMIN_EMAIL = 'admin@cercleatalanka.org';
const DEMO_ADMIN_PASSWORD = 'Kongo999@';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const storedSession = localStorage.getItem(DEMO_ADMIN_STORAGE_KEY);
      setIsAdminLoggedIn(storedSession === 'true');
      return;
    }

    const checkAdminSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          
          if (!error && data?.role === 'admin') {
            setIsAdminLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
      }
    };

    checkAdminSession();
  }, []);

  const adminLogin = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      if (email.toLowerCase() !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
        throw new Error('Identifiants admin invalides.');
      }
      localStorage.setItem(DEMO_ADMIN_STORAGE_KEY, 'true');
      setIsAdminLoggedIn(true);
      return;
    }

    // 1. Connexion avec Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Erreur de connexion Supabase:', error);
      throw error;
    }

    console.log('Utilisateur connecté:', data.user);

    // 2. Récupération du profil - d'abord par ID, puis par email en fallback
    let profile = null;
    let profileError = null;

    // Essayer par ID
    const resultById = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    profile = resultById.data;
    profileError = resultById.error;

    console.log('Profil par ID:', profile, 'Erreur:', profileError);

    // Si la requête par ID échoue ou ne retourne rien, essayer par email
    if (profileError || !profile) {
      console.log('Tentative de récupération par email...');
      const resultByEmail = await supabase
        .from('profiles')
        .select('role')
        .eq('email', email)
        .maybeSingle();

      profile = resultByEmail.data;
      profileError = resultByEmail.error;
      console.log('Profil par email:', profile, 'Erreur:', profileError);
    }

    // Si toujours pas de profil ou erreur, déconnecter
    if (profileError || !profile || profile.role !== 'admin') {
      console.error('Profil non admin ou introuvable:', profile, profileError);
      await supabase.auth.signOut();
      throw new Error("Ce compte n'a pas accès à l'administration.");
    }

    // Succès
    setIsAdminLoggedIn(true);
  };

  const adminLogout = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem(DEMO_ADMIN_STORAGE_KEY);
      setIsAdminLoggedIn(false);
      return;
    }

    await supabase.auth.signOut();
    setIsAdminLoggedIn(false);
  };

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}