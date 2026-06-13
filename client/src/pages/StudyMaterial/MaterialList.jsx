import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getMaterials, downloadMaterial } from '../../api/materialsApi';
import { useAuth } from '../../context/AuthContext';
import { Plus, BookOpen } from 'lucide-react';
import MaterialCard from '../../components/MaterialCard';
import FilterBar from '../../components/FilterBar';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { debounce, BRANCHES, YEARS } from '../../utils/helpers';

const branchOptions = BRANCHES.map((b) => ({ value: b, label: b }));
const yearOptions = YEARS.map((y) => ({ value: String(y), label: `Year ${y}` }));

const MaterialList = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [materials, setMaterials] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const branch = searchParams.get('branch') || '';
  const year = searchParams.get('year') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (branch) params.branch = branch;
      if (year) params.year = year;

      const res = await getMaterials(params);
      setMaterials(res.data.materials);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, branch, year, page]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const handleSearchChange = (val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set('search', val);
    else next.delete('search');
    next.delete('page');
    setSearchParams(next);
  };

  const handleDownload = async (material) => {
    if (!user) { toast.error('Please log in to download'); return; }
    try {
      const res = await downloadMaterial(material._id);
      window.open(res.data.fileUrl, '_blank');
      toast.success('Opening file...');
      // Update download count locally
      setMaterials((prev) =>
        prev.map((m) => (m._id === material._id ? { ...m, downloads: res.data.downloads } : m))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Download failed');
    }
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="section-title">Study Materials</h1>
          <p className="section-subtitle">Browse and download notes, assignments, and references</p>
        </div>
        {user && (
          <Link to="/materials/upload" id="materials-upload-btn" className="btn-primary">
            <Plus className="w-4 h-4" />
            Upload
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar
          search={search}
          onSearchChange={handleSearchChange}
          filters={[
            { name: 'branch', value: branch, options: branchOptions, placeholder: 'All Branches' },
            { name: 'year', value: year, options: yearOptions, placeholder: 'All Years' },
          ]}
          onFilterChange={(name, val) => updateParam(name, val)}
          onClear={() => setSearchParams({})}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : materials.length === 0 ? (
        <EmptyState
          title="No materials found"
          description="Be the first to upload study materials for your batch!"
          icon={BookOpen}
          action={
            user ? (
              <Link to="/materials/upload" className="btn-primary">
                <Plus className="w-4 h-4" />
                Upload Material
              </Link>
            ) : null
          }
        />
      ) : (
        <>
          <p className="text-xs text-slate-500 mb-4">
            Showing {materials.length} of {pagination?.total} materials
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((material) => (
              <MaterialCard
                key={material._id}
                material={material}
                onDownload={handleDownload}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i + 1}
                  id={`materials-page-${i + 1}`}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    page === i + 1
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.set('page', i + 1);
                    setSearchParams(next);
                    window.scrollTo(0, 0);
                  }}
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

export default MaterialList;
