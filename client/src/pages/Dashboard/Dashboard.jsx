import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getLostFoundItems } from '../../api/lostFoundApi';
import { getEvents } from '../../api/eventsApi';
import { getMaterials } from '../../api/materialsApi';
import { Search, Calendar, BookOpen, MapPin, Clock, Plus, ArrowRight, Shield } from 'lucide-react';
import { formatDate, getInitials, timeAgo } from '../../utils/helpers';
import Spinner from '../../components/Spinner';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ lostFound: null, events: null, materials: null });
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getLostFoundItems({ limit: 5 }),
      getEvents({ upcoming: 'true', limit: 4 }),
      getMaterials({ limit: 1 }),
    ]).then(([lf, ev, mat]) => {
      setStats({ lostFound: lf.data.pagination.total, events: ev.data.pagination.total, materials: mat.data.pagination.total });
      setItems(lf.data.items);
      setEvents(ev.data.events);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="page-container">

      {/* Header */}
      <div className="section-gap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%', background: 'var(--amber-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
            fontWeight: 600, color: 'var(--primary-dark)', flexShrink: 0, overflow: 'hidden'
          }}>
            {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(user?.name || '?')}
          </div>
          <div>
            <p className="text-meta" style={{ marginBottom: '2px' }}>{greeting}</p>
            <h1 className="text-page-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {user?.name?.split(' ')[0]}
              {user?.role === 'admin' && (
                <span className="badge" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--amber-accent)' }}>
                  <Shield size={12} style={{ marginRight: '4px' }} /> Admin
                </span>
              )}
            </h1>
            {user?.role !== 'admin' && <p className="text-meta" style={{ marginTop: '2px' }}>{user?.branch} · Year {user?.year}</p>}
          </div>
        </div>
        <Link to="/lost-found/new" className="btn btn-primary" style={{ padding: '8px 16px' }}>
          <Plus size={16} /> Post Item
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Lost & Found Items', value: stats.lostFound, to: '/lost-found' },
          { label: 'Upcoming Events',    value: stats.events,    to: '/events' },
          { label: 'Study Materials',    value: stats.materials, to: '/materials' },
        ].map(({ label, value, to }) => (
          <Link key={to} to={to} style={{
            background: 'var(--bg-stats)',
            borderRadius: '8px',
            padding: '16px',
            textDecoration: 'none',
            display: 'block'
          }}>
            <p style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>{value ?? '—'}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{label}</p>
          </Link>
        ))}
      </div>

      {/* Two-col layout for quick actions and events */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: '16px', marginBottom: '24px' }}>

        {/* Quick actions */}
        <div>
          <p className="text-label" style={{ marginBottom: '10px' }}>Quick Actions</p>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {[
              { label: 'Report lost item',  to: '/lost-found/new',  icon: Search },
              { label: 'Browse events',      to: '/events',          icon: Calendar },
              { label: 'Upload study notes', to: '/materials/upload',icon: Plus },
              { label: 'View all materials', to: '/materials',       icon: BookOpen },
            ].map(({ label, to, icon: Icon }, i, arr) => (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', textDecoration: 'none',
                borderBottom: i < arr.length - 1 ? '0.5px solid var(--border-default)' : 'none',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-stats)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Icon size={16} color="var(--primary-indigo)" />
                <span className="text-body" style={{ fontWeight: 500, flex: 1 }}>{label}</span>
                <ArrowRight size={16} color="var(--text-tertiary)" />
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <p className="text-label" style={{ marginBottom: 0 }}>Upcoming Events</p>
            <Link to="/events" style={{ fontSize: '12px', color: 'var(--primary-indigo)', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {events.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                <Calendar size={48} color="var(--border-input)" style={{ margin: '0 auto 12px' }} />
                <p className="text-body" style={{ fontWeight: 500 }}>Nothing here yet</p>
                <p className="text-meta">No upcoming events are scheduled.</p>
              </div>
            ) : events.map((ev, i, arr) => (
              <Link key={ev._id} to={`/events/${ev._id}`} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                textDecoration: 'none', borderBottom: i < arr.length - 1 ? '0.5px solid var(--border-default)' : 'none',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-stats)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{
                  width: '36px', height: '36px', background: 'var(--indigo-tint)', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Calendar size={16} color="var(--primary-indigo)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="text-body" style={{ fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{ev.title}</p>
                  <p className="text-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Clock size={12} /> {formatDate(ev.date)} · {ev.venue}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent lost & found */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <p className="text-label" style={{ marginBottom: 0 }}>Recent Lost & Found</p>
          <Link to="/lost-found" style={{ fontSize: '12px', color: 'var(--primary-indigo)', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
        </div>
        {items.length === 0 ? (
          <div className="card" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Search size={48} color="var(--border-input)" style={{ margin: '0 auto 12px' }} />
            <p className="text-body" style={{ fontWeight: 500 }}>Nothing here yet</p>
            <p className="text-meta" style={{ marginBottom: '16px' }}>No items have been posted.</p>
            <Link to="/lost-found/new" className="btn btn-primary">Post an item</Link>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {items.map((item, i, arr) => (
              <Link key={item._id} to={`/lost-found/${item._id}`} style={{
                display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px',
                textDecoration: 'none', borderBottom: i < arr.length - 1 ? '0.5px solid var(--border-default)' : 'none',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-stats)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: item.type === 'lost' ? '#FEF2F2' : '#ECFDF5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Search size={16} color={item.type === 'lost' ? '#DC2626' : '#059669'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="text-body" style={{ fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.title}</p>
                  <p className="text-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <MapPin size={12} /> {item.location} · {timeAgo(item.createdAt)}
                  </p>
                </div>
                <span className={`badge badge-${item.status === 'open' ? 'open' : item.status === 'claimed' ? 'claimed' : 'resolved'}`}>
                  {item.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
