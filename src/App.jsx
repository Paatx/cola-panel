import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Cola from './pages/Cola';
import Zonas from './pages/Zonas';
import Usuarios from './pages/Usuarios';
import Configuracion from './pages/Configuracion';
import Estadisticas from './pages/Estadisticas';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Cola />
            </ProtectedRoute>
          } />
          <Route path="/zonas" element={
            <ProtectedRoute>
              <Zonas />
            </ProtectedRoute>
          } />
          <Route path="/usuarios" element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          } />
          <Route path="/configuracion" element={
            <ProtectedRoute>
              <Configuracion />
            </ProtectedRoute>
          } />
        <Route path="/estadisticas" element={
          <ProtectedRoute>
             <Estadisticas />
            </ProtectedRoute>
          } />
           </Routes>
      </BrowserRouter>
    </AuthProvider>

    
  );
}

export default App;