import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Video, ShoppingBag, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router';
import { fetchDashboardOverviewData, resolvePurchasedItem } from '../../lib/admin';
import { Book, Teaching } from '../../lib/types';
import { PurchaseRow } from '../../lib/purchases';
import { formatPrice } from '../../lib/utils';

export function DashboardOverview() {
  const [books, setBooks] = useState<Book[]>([]);
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadOverview = async () => {
      try {
        setError('');
        const data = await fetchDashboardOverviewData();

        if (isActive) {
          setBooks(data.books);
          setTeachings(data.teachings);
          setPurchases(data.purchases);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger votre tableau de bord.');
        }
      }
    };

    void loadOverview();

    return () => {
      isActive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const booksBought = purchases.filter((purchase) => purchase.item_type === 'book').length;
    const teachingsBought = purchases.filter((purchase) => purchase.item_type === 'teaching').length;

    return [
      { label: 'Livres achetés', value: booksBought.toString(), icon: BookOpen, color: 'primary' },
      { label: 'Enseignements suivis', value: teachingsBought.toString(), icon: Video, color: 'secondary' },
      { label: 'Achats totaux', value: formatPrice(totalSpent), icon: ShoppingBag, color: 'accent' },
    ];
  }, [purchases]);

  const recentPurchases = purchases.slice(0, 3).map((purchase) => {
    const item = resolvePurchasedItem(purchase, books, teachings);

    return {
      id: purchase.id,
      title: item?.title || 'Contenu indisponible',
      type: purchase.item_type === 'book' ? 'Livre' : 'Enseignement',
      date: purchase.created_at,
      price: purchase.amount,
    };
  });

  const recommendedTeaching = teachings.find((teaching) => teaching.isPremium) || teachings[0];
  const recommendedBook = books.find((book) => book.isPremium) || books[0];

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`bg-gradient-to-br from-${stat.color}/5 to-${stat.color}/10 border-${stat.color}/20`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-full bg-${stat.color}/20 flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Achats récents</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPurchases.map(purchase => (
                <div key={purchase.id} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                  <div>
                    <h4 className="font-medium mb-1">{purchase.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{purchase.type}</span>
                      <span>•</span>
                      <span>{new Date(purchase.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-secondary">
                    {purchase.price > 0 ? formatPrice(purchase.price) : 'Gratuit'}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/dashboard/purchases">
              <Button variant="outline" size="sm" className="w-full mt-4">
                Voir tous les achats
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Recommandations pour vous</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedTeaching && (
                <div className="p-4 rounded-lg bg-violet/5 border border-violet/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-4 w-4 text-violet fill-violet" />
                  <h4 className="font-medium">{recommendedTeaching.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Recommandation basee sur les contenus premium les plus marquants.
                </p>
                <Link to={`/teachings/${recommendedTeaching.id}`}>
                  <Button variant="violet" size="sm">Découvrir</Button>
                </Link>
                </div>
              )}

              {recommendedBook && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <h4 className="font-medium">{recommendedBook.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Completez votre bibliotheque spirituelle.
                </p>
                <Link to={`/books/${recommendedBook.id}`}>
                  <Button variant="primary" size="sm">Voir le livre</Button>
                </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-accent/5 to-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">Continuez votre apprentissage</h3>
              <p className="text-sm text-muted-foreground">
                Continuez vos achats et enseignements pour enrichir votre parcours spirituel.
              </p>
            </div>
            <Link to="/teachings">
              <Button variant="accent">Continuer</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
