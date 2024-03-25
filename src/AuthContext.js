import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authorization') || '');

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authorization', newToken);
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('authorization');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};