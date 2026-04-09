import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import Settings from './pages/Settings';
import { Profile } from './pages/Profile';
import { AdminLogin } from './pages/AdminLogin';
import { ProtectedRoute } from './components/ProtectedRoute';
import Likes from './pages/Likes';
import Messages from './pages/Messages';
import OnlineUsers from './pages/OnlineUsers';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<AdminLogin />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="likes" element={<Likes />} />
          <Route path="messages" element={<Messages />} />
          <Route path="online-users" element={<OnlineUsers />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all - redirect to login if not authenticated, dashboard if authenticated */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
