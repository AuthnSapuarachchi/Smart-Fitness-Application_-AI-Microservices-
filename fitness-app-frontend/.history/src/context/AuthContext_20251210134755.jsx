import React, { createContext, useContext as useReactContext } from 'react';
import { useAuth } from 'react-oauth2-code-pkce';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={{
      token: auth.token,
      tokenData: auth.tokenData,
      logIn: auth.logIn,
      logOut: auth.logOut,
      isAuthenticated: !!auth.token,
      error: auth.error,
      ...auth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useReactContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthContextProvider');
  }
  return context;
};
