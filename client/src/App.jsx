import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import Volunteers from './pages/Volunteers';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './auth/Login';
import Register from './auth/Register';
import AdminLogin from './auth/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import './index.css';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import Donate from './pages/Donate';
import RegisterFlow from './pages/RegisterFlow';
import JoinCommunity from './pages/JoinCommunity';
import Profile from './pages/Profile';
import Gallery from './pages/Gallery';
import Dashboard from './pages/Dashboard';
import MyClubs from './pages/MyClubs';
import JoinClub from './pages/JoinClub';
import ClubDashboard from './pages/ClubDashboard';
import AdminClubManage from './pages/AdminClubManage';
import EventAttendance from './pages/EventAttendance';
import EventCheckIn from './pages/EventCheckIn';
import MyCertificates from './pages/MyCertificates';
import CertificateView from './pages/CertificateView';
import AdminCertificateVerification from './pages/AdminCertificateVerification';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <Navbar />
          <BackToTop />
          <main className="flex-grow pt-16"> {/* Added padding-top to account for fixed navbar */}
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/volunteers" element={<Volunteers />} />
              <Route path="/events" element={<Events />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/clubs/:id" element={<ClubDetail />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/register-flow" element={<RegisterFlow />} />
              <Route path="/join-community" element={<JoinCommunity />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-clubs" element={<MyClubs />} />
              <Route path="/clubs/join/:clubId" element={<JoinClub />} />
              <Route path="/clubs/:clubId/dashboard" element={<ClubDashboard />} />
              <Route path="/admin/clubs/:clubId/manage" element={<AdminClubManage />} />
              <Route path="/events/:eventId/check-in" element={<EventCheckIn />} />
              <Route path="/admin/events/:eventId/attendance" element={<EventAttendance />} />
              <Route path="/my-certificates" element={<MyCertificates />} />
              <Route path="/certificates/:certificateId" element={<CertificateView />} />
              <Route path="/admin/certificates" element={<AdminCertificateVerification />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
