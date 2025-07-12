// src/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loadGoogleApi,
  signIn as gapiSignIn,
  signOut as gapiSignOut,
  isSignedIn as isSignedIn,
} from "./googleSheetApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadGoogleApi();
  }, []);

  const signIn = async () => {
    try {
      await loadGoogleApi();
      const userInfo = await gapiSignIn();
      setUser(userInfo);
    } catch (err) {
      console.error("Sign-in failed:", err);
    }
  };

  const signOut = async () => {
    await gapiSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
