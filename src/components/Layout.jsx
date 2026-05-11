import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user } = useAuth();
  const esAdmin = user?.rol === 'admin';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: esAdmin ? '240px 1fr' : '1fr',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {esAdmin && <Sidebar />}
      <main style={{ padding: '32px 40px', background: '#fafafa' }}>
        {children}
      </main>
    </div>
  );
}