import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../backend/supabase";
// import { Linking } from "react-native";
import { Session } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignoutLoading, setIsLoadingSignout] = useState(false);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState("student");
  const [professorMode, setProfessorMode] = useState(false);
  const redirectTo = makeRedirectUri();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      // console.log("session in authContext: ", JSON.stringify(session, null, 2));

      if (session && session.user && session.user.user_metadata) {
        const role = session.user.user_metadata.role;
        if (role === "professor") {
          setUserRole("professor");
          setProfessorMode(true);
        }
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session && session.user && session.user.user_metadata) {
        const role = session.user.user_metadata.role;
        if (role === "professor") {
          setUserRole("professor");
          setProfessorMode(true);
        }
      }
    });
  }, []);
  // WebBrowser.maybeCompleteAuthSession();
  const createSessionFromUrl = async (url) => {
    const { params, errorCode } = getQueryParams.getQueryParams(url);

    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;

    if (!access_token) return;

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;
    return data.session;
  };

  const logout = async () => {
    setIsLoadingSignout(true);
    try {
      await supabase.auth.signOut();
      setSession(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out:", error.message);
      alert("An error occurred while signing out.");
    }
    setIsLoadingSignout(false);
  };

  const signInWithGoogle = async () => {
    console.log("redirectTo : ", redirectTo);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;

    const res = await WebBrowser.openAuthSessionAsync(
      data?.url ?? "",
      redirectTo
    );

    if (res.type === "success") {
      const { url } = res;
      await createSessionFromUrl(url);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        setSession,
        isAuthenticated,
        userRole,
        professorMode,
        setProfessorMode,
        logout,
        isSignoutLoading,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
