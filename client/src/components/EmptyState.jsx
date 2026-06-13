import { PackageOpen } from 'lucide-react';

const EmptyState = ({ title = 'Nothing here yet', description = '', icon: Icon = PackageOpen, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
      {description && <p className="text-slate-500 text-sm max-w-xs">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
