import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Usuarios() {
  const { user, logout } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* SIDEBAR */}
      <aside style={{ background: 'white', borderRight: '1px solid #e4e4e7', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: '800', fontSize: '18px', padding: '8px 12px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ea580c', display: 'inline-block' }}></span>
          Cola
        </div>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#a1a1aa', padding: '16px 12px 8px', fontWeight: '600' }}>Operativa</div>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', color: '#71717a', fontWeight: '500', fontSize: '14px', textDecoration: 'none' }}>● Cola en vivo</a>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#a1a1aa', padding: '16px 12px 8px', fontWeight: '600' }}>Administración</div>
        <a href="/zonas" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', color: '#71717a', fontWeight: '500', fontSize: '14px', textDecoration: 'none' }}>◆ Zonas</a>
        <a href="/usuarios" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', background: '#fff7ed', color: '#ea580c', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>◉ Usuarios</a>
        <a href="/configuracion" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', color: '#71717a', fontWeight: '500', fontSize: '14px', textDecoration: 'none' }}>⚙ Configuración</a>
        <a href="/estadisticas" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', color: '#71717a', fontWeight: '500', fontSize: '14px', textDecoration: 'none' }}>▤ Estadísticas</a>
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e4e4e7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ea580c', color: 'white', display: 'grid', placeItems: 'center', fontWeight: '700', fontSize: '13px' }}>
              {user?.name?.charAt(0)}
            </div>
            <div style={{ fontSize: '13px' }}>
              <strong style={{ display: 'block' }}>{user?.name}</strong>
              <small style={{ color: '#71717a' }}>{user?.negocio?.nombre}</small>
            </div>
          </div>
          <button onClick={logout} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', background: 'none', color: '#71717a', cursor: 'pointer', fontSize: '14px' }}>
            ↪ Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ padding: '32px 40px', background: '#fafafa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Usuarios</h1>
            <p style={{ color: '#71717a', marginTop: '4px', fontSize: '14px' }}>Staff con acceso al panel</p>
          </div>
          <button style={{ padding: '12px 20px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
            + Invitar usuario
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#71717a' }}>Cargando usuarios...</div>
        ) : (
          <div style={{ background: 'white', border: '1px solid #e4e4e7', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f4f4f5', borderBottom: '1px solid #e4e4e7' }}>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.06em', color: '#71717a', fontWeight: '600' }}>Nombre</th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.06em', color: '#71717a', fontWeight: '600' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.06em', color: '#71717a', fontWeight: '600' }}>Rol</th>
                  <th style={{ padding: '12px 20px', width: '100px' }}></th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#71717a' }}>No hay usuarios</td>
                  </tr>
                ) : usuarios.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: i < usuarios.length - 1 ? '1px solid #e4e4e7' : 'none' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ea580c', color: 'white', display: 'grid', placeItems: 'center', fontWeight: '700', fontSize: '13px' }}>
                          {u.name?.charAt(0)}
                        </div>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#71717a' }}>{u.email}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        background: u.rol === 'admin' ? '#fffbeb' : '#eff6ff',
                        color: u.rol === 'admin' ? '#d97706' : '#2563eb',
                      }}>
                        {u.rol}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button style={{ padding: '6px 12px', background: 'white', border: '1px solid #d4d4d8', borderRadius: '6px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}