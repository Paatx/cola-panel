import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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
        <a href="/configuracion" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', background: '#fff7ed', color: '#ea580c', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>⚙ Configuración</a>
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
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Configuración</h1>
          <p style={{ color: '#71717a', marginTop: '4px', fontSize: '14px' }}>Ajustes del restaurante</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#71717a' }}>Cargando...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* Datos del restaurante */}
            <div style={{ background: 'white', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Datos del restaurante</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d4d4d8', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Teléfono WhatsApp</label>
                <input
                  type="text"
                  value={form.telefono_whatsapp}
                  onChange={e => setForm({ ...form, telefono_whatsapp: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d4d4d8', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
                <p style={{ fontSize: '12px', color: '#71717a', marginTop: '4px' }}>El número al que los clientes mandan mensajes al escanear el QR</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Tiempo estimado por mesa (minutos)</label>
                <input
                  type="number"
                  value={form.tiempo_espera_por_mesa}
                  onChange={e => setForm({ ...form, tiempo_espera_por_mesa: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d4d4d8', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <button
                onClick={guardar}
                disabled={guardando}
                style={{ padding: '10px 20px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>

            {/* QR */}
            <div style={{ background: 'white', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Código QR</h2>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{
                  width: '140px', height: '140px', flexShrink: 0,
                  background: 'repeating-conic-gradient(#18181b 0% 25%, #fff 0% 50%) 50% / 20px 20px',
                  borderRadius: '6px'
                }}></div>
                <div>
                  <p style={{ fontSize: '14px', marginBottom: '12px', color: '#71717a' }}>
                    Imprime este QR y colócalo en la entrada. Los clientes lo escanearán para apuntarse a la cola.
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ padding: '8px 14px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                      Descargar PNG
                    </button>
                    <button style={{ padding: '8px 14px', background: 'white', border: '1px solid #d4d4d8', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                      Descargar PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}