import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type UserRole = "investor" | "farmer" | "jobseeker";

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  wilaya?: string;
  address?: string;
  investor_type?: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (data: Record<string, unknown>, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "http://localhost:3000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("agrofund_user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, token: storedToken });
      } catch {
        localStorage.removeItem("agrofund_user");
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error("Login failed:", error);
        return false;
      }

      const data = await response.json();

      if (!data.token || !data.id) {
        console.error("Invalid login response");
        return false;
      }

      if (data.type !== role) {
        console.error(`User type mismatch: expected ${role}, got ${data.type}`);
        return false;
      }

      const authUser: AuthUser = {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.type as UserRole,
        phone: data.phone,
        wilaya: data.wilaya,
        address: data.address,
        investor_type: data.investor_type,
        token: data.token,
      };

      setUser(authUser);
      localStorage.setItem("agrofund_user", JSON.stringify(authUser));
      localStorage.setItem("token", data.token);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    data: Record<string, unknown>,
    role: UserRole
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Registration failed:", errorData);
        return false;
      }

      const result = await response.json();

      if (!result.token || !result.id) {
        console.error("Invalid registration response:", result);
        return false;
      }

      const authUser: AuthUser = {
        id: result.id,
        email: result.email,
        first_name: result.first_name,
        last_name: result.last_name,
        role: result.type as UserRole,
        phone: result.phone,
        wilaya: result.wilaya,
        address: result.address,
        investor_type: result.investor_type,
        token: result.token,
      };

      setUser(authUser);
      localStorage.setItem("agrofund_user", JSON.stringify(authUser));
      localStorage.setItem("token", result.token);

      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("agrofund_user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
