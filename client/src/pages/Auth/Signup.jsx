import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from '../../api/authApi';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { BRANCHES } from '../../utils/helpers';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', branch: 'CSE', year: '1' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Fill in all required fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await registerUser({ ...form, year: parseInt(form.year) });
      login(res.data.token, res.data.user);
      toast.success(`Welcome, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const iconStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--amber-accent)', borderRadius: '50%' }}></div>
          <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)' }}>CampusConnect</span>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <h1 className="text-page-heading" style={{ marginBottom: '4px' }}>Create an account</h1>
          <p className="text-body" style={{ color: 'var(--text-secondary)', marginBottom: '22px' }}>Join your campus community</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label htmlFor="signup-name" className="label-input">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={iconStyle} />
                <input id="signup-name" type="text" className="input" style={{ paddingLeft: '38px' }}
                       placeholder="Your name" value={form.name} onChange={set('name')} autoComplete="name" />
              </div>
            </div>
            <div>
              <label htmlFor="signup-email" className="label-input">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={iconStyle} />
                <input id="signup-email" type="email" className="input" style={{ paddingLeft: '38px' }}
                       placeholder="you@campus.edu" value={form.email} onChange={set('email')} autoComplete="email" />
              </div>
            </div>
            <div>
              <label htmlFor="signup-password" className="label-input">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={iconStyle} />
                <input id="signup-password" type={show ? 'text' : 'password'} className="input"
                       style={{ paddingLeft: '38px', paddingRight: '38px' }}
                       placeholder="Min. 6 characters" value={form.password} onChange={set('password')} autoComplete="new-password" />
                <button type="button" tabIndex={-1} onClick={() => setShow(!show)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 0 }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label htmlFor="signup-branch" className="label-input">Branch</label>
                <select id="signup-branch" className="select" value={form.branch} onChange={set('branch')}>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="signup-year" className="label-input">Year</label>
                <select id="signup-year" className="select" value={form.year} onChange={set('year')}>
                  {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </div>
            <button id="signup-submit" type="submit" className="btn btn-primary"
                    style={{ width: '100%', marginTop: '4px' }} disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Create account'}
            </button>
          </form>

          <p className="text-body" style={{ marginTop: '18px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Have an account?{' '}
            <Link to="/login" id="signup-goto-login" style={{ color: 'var(--primary-indigo)', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
