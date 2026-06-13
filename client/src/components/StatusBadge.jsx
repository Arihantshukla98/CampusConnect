import { STATUS_BADGE_MAP } from '../utils/helpers';

const statusLabels = {
  open: 'Open',
  claimed: 'Claimed',
  resolved: 'Resolved',
};

const StatusBadge = ({ status }) => {
  const badgeClass = STATUS_BADGE_MAP[status] || 'badge-gray';
  return (
    <span className={badgeClass}>
      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block mr-1 opacity-70" />
      {statusLabels[status] || status}
    </span>
  );
};

export default StatusBadge;
