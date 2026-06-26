import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Star, BookOpen, Download, ArrowLeft, Share2, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { fetchBookById, fetchBooks } from '../lib/content';
import { Book } from '../lib/types';
import { formatPrice } from '../lib/utils';

export function BookDetail() {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState<'description' | 'reviews'>('description');
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setBook(null);
      setRelatedBooks([]);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadBook = async () => {
      try {
        setError('');
        const [currentBook, allBooks] = await Promise.all([fetchBookById(id), fetchBooks()]);

        if (!isActive) return;

        setBook(currentBook);
        setRelatedBooks(
          currentBook
            ? allBooks
                .filter((candidate) => candidate.id !== currentBook.id && candidate.category === currentBook.category)
                .slice(0, 3)
            : [],
        );
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger le livre.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadBook();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (!isLoading && !book) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Livre introuvable</h1>
        <p className="text-muted-foreground mb-6">
          Le livre que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link to="/books">
          <Button variant="primary">Retour aux livres</Button>
        </Link>
      </div>
    );
  }

  const reviews = [
    {
      id: 1,
      author: 'Marie Laurent',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      rating: 5,
      date: '2026-04-15',
      comment: 'Un livre absolument transformateur! Les enseignements sont profonds et accessibles. Je le recommande à tous ceux qui cherchent l\'éveil spirituel.',
    },
    {
      id: 2,
      author: 'Pierre Dubois',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      rating: 5,
      date: '2026-04-10',
      comment: 'Excellente qualité d\'enseignement. Chaque chapitre apporte une nouvelle perspective sur la spiritualité.',
    },
    {
      id: 3,
      author: 'Sophie Martin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      rating: 4,
      date: '2026-04-05',
      comment: 'Très bon livre, bien écrit et inspirant. J\'aurais aimé plus d\'exercices pratiques, mais le contenu est excellent.',
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        Chargement du livre...
      </div>
    );
  }

  if (!book) {
    return null;
  }

  // Le lien Chariow est stocké dans book.pdfUrl (ou vous pouvez ajouter un champ book.chariowLink)
  const chariowLink = book.pdfUrl || '#';

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Link to="/books" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux livres
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-full rounded-xl shadow-lg"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {book.category}
                  </span>
                  {book.isPremium && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-violet/10 text-violet">
                      Premium
                    </span>
                  )}
                </div>

                <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
                <p className="text-xl text-muted-foreground mb-4">Par {book.author}</p>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(book.rating || 0)
                            ? 'text-secondary fill-secondary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {book.rating} ({book.reviews} avis)
                  </span>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-secondary">
                    {formatPrice(book.price)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  {/* Bouton qui redirige vers Chariow */}
                  {chariowLink && chariowLink !== '#' ? (
                    <a
                      href={chariowLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="accent" size="lg" className="w-full">
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        Obtenir le livre
                      </Button>
                    </a>
                  ) : (
                    <Button variant="accent" size="lg" className="flex-1" disabled>
                      <Download className="h-5 w-5 mr-2" />
                      Lien non disponible
                    </Button>
                  )}
                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5 mr-2" />
                    Partager
                  </Button>
                </div>

                <div className="bg-accent/10 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <BookOpen className="h-4 w-4 text-accent" />
                    <span>Format PDF numérique</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <ShoppingBag className="h-4 w-4 text-accent" />
                    <span>Achat sécurisé via Chariow</span>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex border-b border-border mb-6">
                  <button
                    onClick={() => setSelectedTab('description')}
                    className={`px-6 py-3 font-medium transition-colors ${
                      selectedTab === 'description'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setSelectedTab('reviews')}
                    className={`px-6 py-3 font-medium transition-colors ${
                      selectedTab === 'reviews'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Avis ({book.reviews})
                  </button>
                </div>

                {selectedTab === 'description' ? (
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {book.description}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Ce livre explore en profondeur les concepts fondamentaux de la spiritualité et offre
                      des outils pratiques pour votre transformation personnelle. À travers des enseignements
                      clairs et accessibles, vous découvrirez comment éveiller votre conscience et vivre
                      une vie plus alignée avec votre véritable nature.
                    </p>
                    <h3 className="text-xl font-semibold mb-3">Ce que vous apprendrez</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Les principes fondamentaux de la pratique spirituelle</li>
                      <li>Des techniques de méditation et de pleine conscience</li>
                      <li>Comment intégrer la spiritualité dans votre vie quotidienne</li>
                      <li>Des exercices pratiques pour votre transformation</li>
                      <li>La sagesse des traditions ancestrales adaptée au monde moderne</li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-6 last:border-0">
                        <div className="flex items-start space-x-4">
                          <img
                            src={review.avatar}
                            alt={review.author}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.author}</h4>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-secondary fill-secondary'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Livres similaires</h3>
                <div className="space-y-4">
                  {relatedBooks.map((relatedBook) => (
                    <Link key={relatedBook.id} to={`/books/${relatedBook.id}`}>
                      <div className="flex space-x-3 hover:bg-muted/50 p-2 rounded-lg transition-colors cursor-pointer">
                        <img
                          src={relatedBook.coverImageUrl}
                          alt={relatedBook.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">
                            {relatedBook.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-1">
                            {relatedBook.author}
                          </p>
                          <p className="text-sm font-bold text-secondary">
                            {formatPrice(relatedBook.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}