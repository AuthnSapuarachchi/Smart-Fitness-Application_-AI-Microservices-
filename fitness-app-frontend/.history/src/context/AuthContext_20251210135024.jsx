import React, { createContext, useContext as useReactContext } from 'react';

// This context will be populated by the auth provider
export const AuthContext = createContext({
  token: null,
  tokenData: null,
  logIn: () => {},
  logOut: () => {},
  isAuthenticated: false,
  error: null,
});

export const useAuthContext = () => {
  const context = useReactContext(AuthContext);
  if (!context) {
    console.warn('useAuthContext must be used within AuthProvider');
    return {
      token: null,
      tokenData: null,
      logIn: () => {},
      logOut: () => {},
      isAuthenticated: false,
      error: null,
    };
  }
  return context;
};
