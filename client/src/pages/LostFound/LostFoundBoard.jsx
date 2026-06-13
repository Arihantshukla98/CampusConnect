import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getLostFoundItems } from '../../api/lostFoundApi';
import { Plus, Search } from 'lucide-react';
import ItemCard from '../../components/ItemCard';
import FilterBar from '../../components/FilterBar';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import { debounce, LOST_FOUND_CATEGORIES } from '../../utils/helpers';

const categoryOptions = LOST_FOUND_CATEGORIES.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));
const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'claimed', label: 'Claimed' },
  { value: 'resolved', label: 'Resolved' },
];

const LostFoundBoard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';
  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (type) params.type = type;
      if (category) params.category = category;
      if (status) params.status = status;

      const res = await getLostFoundItems(params);
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, type, category, status, page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const debouncedSearch = useCallback(
    debounce((val) => updateParam('search', val), 400),
    [searchParams]
  );

  const handleSearchChange = (val) => {
    debouncedSearch(val);
    // Update URL immediately for controlled input display
    const next = new URLSearchParams(searchParams);
    if (val) next.set('search', val);
    else next.delete('search');
    next.delete('page');
    setSearchParams(next);
  };

  const handleClear = () => {
    setSearchParams({});
  };

  const handlePageChange = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
    window.scrollTo(0, 0);
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="section-title">Lost & Found Board</h1>
          <p className="section-subtitle">Browse or post lost and found items on campus</p>
        </div>
        <Link to="/lost-found/new" id="lostfound-post-btn" className="btn-primary">
          <Plus className="w-4 h-4" />
          Post Item
        </Link>
      </div>

      {/* Type Toggle */}
      <div className="flex gap-2 mb-4">
        {[
          { label: 'All Items', value: '' },
          { label: '🔍 Lost', value: 'lost' },
          { label: '✅ Found', value: 'found' },
        ].map(({ label, value }) => (
          <button
            key={value}
            id={`lostfound-type-${value || 'all'}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              type === value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
            onClick={() => updateParam('type', value)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="mb-6">
        <FilterBar
          search={search}
          onSearchChange={handleSearchChange}
          filters={[
            { name: 'category', value: category, options: categoryOptions, placeholder: 'All Categories' },
            { name: 'status', value: status, options: statusOptions, placeholder: 'All Status' },
          ]}
          onFilterChange={(name, val) => updateParam(name, val)}
          onClear={handleClear}
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No items found"
          description="Try adjusting your filters or be the first to post!"
          icon={Search}
          action={
            <Link to="/lost-found/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              Post an Item
            </Link>
          }
        />
      ) : (
        <>
          <p className="text-xs text-slate-500 mb-4">
            Showing {items.length} of {pagination?.total} results
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i + 1}
                  id={`lostfound-page-${i + 1}`}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    page === i + 1
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  onClick={() => handlePageChange(i + 1)}
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

export default LostFoundBoard;
