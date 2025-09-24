import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Escuchar los cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    try {
      // Primero intentamos registrar directamente
      // Si el correo ya existe, Supabase nos devolverá un error
      localStorage.setItem('isNewUser', 'true');
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: email.split('@')[0],
            signup_date: new Date().toISOString()
          }
        }
      });
      
      // Si hay un error, lo manejamos
      if (signUpError) {
        console.error('Error en signUp:', signUpError);
        
        // Verificamos si el error es por correo ya registrado
        if (signUpError.message && (signUpError.message.includes('already registered') || 
                                   signUpError.message.includes('already in use') ||
                                   signUpError.message.includes('ya está en uso'))) {
          return { 
            data: null, 
            error: { 
              message: 'Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza otro correo.' 
            } 
          };
        }
        
        throw signUpError;
      }
      
      // Verificamos si el usuario ya existe en la tabla de autenticación
      if (signUpData && signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
        return { 
          data: null, 
          error: { 
            message: 'Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza otro correo.' 
          } 
        };
      }
      
      // Si llegamos aquí, el registro fue exitoso
      return { data: signUpData, error: null };
      
    } catch (error) {
      console.error('Error en signUp (catch):', error);
      // Si hay un error, limpiamos la bandera de nuevo usuario
      localStorage.removeItem('isNewUser');
      
      // Manejamos específicamente el error de correo ya registrado
      if (error.message && (error.message.includes('already registered') || 
                           error.message.includes('already in use') ||
                           error.message.includes('ya está en uso') ||
                           error.message.includes('ya está registrado'))) {
        return { 
          data: null, 
          error: { 
            message: 'Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza otro correo.' 
          } 
        };
      }
      
      return { 
        data: null, 
        error: { 
          message: error.message || 'Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.' 
        } 
      };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Personalizamos el mensaje de error para credenciales inválidas
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('El correo electrónico o la contraseña son incorrectos. Por favor, inténtalo de nuevo.');
        }
        throw error;
      }
      
      // Verificar si es el primer inicio de sesión
      const { data: { user } } = await supabase.auth.getUser();
      const signupDate = user?.user_metadata?.signup_date;
      
      if (signupDate) {
        const signupTime = new Date(signupDate).getTime();
        const now = new Date().getTime();
        const oneHourAgo = now - (60 * 60 * 1000);
        
        // Si el usuario se registró hace menos de 1 hora, lo consideramos nuevo
        if (signupTime > oneHourAgo) {
          localStorage.setItem('isNewUser', 'true');
        }
      }
      
      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error.message || 'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.' 
        } 
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
