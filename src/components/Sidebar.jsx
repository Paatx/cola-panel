import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLink = (href, icon, label) => ({
    href,
    icon,
    label,
    active: location.pathname === href
  });

  const links = [
    navLink('/', '●', 'Cola en vivo'),
  ];

  const adminLinks = [
    navLink('/zonas', '◆', 'Zonas'),
    navLink('/usuarios', '◉', 'Usuarios'),
    navLink('/configuracion', '⚙', 'Configuración'),
    navLink('/estadisticas', '▤', 'Estadísticas'),
  ];

  return (
    <aside style={{ background: 'white', borderRight: '1px solid #e4e4e7', padding: '24px 16px', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
      <div style={{ fontWeight: '800', fontSize: '18px', padding: '8px 12px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ea580c', display: 'inline-block' }}></span>
        Cola
      </div>

      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#a1a1aa', padding: '16px 12px 8px', fontWeight: '600' }}>Operativa</div>

      {links.map(link => (
        <a key={link.href} href={link.href} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 12px', borderRadius: '6px',
          background: link.active ? '#fff7ed' : 'transparent',
          color: link.active ? '#ea580c' : '#71717a',
          fontWeight: link.active ? '600' : '500',
          fontSize: '14px', textDecoration: 'none'
        }}>
          {link.icon} {link.label}
        </a>
      ))}

      {user?.rol === 'admin' && (
        <>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#a1a1aa', padding: '16px 12px 8px', fontWeight: '600' }}>Administración</div>
          {adminLinks.map(link => (
            <a key={link.href} href={link.href} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '6px',
              background: link.active ? '#fff7ed' : 'transparent',
              color: link.active ? '#ea580c' : '#71717a',
              fontWeight: link.active ? '600' : '500',
              fontSize: '14px', textDecoration: 'none'
            }}>
              {link.icon} {link.label}
            </a>
          ))}
        </>
      )}

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
        <button onClick={logout} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', background: 'none', color: '#71717a', cursor: 'pointer', fontSize: '14px', borderRadius: '6px' }}>
          ↪ Cerrar sesión
        </button>
      </div>
    </aside>
  );
}