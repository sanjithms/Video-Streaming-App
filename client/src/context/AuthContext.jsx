import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  // 1. Add a loading state to prevent UI flickering on refresh
  const [loading, setLoading] = useState(true);

  // Helper to set default axios header
  const setAxiosHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    // 2. Safely decode token and handle expiration
    const initializeAuth = async () => {
      if (token) {
        try {
          // Set global header immediately
          setAxiosHeader(token);

          // Decode payload safely
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const payload = JSON.parse(jsonPayload);

          // Optional: Check if token is expired
          const currentTime = Date.now() / 1000;
          if (payload.exp && payload.exp < currentTime) {
            logout(); // Token expired
          } else {
            setUser(payload);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          logout();
        }
      } else {
        setAxiosHeader(null);
      }
      setLoading(false); // Auth check finished
    };

    initializeAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      
      const newToken = res.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(res.data.user);
      
      // Update global header immediately upon login
      setAxiosHeader(newToken);
      return true; // Return success status
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Let the component handle the alert
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setAxiosHeader(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {/* 3. Show a loading spinner if we are still checking the token */}
      {loading ? (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
             <p className="text-slate-400 text-sm animate-pulse">Securely loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};