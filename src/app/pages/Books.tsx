import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Star, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { fetchBooks } from '../lib/content';
import { Book } from '../lib/types';
import { formatPrice } from '../lib/utils';

export function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadBooks = async () => {
      try {
        setError('');
        const data = await fetchBooks();

        if (isActive) {
          setBooks(data);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les livres.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadBooks();

    return () => {
      isActive = false;
    };
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(books.map((book) => book.category))).sort((left, right) => left.localeCompare(right)),
    [books],
  );

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesPremium = !showPremiumOnly || book.isPremium;

    return matchesSearch && matchesCategory && matchesPremium;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Bibliothèque Spirituelle</h1>
        <p className="text-muted-foreground">
          Découvrez notre collection de livres sur la spiritualité, la méditation et le développement personnel
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Recherche
            </h3>
            <Input
              placeholder="Rechercher un livre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Catégories
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Toutes les catégories
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPremiumOnly}
                onChange={(e) => setShowPremiumOnly(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm">Contenu premium uniquement</span>
            </label>
          </Card>
        </aside>

        <div className="lg:col-span-3">
          <div className="mb-6">
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <p className="text-muted-foreground">
              {isLoading
                ? 'Chargement des livres...'
                : `${filteredBooks.length} livre${filteredBooks.length > 1 ? 's' : ''} trouvé${filteredBooks.length > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-full h-72 object-cover"
                  />
                  {book.isPremium && (
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full bg-violet text-violet-foreground text-xs font-medium">
                        Premium
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {book.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-secondary fill-secondary" />
                      <span className="text-sm font-medium">{book.rating}</span>
                      <span className="text-xs text-muted-foreground">({book.reviews})</span>
                    </div>
                  </div>

                  <h3 className="font-semibold mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">Par {book.author}</p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-secondary">
                      {formatPrice(book.price)}
                    </span>
                    <Link to={`/books/${book.id}`}>
                      <Button variant="primary" size="sm">
                        Voir
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {isLoading ? 'Chargement en cours...' : 'Aucun livre ne correspond à vos critères de recherche.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}