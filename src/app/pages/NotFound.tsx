import { Link } from 'react-router';
import { Home, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary via-secondary to-violet bg-clip-text text-transparent">
            404
          </h1>
        </div>
        <h2 className="text-3xl font-bold mb-4">Page introuvable</h2>
        <p className="text-muted-foreground mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <Link to="/books">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Explorer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
