import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import ContentManager from './pages/ContentManager';
import GalleryManager from './pages/GalleryManager';
import TeamManager from './pages/TeamManager';
import Settings from './pages/Settings';
import QAModeration from './pages/QAModeration';
import LibraryManager from './pages/LibraryManager';
import UserManager from './pages/UserManager';
import AuditLogs from './pages/AuditLogs';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="content/gallery" element={<GalleryManager />} />
        <Route path="content/team" element={<TeamManager />} />
        <Route path="content/:type" element={<ContentManager />} />
        <Route path="qa" element={<QAModeration />} />
        <Route path="library" element={<LibraryManager />} />
        <Route path="users" element={<UserManager />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppRoutes />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}
