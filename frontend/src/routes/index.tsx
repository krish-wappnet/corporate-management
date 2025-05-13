import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import Auth from '../components/auth/Auth';
import Dashboard from '../pages/Dashboard';
import EmployeesPage from '../pages/employees/EmployeesPage';
import AddEmployeePage from '../pages/employees/AddEmployeePage';
import { KpiListPage, KpiFormPage, KpiDetailPage, KpiAnalyticsPage } from '../pages/kpis';
import { CategoriesListPage, AddCategoryPage, EditCategoryPage } from '../pages/categories';
import NotFound from '../pages/NotFound';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};



const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      
      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <Auth />
        }
      />
      <Route
        path="/register"
        element={
          <Auth />
        }
      />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <Layout>
              <EmployeesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/employees/new"
        element={
          <ProtectedRoute>
            <Layout>
              <AddEmployeePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Category Routes */}
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Layout>
              <CategoriesListPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories/new"
        element={
          <ProtectedRoute>
            <Layout>
              <AddCategoryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories/edit/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <EditCategoryPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* KPI Routes */}
      <Route
        path="/kpis"
        element={
          <ProtectedRoute>
            <Layout>
              <KpiListPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/kpis/new"
        element={
          <ProtectedRoute>
            <Layout>
              <KpiFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/kpis/edit/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <KpiFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/kpis/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <KpiDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/analytics/kpis"
        element={
          <ProtectedRoute>
            <Layout>
              <KpiAnalyticsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
