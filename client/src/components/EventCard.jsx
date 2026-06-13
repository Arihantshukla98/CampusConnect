import { Link } from 'react-router-dom';
import { MapPin, Clock, Users } from 'lucide-react';
import { formatDate, EVENT_CATEGORY_COLORS, isUpcoming } from '../utils/helpers';

const CATEGORY_EMOJI = { technical: '💻', cultural: '🎭', sports: '⚽', workshop: '🔧', seminar: '🎤', other: '📌' };

export default function EventCard({ event, onRSVP, isRSVPed, rsvpLoading }) {
  const upcoming = isUpcoming(event.date);

  return (
    <div id={`event-card-${event._id}`} className="card"
         style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0, position: 'relative' }}>
      {/* Top accent stripe */}
      <div style={{ height: '4px', background: 'var(--primary-indigo)', width: '100%', flexShrink: 0 }}></div>

      {/* Body */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <span className="badge badge-event" style={{ textTransform: 'capitalize' }}>
            {event.category}
          </span>
          <span className={`badge ${upcoming ? 'badge-open' : 'badge-resolved'}`}>{upcoming ? 'Upcoming' : 'Past'}</span>
        </div>

        <Link to={`/events/${event._id}`} id={`event-card-title-${event._id}`}
              className="text-card-title line-clamp-2"
              style={{ textDecoration: 'none', lineHeight: 1.4, marginBottom: '12px', minHeight: '42px' }}>
          {event.title}
        </Link>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="var(--amber-accent)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--amber-accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {formatDate(event.date)}{event.time && ` · ${event.time}`}
            </span>
          </div>
          <div className="text-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} style={{ flexShrink: 0 }} />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          <div className="text-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} style={{ flexShrink: 0 }} />
            {event.rsvpList?.length || 0} attending
          </div>
        </div>

        {/* Footer */}
        <div className="card-footer" style={{ marginTop: 'auto', gap: '8px' }}>
          <Link to={`/events/${event._id}`} className="btn btn-ghost btn-sm" id={`event-card-details-${event._id}`} style={{ flex: 1 }}>
            Details
          </Link>
          {onRSVP && upcoming && (
            <button id={`event-card-rsvp-${event._id}`}
                    className={`btn ${isRSVPed ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    style={{ flex: 1 }}
                    onClick={e => { e.preventDefault(); onRSVP(event._id); }}
                    disabled={rsvpLoading}>
              {isRSVPed ? 'RSVP\'d' : 'RSVP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
