import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Theme Provider
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateRide from './pages/CreateRide';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import MyRides from './pages/MyRides';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Analytics from './pages/Analytics';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }} 
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes Wrapper with Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/create-ride" element={<CreateRide />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/chat/:matchId" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-rides" element={<MyRides />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/support" element={<Support />} />
                <Route path="/analytics" element={<Analytics />} />
              </Route>
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
