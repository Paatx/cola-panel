import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';

export default function Cola() {
  const [cola, setCola] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarCola();
  }, []);

  const cargarCola = async () => {
    try {
      const response = await api.get('/cola');
      setCola(response.data);
    } catch (err) {
      console.error('Error cargando cola:', err);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.patch(`/cola/${id}`, { estado });
      cargarCola();
    } catch (err) {
      console.error('Error actualizando estado:', err);
    }
  };

  const colaFiltrada = cola.filter(entrada => {
    if (filtro === '1-2') return entrada.num_personas <= 2;
    if (filtro === '3-4') return entrada.num_personas >= 3 && entrada.num_personas <= 4;
    if (filtro === '5-6') return entrada.num_personas >= 5 && entrada.num_personas <= 6;
    if (filtro === '7+') return entrada.num_personas >= 7;
    if (busqueda) return entrada.num_personas === parseInt(busqueda);
    return true;
  });

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Cola en vivo</h1>
          <p style={{ color: '#71717a', marginTop: '4px', fontSize: '14px' }}>{cola.length} personas esperando</p>
        </div>
        <button style={{ padding: '12px 20px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
          + Añadir manualmente
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'En cola ahora', value: cola.filter(e => e.estado === 'esperando').length },
          { label: 'Avisados', value: cola.filter(e => e.estado === 'avisado').length },
          { label: 'Total personas', value: cola.reduce((acc, e) => acc + e.num_personas, 0) },
          { label: 'Tiempo medio', value: '~20 min' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '18px 20px' }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.06em', color: '#71717a', fontWeight: '600' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '6px' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* FILTROS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '18px 22px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>Filtrar por comensales:</span>
          {[
            { label: 'Todas', value: 'todas', color: null },
            { label: '1-2', value: '1-2', bg: '#d1fae5', border: '#34d399', color: '#065f46' },
            { label: '3-4', value: '3-4', bg: '#dbeafe', border: '#60a5fa', color: '#1e40af' },
            { label: '5-6', value: '5-6', bg: '#ffedd5', border: '#fb923c', color: '#9a3412' },
            { label: '7+', value: '7+', bg: '#fee2e2', border: '#f87171', color: '#991b1b' },
          ].map(btn => (
            <button
              key={btn.value}
              onClick={() => { setFiltro(btn.value); setBusqueda(''); }}
              style={{
                padding: '10px 18px',
                border: `1px solid ${filtro === btn.value ? '#ea580c' : (btn.border || '#d4d4d8')}`,
                background: filtro === btn.value ? '#ea580c' : (btn.bg || 'white'),
                color: filtro === btn.value ? 'white' : (btn.color || '#18181b'),
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            min="1"
            placeholder="Nº exacto"
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setFiltro('todas'); }}
            style={{ width: '140px', padding: '10px 14px', border: '1px solid #d4d4d8', borderRadius: '6px', fontSize: '14px' }}
          />
          <button style={{ padding: '10px 18px', border: '1px solid #d4d4d8', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
            Buscar
          </button>
        </div>
      </div>

      {/* LISTA */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#71717a' }}>Cargando cola...</div>
      ) : colaFiltrada.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#71717a' }}>No hay nadie en la cola</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {colaFiltrada.map(entrada => (
            <div key={entrada.id} style={{
              background: entrada.estado === 'avisado' ? '#fffbeb' : 'white',
              border: `1px solid ${entrada.estado === 'avisado' ? '#d97706' : '#e4e4e7'}`,
              borderRadius: '10px',
              padding: '16px 20px',
              display: 'grid',
              gridTemplateColumns: '48px 1fr auto',
              gap: '16px',
              alignItems: 'center'
            }}>
              <div style={{
                width: '48px', height: '48px',
                borderRadius: '10px',
                background: entrada.estado === 'avisado' ? '#d97706' : '#f4f4f5',
                color: entrada.estado === 'avisado' ? 'white' : '#18181b',
                display: 'grid', placeItems: 'center',
                fontWeight: '600', fontSize: '18px'
              }}>
                {entrada.posicion}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '16px' }}>{entrada.nombre}</span>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    background: entrada.estado === 'avisado' ? '#fffbeb' : '#eff6ff',
                    color: entrada.estado === 'avisado' ? '#d97706' : '#2563eb',
                  }}>
                    {entrada.estado}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#71717a' }}>
                  <span>👥 {entrada.num_personas} personas</span>
                  <span>📞 {entrada.telefono}</span>
                  {entrada.zona && <span>📍 {entrada.zona.nombre}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {entrada.estado === 'esperando' && (
                  <button
                    onClick={() => cambiarEstado(entrada.id, 'avisado')}
                    style={{ padding: '6px 12px', background: 'white', border: '1px solid #d4d4d8', borderRadius: '6px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Avisar
                  </button>
                )}
                {entrada.estado === 'avisado' && (
                  <button
                    onClick={() => cambiarEstado(entrada.id, 'sentado')}
                    style={{ padding: '6px 12px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Sentar
                  </button>
                )}
                <button
                  onClick={() => cambiarEstado(entrada.id, 'no_show')}
                  style={{ padding: '6px 12px', background: 'white', border: '1px solid #d4d4d8', color: '#dc2626', borderRadius: '6px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                >
                  No-show
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}