import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#fafafa',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        border: '1px solid #e4e4e7',
        borderRadius: '14px',
        padding: '40px',
        boxShadow: '0 12px 32px rgba(24,24,27,.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '12px',
            background: '#ea580c',
            margin: '0 auto 16px',
            display: 'grid',
            placeItems: 'center',
            color: 'white',
            fontWeight: '800',
            fontSize: '20px'
          }}>R</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>Reserpax Cola</h1>
          <p style={{ color: '#71717a', fontSize: '13px', marginTop: '4px' }}>Panel de gestión para el staff</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@restaurante.com"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d4d4d8',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d4d4d8',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#f97316' : '#ea580c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}