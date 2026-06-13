import { Search, X, ChevronDown } from 'lucide-react';

const FilterBar = ({ filters = [], search, onSearchChange, onFilterChange, onClear, children }) => {
  const hasActiveFilters =
    (search && search.trim()) || filters.some((f) => f.value && f.value !== '');

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="filter-search"
            type="text"
            className="input pl-10 pr-10"
            placeholder="Search..."
            value={search || ''}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown filters */}
        {filters.map((filter) => (
          <div key={filter.name} className="relative min-w-[140px]">
            <select
              id={`filter-${filter.name}`}
              className="select pr-8"
              value={filter.value}
              onChange={(e) => onFilterChange(filter.name, e.target.value)}
            >
              <option value="">{filter.placeholder || `All ${filter.name}`}</option>
              {filter.options.map((opt) => (
                <option key={typeof opt === 'object' ? opt.value : opt} value={typeof opt === 'object' ? opt.value : opt}>
                  {typeof opt === 'object' ? opt.label : opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        ))}

        {/* Extra children (e.g. toggle buttons) */}
        {children}

        {/* Clear button */}
        {hasActiveFilters && (
          <button
            id="filter-clear"
            className="btn-ghost whitespace-nowrap text-sm"
            onClick={onClear}
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
