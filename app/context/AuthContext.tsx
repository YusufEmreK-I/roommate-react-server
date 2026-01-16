"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { getMeApi } from "../../services/authService";

export interface User {
  id?: number;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  nationality?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, userData?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // Temizlik fonksiyonunu useEffect'ten önce tanımladık
  // useCallback kullanarak gereksiz referans değişimini engelliyoruz
  const handleLogoutCleanUp = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  // Uygulama ilk açıldığında (F5) çalışır
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Token varsa backend'e sor: Bu kim?
          const userData = await getMeApi();
          if (userData) {
            setUser(userData);
            setIsLoggedIn(true);
          }
        } catch (error) {
          // 🔥 DÜZELTME: ': any' ibaresi kaldırıldı.
          // Typescript'te catch bloğundaki error varsayılan olarak 'unknown' kabul edilir.
          console.error("Oturum açılırken hata oluştu:", error);

          handleLogoutCleanUp();

          // Eğer zaten login sayfasında değilsek uyarı ver ve yönlendir
          if (pathname !== "/auth/login") {
            // alert("Oturum süreniz doldu, lütfen tekrar giriş yapın.");
            // İstersen alert'i açabilirsin, ama console.error yeterli.
            router.push("/auth/login");
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [pathname, router, handleLogoutCleanUp]);

  const login = (token: string, userData?: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);

    if (userData) {
      setUser(userData);
    } else {
      getMeApi()
        .then((data) => setUser(data))
        .catch((err) => console.error("Login user fetch error:", err));
    }
  };

  const logout = () => {
    handleLogoutCleanUp();
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
