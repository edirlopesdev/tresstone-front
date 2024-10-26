import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LoginForm from './auth/LoginForm';
import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';
import { ToastProvider } from './components/ui/toast';
import { AgendamentosPage } from './pages/Agendamentos';
import { ClientesPage } from './pages/Clientes';
import { HistoricoColoracaoPage } from './pages/HistoricoColoracao';
import { PerfisPage } from './pages/Perfis';
import { PlanosPage } from './pages/Planos';
import { ProdutosPage } from './pages/Produtos';
import { Toaster } from "./components/ui/toaster"

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
              <Route
                path="/agendamentos"
                element={user ? <AgendamentosPage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/clientes"
                element={user ? <ClientesPage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/historico-coloracao"
                element={user ? <HistoricoColoracaoPage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/perfis"
                element={user ? <PerfisPage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/planos"
                element={user ? <PlanosPage /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/produtos"
                element={user ? <ProdutosPage /> : <Navigate to="/login" replace />}
              />
              <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
