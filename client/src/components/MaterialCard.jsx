import { Link } from 'react-router-dom';
import { Download, FileText, Image, File } from 'lucide-react';
import { timeAgo, getInitials } from '../utils/helpers';

const fileConfig = {
  pdf:   { icon: <FileText className="w-5 h-5" />, color: 'text-rose-400',   bg: 'bg-rose-500/15 border-rose-500/20' },
  image: { icon: <Image    className="w-5 h-5" />, color: 'text-blue-400',   bg: 'bg-blue-500/15 border-blue-500/20' },
  other: { icon: <File     className="w-5 h-5" />, color: 'text-slate-400',  bg: 'bg-white/8 border-white/10' },
};

const branchColors = {
  CSE:   'badge-blue',
  ECE:   'badge-purple',
  ME:    'badge-yellow',
  Civil: 'badge-green',
  MBA:   'badge-pink',
  Other: 'badge-gray',
};

const MaterialCard = ({ material, onDownload }) => {
  const fc = fileConfig[material.fileType] || fileConfig.other;
  const branchBadge = branchColors[material.branch] || 'badge-gray';

  return (
    <div id={`material-card-${material._id}`} className="card-hover flex flex-col p-5 group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 ${fc.bg} ${fc.color} group-hover:scale-105 transition-transform`}>
          {fc.icon}
        </div>
        <div className="flex-1 min-w-0">
          <Link
            to={`/materials/${material._id}`}
            id={`material-card-title-${material._id}`}
            className="font-bold text-white text-sm hover:text-primary-300 transition-colors line-clamp-2 leading-snug block"
          >
            {material.title}
          </Link>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{material.subject}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{material.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className={branchBadge}>{material.branch}</span>
        <span className="badge badge-indigo">Year {material.year}</span>
        <span className="badge badge-gray">Sem {material.semester}</span>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-white/6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {material.uploadedBy?.avatar ? (
              <img src={material.uploadedBy.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(material.uploadedBy?.name || '?')
            )}
          </div>
          <div>
            <p className="text-xs text-slate-300 font-medium leading-none">{material.uploadedBy?.name}</p>
            <p className="text-xs text-slate-600 mt-0.5">{timeAgo(material.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <Download className="w-3 h-3" />
            {material.downloads}
          </span>
          <button
            id={`material-card-download-${material._id}`}
            className="btn-primary text-xs py-1.5 px-3"
            onClick={() => onDownload(material)}
          >
            <Download className="w-3 h-3" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
