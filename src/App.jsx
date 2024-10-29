// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoutes from './components/protectedRoutes/ProtectedRoutes';
import PublicRoutes from './components/publicRoutes/PublicRoutes';
import Home from './components/pages/Home';
import TargetedSubscriber from './components/pages/TargetedSubscriber';
import MassiveSubscribers from './components/pages/MassiveSubscribers';
import EmergencyAlert from './components/pages/EmergencyAlert';
import AddSensitiveArea from './components/pages/AddSensitiveArea';
import ManageDevices from './components/pages/ManageDevices';
import MonitorDevices from './components/pages/MonitorDevices';
import MonitorSensitiveAreas from './components/pages/MonitorSensitiveAreas';
import UploadFiles from './components/pages/UploadFiles';
import ManageTargetedSubscribers from './components/pages/ManageTargetedSubscribers';

function App() {
  const isAuthenticated = true;

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<PublicRoutes>Login Page</PublicRoutes>}
          />
          <Route
            path="/"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="//manage-targeted-subscribers"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <Layout>
                  <ManageTargetedSubscribers />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/targeted-subscriber"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <Layout>
                  <TargetedSubscriber />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/massive-subscribers"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <Layout>
                  <MassiveSubscribers />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/manage-devices"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <Layout>
                  <ManageDevices />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/monitor-devices"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <Layout>
                  <MonitorDevices />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/emergency-alert"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <Layout>
                  <EmergencyAlert />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/add-sensitive-area"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <Layout>
                  <AddSensitiveArea />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/monitor-sensitive-area"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <Layout>
                  <MonitorSensitiveAreas/>
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/send-alert"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <Layout>Send Alert</Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <Layout>
                  <UploadFiles />
                </Layout>
              </ProtectedRoutes>
            }
          />
          {/* <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/forgot-password"
          element={
            <PublicRoutes>
              <ForgotPassword />
            </PublicRoutes>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoutes>
              <ResetPassword />
            </PublicRoutes>
          }
        /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
