import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMaterial, downloadMaterial, deleteMaterial } from '../../api/materialsApi';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Download, FileText, Image, File, User, Trash2, Calendar, Hash } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { formatDate, getInitials, timeAgo } from '../../utils/helpers';

const fileIcons = {
  pdf: <FileText className="w-12 h-12 text-red-400" />,
  image: <Image className="w-12 h-12 text-blue-400" />,
  other: <File className="w-12 h-12 text-slate-400" />,
};

const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMaterial(id);
        setMaterial(res.data.material);
      } catch {
        toast.error('Material not found');
        navigate('/materials');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const isOwner = user && material && material.uploadedBy?._id === user._id;
  const isAdmin = user?.role === 'admin';
  const canDelete = isOwner || isAdmin;

  const handleDownload = async () => {
    if (!user) { toast.error('Please log in to download'); return; }
    setDownloadLoading(true);
    try {
      const res = await downloadMaterial(id);
      window.open(res.data.fileUrl, '_blank');
      toast.success('Opening file...');
      setMaterial((prev) => ({ ...prev, downloads: res.data.downloads }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Download failed');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteMaterial(id);
      toast.success('Material deleted');
      navigate('/materials');
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

  if (!material) return null;

  const icon = fileIcons[material.fileType] || fileIcons.other;

  return (
    <div className="page-container max-w-3xl animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2" id="material-detail-back">
        <ArrowLeft className="w-4 h-4" />
        Back to Materials
      </button>

      <div className="card overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary-50 to-purple-50 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0">
              {material.fileType === 'image' && material.fileUrl ? (
                <img src={material.fileUrl} alt={material.title} className="w-full h-full rounded-2xl object-cover" />
              ) : icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-slate-800 leading-tight">{material.title}</h1>
              <p className="text-slate-500 text-sm mt-1">{material.subject}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="badge badge-blue">{material.branch}</span>
                <span className="badge badge-indigo">Year {material.year}</span>
                <span className="badge badge-gray">Sem {material.semester}</span>
                <span className="badge badge-purple capitalize">{material.fileType}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Description */}
          <h2 className="font-bold text-slate-800 mb-2">Description</h2>
          <p className="text-slate-600 leading-relaxed mb-6">{material.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Download, label: 'Downloads', value: material.downloads },
              { icon: Calendar, label: 'Uploaded', value: formatDate(material.createdAt) },
              { icon: Hash, label: 'File Type', value: material.fileType?.toUpperCase() || 'N/A' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center p-3 bg-slate-50 rounded-xl">
                <Icon className="w-4 h-4 text-primary-500 mx-auto mb-1" />
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-bold text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Uploaded by */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center text-white font-bold flex-shrink-0">
              {material.uploadedBy?.avatar ? (
                <img src={material.uploadedBy.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : getInitials(material.uploadedBy?.name || '?')}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Uploaded by</p>
              <p className="text-sm font-semibold text-slate-800">{material.uploadedBy?.name}</p>
              <p className="text-xs text-slate-500">{material.uploadedBy?.branch} · {timeAgo(material.createdAt)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              id="material-detail-download"
              className="btn-primary flex-1"
              onClick={handleDownload}
              disabled={downloadLoading}
            >
              {downloadLoading ? <Spinner size="sm" /> : (<><Download className="w-4 h-4" /> Download File</>)}
            </button>

            {canDelete && (
              <button
                id="material-detail-delete"
                className="btn-danger"
                onClick={() => setDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete this material?"
        message="This will permanently remove the file and its record. This cannot be undone."
        confirmLabel="Delete"
        isDanger
      />
    </div>
  );
};

export default MaterialDetail;
