import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { BookOpen, Video, Calendar } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { fetchBooks, fetchTeachings } from '../../lib/content';
import { Book, Teaching } from '../../lib/types';
import { getCurrentUserPurchases, PurchaseRow } from '../../lib/purchases';
import { formatPrice } from '../../lib/utils';

export function DashboardPurchases() {
  const { isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setPurchases([]);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadPurchases = async () => {
      try {
        setError('');
        const [data, bookData, teachingData] = await Promise.all([
          getCurrentUserPurchases(),
          fetchBooks(),
          fetchTeachings(),
        ]);

        if (isActive) {
          setPurchases(data);
          setBooks(bookData);
          setTeachings(teachingData);
        }
      } catch (loadError) {
        if (isActive) {
          const message = loadError instanceof Error ? loadError.message : 'Impossible de charger vos achats.';
          setError(message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadPurchases();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated]);

  const catalog = [...books, ...teachings];

  const mappedPurchases = purchases.map((purchase) => {
    const item = catalog.find((entry) => entry.id === purchase.item_id);

    return {
      ...purchase,
      title: item?.title || 'Contenu indisponible',
      subtitle: 'author' in (item || {}) ? item.author : item?.category || 'Contenu premium',
      link: purchase.item_type === 'book' ? `/books/${purchase.item_id}` : `/teachings/${purchase.item_id}`,
    };
  });

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Mes achats</h2>
          <p className="text-muted-foreground">Connectez-vous pour voir votre historique d'achats.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Mes achats</h2>
          <p className="text-muted-foreground">Chargement de vos achats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Mes achats</h2>
          <p className="text-muted-foreground">
            {purchases.length} achat{purchases.length > 1 ? 's' : ''} • Total dépensé: {formatPrice(totalSpent)}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!error && mappedPurchases.length === 0 && (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            Vous n'avez pas encore d'achats finalises.
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {mappedPurchases.map(purchase => (
          <Card key={purchase.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`h-12 w-12 rounded-lg ${
                    purchase.item_type === 'book' ? 'bg-primary/10' : 'bg-accent/10'
                  } flex items-center justify-center`}>
                    {purchase.item_type === 'book' ? (
                      <BookOpen className="h-6 w-6 text-primary" />
                    ) : (
                      <Video className="h-6 w-6 text-accent" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold mb-1">{purchase.title}</h3>
                        <p className="text-sm text-muted-foreground">{purchase.subtitle}</p>
                      </div>
                      <span className="text-lg font-bold text-secondary">
                        {purchase.amount > 0 ? formatPrice(purchase.amount) : 'Gratuit'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(purchase.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs">
                        {purchase.status === 'completed' ? 'Terminé' : 'En cours'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link to={purchase.link}>
                        <Button variant={purchase.item_type === 'book' ? 'primary' : 'accent'} size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          {purchase.item_type === 'book' ? 'Voir le livre' : 'Voir l\'enseignement'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
