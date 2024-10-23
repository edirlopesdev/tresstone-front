import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LoginForm from './auth/LoginForm';
import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';
import { ToastProvider } from './components/ui/toast';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <ToastProvider>
      <Router>
        <div className="flex">
          {user && <Sidebar />}
          <main className="flex-1">
            <Routes>
              <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />}
              />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/login" replace />}
              />
              <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
              {/* ... outras rotas protegidas */}
            </Routes>
          </main>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
