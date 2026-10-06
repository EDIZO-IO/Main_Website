import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import { HelmetProvider } from 'react-helmet-async';
import CustomCursor from './components/CustomCursor';
import WhatsAppBubble from './components/WhatsAppBubble';
import CookieConsent from './components/CookieConsent';

// Pages
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ServiceDetails from './pages/ServiceDetails';
import InternshipsPage from './pages/InternshipsPage';
import InternshipDetails from './pages/InternshipDetails';
import InternshipApplication from './pages/InternshipApplication';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import ScrollToTop from './components/ScrollToTop';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SiteProvider>
          <Router>
            <ScrollToTop />
            <div className="bg-white min-h-screen font-sans selection:bg-orange selection:text-white flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/:id" element={<ServiceDetails />} />
                  <Route path="/internships" element={<InternshipsPage />} />
                  <Route path="/internships/:id" element={<InternshipDetails />} />
                  <Route path="/internships/:id/apply" element={
                    <ProtectedRoute>
                      <InternshipApplication />
                    </ProtectedRoute>
                  } />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/portfolio" element={<Navigate to="/projects" replace />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/cookies" element={<CookiePolicyPage />} />
                  
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
              <CookieConsent />
              <WhatsAppBubble />
              <CustomCursor />
            </div>
          </Router>
        </SiteProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
