import { Link, Outlet, useLocation } from 'react-router';
import { LayoutDashboard, BookOpen, Video, Users, MessageCircle, Settings, BarChart3, LogOut } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Navigate } from 'react-router';

export function AdminDashboard() {
  const { isAdminLoggedIn, adminLogout } = useAdmin();
  const location = useLocation();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: "Vue d'ensemble", exact: true },
    { path: '/admin/books', icon: BookOpen, label: 'Gestion Livres' },
    { path: '/admin/teachings', icon: Video, label: 'Gestion Enseignements' },
    { path: '/admin/users', icon: Users, label: 'Utilisateurs' },
    { path: '/admin/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Statistiques' },
    { path: '/admin/settings', icon: Settings, label: 'Paramètres' },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await adminLogout();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Administration</h1>
              <p className="text-sm text-muted-foreground">Cercle Atalanka</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <button className="text-sm text-primary hover:underline">
                  Retour au dashboard utilisateur
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm text-destructive hover:underline"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="space-y-2 sticky top-24">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path, item.exact) ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}