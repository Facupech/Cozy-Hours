import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userToken, setUserToken] = useState(() => localStorage.getItem('token'));

  // Guardar token en localStorage
  const login = (token) => {
    localStorage.setItem('token', token);
    setUserToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserToken(null);
  };

  return (
    <UserContext.Provider value={{ userToken, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
