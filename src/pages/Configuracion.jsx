import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';

export default function Configuracion() {
  const { user, logout } = useAuth();
  const [negocio, setNegocio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    telefono_whatsapp: '',
    tiempo_espera_por_mesa: 20,
  });

  useEffect(() => {
    cargarNegocio();
  }, []);

  const cargarNegocio = async () => {
    try {
      const response = await api.get('/negocios/1');
      setNegocio(response.data);
      setForm({
        nombre: response.data.nombre,
        telefono_whatsapp: response.data.telefono_whatsapp || '',
        tiempo_espera_por_mesa: response.data.tiempo_espera_por_mesa,
      });
    } catch (err) {
      console.error('Error cargando negocio:', err);
    } finally {
      setLoading(false);
    }
  };

  const guardar = async () => {
    setGuardando(true);
    try {
      await api.patch(`/negocios/1`, form);
      alert('Cambios guardados correctamente');
    } catch (err) {
      console.error('Error guardando:', err);
    } finally {
      setGuardando(false);
    }
  };

  return (
  <Layout>
    <div style={{ marginBottom: '28px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Configuración</h1>
      <p style={{ color: '#71717a', marginTop: '4px', fontSize: '14px' }}>Ajustes del restaurante</p>
    </div>

    {loading ? (
      <div style={{ textAlign: 'center', padding: '40px', color: '#71717a' }}>Cargando...</div>
    ) : (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        <div style={{ background: 'white', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Datos del restaurante</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Nombre</label>
            <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d4d4d8', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Teléfono WhatsApp</label>
            <input type="text" value={form.telefono_whatsapp} onChange={e => setForm({ ...form, telefono_whatsapp: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d4d4d8', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            <p style={{ fontSize: '12px', color: '#71717a', marginTop: '4px' }}>El número al que los clientes mandan mensajes al escanear el QR</p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Tiempo estimado por mesa (minutos)</label>
            <input type="number" value={form.tiempo_espera_por_mesa} onChange={e => setForm({ ...form, tiempo_espera_por_mesa: parseInt(e.target.value) })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #d4d4d8', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <button onClick={guardar} disabled={guardando}
            style={{ padding: '10px 20px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

        <div style={{ background: 'white', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Código QR</h2>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '140px', height: '140px', flexShrink: 0, background: 'repeating-conic-gradient(#18181b 0% 25%, #fff 0% 50%) 50% / 20px 20px', borderRadius: '6px' }}></div>
            <div>
              <p style={{ fontSize: '14px', marginBottom: '12px', color: '#71717a' }}>
                Imprime este QR y colócalo en la entrada. Los clientes lo escanearán para apuntarse a la cola.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ padding: '8px 14px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Descargar PNG</button>
                <button style={{ padding: '8px 14px', background: 'white', border: '1px solid #d4d4d8', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Descargar PDF</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    )}
  </Layout>
);
}