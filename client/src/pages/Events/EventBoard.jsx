import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEvents, toggleRSVP } from '../../api/eventsApi';
import { Plus, Calendar } from 'lucide-react';
import EventCard from '../../components/EventCard';
import FilterBar from '../../components/FilterBar';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { debounce, EVENT_CATEGORIES } from '../../utils/helpers';

const categoryOptions = EVENT_CATEGORIES.map((c) => ({
  value: c,
  label: c.charAt(0).toUpperCase() + c.slice(1),
}));

const EventBoard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState('');
  const [userRsvps, setUserRsvps] = useState(new Set());

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const upcoming = searchParams.get('upcoming') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (upcoming) params.upcoming = upcoming;

      const res = await getEvents(params);
      const fetchedEvents = res.data.events;
      setEvents(fetchedEvents);
      setPagination(res.data.pagination);

      // Determine which events the user has RSVP'd to
      if (user) {
        const rsvpSet = new Set(
          fetchedEvents
            .filter((e) => e.rsvpList?.some((id) => id === user._id || id?._id === user._id))
            .map((e) => e._id)
        );
        setUserRsvps(rsvpSet);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, upcoming, page, user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const handleRSVP = async (eventId) => {
    if (!user) {
      toast.error('Please log in to RSVP');
      return;
    }
    setRsvpLoading(eventId);
    try {
      const res = await toggleRSVP(eventId);
      const { isRSVPed, rsvpCount } = res.data;
      toast.success(isRSVPed ? 'RSVP confirmed! 🎉' : 'RSVP removed');
      setUserRsvps((prev) => {
        const updated = new Set(prev);
        if (isRSVPed) updated.add(eventId);
        else updated.delete(eventId);
        return updated;
      });
      // Update event count in list
      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? { ...e, rsvpList: Array(rsvpCount).fill(null) } : e))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'RSVP failed');
    } finally {
      setRsvpLoading('');
    }
  };

  const debouncedSearch = useCallback(
    debounce((val) => updateParam('search', val), 400),
    [searchParams]
  );

  const handleSearchChange = (val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set('search', val);
    else next.delete('search');
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="section-title">Event Board</h1>
          <p className="section-subtitle">Discover events, workshops, and campus activities</p>
        </div>
        {user?.role === 'admin' && (
          <Link to="/events/new" id="events-create-btn" className="btn-primary">
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        )}
      </div>

      {/* Upcoming / Past toggle */}
      <div className="flex gap-2 mb-4">
        {[
          { label: '📅 All Events', value: '' },
          { label: '🔜 Upcoming', value: 'true' },
          { label: '⏪ Past', value: 'false' },
        ].map(({ label, value }) => (
          <button
            key={value}
            id={`events-time-${value || 'all'}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              upcoming === value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
            onClick={() => updateParam('upcoming', value)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar
          search={search}
          onSearchChange={handleSearchChange}
          filters={[
            { name: 'category', value: category, options: categoryOptions, placeholder: 'All Categories' },
          ]}
          onFilterChange={(name, val) => updateParam(name, val)}
          onClear={() => setSearchParams({})}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Check back soon or adjust your filters"
          icon={Calendar}
          action={
            user?.role === 'admin' ? (
              <Link to="/events/new" className="btn-primary">
                <Plus className="w-4 h-4" />
                Create Event
              </Link>
            ) : null
          }
        />
      ) : (
        <>
          <p className="text-xs text-slate-500 mb-4">
            Showing {events.length} of {pagination?.total} events
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRSVP={handleRSVP}
                isRSVPed={userRsvps.has(event._id)}
                rsvpLoading={rsvpLoading === event._id}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i + 1}
                  id={`events-page-${i + 1}`}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    page === i + 1
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.set('page', i + 1);
                    setSearchParams(next);
                    window.scrollTo(0, 0);
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventBoard;
