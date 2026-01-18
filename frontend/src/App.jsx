import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import Trade from './pages/Trade';
import Portfolio from './pages/Portfolio';
import Wallet from './pages/Wallet';
import Watchlist from './pages/Watchlist';
import Settings from './pages/Settings';
import Heatmap from './pages/Heatmap';
import Payment from './pages/Payment';
import NewsDetail from './pages/NewsDetail';
import Placeholder from './pages/Placeholder';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { MarketProvider } from './context/MarketContext';
import { ThemeProvider } from './context/ThemeContext';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MarketProvider>
          <ThemeProvider>
            <Router>
              <ScrollToTop />
              <div className="min-h-screen bg-primary text-white font-sans antialiased selection:bg-accent selection:text-white transition-colors duration-300">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/markets" element={
                    <ProtectedRoute>
                      <Markets />
                    </ProtectedRoute>
                  } />
                  <Route path="/trade/:assetId" element={
                    <ProtectedRoute>
                      <Trade />
                    </ProtectedRoute>
                  } />
                  <Route path="/portfolio" element={
                    <ProtectedRoute>
                      <Portfolio />
                    </ProtectedRoute>
                  } />
                  <Route path="/watchlist" element={
                    <ProtectedRoute>
                      <Watchlist />
                    </ProtectedRoute>
                  } />
                  <Route path="/wallet" element={
                    <ProtectedRoute>
                      <Wallet />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/heatmap" element={
                    <ProtectedRoute>
                      <Heatmap />
                    </ProtectedRoute>
                  } />

                  {/* Payment Route (not in navigation) */}
                  <Route path="/payment" element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  } />
                  <Route path="/news/:id" element={
                    <ProtectedRoute>
                      <NewsDetail />
                    </ProtectedRoute>
                  } />

                  {/* Project Routes */}
                  <Route path="/documentation" element={<Placeholder title="Documentation" />} />
                  <Route path="/features" element={<Placeholder title="Features List" />} />
                  <Route path="/updates" element={<Placeholder title="Updates" />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </Router>
          </ThemeProvider>
        </MarketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
