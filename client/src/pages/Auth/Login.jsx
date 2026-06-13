import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../api/authApi';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const iconStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left panel */}
      <div className="hidden lg:flex" style={{
        width: '44%', background: 'var(--bg-card)', borderRight: '0.5px solid var(--border-default)',
        flexDirection: 'column', justifyContent: 'space-between', padding: '44px 52px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--amber-accent)', borderRadius: '50%' }}></div>
          <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)' }}>CampusConnect</span>
        </div>

        <div>
          <h1 className="text-display" style={{ marginBottom: '14px' }}>
            Your campus,<br />all in one place.
          </h1>
          <p className="text-body" style={{ color: 'var(--text-secondary)', marginBottom: '36px' }}>
            Lost & Found, campus events, and study materials — built to make student life easier.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { emoji: '🔍', title: 'Lost & Found',     desc: 'Post or find lost items on campus' },
              { emoji: '📅', title: 'Events',            desc: 'Stay updated on campus events and RSVPs' },
              { emoji: '📚', title: 'Study Materials',   desc: 'Share notes and access study resources' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: '12px', padding: '14px 16px', background: 'var(--bg-stats)', borderRadius: '8px' }}>
                <span style={{ fontSize: '20px', lineHeight: 1.3, flexShrink: 0 }}>{emoji}</span>
                <div>
                  <p className="text-card-title" style={{ marginBottom: '2px' }}>{title}</p>
                  <p className="text-meta">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-meta" style={{ color: 'var(--text-tertiary)' }}>© 2024 CampusConnect</p>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '340px' }}>
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--amber-accent)', borderRadius: '50%' }}></div>
            <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)' }}>CampusConnect</span>
          </div>

          <h2 className="text-page-heading" style={{ marginBottom: '5px' }}>Sign in</h2>
          <p className="text-body" style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>Enter your details to continue</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="login-email" className="label-input">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={iconStyle} />
                <input id="login-email" type="email" className="input" style={{ paddingLeft: '38px' }}
                       placeholder="you@campus.edu" value={form.email}
                       onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" />
              </div>
            </div>
            <div>
              <label htmlFor="login-password" className="label-input">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={iconStyle} />
                <input id="login-password" type={show ? 'text' : 'password'} className="input"
                       style={{ paddingLeft: '38px', paddingRight: '38px' }}
                       placeholder="••••••••" value={form.password}
                       onChange={e => setForm({ ...form, password: e.target.value })} autoComplete="current-password" />
                <button type="button" tabIndex={-1} onClick={() => setShow(!show)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 0 }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button id="login-submit" type="submit" className="btn btn-primary"
                    style={{ width: '100%', marginTop: '2px' }} disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Sign in'}
            </button>
          </form>

          <p className="text-body" style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No account?{' '}
            <Link to="/signup" id="login-goto-signup" style={{ color: 'var(--primary-indigo)', fontWeight: 500, textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
