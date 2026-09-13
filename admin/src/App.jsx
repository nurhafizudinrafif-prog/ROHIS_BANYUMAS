import { BrowserRouter as Router } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import DynamicBackground from './components/DynamicBackground';

export default function App() {
  return (
    <Router>
      <DynamicBackground />
      <AdminDashboard />
    </Router>
  );
}
