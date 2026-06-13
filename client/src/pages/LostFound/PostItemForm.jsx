import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLostFoundItem } from '../../api/lostFoundApi';
import { Upload, X, ArrowLeft, Phone, MessageCircle, Mail, MapPin, Tag, Info } from 'lucide-react';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { LOST_FOUND_CATEGORIES } from '../../utils/helpers';

export default function PostItemForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: 'other', type: 'lost',
    location: '', contactPhone: '', contactWhatsapp: '', contactEmail: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) { toast.error('Only JPG, PNG, or PDF files are allowed'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('File must be under 10MB'); return; }
    setImageFile(file);
    if (file.type.startsWith('image/')) setImagePreview(URL.createObjectURL(file));
    else setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('type', form.type);
      formData.append('location', form.location);
      formData.append('contact', JSON.stringify({
        phone: form.contactPhone,
        whatsapp: form.contactWhatsapp,
        email: form.contactEmail,
      }));
      if (imageFile) formData.append('image', imageFile);

      await createLostFoundItem(formData);
      toast.success('Item posted!');
      navigate('/lost-found');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post item');
    } finally {
      setLoading(false);
    }
  };

  const isLost = form.type === 'lost';
  const iconStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' };

  return (
    <div className="page-container" style={{ maxWidth: '640px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: '24px', marginLeft: '-12px', border: 'none' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ marginBottom: '24px' }}>
        <h1 className="text-display" style={{ marginBottom: '4px' }}>Post a Lost / Found Item</h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)' }}>Help your fellow students reunite with their belongings</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Type Toggle */}
          <div>
            <p className="label-input">Item Type <span style={{ color: '#EF4444' }}>*</span></p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {['lost', 'found'].map(t => {
                const active = form.type === t;
                const isTlost = t === 'lost';
                return (
                  <button key={t} type="button"
                          onClick={() => setForm({ ...form, type: t })}
                          style={{
                            padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.15s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            background: active ? (isTlost ? '#FEF2F2' : '#ECFDF5') : 'transparent',
                            color: active ? (isTlost ? '#991B1B' : '#065F46') : 'var(--text-secondary)',
                            border: `0.5px solid ${active ? (isTlost ? '#FECACA' : '#A7F3D0') : 'var(--border-default)'}`
                          }}>
                    <span style={{ fontSize: '16px' }}>{isTlost ? '🔍' : '✅'}</span>
                    {isTlost ? 'I Lost Something' : 'I Found Something'}
                  </button>
                );
              })}
            </div>
            <p className="text-meta" style={{ marginTop: '8px' }}>
              {isLost ? 'Report an item you lost on campus.' : 'Report an item you found on campus.'}
            </p>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="post-item-title" className="label-input">
              Item Title <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input id="post-item-title" type="text" name="title" className="input"
                   placeholder="e.g. Black iPhone 14 with cracked screen"
                   value={form.title} onChange={handleChange} required />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="post-item-description" className="label-input">
              Description <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea id="post-item-description" name="description" className="input" style={{ resize: 'none' }} rows={3}
                      placeholder="Describe the item — color, brand, identifying features, when/where it was lost..."
                      value={form.description} onChange={handleChange} required />
          </div>

          {/* Category + Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label htmlFor="post-item-category" className="label-input">Category</label>
              <div style={{ position: 'relative' }}>
                <Tag size={16} style={iconStyle} />
                <select id="post-item-category" name="category" className="select" style={{ paddingLeft: '38px' }}
                        value={form.category} onChange={handleChange}>
                  {LOST_FOUND_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="post-item-location" className="label-input">
                Location <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={iconStyle} />
                <input id="post-item-location" type="text" name="location" className="input" style={{ paddingLeft: '38px' }}
                       placeholder="e.g. Library 2nd floor" value={form.location} onChange={handleChange} required />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '4px', height: '16px', background: 'var(--primary-indigo)', borderRadius: '2px' }}></div>
              <p className="text-card-title">Contact Details</p>
            </div>
            <div style={{ background: 'var(--bg-stats)', borderRadius: '8px', padding: '16px', border: '0.5px solid var(--border-default)' }}>
              <p className="text-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                <Info size={14} style={{ flexShrink: 0 }} />
                Add at least one way for people to contact you.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={iconStyle} />
                  <input type="tel" name="contactPhone" className="input" style={{ paddingLeft: '38px', background: '#FFFFFF' }}
                         placeholder="Phone number (e.g. 9876543210)" value={form.contactPhone} onChange={handleChange} />
                </div>
                <div style={{ position: 'relative' }}>
                  <MessageCircle size={16} style={iconStyle} />
                  <input type="tel" name="contactWhatsapp" className="input" style={{ paddingLeft: '38px', background: '#FFFFFF' }}
                         placeholder="WhatsApp number (if different)" value={form.contactWhatsapp} onChange={handleChange} />
                </div>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={iconStyle} />
                  <input type="email" name="contactEmail" className="input" style={{ paddingLeft: '38px', background: '#FFFFFF' }}
                         placeholder="Email address" value={form.contactEmail} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <p className="label-input">Photo (optional)</p>
            <label htmlFor="post-item-image"
                   style={{
                     display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                     width: '100%', height: '120px', borderRadius: '8px', cursor: 'pointer',
                     border: '1px dashed var(--border-input)', background: 'var(--bg-stats)',
                     transition: 'border-color 0.15s'
                   }}
                   onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-focus)'}
                   onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-input)'}>
              {imagePreview ? (
                <div style={{ position: 'relative', width: '100%', height: '100%', padding: '4px' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                  <button type="button"
                          style={{
                            position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px',
                            borderRadius: '50%', background: '#EF4444', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer'
                          }}
                          onClick={e => { e.preventDefault(); setImageFile(null); setImagePreview(''); }}>
                    <X size={14} />
                  </button>
                </div>
              ) : imageFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Upload size={24} color="var(--primary-indigo)" />
                  <p className="text-body" style={{ fontWeight: 500 }}>{imageFile.name}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Upload size={24} color="var(--text-tertiary)" />
                  <p className="text-body" style={{ fontWeight: 500 }}>Click to upload photo</p>
                  <p className="text-meta">JPG, PNG, PDF — max 10MB</p>
                </div>
              )}
              <input id="post-item-image" type="file" style={{ display: 'none' }} accept=".jpg,.jpeg,.png,.pdf"
                     onChange={handleImageChange} />
            </label>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate(-1)} disabled={loading}>
              Cancel
            </button>
            <button id="post-item-submit" type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? <Spinner size="sm" /> : `Post ${isLost ? 'Lost' : 'Found'} Item`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
