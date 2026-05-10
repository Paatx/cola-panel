import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Estadisticas() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    esperando: 0,
    sentados: 0,
    cancelados: 0,
    no_shows: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarStats();
  }, []);

  const cargarStats = async () => {
    try {
      const response = await api.get('/cola');
      const cola = response.data;
      setStats({
        total: cola.length,
        esperando: cola.filter(e => e.estado === 'esperando').length,
        sentados: cola.filter(e => e.estado === 'sentado').length,
        cancelados: cola.filter(e => e.estado === 'cancelado').length,
        no_shows: cola.filter(e => e.estado === 'no_show').length,
      });
    } catch (err) {
      console.error('Error cargando stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total atendidos', value: stats.total, trend: '↑ 12% vs mes anterior', color: '#16a34a' },
    { label: 'Esperando ahora', value: stats.esperando, color: '#2563eb' },
    { label: 'Sentados hoy', value: stats.sentados, trend: '↑ 8% vs mes anterior', color: '#16a34a' },
    { label: 'No-shows', value: stats.no_shows, trend: '↓ 1.1% vs mes anterior', color: '#dc2626' },
  ];

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
        <a href="/usuarios" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', color: '#71717a', fontWeight: '500', fontSize: '14px', textDecoration: 'none' }}>◉ Usuarios</a>
        <a href="/configuracion" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', color: '#71717a', fontWeight: '500', fontSize: '14px', textDecoration: 'none' }}>⚙ Configuración</a>
        <a href="/estadisticas" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', background: '#fff7ed', color: '#ea580c', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>▤ Estadísticas</a>
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
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Estadísticas</h1>
            <p style={{ color: '#71717a', marginTop: '4px', fontSize: '14px' }}>Rendimiento de la gestión de la cola</p>
          </div>
          <select style={{ padding: '10px 12px', border: '1px solid #d4d4d8', borderRadius: '6px', fontSize: '14px' }}>
            <option>Hoy</option>
            <option>Esta semana</option>
            <option selected>Último mes</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#71717a' }}>Cargando estadísticas...</div>
        ) : (
          <>
            {/* STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
              {statCards.map((stat, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '18px 20px' }}>
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.06em', color: '#71717a', fontWeight: '600' }}>{stat.label}</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '6px' }}>{stat.value}</div>
                  {stat.trend && <div style={{ fontSize: '12px', color: stat.color, marginTop: '4px' }}>{stat.trend}</div>}
                </div>
              ))}
            </div>

            {/* GRÁFICA */}
            <div style={{ background: 'white', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>Personas atendidas por día</h2>
                <span style={{ fontSize: '13px', color: '#71717a' }}>Últimos 30 días</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gap: '4px', height: '160px', alignItems: 'end' }}>
                {[30,45,60,40,70,85,95,35,50,55,65,48,88,92,42,58,62,70,52,82,90,38,55,60,68,45,85,94,40,50].map((h, i) => (
                  <div key={i} style={{
                    background: [5,6,12,13,19,20,26,27].includes(i) ? '#ea580c' : '#fff7ed',
                    border: '1px solid #ea580c',
                    height: `${h}%`,
                    borderRadius: '4px 4px 0 0'
                  }}></div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gap: '4px', marginTop: '8px', fontSize: '11px', color: '#71717a', textAlign: 'center' }}>
                {Array.from({length: 30}, (_, i) => (
                  <span key={i}>{[0,4,9,14,19,24,29].includes(i) ? i+1 : ''}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '20px', marginTop: '16px', fontSize: '12px', color: '#71717a' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: '#fff7ed', border: '1px solid #ea580c', borderRadius: '3px', display: 'inline-block' }}></span>
                  Lunes a viernes
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: '#ea580c', borderRadius: '3px', display: 'inline-block' }}></span>
                  Fines de semana
                </span>
              </div>
            </div>

            {/* TABLAS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'white', border: '1px solid #e4e4e7', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e4e7', fontWeight: '600', fontSize: '15px' }}>Horas punta</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {[['21:00 — 22:00', '28%'], ['14:00 — 15:00', '22%'], ['22:00 — 23:00', '18%'], ['13:00 — 14:00', '14%'], ['Otros', '18%']].map(([hora, pct], i) => (
                      <tr key={i} style={{ borderBottom: i < 4 ? '1px solid #e4e4e7' : 'none' }}>
                        <td style={{ padding: '14px 20px' }}>{hora}</td>
                        <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: '600' }}>{pct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: 'white', border: '1px solid #e4e4e7', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e4e7', fontWeight: '600', fontSize: '15px' }}>Zonas más solicitadas</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {[['🌿 Terraza', '58%'], ['🪑 Interior', '27%'], ['Sin preferencia', '15%']].map(([zona, pct], i, arr) => (
                      <tr key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid #e4e4e7' : 'none' }}>
                        <td style={{ padding: '14px 20px' }}>{zona}</td>
                        <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: '600' }}>{pct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}