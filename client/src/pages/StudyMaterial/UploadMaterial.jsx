import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadMaterial } from '../../api/materialsApi';
import { ArrowLeft, Upload, FileText, Image, X } from 'lucide-react';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { BRANCHES } from '../../utils/helpers';

const UploadMaterial = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    branch: 'CSE',
    year: '1',
    semester: '1',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowed.includes(f.type)) { toast.error('Only JPG, PNG, or PDF files are allowed'); return; }
    if (f.size > 10 * 1024 * 1024) { toast.error('File must be under 10MB'); return; }
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.subject || !file) {
      toast.error('Please fill in all required fields and select a file');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append('file', file);

      const res = await uploadMaterial(formData);
      toast.success('Material uploaded successfully! 📚');
      navigate(`/materials/${res.data.material._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const fileIcon = file?.type === 'application/pdf'
    ? <FileText className="w-8 h-8 text-red-500" />
    : file?.type?.startsWith('image/')
    ? <Image className="w-8 h-8 text-blue-500" />
    : <Upload className="w-8 h-8 text-slate-400" />;

  return (
    <div className="page-container max-w-2xl animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2" id="upload-material-back">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="section-title mb-1">Upload Study Material</h1>
      <p className="section-subtitle mb-6">Share notes, assignments, or references with your batchmates</p>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="upload-title" className="label">Title <span className="text-red-500">*</span></label>
            <input id="upload-title" type="text" name="title" className="input" placeholder="e.g. Data Structures Complete Notes" value={form.title} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="upload-description" className="label">Description <span className="text-red-500">*</span></label>
            <textarea id="upload-description" name="description" className="input resize-none" rows={3} placeholder="Brief description of the content..." value={form.description} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="upload-subject" className="label">Subject <span className="text-red-500">*</span></label>
            <input id="upload-subject" type="text" name="subject" className="input" placeholder="e.g. Data Structures & Algorithms" value={form.subject} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="upload-branch" className="label">Branch</label>
              <select id="upload-branch" name="branch" className="select" value={form.branch} onChange={handleChange}>
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="upload-year" className="label">Year</label>
              <select id="upload-year" name="year" className="select" value={form.year} onChange={handleChange}>
                {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="upload-semester" className="label">Semester</label>
              <select id="upload-semester" name="semester" className="select" value={form.semester} onChange={handleChange}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>
          </div>

          {/* File upload */}
          <div>
            <p className="label">File <span className="text-red-500">*</span></p>
            <label
              htmlFor="upload-file"
              className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                file
                  ? 'border-primary-300 bg-primary-50/30 py-6'
                  : 'border-slate-200 hover:border-primary-400 hover:bg-primary-50/20 py-10'
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  {fileIcon}
                  <p className="text-sm font-semibold text-slate-700">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    type="button"
                    className="mt-1 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    onClick={(e) => { e.preventDefault(); setFile(null); }}
                  >
                    <X className="w-3 h-3" /> Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Upload className="w-10 h-10" />
                  <p className="text-sm font-medium text-slate-600">Click to select a file</p>
                  <p className="text-xs">PDF, JPG, PNG — max 10MB</p>
                </div>
              )}
              <input id="upload-file" type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
            <button id="upload-material-submit" type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? <Spinner size="sm" /> : (<><Upload className="w-4 h-4" />Upload Material</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMaterial;
