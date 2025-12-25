import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AssetProvider } from './context/AssetContext';
import { ProcurementProvider } from './context/ProcurementContext';
import { LogisticsProvider } from './context/LogisticsContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import RequestQuotation from './pages/RequestQuotation';
import RequestList from './pages/RequestList';
import TenderList from './pages/TenderList';
import ContractTracking from './pages/ContractTracking';
import LogisticsHub from './pages/LogisticsHub';
import VendorManagement from './pages/VendorManagement';
import LiveMap from './pages/LiveMap';
import CompareAssets from './pages/CompareAssets';
import VendorPortal from './pages/VendorPortal';
import Settings from './pages/Settings';
import Login from './pages/Login';
import SmartAssist from './components/SmartAssist';
import MarketAssessment from './pages/MarketAssessment';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   
   return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
         <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
         <div className="flex-1 flex flex-col overflow-hidden relative">
            <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950">
               {children}
            </main>
            {/* Global AI Assistant - Floating Button */}
            <SmartAssist />
         </div>
      </div>
   );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AssetProvider>
          <ProcurementProvider>
            <LogisticsProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  
                  {/* Admin Routes */}
                  <Route path="/" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Layout><Overview /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/products" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Layout><Products /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/product/:id" element={
                    <ProtectedRoute allowedRoles={['admin', 'vendor']}>
                      <Layout><ProductDetail /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/market-assessment" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Layout><MarketAssessment /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/request/:id" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Layout><RequestQuotation /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/request-list" element={
                    <ProtectedRoute allowedRoles={['admin', 'technical']}>
                      <Layout><RequestList /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/tenders" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Layout><TenderList /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/contracts" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Layout><ContractTracking /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/logistics" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Layout><LogisticsHub /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/vendors" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Layout><VendorManagement /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/live-map" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Layout><LiveMap /></Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/compare" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Layout><CompareAssets /></Layout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Vendor Routes */}
                  <Route path="/vendor" element={
                    <ProtectedRoute allowedRoles={['vendor']}>
                      <Layout><VendorPortal /></Layout>
                    </ProtectedRoute>
                  } />

                  {/* Shared */}
                  <Route path="/settings" element={
                    <ProtectedRoute allowedRoles={['admin', 'vendor', 'technical']}>
                      <Layout><Settings /></Layout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </LogisticsProvider>
          </ProcurementProvider>
        </AssetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;