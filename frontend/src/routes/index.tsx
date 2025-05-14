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
import { DepartmentList, DepartmentForm, DepartmentDetail } from '../pages/departments';
import { CategoriesListPage, AddCategoryPage, EditCategoryPage } from '../pages/categories';
import OkrListPage from '../pages/okrs/OkrListPage';
import OkrFormPage from '../pages/okrs/OkrFormPage';
import OkrDetailPage from '../pages/okrs/OkrDetailPage';
import OkrAnalyticsPage from '../pages/okrs/OkrAnalyticsPage';
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

      {/* OKR Routes */}
      <Route
        path="/okrs"
        element={
          <ProtectedRoute>
            <Layout>
              <OkrListPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/okrs/new"
        element={
          <ProtectedRoute>
            <Layout>
              <OkrFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/okrs/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <OkrDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/okrs/:id/edit"
        element={
          <ProtectedRoute>
            <Layout>
              <OkrFormPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/okr-analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <OkrAnalyticsPage />
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
      
      {/* Department Routes */}
      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <Layout>
              <DepartmentList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments/new"
        element={
          <ProtectedRoute>
            <Layout>
              <DepartmentForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DepartmentDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments/:id/edit"
        element={
          <ProtectedRoute>
            <Layout>
              <DepartmentForm isEdit />
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
