// src/App.tsx
import { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout.tsx';
import UserLayout from './layouts/UserLayout.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import AdminDashboard from './pages/admin/Dashboard.tsx';
import './App.css';

interface AppProps {
  isAdminRoute: boolean;
}

class App extends Component<AppProps> {
  renderUserRoutes() {
    return (
      <UserLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </UserLayout>
    );
  }

  renderAdminRoutes() {
    return (
      <AdminLayout>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </AdminLayout>
    );
  }

  render() {
    return this.props.isAdminRoute ? this.renderAdminRoutes() : this.renderUserRoutes();
  }
}

export default App;
