import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Zonas() {
  const { user, logout } = useAuth();
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nueva, setNueva] = useState('');

  useEffect(() => {
    cargarZonas();
  }, []);

  const cargarZonas = async () => {
    try {
      const response = await api.get('/zonas');
      setZonas(response.data);
    } catch (err) {
      console.error('Error cargando zonas:', err);
    } finally {
      setLoading(false);
    }
  };

  const crearZona = async () => {
    if (!nueva.trim()) return;
    try {
      await api.post('/zonas', {
        negocio_id: user?.negocio_id || 1,
        nombre: nueva,
        activa: true
      });
      setNueva('');
      cargarZonas();
    } catch (err) {
      console.error('Error creando zona:', err);
    }
  };

  const toggleActiva = async (zona) => {
    try {
      await api.patch(`/zonas/${zona.id}`, { activa: !zona.activa });
      cargarZonas();
    } catch (err) {
      console.error('Error actualizando zona:', err);
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
        <a href="/zonas" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', background: '#fff7ed', color: '#ea580c', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>◆ Zonas</a>
        <a href="/usuarios" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', color: '#71717a', fontWeight: '500', fontSize: '14px', textDecoration: 'none' }}>◉ Usuarios</a>
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
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Zonas</h1>
            <p style={{ color: '#71717a', marginTop: '4px', fontSize: '14px' }}>Áreas del restaurante disponibles para la cola</p>
          </div>
        </div>

        {/* AÑADIR ZONA */}
        <div style={{ background: 'white', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Nombre de la nueva zona (ej: Terraza, Interior...)"
            value={nueva}
            onChange={e => setNueva(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && crearZona()}
            style={{ flex: 1, padding: '10px 12px', border: '1px solid #d4d4d8', borderRadius: '6px', fontSize: '14px' }}
          />
          <button
            onClick={crearZona}
            style={{ padding: '10px 20px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
          >
            + Añadir zona
          </button>
        </div>

        {/* LISTA DE ZONAS */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#71717a' }}>Cargando zonas...</div>
        ) : (
          <div style={{ background: 'white', border: '1px solid #e4e4e7', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f4f4f5', borderBottom: '1px solid #e4e4e7' }}>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.06em', color: '#71717a', fontWeight: '600' }}>Nombre</th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.06em', color: '#71717a', fontWeight: '600' }}>Estado</th>
                  <th style={{ padding: '12px 20px', width: '120px' }}></th>
                </tr>
              </thead>
              <tbody>
                {zonas.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#71717a' }}>No hay zonas creadas</td>
                  </tr>
                ) : zonas.map((zona, i) => (
                  <tr key={zona.id} style={{ borderBottom: i < zonas.length - 1 ? '1px solid #e4e4e7' : 'none' }}>
                    <td style={{ padding: '14px 20px', fontWeight: '600' }}>{zona.nombre}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        background: zona.activa ? '#f0fdf4' : '#fef2f2',
                        color: zona.activa ? '#16a34a' : '#dc2626',
                      }}>
                        {zona.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => toggleActiva(zona)}
                        style={{ padding: '6px 12px', background: 'white', border: '1px solid #d4d4d8', borderRadius: '6px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                      >
                        {zona.activa ? 'Desactivar' : 'Activar'}
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