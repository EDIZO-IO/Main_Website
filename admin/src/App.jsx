import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import DashboardOverview from './pages/DashboardOverview';
import InternshipApplicationsView from './pages/InternshipApplicationsView';
import InternshipsView from './pages/InternshipsView';
import CreateInternshipView from './pages/CreateInternshipView';
import EditInternshipView from './pages/EditInternshipView';
import ServicesView from './pages/ServicesView';
import CreateServiceView from './pages/CreateServiceView';
import EditServiceView from './pages/EditServiceView';
import ServiceRequestsView from './pages/ServiceRequestsView';
import LeadsInboxView from './pages/LeadsInboxView';
import UsersView from './pages/UsersView';
import SettingsView from './pages/SettingsView';
import ManagePortfolioView from './pages/ManagePortfolioView';
import ManageTeamView from './pages/ManageTeamView';
import WhatsAppManager from './pages/WhatsAppManager';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="applications" element={<InternshipApplicationsView />} />
            <Route path="requests" element={<ServiceRequestsView />} />
            <Route path="internships" element={<InternshipsView />} />
            <Route path="internships/new" element={<CreateInternshipView />} />
            <Route path="internships/:id/edit" element={<EditInternshipView />} />
            <Route path="services" element={<ServicesView />} />
            <Route path="services/new" element={<CreateServiceView />} />
            <Route path="services/:id/edit" element={<EditServiceView />} />
            <Route path="messages" element={<LeadsInboxView />} />
            <Route path="users" element={<UsersView />} />
            <Route path="portfolio" element={<ManagePortfolioView />} />
            <Route path="team" element={<ManageTeamView />} />
            <Route path="whatsapp" element={<WhatsAppManager />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
