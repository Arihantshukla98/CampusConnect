import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Spinner from './components/Spinner';

// Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import LostFoundBoard from './pages/LostFound/LostFoundBoard';
import PostItemForm from './pages/LostFound/PostItemForm';
import ItemDetail from './pages/LostFound/ItemDetail';
import EventBoard from './pages/Events/EventBoard';
import EventDetail from './pages/Events/EventDetail';
import CreateEditEvent from './pages/Events/CreateEditEvent';
import MaterialList from './pages/StudyMaterial/MaterialList';
import UploadMaterial from './pages/StudyMaterial/UploadMaterial';
import MaterialDetail from './pages/StudyMaterial/MaterialDetail';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl animate-pulse-slow">
            <span className="text-2xl">🎓</span>
          </div>
          <Spinner size="md" />
          <p className="text-sm text-slate-500">Loading CampusConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar — hide on auth pages */}
      <Routes>
        <Route path="/login" element={null} />
        <Route path="/signup" element={null} />
        <Route path="*" element={<Navbar />} />
      </Routes>

      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
        />

        {/* Auth (public) */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" replace /> : <Signup />}
        />

        {/* Dashboard (protected) */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

        {/* Lost & Found */}
        <Route path="/lost-found" element={<LostFoundBoard />} />
        <Route
          path="/lost-found/new"
          element={<ProtectedRoute><PostItemForm /></ProtectedRoute>}
        />
        <Route path="/lost-found/:id" element={<ItemDetail />} />

        {/* Events */}
        <Route path="/events" element={<EventBoard />} />
        <Route
          path="/events/new"
          element={<AdminRoute><CreateEditEvent /></AdminRoute>}
        />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route
          path="/events/:id/edit"
          element={<AdminRoute><CreateEditEvent /></AdminRoute>}
        />

        {/* Study Materials */}
        <Route path="/materials" element={<MaterialList />} />
        <Route
          path="/materials/upload"
          element={<ProtectedRoute><UploadMaterial /></ProtectedRoute>}
        />
        <Route path="/materials/:id" element={<MaterialDetail />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
              <p className="text-8xl mb-4">🔍</p>
              <h1 className="text-4xl font-black text-slate-800 mb-2">404</h1>
              <p className="text-slate-500 mb-6">This page doesn't exist</p>
              <a href="/dashboard" className="btn-primary">Go to Dashboard</a>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
