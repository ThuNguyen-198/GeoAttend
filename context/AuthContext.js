import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../backend/supabase";
import { Linking } from "react-native";
import { Session } from "@supabase/supabase-js";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // useEffect(() => {
  //   const checkSession = async () => {
  //     try {
  //       setIsLoading(true);
  //       const {
  //         data: { session },
  //       } = await supabase.auth.getSession();

  //       if (session) {
  //         console.log("Session found:", session);
  //         setIsAuthenticated(true);
  //       } else {
  //         console.log("No session found.");
  //         setIsAuthenticated(false);
  //       }
  //     } catch (error) {
  //       console.error("Error checking session:", error.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkSession();

  //   // Add a listener for auth state changes to keep `isAuthenticated` updated
  //   const { subscription } = supabase.auth.onAuthStateChange(
  //     (event, session) => {
  //       if (session) {
  //         console.log("Auth state changed - user logged in:", session);
  //         setIsAuthenticated(true);
  //       } else {
  //         console.log("Auth state changed - user logged out.");
  //         setIsAuthenticated(false);
  //       }
  //     }
  //   );

  //   return () => subscription?.unsubscribe?.(); // Safely handle unsubscribing
  // }, []);

  const login = () => setIsAuthenticated(true);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out:", error.message);
      alert("An error occurred while signing out.");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "online",
            prompt: "select_account",
            redirectTo: "geoattend://auth/callback",
          },
        },
      });

      if (error) {
        console.error("Google sign-in error:", error.message);
        alert("Error signing in with Google");
        return;
      }

      if (data?.url) {
        console.log("Google Sign-in URL:", data.url);
        Linking.openURL(data.url); // Open the URL in a browser or in-app
      }
    } catch (error) {
      console.error("Unexpected error during Google sign-in:", error.message);
      alert("An unexpected error occurred during sign-in");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated,
        isLoading,
        login,
        logout,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
