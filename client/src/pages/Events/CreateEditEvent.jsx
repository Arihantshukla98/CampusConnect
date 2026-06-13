import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, updateEvent, getEvent } from '../../api/eventsApi';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { EVENT_CATEGORIES } from '../../utils/helpers';

const CreateEditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Present when editing
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'other',
    date: '',
    time: '',
    venue: '',
    organizer: '',
    registrationLink: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchEvent = async () => {
        try {
          const res = await getEvent(id);
          const e = res.data.event;
          setForm({
            title: e.title,
            description: e.description,
            category: e.category,
            date: e.date?.split('T')[0] || '',
            time: e.time || '',
            venue: e.venue,
            organizer: e.organizer,
            registrationLink: e.registrationLink || '',
          });
          if (e.image) setImagePreview(e.image);
        } catch {
          toast.error('Failed to load event');
          navigate('/events');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) { toast.error('Only JPG or PNG images allowed'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('File must be under 10MB'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.date || !form.time || !form.venue || !form.organizer) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      if (imageFile) formData.append('image', imageFile);

      if (isEdit) {
        await updateEvent(id, formData);
        toast.success('Event updated!');
        navigate(`/events/${id}`);
      } else {
        const res = await createEvent(formData);
        toast.success('Event created! 🎉');
        navigate(`/events/${res.data.event._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="page-container max-w-2xl animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2" id="create-event-back">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="section-title mb-1">{isEdit ? 'Edit Event' : 'Create New Event'}</h1>
      <p className="section-subtitle mb-6">
        {isEdit ? 'Update the event details' : 'Share an upcoming event with the campus'}
      </p>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="event-title" className="label">Title <span className="text-red-500">*</span></label>
            <input id="event-title" type="text" name="title" className="input" placeholder="e.g. National Hackathon 2024" value={form.title} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="event-description" className="label">Description <span className="text-red-500">*</span></label>
            <textarea id="event-description" name="description" className="input resize-none" rows={4} placeholder="Describe the event..." value={form.description} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="event-category" className="label">Category</label>
              <select id="event-category" name="category" className="select" value={form.category} onChange={handleChange}>
                {EVENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="event-organizer" className="label">Organizer <span className="text-red-500">*</span></label>
              <input id="event-organizer" type="text" name="organizer" className="input" placeholder="e.g. CSE Dept" value={form.organizer} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="event-date" className="label">Date <span className="text-red-500">*</span></label>
              <input id="event-date" type="date" name="date" className="input" value={form.date} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="event-time" className="label">Time <span className="text-red-500">*</span></label>
              <input id="event-time" type="time" name="time" className="input" value={form.time} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label htmlFor="event-venue" className="label">Venue <span className="text-red-500">*</span></label>
            <input id="event-venue" type="text" name="venue" className="input" placeholder="e.g. Main Auditorium" value={form.venue} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="event-reg-link" className="label">Registration Link (optional)</label>
            <input id="event-reg-link" type="url" name="registrationLink" className="input" placeholder="https://..." value={form.registrationLink} onChange={handleChange} />
          </div>

          {/* Image upload */}
          <div>
            <p className="label">Event Banner (optional)</p>
            <label htmlFor="event-image" className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all">
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  <button
                    type="button"
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                    onClick={(e) => { e.preventDefault(); setImageFile(null); setImagePreview(''); }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Upload className="w-8 h-8" />
                  <p className="text-sm font-medium text-slate-600">Upload event banner</p>
                  <p className="text-xs">JPG or PNG — max 10MB</p>
                </div>
              )}
              <input id="event-image" type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={handleImageChange} />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
            <button id="create-event-submit" type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? <Spinner size="sm" /> : isEdit ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditEvent;
