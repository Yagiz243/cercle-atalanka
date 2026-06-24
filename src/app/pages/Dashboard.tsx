import { Link, Outlet, useLocation } from 'react-router';
import { Home, ShoppingBag, MessageCircle, Settings, BookOpen, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Vue d\'ensemble', exact: true },
    { path: '/dashboard/purchases', icon: ShoppingBag, label: 'Mes achats' },
    { path: '/dashboard/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/dashboard/settings', icon: Settings, label: 'Paramètres' },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue, {user?.fullName}!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <nav className="space-y-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path, item.exact)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
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
  );
}
