import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "./contexts/LanguageContext";
import LoginPage from "./components/loginpage";
import HomePage from "./components/HomePage";
import TubelightNavbarDemo from "./components/TubelightNavbarDemo";
import SchemesPage from "./components/SchemesPage";
import DocumentsPage from "./components/DocumentsPage";
import RecommendationsPage from "./components/RecommendationsPage";
import ApplicationsPage from "./components/ApplicationsPage";
import SchemeTracking from "./components/SchemeTracking";
import ApplyPage from "./components/ApplyPage";
import SchemeChatBot from "./components/SchemeChatBot";
import "./components/SchemeChatBot.css";
import AdminApplicationsPage from "./components/AdminApplicationsPage";
import AdminUsersPage from "./components/AdminUsersPage";
import AdminDashboard from "./components/AdminDashboard";
import ApplicationTrackingPage from "./components/ApplicationTrackingPage";
import AdminDocumentsPage from "./components/AdminDocumentsPage";
import ApplicationReviewPage from "./components/ApplicationReviewPage";
import UserDashboard from "./components/UserDashboard";
import SchemeComparison from "./components/SchemeComparison";
import LanguageSwitcher from "./components/LanguageSwitcher";
import FAQSection from "./components/FAQSection";
import Notifications from "./components/Notifications";
import ThemeToggle from "./components/ThemeToggle";
import AdminApplicationDetailsPage from "./components/AdminApplicationDetailsPage";
import SchemeApprovalPage from "./components/SchemeApprovalPage";
import { ThemeProvider } from "./contexts/ThemeContext";

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [showChatBot, setShowChatBot] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check for existing authentication
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
    // Keep demo mode for development (comment out for production)
    // else {
    //   const demoToken = "demo_token_12345";
    //   const demoRole = "user";
    //   localStorage.setItem("token", demoToken);
    //   localStorage.setItem("role", demoRole);
    //   setIsLoggedIn(true);
    //   setUserRole(demoRole);
    // }
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Show navbar if scrolling up or if very close to top (within 50px)
          if (currentScrollY < lastScrollY || currentScrollY < 50) {
            setIsAtTop(true);
          }
          // Hide navbar if scrolling down and past the threshold
          else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsAtTop(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    // Track scroll on all pages for consistent behavior
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChatToggle = () => {
    setShowChatBot(!showChatBot);
  };

  // Show navbar based on scroll behavior for all pages when logged in
  const showNavbar =
    // Show navbar when at top or scrolling up (for all pages when logged in, except login)
    (isLoggedIn && location.pathname !== "/login" && isAtTop);

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {showNavbar && (
          <TubelightNavbarDemo
            key="navbar"
            onChatToggle={handleChatToggle}
            userRole={userRole}
            setIsLoggedIn={setIsLoggedIn}
            setUserRole={setUserRole}
          />
        )}
      </AnimatePresence>
      <Routes>
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />

        {/* User Routes - Only accessible by regular users */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              userRole === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <HomePage />
            ) : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/schemes"
          element={
            isLoggedIn ? (
              userRole === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <SchemesPage />
            ) : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/documents"
          element={
            isLoggedIn ? (
              userRole === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <DocumentsPage />
            ) : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/recommendations"
          element={
            isLoggedIn ? (
              userRole === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <RecommendationsPage />
            ) : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/applications"
          element={
            isLoggedIn ? (
              userRole === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <ApplicationsPage />
            ) : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/scheme-tracking"
          element={
            isLoggedIn ? (
              userRole === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <SchemeTracking />
            ) : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/apply/:schemeId"
          element={
            isLoggedIn ? (
              userRole === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <ApplyPage />
            ) : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/track/:trackingId"
          element={<ApplicationTrackingPage />}
        />

        {/* Admin Routes - Only accessible by admin users */}
        <Route
          path="/admin/dashboard"
          element={
            isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin/applications"
          element={
            isLoggedIn && userRole === 'admin' ? <AdminApplicationsPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin/applications/:id"
          element={
            isLoggedIn && userRole === 'admin' ? <AdminApplicationDetailsPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin/users"
          element={
            isLoggedIn && userRole === 'admin' ? <AdminUsersPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin/documents"
          element={
            isLoggedIn && userRole === 'admin' ? <AdminDocumentsPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin/application-review"
          element={
            isLoggedIn && userRole === 'admin' ? <ApplicationReviewPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin/scheme-approval"
          element={
            isLoggedIn && userRole === 'admin' ? <SchemeApprovalPage /> : <Navigate to="/login" replace />
          }
        />

        {/* Catch-all redirect for unauthorized access */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      {/* ChatBot available on all pages when logged in and not explicitly closed */}
      {isLoggedIn && location.pathname !== "/login" && showChatBot && (
        <SchemeChatBot onClose={() => setShowChatBot(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;