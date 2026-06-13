const Spinner = ({ size = 'md', className = '' }) => {
  const s = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-8 h-8 border-2', xl: 'w-12 h-12 border-4' };
  return <div className={`${s[size]} border-gray-200 border-t-gray-500 rounded-full animate-spin ${className}`} role="status" aria-label="Loading" />;
};

export default Spinner;
