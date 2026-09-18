import { BrowserRouter as Router } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import DynamicBackground from './components/DynamicBackground';
import { DataProvider } from './context/DataContext';

export default function App() {
  return (
    <Router>
      <DataProvider>
        <DynamicBackground />
        <AdminDashboard />
      </DataProvider>
    </Router>
  );
}
