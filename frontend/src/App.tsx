import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import TemplateEditor from './pages/TemplateEditor';
import Participants from './pages/Participants';
import Generate from './pages/Generate';
import EmailCenter from './pages/EmailCenter';
import Settings from './pages/Settings';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="events/create" element={<CreateEvent />} />
          <Route path="events/:id/template" element={<TemplateEditor />} />
          <Route path="events/:id/participants" element={<Participants />} />
          <Route path="events/:id/generate" element={<Generate />} />
          <Route path="events/:id/email" element={<EmailCenter />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
