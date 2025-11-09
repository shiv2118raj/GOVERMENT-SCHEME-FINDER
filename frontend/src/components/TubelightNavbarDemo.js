import React from 'react';
import { Home, LayoutDashboard, FileText, Users, ClipboardList, LogOut, CreditCard, MessageCircle, Bot } from 'lucide-react';
import { NavBar } from "./ui/tubelight-navbar";
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Notifications from './Notifications';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

export default function TubelightNavbarDemo({ onChatToggle, userRole, setIsLoggedIn, setUserRole }) {
  console.log("TubelightNavbarDemo - Rendering navbar component");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole('user');
    navigate('/login');
  };

  // Build navigation items based on user role
  const navItems = [];

  if (userRole === 'admin') {
    // Admin navigation items
    navItems.push(
      {
        name: '📊 Dashboard',
        url: '/admin/dashboard',
        icon: LayoutDashboard,
        onClick: () => navigate('/admin/dashboard')
      },
      {
        name: '📋 Applications',
        url: '/admin/applications',
        icon: ClipboardList,
        onClick: () => navigate('/admin/applications')
      },
      {
        name: '📄 Documents',
        url: '/admin/documents',
        icon: FileText,
        onClick: () => navigate('/admin/documents')
      },
      {
        name: '👥 Users',
        url: '/admin/users',
        icon: Users,
        onClick: () => navigate('/admin/users')
      }
    );
  } else {
    // Regular user navigation items
    navItems.push(
      {
        name: t('nav.home', '🏠 Home'),
        url: '/',
        icon: Home,
        onClick: () => navigate('/')
      },
      {
        name: t('nav.browseSchemes', '📋 Schemes'),
        url: '/schemes',
        icon: FileText,
        onClick: () => navigate('/schemes')
      },
      {
        name: t('nav.applications', '📋 Applications'),
        url: '/applications',
        icon: CreditCard,
        onClick: () => navigate('/applications')
      },
      {
        name: t('nav.schemeTracking', '📊 Scheme Tracking'),
        url: '/scheme-tracking',
        icon: MessageCircle,
        onClick: () => navigate('/scheme-tracking')
      },
      {
        name: t('nav.documents', '📄 Documents'),
        url: '/documents',
        icon: FileText,
        onClick: () => navigate('/documents')
      },
      {
        name: t('nav.recommendations', '💡 Recommendations'),
        url: '/recommendations',
        icon: MessageCircle,
        onClick: () => navigate('/recommendations')
      }
    );
  }

  // Add chatbot toggle button (visible for all logged-in users except on login page)
  if (location.pathname !== '/login') {
    navItems.push({
      name: '🤖 Chat Bot',
      url: '#',
      icon: Bot,
      onClick: () => onChatToggle && onChatToggle()
    });
  }

  // Add logout button for all logged-in users
  navItems.push({
    name: userRole === 'admin' ? '🚪 Logout (Admin)' : '🚪 Logout',
    url: '#',
    icon: LogOut,
    onClick: handleLogout
  });

  return <NavBar items={navItems} className="z-50">
    <div className="flex items-center gap-4">
      <LanguageSwitcher />
      <ThemeToggle />
      <Notifications />
    </div>
  </NavBar>;
}
