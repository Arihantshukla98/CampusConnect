import { Link } from 'react-router-dom';
import { MapPin, Clock, Tag, Smartphone, CreditCard, PenTool, Package } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { timeAgo, getInitials } from '../utils/helpers';

export default function ItemCard({ item }) {
  const isLost = item.type === 'lost';

  // Determine icon and colors based on category
  const getCategoryConfig = (category) => {
    switch (category) {
      case 'electronics': return { icon: Smartphone, bg: '#FEF2F2', color: '#DC2626' };
      case 'id-card':
      case 'id card':
      case 'wallet':      return { icon: CreditCard, bg: '#ECFDF5', color: '#059669' };
      case 'stationery':  return { icon: PenTool, bg: '#EFF6FF', color: '#2563EB' };
      default:            return { icon: Package, bg: '#F5F3FF', color: '#7C3AED' };
    }
  };

  const { icon: Icon, bg, color } = getCategoryConfig(item.category?.toLowerCase());

  return (
    <Link to={`/lost-found/${item._id}`} id={`item-card-${item._id}`}
          className="card" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', transition: 'border-color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-focus)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>

      {/* Header: Icon + Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '9px', background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Icon size={18} color={color} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>{isLost ? 'Lost' : 'Found'}</span>
          <span className={`badge badge-${item.status === 'open' ? 'open' : item.status === 'claimed' ? 'claimed' : 'resolved'}`}>
            {item.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <p className="text-card-title line-clamp-2" style={{ marginBottom: '6px', lineHeight: 1.4 }}>
          {item.title}
        </p>
        <p className="text-meta line-clamp-2" style={{ marginBottom: '12px' }}>
          {item.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
          <div className="text-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} style={{ flexShrink: 0 }} />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="text-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Tag size={14} style={{ flexShrink: 0 }} />
            <span style={{ textTransform: 'capitalize' }}>{item.category}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%', background: 'var(--amber-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 600, color: 'var(--primary-dark)', flexShrink: 0, overflow: 'hidden'
          }}>
            {item.postedBy?.avatar ? <img src={item.postedBy.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(item.postedBy?.name || '?')}
          </div>
          <span className="text-meta line-clamp-1" style={{ maxWidth: '80px' }}>{item.postedBy?.name}</span>
        </div>
        <span className="text-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} />{timeAgo(item.createdAt)}
        </span>
      </div>
    </Link>
  );
}
