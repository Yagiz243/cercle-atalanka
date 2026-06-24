import { Link } from 'react-router';
import { ShoppingCart, User, LogOut, BookOpen, Video, Users, Home, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full from-primary via-secondary to-violet flex items-center justify-center">
            <img src="src/imports/logo.png" alt="Cercle Atalanka"  />
            </div>
           
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
              <span>Accueil</span>
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              À propos
            </Link>
            <Link to="/books" className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors">
              <BookOpen className="h-4 w-4" />
              <span>Livres</span>
            </Link>
            <Link to="/teachings" className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors">
              <Video className="h-4 w-4" />
              <span>Enseignements</span>
            </Link>
            <Link to="/community" className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors">
              <Users className="h-4 w-4" />
              <span>Communauté</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="violet" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5 mr-2" />
                    {user?.fullName}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Connexion</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Inscription</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
