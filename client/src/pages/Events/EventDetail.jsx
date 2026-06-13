import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvent, toggleRSVP, deleteEvent } from '../../api/eventsApi';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Calendar, Clock, MapPin, Users, ExternalLink, Edit, Trash2, Check } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { formatDate, EVENT_CATEGORY_COLORS, isUpcoming, getInitials } from '../../utils/helpers';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isAdmin = user?.role === 'admin';

  const fetchEvent = async () => {
    try {
      const res = await getEvent(id);
      setEvent(res.data.event);
    } catch {
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const isRSVPed = user && event?.rsvpList?.some((u) => u._id === user._id || u === user._id);
  const upcoming = event ? isUpcoming(event.date) : false;

  const handleRSVP = async () => {
    if (!user) { toast.error('Please log in'); return; }
    setRsvpLoading(true);
    try {
      const res = await toggleRSVP(id);
      toast.success(res.data.isRSVPed ? 'RSVP confirmed! 🎉' : 'RSVP removed');
      fetchEvent(); // Refetch to update list
    } catch (err) {
      toast.error(err.response?.data?.message || 'RSVP failed');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteEvent(id);
      toast.success('Event deleted');
      navigate('/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteLoading(false);
      setDeleteModal(false);
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!event) return null;

  const categoryBadge = EVENT_CATEGORY_COLORS[event.category] || 'badge-gray';

  return (
    <div className="page-container max-w-3xl animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2" id="event-detail-back">
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </button>

      <div className="card overflow-hidden">
        {/* Hero */}
        <div className="relative h-64 overflow-hidden">
          {event.image ? (
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full gradient-card flex items-center justify-center">
              <span className="text-7xl opacity-60">🎓</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={`${categoryBadge} capitalize`}>{event.category}</span>
              <span className={`badge ${upcoming ? 'badge-green' : 'badge-gray'}`}>
                {upcoming ? 'Upcoming' : 'Past Event'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white leading-tight">{event.title}</h1>
          </div>
        </div>

        <div className="p-6">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: Calendar, label: 'Date', value: formatDate(event.date) },
              { icon: Clock, label: 'Time', value: event.time || 'TBD' },
              { icon: MapPin, label: 'Venue', value: event.venue },
              { icon: Users, label: 'Organizer', value: event.organizer },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-800">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <h2 className="font-bold text-slate-800 mb-2">About this event</h2>
          <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-line">{event.description}</p>

          {/* RSVP count */}
          <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-2xl mb-6">
            <div className="flex -space-x-2">
              {event.rsvpList?.slice(0, 5).map((u) => (
                <div
                  key={u._id || u}
                  className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold"
                >
                  {u.avatar ? (
                    <img src={u.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : getInitials(u.name || '?')}
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold text-primary-700">
              {event.rsvpList?.length || 0} {event.rsvpList?.length === 1 ? 'person' : 'people'} attending
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {upcoming && user && (
              <button
                id="event-detail-rsvp"
                className={`flex-1 btn ${isRSVPed ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleRSVP}
                disabled={rsvpLoading}
              >
                {rsvpLoading ? <Spinner size="sm" /> : isRSVPed ? (<><Check className="w-4 h-4" /> You're Going!</>) : 'RSVP to Event'}
              </button>
            )}

            {event.registrationLink && (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                id="event-detail-register"
                className="btn-accent flex-1"
              >
                Register Externally
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {isAdmin && (
              <>
                <Link
                  to={`/events/${id}/edit`}
                  id="event-detail-edit"
                  className="btn-secondary"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  id="event-detail-delete"
                  className="btn-danger"
                  onClick={() => setDeleteModal(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete this event?"
        message="This will permanently remove the event and all RSVPs. This cannot be undone."
        confirmLabel="Delete Event"
        isDanger
      />
    </div>
  );
};

export default EventDetail;
