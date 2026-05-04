import { createContext, useState, useEffect, useRef } from "react";
import API from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const hasFetched = useRef(false);
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadData = async () => {
      try {
        // Try to load user
        try {
          const userRes = await API.get("/user/me");
          setUser(userRes.data.user);
        } catch (err) {
          // If not user, try to load company
          try {
            const companyRes = await API.get("/company/myCompany");
            setCompany(companyRes.data.company);
          } catch (companyErr) {
            setUser(null);
            setCompany(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const login = async (formData) => {
    const res = await API.post("/auth/login", formData);
    setUser(res.data.user);
    setCompany(null);
  };

  const companyLogin = async (formData) => {
    const res = await API.post("/company/login", formData);
    setCompany(res.data.company);
    setUser(null);
  };

  const register = async (formData) => {
    const res = await API.post("/auth/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  };

  const companyRegister = async (formData) => {
    const res = await API.post("/company/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      setCompany(null);
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const companyLogout = async () => {
    try {
      await API.post("/company/logout");
      setCompany(null);
      setUser(null);
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const refreshAuth = async () => {
    try {
      const userRes = await API.get("/user/me");
      setUser(userRes.data.user);
      setCompany(null);
    } catch (err) {
      try {
        const companyRes = await API.get("/company/myCompany");
        setCompany(companyRes.data.company);
        setUser(null);
      } catch (companyErr) {
        setUser(null);
        setCompany(null);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, company, setCompany, login, companyLogin, logout, companyLogout, register, companyRegister, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
