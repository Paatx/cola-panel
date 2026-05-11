import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

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

     <Sidebar />

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