import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { BookOpen, Video, Users, Star, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { fetchBooks, fetchTeachings } from '../lib/content';
import { Book, Teaching } from '../lib/types';
import { formatPrice } from '../lib/utils';
import heroBg from '../../../public/hero-bg.jpg'; // 👈 IMPORT DE L'IMAGE

export function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [featuredTeachings, setFeaturedTeachings] = useState<Teaching[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadHomeContent = async () => {
      try {
        setError('');
        const [books, teachings] = await Promise.all([fetchBooks(), fetchTeachings()]);

        if (!isActive) return;

        const latestTeachings = [...teachings]
          .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
          .slice(0, 3);

        setFeaturedBooks(books.slice(0, 3));
        setFeaturedTeachings(latestTeachings);
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger la page d\'accueil.');
        }
      }
    };

    void loadHomeContent();

    return () => {
      isActive = false;
    };
  }, []);

  const getTeachingPreview = (teaching: Teaching) => {
    if (teaching.videoUrl) {
      const isDirectVideo = /\.(mp4|webm|ogg|m4v|mov)(\?.*)?$/i.test(teaching.videoUrl);

      if (isDirectVideo) {
        return {
          kind: 'video' as const,
          src: teaching.videoUrl,
        };
      }

      const youtubeMatch = teaching.videoUrl.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
      );

      if (youtubeMatch?.[1]) {
        return {
          kind: 'image' as const,
          src: `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`,
        };
      }
    }

    if (teaching.images && teaching.images.length > 0) {
      return {
        kind: 'image' as const,
        src: teaching.images[0],
      };
    }

    return null;
  };

  return (
    <div className="w-full">
      {error && (
        <div className="container mx-auto px-4 pt-6">
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        </div>
      )}

      {/* Hero section responsive */}
      <section className="relative min-h-[70vh] md:min-h-[600px] flex items-center overflow-hidden py-8 md:py-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/70"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div className="text-white">
              <p className="text-xs md:text-base tracking-[0.3em] mb-3 md:mb-6 text-secondary uppercase font-light">
                Spiritualité • Éveil • Méditation • Transformation
              </p>
              <h1 className="text-4xl md:text-7xl font-bold mb-3 md:mb-6 leading-tight">
                Cercle<br />Atalanka
              </h1>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-4 md:mt-8">
                <Link to="/books" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-white/90 w-full sm:w-auto"
                  >
                    Découvrir notre collection
                  </Button>
                </Link>
                <Link to="/about" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white w-full sm:w-auto"
                  >
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </div>

            <div className="text-white hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 italic">
                  "Découvrez le potentiel de chaque être spirituel"
                </h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  Rejoignez une communauté dédiée à l'éveil de la conscience et à la transformation spirituelle à travers des enseignements authentiques et des pratiques ancestrales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 cartes */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow border-2 border-primary/20">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Livres Spirituels</h3>
              <p className="text-muted-foreground mb-4">
                Accédez à une collection exclusive de livres sur la spiritualité, la méditation et l'éveil.
              </p>
              <Link to="/books">
                <Button variant="ghost" size="sm">
                  Découvrir <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow border-2 border-secondary/20">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enseignements Vidéo</h3>
              <p className="text-muted-foreground mb-4">
                Apprenez avec des vidéos, des textes enrichis et des galeries photos inspirantes.
              </p>
              <Link to="/teachings">
                <Button variant="ghost" size="sm">
                  Explorer <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow border-2 border-violet/20">
              <div className="h-16 w-16 rounded-full bg-violet/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-violet" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Communauté</h3>
              <p className="text-muted-foreground mb-4">
                Rejoignez une communauté de pratiquants partageant le même chemin spirituel.
              </p>
              <Link to="/community">
                <Button variant="ghost" size="sm">
                  Rejoindre <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Livres en vedette */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Livres en vedette</h2>
              <p className="text-muted-foreground">Découvrez nos meilleures recommandations</p>
            </div>
            <Link to="/books">
              <Button variant="outline">Voir tout</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBooks.map(book => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {book.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-secondary fill-secondary" />
                      <span className="text-sm">{book.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-secondary">
                      {formatPrice(book.price)}
                    </span>
                    <Link to={`/books/${book.id}`}>
                      <Button variant="primary" size="sm">Voir</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enseignements */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">3 derniers enseignements publiés</h2>
              <p className="text-muted-foreground">Videos et photos des contenus les plus recents</p>
            </div>
            <Link to="/teachings">
              <Button variant="outline">Voir tout</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTeachings.map(teaching => {
              const preview = getTeachingPreview(teaching);

              return (
                <Card key={teaching.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {preview?.kind === 'video' ? (
                      <video
                        src={preview.src}
                        className="h-full w-full object-cover"
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : preview?.kind === 'image' ? (
                      <img
                        src={preview.src}
                        alt={teaching.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/10 via-primary/10 to-violet/10">
                        <Video className="h-10 w-10 text-accent" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/10 text-accent">
                        {teaching.category}
                      </span>
                      {teaching.isPremium && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-violet/10 text-violet">
                          Premium
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{teaching.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {teaching.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{teaching.duration || 'Contenu spirituel'}</span>
                      <span>{teaching.views?.toLocaleString()} vues</span>
                    </div>
                    <Link to={`/teachings/${teaching.id}`}>
                      <Button variant="accent" size="sm" className="w-full">
                        Commencer
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 bg-gradient-to-br from-violet/10 via-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt à commencer votre voyage?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de membres qui transforment leur vie grâce aux enseignements du Cercle Atalanka.
          </p>
          <Link to="/register">
            <Button variant="violet" size="lg">
              Créer un compte gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}