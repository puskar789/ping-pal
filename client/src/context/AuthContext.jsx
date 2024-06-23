/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

// hook to get auth context
export const useAuthContext = () => {
  return useContext(AuthContext);
};
export const AuthContextProvider = ({ children }) => {
  //  localStorage.getItem("chat-user") is a string by default
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("chat-user")) || null
  );

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
