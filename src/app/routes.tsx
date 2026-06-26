import { createBrowserRouter } from 'react-router';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Books } from './pages/Books';
import { BookDetail } from './pages/BookDetail';
import { Teachings } from './pages/Teachings';
import { TeachingDetail } from './pages/TeachingDetail';
import { Community } from './pages/Community';
import { FAQ } from './pages/FAQ';
import { TermsOfService } from './pages/TermsOfService';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Cart } from './pages/Cart';
import { Dashboard } from './pages/Dashboard';
import { DashboardOverview } from './pages/dashboard/Overview';
import { DashboardPurchases } from './pages/dashboard/Purchases';
import { DashboardMessages } from './pages/dashboard/Messages';
import { DashboardSettings } from './pages/dashboard/Settings';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminBooks } from './pages/admin/AdminBooks';
import { AdminTeachings } from './pages/admin/AdminTeachings';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSettings } from './pages/admin/AdminSettings';
import { NotFound } from './pages/NotFound';
import { PaymentReturn } from './pages/PaymentReturn';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    errorElement: <div className="p-6 text-red-500">Erreur sur la page principale</div>,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'books', Component: Books },
      { path: 'books/:id', Component: BookDetail },
      { path: 'teachings', Component: Teachings },
      { path: 'teachings/:id', Component: TeachingDetail },
      { path: 'community', Component: Community },
      { path: 'faq', Component: FAQ },
      { path: 'terms', Component: TermsOfService },
      { path: 'privacy', Component: PrivacyPolicy },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'cart', Component: Cart },
      { path: 'payment/return', Component: PaymentReturn },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        errorElement: <div className="p-6 text-red-500">Erreur dans le tableau de bord utilisateur</div>,
        children: [
          { index: true, Component: DashboardOverview },
          { path: 'purchases', Component: DashboardPurchases },
          { path: 'messages', Component: DashboardMessages },
          { path: 'settings', Component: DashboardSettings },
        ],
      },
      { path: '*', Component: NotFound },
    ],
  },
  {
    path: '/admin/login',
    Component: AdminLogin,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute redirectTo="/admin/login" requireAdmin>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    errorElement: <div className="p-6 text-red-500">Erreur dans l'interface admin</div>,
    children: [
      { index: true, Component: AdminOverview },
      { path: 'books', Component: AdminBooks },
      { path: 'teachings', Component: AdminTeachings },
      { path: 'users', Component: AdminUsers },
      { path: 'messages', Component: AdminMessages },
      { path: 'settings', Component: AdminSettings },
    ],
  },
]);
