import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import { LogOut, User, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Dashboard',       to: '/dashboard'  },
  { label: 'Lost & Found',    to: '/lost-found'  },
  { label: 'Events',          to: '/events'       },
  { label: 'Study Materials', to: '/materials'    },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); setDropdownOpen(false); };
  const active = (to) => location.pathname.startsWith(to);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--primary-dark)',
      height: '56px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center' }}>

        {/* Logo */}
        <Link to="/dashboard" id="navbar-logo"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginRight: '32px' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--amber-accent)', borderRadius: '50%' }}></div>
          <span style={{ fontWeight: 600, fontSize: '16px', color: '#FFFFFF' }}>
            CampusConnect
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
          {navLinks.map(({ label, to }) => {
            const isActive = active(to);
            return (
              <Link
                key={to} to={to}
                id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  transition: 'background 0.15s, color 0.15s'
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Admin Badge inside navbar next to avatar if possible, or just the avatar */}
              {user.role === 'admin' && (
                <div style={{
                  background: 'rgba(245,158,11,0.15)',
                  color: 'var(--amber-accent)',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}>
                  Admin
                </div>
              )}

              {/* User Avatar & Dropdown */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  id="navbar-user-menu"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'var(--amber-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 600, color: 'var(--primary-dark)',
                    overflow: 'hidden'
                  }}>
                    {user.avatar ? (
                      <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="card" style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: '200px',
                    padding: '8px',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ padding: '8px 8px 12px', borderBottom: '0.5px solid var(--border-default)', marginBottom: '4px' }}>
                      <p className="text-body" style={{ fontWeight: 500, lineHeight: 1.2 }}>{user.name}</p>
                      <p className="text-meta" style={{ marginTop: '2px' }}>{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px',
                            borderRadius: '6px', textDecoration: 'none', color: 'var(--text-primary)',
                            fontSize: '13px', transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-app)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <User size={16} color="var(--text-secondary)" /> My Dashboard
                    </Link>
                    <button onClick={handleLogout}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px',
                              borderRadius: '6px', border: 'none', background: 'transparent',
                              color: '#EF4444', fontSize: '13px', cursor: 'pointer',
                              transition: 'background 0.15s', textAlign: 'left', width: '100%'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <LogOut size={16} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}>Log in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm" style={{ background: '#FFFFFF', color: 'var(--primary-dark)' }}>Sign up</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}
                  style={{ background: 'none', border: 'none', color: '#FFFFFF', padding: '4px', cursor: 'pointer' }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden" style={{
          position: 'absolute', top: '56px', left: 0, width: '100%',
          background: 'var(--primary-dark)', padding: '16px',
          borderTop: '0.5px solid rgba(255,255,255,0.1)'
        }}>
          {navLinks.map(({ label, to }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block', padding: '10px 12px', color: active(to) ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                    fontSize: '14px', textDecoration: 'none', fontWeight: 500,
                    background: active(to) ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '6px',
                    marginBottom: '4px'
                  }}>
              {label}
            </Link>
          ))}
          {user && (
            <button onClick={handleLogout} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px',
              color: '#EF4444', background: 'transparent', border: 'none', fontSize: '14px',
              fontWeight: 500, cursor: 'pointer', marginTop: '8px', borderTop: '0.5px solid rgba(255,255,255,0.1)'
            }}>
              Log out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
