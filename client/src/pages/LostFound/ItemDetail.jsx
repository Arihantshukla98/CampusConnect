import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLostFoundItem, claimItem, resolveItem, deleteItem } from '../../api/lostFoundApi';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, MapPin, Tag, Clock, User, CheckCircle, Trash2, Flag } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { formatDateTime, getInitials, CATEGORY_ICONS } from '../../utils/helpers';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [modal, setModal] = useState({ open: false, action: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getLostFoundItem(id);
        setItem(res.data.item);
      } catch {
        toast.error('Item not found');
        navigate('/lost-found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const isOwner = user && item && item.postedBy?._id === user._id;
  const isAdmin = user?.role === 'admin';
  const canClaim = user && !isOwner && item?.status === 'open';
  const canResolve = (isOwner || isAdmin) && item?.status !== 'resolved';
  const canDelete = isOwner || isAdmin;

  const handleAction = async () => {
    setActionLoading(modal.action);
    try {
      if (modal.action === 'claim') {
        const res = await claimItem(id);
        setItem(res.data.item);
        toast.success('Item claimed! The poster will be notified.');
      } else if (modal.action === 'resolve') {
        const res = await resolveItem(id);
        setItem(res.data.item);
        toast.success('Marked as resolved!');
      } else if (modal.action === 'delete') {
        await deleteItem(id);
        toast.success('Item deleted');
        navigate('/lost-found');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading('');
      setModal({ open: false, action: '' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!item) return null;

  const icon = CATEGORY_ICONS[item.category] || '📦';

  return (
    <div className="page-container max-w-3xl animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2" id="item-detail-back">
        <ArrowLeft className="w-4 h-4" />
        Back to Board
      </button>

      <div className="card overflow-hidden">
        {/* Image */}
        {item.image ? (
          <div className="h-72 w-full overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <span className="text-7xl opacity-30">{icon}</span>
          </div>
        )}

        <div className="p-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`badge ${item.type === 'lost' ? 'badge-red' : 'badge-blue'}`}>
              {item.type === 'lost' ? '🔍 Lost' : '✅ Found'}
            </span>
            <StatusBadge status={item.status} />
            <span className="badge badge-gray capitalize">{item.category}</span>
          </div>

          <h1 className="text-2xl font-black text-slate-800 mb-2">{item.title}</h1>
          <p className="text-slate-600 leading-relaxed mb-6">{item.description}</p>

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-3">
              <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400 font-medium">Location</p>
                <p className="font-semibold">{item.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-3">
              <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400 font-medium">Posted</p>
                <p className="font-semibold">{formatDateTime(item.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Posted by */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center text-white font-bold flex-shrink-0">
              {item.postedBy?.avatar ? (
                <img src={item.postedBy.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : getInitials(item.postedBy?.name || '?')}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Posted by</p>
              <p className="text-sm font-semibold text-slate-800">{item.postedBy?.name}</p>
              <p className="text-xs text-slate-500">{item.postedBy?.branch} · Year {item.postedBy?.year}</p>
            </div>
          </div>

          {/* Claimed by */}
          {item.claimedBy && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                {getInitials(item.claimedBy?.name || '?')}
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium">Claimed by</p>
                <p className="text-sm font-semibold text-slate-800">{item.claimedBy?.name}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {user && (
            <div className="flex flex-wrap gap-3">
              {canClaim && (
                <button
                  id="item-detail-claim"
                  className="btn-accent flex-1 sm:flex-none"
                  onClick={() => setModal({ open: true, action: 'claim' })}
                >
                  <Flag className="w-4 h-4" />
                  Claim This Item
                </button>
              )}
              {canResolve && (
                <button
                  id="item-detail-resolve"
                  className="btn-secondary flex-1 sm:flex-none"
                  onClick={() => setModal({ open: true, action: 'resolve' })}
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Resolved
                </button>
              )}
              {canDelete && (
                <button
                  id="item-detail-delete"
                  className="btn-danger flex-1 sm:flex-none"
                  onClick={() => setModal({ open: true, action: 'delete' })}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, action: '' })}
        onConfirm={handleAction}
        loading={!!actionLoading}
        title={
          modal.action === 'delete'
            ? 'Delete this item?'
            : modal.action === 'claim'
            ? 'Claim this item?'
            : 'Mark as resolved?'
        }
        message={
          modal.action === 'delete'
            ? 'This will permanently remove the post. This cannot be undone.'
            : modal.action === 'claim'
            ? 'You are claiming this item. The poster will know it has been found.'
            : 'This will close the post and mark it as resolved.'
        }
        confirmLabel={modal.action === 'delete' ? 'Delete' : modal.action === 'claim' ? 'Yes, Claim' : 'Mark Resolved'}
        isDanger={modal.action === 'delete'}
      />
    </div>
  );
};

export default ItemDetail;
