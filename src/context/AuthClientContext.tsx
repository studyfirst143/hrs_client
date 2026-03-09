import { createContext, useContext, useEffect, useState } from "react";

interface Guest {
  _id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  guest?: Guest | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, guest: Guest) => void;
  logout: () => void;
}

const AuthClientContext = createContext<AuthContextType | null>(null);

export function AuthClientProvider({ children }: { children: React.ReactNode }) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("client_token");
    const savedGuest = localStorage.getItem("client_guest");

    if (savedToken && savedGuest) {
      setToken(savedToken);
      setGuest(JSON.parse(savedGuest));
    }
  }, []);

  const login = (token: string, guest: Guest) => {
    setToken(token);
    setGuest(guest);
    localStorage.setItem("client_token", token);
    localStorage.setItem("client_guest", JSON.stringify(guest));
  };

  const logout = () => {
    setToken(null);
    setGuest(null);
    localStorage.removeItem("client_token");
    localStorage.removeItem("client_guest");
  };

  return (
    <AuthClientContext.Provider
      value={{
        guest,
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthClientContext.Provider>
  );
}

export function useAuthClient() {
  const context = useContext(AuthClientContext);
  if (!context) {
    throw new Error("useAuthClient must be used inside AuthClientProvider");
  }
  return context;
}
