import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import DashboardOverview from './pages/DashboardOverview';
import ApplicationsView from './pages/ApplicationsView';
import ContactMessagesView from './pages/ContactMessagesView';
import InternshipsView from './pages/InternshipsView';
import CreateInternshipView from './pages/CreateInternshipView';
import EditInternshipView from './pages/EditInternshipView';
import ServicesView from './pages/ServicesView';
import CreateServiceView from './pages/CreateServiceView';
import EditServiceView from './pages/EditServiceView';
import ServiceRequestsView from './pages/ServiceRequestsView';
import UsersView from './pages/UsersView';
import SettingsView from './pages/SettingsView';
import ManagePortfolioView from './pages/ManagePortfolioView';
import ManageTeamView from './pages/ManageTeamView';
import WhatsAppManager from './pages/WhatsAppManager';

// V2 Feature Pages
import CrmPipelineView from './pages/CrmPipelineView';
import ProposalsView from './pages/ProposalsView';
import TaskBoardView from './pages/TaskBoardView';
import BillingInvoicesView from './pages/BillingInvoicesView';
import SupportTicketsView from './pages/SupportTicketsView';
import ConsultationsView from './pages/ConsultationsView';
import DocumentsView from './pages/DocumentsView';
import EmployeesView from './pages/EmployeesView';
import InternshipTasksView from './pages/InternshipTasksView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            
            {/* Sales & CRM */}
            <Route path="crm" element={<CrmPipelineView />} />
            <Route path="proposals" element={<ProposalsView />} />
            <Route path="consultations" element={<ConsultationsView />} />
            <Route path="requests" element={<ServiceRequestsView />} />
            <Route path="messages" element={<ContactMessagesView />} />

            {/* Delivery & Operations */}
            <Route path="projects" element={<TaskBoardView />} />
            <Route path="tickets" element={<SupportTicketsView />} />
            <Route path="documents" element={<DocumentsView />} />

            {/* Billing & Finance */}
            <Route path="billing" element={<BillingInvoicesView />} />

            {/* HR & Academy */}
            <Route path="employees" element={<EmployeesView />} />
            <Route path="internships" element={<InternshipsView />} />
            <Route path="internships/new" element={<CreateInternshipView />} />
            <Route path="internships/:id/edit" element={<EditInternshipView />} />
            <Route path="internship-tasks" element={<InternshipTasksView />} />
            <Route path="applications" element={<ApplicationsView />} />

            {/* CMS & Settings */}
            <Route path="services" element={<ServicesView />} />
            <Route path="services/new" element={<CreateServiceView />} />
            <Route path="services/:id/edit" element={<EditServiceView />} />
            <Route path="portfolio" element={<ManagePortfolioView />} />
            <Route path="team" element={<ManageTeamView />} />
            <Route path="users" element={<UsersView />} />
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
