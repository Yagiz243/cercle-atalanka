import { Link } from 'react-router';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary via-secondary to-violet flex items-center justify-center">
                <span className="text-white font-bold text-xl">CA</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary via-secondary to-violet bg-clip-text text-transparent">
                Cercle Atalanka
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Votre guide vers l'éveil spirituel et la transformation intérieure.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-muted-foreground hover:text-primary transition-colors">
                  Livres
                </Link>
              </li>
              <li>
                <Link to="/teachings" className="text-muted-foreground hover:text-primary transition-colors">
                  Enseignements
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-muted-foreground hover:text-primary transition-colors">
                  Communauté
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <Link to="/dashboard/messages" className="text-muted-foreground hover:text-primary transition-colors">
                  Contactez-nous
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Cercle Atalanka. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
