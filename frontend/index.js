// =======================================================================
// REACT FRONTEND ROUTING & ENTRY POINT
// Filename: frontend/index.js
// =======================================================================

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Component Imports
import BrowseListings from './components/BrowseListings';
import SellerListings from './components/SellerListings';
import BuyerInspectionStatus from './components/InspectionRequest';
import AdminInspectionQueue from './components/AdminInspectionQueue';
import InspectorReportForm from './components/InspectorReportForm';
import './index.css'; // Tailwind configuration import

// Helper hook or function to check role validation
const checkRole = (expectedRole) => {
  const rawUser = localStorage.getItem('user_session');
  if (!rawUser) return false;
  try {
    const user = JSON.parse(rawUser);
    return (user.role || '').toLowerCase() === expectedRole.toLowerCase();
  } catch (e) {
    return false;
  }
};

// Guard Modules safeguarding page endpoints
const BuyerProtectedRoute = ({ children }) => {
  return checkRole('buyer') ? children : <Navigate to="/browse" replace />;
};

const SellerProtectedRoute = ({ children }) => {
  return checkRole('seller') ? children : <Navigate to="/browse" replace />;
};

const InspectorProtectedRoute = ({ children }) => {
  return checkRole('inspector') ? children : <Navigate to="/browse" replace />;
};

const AdminProtectedRoute = ({ children }) => {
  return checkRole('admin') ? children : <Navigate to="/browse" replace />;
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('user_session');
      if (rawUser) {
        setCurrentUser(JSON.parse(rawUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Professional Multi-Role Session Dispatcher
  const loginAsRole = async (roleName, demoUserObj) => {
    try {
      // Fetch dynamic, verified token signed real-time by JWT secret key
      const response = await axios.post('/api/auth/token', demoUserObj);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_session', JSON.stringify(demoUserObj));
        alert(`✨ Testing Session switched: Welcome, ${demoUserObj.email} (${roleName} profile). Access key unlocked!`);
        window.location.reload();
      }
    } catch (err) {
      console.error('Session loader error:', err);
      // Fallback local setter if backend isn't up
      localStorage.setItem('user_session', JSON.stringify(demoUserObj));
      alert(`Testing switch (local-only fallback): Role updated to ${roleName}`);
      window.location.reload();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    localStorage.removeItem('token');
    alert('Session cleared successfully.');
    window.location.reload();
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 select-none flex flex-col justify-between">
        
        {/* Navigation panel */}
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Logo and navigation links */}
            <div className="flex items-center justify-between md:justify-start gap-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚗</span>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-900 bg-clip-text text-transparent">
                  CARVELLO
                </span>
              </div>
              
              <nav className="flex items-center gap-5 text-xs font-bold text-slate-600 tracking-wide uppercase">
                <a href="/browse" className="hover:text-indigo-650 transition-colors">
                  Browse Cars
                </a>
                <a href="/dashboard/buyer" className="hover:text-indigo-650 transition-colors">
                  Buyer Orders
                </a>
                <a href="/dashboard/seller" className="hover:text-indigo-650 transition-colors">
                  Dealer Hub
                </a>
                <a href="/dashboard/inspector" className="hover:text-indigo-650 transition-colors">
                  Inspector Lab
                </a>
                <a href="/dashboard/admin" className="hover:text-indigo-650 transition-colors font-semibold">
                  Admin Dispatch
                </a>
              </nav>
            </div>

            {/* Simulated Session deck controller */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Mock Profile Switcher:</span>
              
              <button
                onClick={() => loginAsRole('Buyer', { id: 'usr-buyer-88', email: 'jordan@jordanwill366.com', role: 'buyer' })}
                className={`text-[10px] px-2.5 py-1.5 border font-semibold rounded-lg transition-all ${
                  currentUser?.role === 'buyer'
                    ? 'bg-amber-600 border-amber-600 text-white shadow-sm font-bold'
                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100'
                }`}
              >
                👶 Buyer
              </button>

              <button
                onClick={() => loginAsRole('Seller', { id: 'usr-seller-02', email: 'seller@primecarvello.ng', role: 'seller' })}
                className={`text-[10px] px-2.5 py-1.5 border font-semibold rounded-lg transition-all ${
                  currentUser?.role === 'seller'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm font-bold'
                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100'
                }`}
              >
                🏢 Seller
              </button>

              <button
                onClick={() => loginAsRole('Inspector', { id: 'ins-jake-04', email: 'jake@cervelloinspection.ng', role: 'inspector' })}
                className={`text-[10px] px-2.5 py-1.5 border font-semibold rounded-lg transition-all ${
                  currentUser?.role === 'inspector'
                    ? 'bg-purple-600 border-purple-600 text-white shadow-sm font-bold'
                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100'
                }`}
              >
                🔧 Inspector
              </button>

              <button
                onClick={() => loginAsRole('Admin', { id: 'usr-admin-10', email: 'director@carvello.co', role: 'admin' })}
                className={`text-[10px] px-2.5 py-1.5 border font-semibold rounded-lg transition-all ${
                  currentUser?.role === 'admin'
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100'
                }`}
              >
                👑 Admin
              </button>

              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="text-[10px] text-red-600 hover:text-red-950 font-bold px-2 py-1 ml-2 border border-dashed border-red-200 rounded-lg bg-red-50/50"
                >
                  Logout
                </button>
              )}
            </div>

          </div>
        </header>

        {/* Dynamic Route views */}
        <div className="flex-grow">
          <Routes>
            {/* Public catalogs list */}
            <Route path="/browse" element={<BrowseListings />} />
            
            {/* Buyer self orders list */}
            <Route 
              path="/dashboard/buyer" 
              element={
                <BuyerProtectedRoute>
                  <BuyerInspectionStatus />
                </BuyerProtectedRoute>
              } 
            />

            {/* Seller inventories hub */}
            <Route 
              path="/dashboard/seller" 
              element={
                <SellerProtectedRoute>
                  <SellerListings />
                </SellerProtectedRoute>
              } 
            />

            {/* Inspector task space */}
            <Route 
              path="/dashboard/inspector" 
              element={
                <InspectorProtectedRoute>
                  <InspectorReportForm />
                </InspectorProtectedRoute>
              } 
            />

            {/* Admin dispatch pipeline */}
            <Route 
              path="/dashboard/admin" 
              element={
                <AdminProtectedRoute>
                  <AdminInspectionQueue />
                </AdminProtectedRoute>
              } 
            />

            {/* General redirects */}
            <Route path="*" element={<Navigate to="/browse" replace />} />
          </Routes>
        </div>

        {/* Global Footer container */}
        <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Carvello Dealership Ecosystem. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Security Rules</a>
              <a href="#" className="hover:text-white transition-colors">Escrow Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </footer>

      </div>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
