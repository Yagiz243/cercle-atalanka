import { useEffect, useMemo, useState } from 'react';
import { Users, BookOpen, Video, DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { fetchAdminOverviewData } from '../../lib/admin';
import { Book, Teaching, CommunityMember, Message, User } from '../../lib/types';
import { PurchaseRow } from '../../lib/purchases';
import { formatPrice } from '../../lib/utils';

export function AdminOverview() {
  const [books, setBooks] = useState<Book[]>([]);
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [profiles, setProfiles] = useState<User[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadOverview = async () => {
      try {
        setError('');
        const data = await fetchAdminOverviewData();

        if (!isActive) {
          return;
        }

        setBooks(data.books);
        setTeachings(data.teachings);
        setProfiles(data.profiles);
        setPurchases(data.purchases);
        setCommunityMembers(data.communityMembers);
        setMessages(data.messages as Message[]);
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger la vue d\'ensemble admin.');
        }
      }
    };

    void loadOverview();

    return () => {
      isActive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const revenue = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    return [
      {
        label: 'Utilisateurs totaux',
        value: profiles.length.toString(),
        change: `${communityMembers.length} membres`,
        icon: Users,
        color: 'primary',
      },
      {
        label: 'Livres publiés',
        value: books.length.toString(),
        change: `${books.filter((book) => book.isPremium).length} premium`,
        icon: BookOpen,
        color: 'secondary',
      },
      {
        label: 'Enseignements',
        value: teachings.length.toString(),
        change: `${teachings.filter((teaching) => teaching.isPremium).length} premium`,
        icon: Video,
        color: 'accent',
      },
      {
        label: 'Revenus totaux',
        value: formatPrice(revenue),
        change: `${purchases.length} ventes`,
        icon: DollarSign,
        color: 'violet',
      },
    ];
  }, [books, communityMembers.length, profiles.length, purchases, teachings]);

  const recentActivity = useMemo(() => {
    const bookActivity = books.slice(0, 2).map((book, index) => ({ id: `book-${book.id}`, action: 'Livre disponible', item: book.title, time: `Element ${index + 1}` }));
    const purchaseActivity = purchases.slice(0, 2).map((purchase) => ({ id: `purchase-${purchase.id}`, action: 'Achat effectue', item: purchase.item_id, time: new Date(purchase.created_at).toLocaleDateString('fr-FR') }));
    const messageActivity = messages.slice(0, 2).map((message) => ({ id: `message-${message.id}`, action: 'Message recu', item: message.message.slice(0, 40), time: new Date(message.createdAt).toLocaleDateString('fr-FR') }));

    return [...bookActivity, ...purchaseActivity, ...messageActivity].slice(0, 6);
  }, [books, messages, purchases]);

  const topBooks = useMemo(() => [...books].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 5), [books]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold mb-2">Vue d'ensemble</h2>
        <p className="text-muted-foreground">Aperçu de votre plateforme Cercle Atalanka</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`bg-gradient-to-br from-${stat.color}/5 to-${stat.color}/10`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-8 w-8 text-${stat.color}`} />
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.change.startsWith('+') ? 'text-accent' : 'text-destructive'
                }`}>
                  <TrendingUp className="h-4 w-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Activité récente</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.item}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Livres les plus populaires</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topBooks.map((book, index) => (
                <div key={book.id} className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-muted-foreground/30">
                    {index + 1}
                  </span>
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.reviews} avis</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <ShoppingBag className="h-8 w-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Ventes aujourd'hui</p>
            <p className="text-3xl font-bold">{formatPrice(purchases.reduce((sum, purchase) => sum + purchase.amount, 0))}</p>
            <p className="text-xs text-muted-foreground mt-2">{purchases.length} transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10">
          <CardContent className="p-6">
            <Users className="h-8 w-8 text-accent mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Nouveaux membres</p>
            <p className="text-3xl font-bold">{communityMembers.length}</p>
            <p className="text-xs text-muted-foreground mt-2">Profils communaute</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet/5 to-violet/10">
          <CardContent className="p-6">
            <Video className="h-8 w-8 text-violet mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Vues totales</p>
            <p className="text-3xl font-bold">{teachings.reduce((sum, teaching) => sum + (teaching.views || 0), 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Tous enseignements</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
