import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Star, Eye, Play, ArrowLeft, Share2, Clock, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchTeachingById, fetchTeachings } from '../lib/content';
import { Teaching } from '../lib/types';
import { hasPurchasedItem } from '../lib/purchases';

// Fonctions utilitaires pour détecter YouTube
function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/.test(url);
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function TeachingDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const [selectedTab, setSelectedTab] = useState<'content' | 'comments'>('content');
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [teaching, setTeaching] = useState<Teaching | null>(null);
  const [relatedTeachings, setRelatedTeachings] = useState<Teaching[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setTeaching(null);
      setRelatedTeachings([]);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadTeaching = async () => {
      try {
        setError('');
        const [currentTeaching, allTeachings] = await Promise.all([fetchTeachingById(id), fetchTeachings()]);

        if (!isActive) {
          return;
        }

        setTeaching(currentTeaching);
        setRelatedTeachings(
          currentTeaching
            ? allTeachings.filter((candidate) => candidate.id !== currentTeaching.id && candidate.category === currentTeaching.category).slice(0, 3)
            : [],
        );
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger l\'enseignement.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadTeaching();

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    if (!teaching) {
      return;
    }

    if (!teaching.isPremium) {
      setHasAccess(true);
      setIsCheckingAccess(false);
      return;
    }

    if (!isAuthenticated) {
      setHasAccess(false);
      setIsCheckingAccess(false);
      return;
    }

    let isActive = true;

    const checkAccess = async () => {
      try {
        const purchased = await hasPurchasedItem('teaching', teaching.id);

        if (isActive) {
          setHasAccess(purchased);
        }
      } catch (error) {
        console.error('Error checking teaching access:', error);
        if (isActive) {
          setHasAccess(false);
        }
      } finally {
        if (isActive) {
          setIsCheckingAccess(false);
        }
      }
    };

    void checkAccess();

    return () => {
      isActive = false;
    };
  }, [teaching, isAuthenticated, user?.id]);

  if (!isLoading && !teaching) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Enseignement introuvable</h1>
        <p className="text-muted-foreground mb-6">
          L'enseignement que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link to="/teachings">
          <Button variant="primary">Retour aux enseignements</Button>
        </Link>
      </div>
    );
  }

  const comments = [
    {
      id: 1,
      author: 'Marie Laurent',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      date: '2026-04-20',
      comment: 'Enseignement incroyable! J\'ai beaucoup appris et je me sens transformée. Merci!',
    },
    {
      id: 2,
      author: 'Pierre Dubois',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      date: '2026-04-18',
      comment: 'Très claire et bien structuré. Les explications sont faciles à suivre.',
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        Chargement de l'enseignement...
      </div>
    );
  }

  if (!teaching) {
    return null;
  }

  const canAccess = !teaching.isPremium || hasAccess;

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Link to="/teachings" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux enseignements
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="p-0">
                {canAccess && teaching.videoUrl ? (
                  <div className="aspect-video bg-slate-900 flex items-center justify-center rounded-t-xl">
                    {isYouTubeUrl(teaching.videoUrl) ? (
                      <iframe
                        src={getYouTubeEmbedUrl(teaching.videoUrl) || undefined}
                        className="w-full h-full rounded-t-xl"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <video
                        src={teaching.videoUrl}
                        controls
                        className="w-full h-full rounded-t-xl"
                        playsInline
                        preload="metadata"
                      />
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-violet/20 to-primary/20 flex items-center justify-center rounded-t-xl">
                    <div className="text-center">
                      <Lock className="h-20 w-20 mx-auto mb-4 text-violet" />
                      <h3 className="text-xl font-semibold mb-2">Contenu Premium</h3>
                      {isCheckingAccess ? (
                        <p className="text-muted-foreground mb-4">Verification de vos droits d'acces...</p>
                      ) : isAuthenticated ? (
                        <>
                          <p className="text-muted-foreground mb-4">
                            Cet enseignement premium n'est pas encore debloque sur votre compte.
                          </p>
                          <Button variant="accent" onClick={() => addToCart(teaching, 'teaching')}>
                            Ajouter au panier
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="text-muted-foreground mb-4">
                            Connectez-vous ou inscrivez-vous pour acceder a cet enseignement
                          </p>
                          <div className="flex gap-4 justify-center">
                            <Link to="/login">
                              <Button variant="primary">Se connecter</Button>
                            </Link>
                            <Link to="/register">
                              <Button variant="outline">S'inscrire</Button>
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent">
                  {teaching.category}
                </span>
                {teaching.isPremium && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-violet/10 text-violet">
                    Premium
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-4">{teaching.title}</h1>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
                {teaching.duration && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{teaching.duration}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{teaching.views?.toLocaleString()} vues</span>
                </div>
                {teaching.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-secondary fill-secondary" />
                    <span>{teaching.rating}/5</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex border-b border-border mb-6">
                  <button
                    onClick={() => setSelectedTab('content')}
                    className={`px-6 py-3 font-medium transition-colors ${
                      selectedTab === 'content'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setSelectedTab('comments')}
                    className={`px-6 py-3 font-medium transition-colors ${
                      selectedTab === 'comments'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Commentaires ({comments.length})
                  </button>
                </div>

                {selectedTab === 'content' ? (
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {teaching.description}
                    </p>

                    {canAccess && teaching.content && (
                      <div className="bg-muted/50 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">Contenu de l'enseignement</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {teaching.content}
                        </p>
                      </div>
                    )}

                    {canAccess && teaching.images && teaching.images.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-4">Galerie</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {teaching.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Image ${index + 1}`}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-accent/10 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-3">Points clés</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Comprendre les fondamentaux du sujet abordé</li>
                        <li>Techniques pratiques à appliquer immédiatement</li>
                        <li>Exercices guidés pour approfondir votre pratique</li>
                        <li>Sagesse traditionnelle et approche moderne</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {canAccess ? (
                      <>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <textarea
                            placeholder="Partagez votre expérience..."
                            className="w-full min-h-[100px] bg-transparent border border-border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <div className="flex justify-end mt-2">
                            <Button variant="primary" size="sm">
                              Publier
                            </Button>
                          </div>
                        </div>

                        {comments.map(comment => (
                          <div key={comment.id} className="border-b border-border pb-6 last:border-0">
                            <div className="flex items-start space-x-4">
                              <img
                                src={comment.avatar}
                                alt={comment.author}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">{comment.author}</h4>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(comment.date).toLocaleDateString('fr-FR')}
                                  </span>
                                </div>
                                <p className="text-muted-foreground">{comment.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Connectez-vous pour voir et ajouter des commentaires
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Enseignements similaires</h3>
                <div className="space-y-4">
                  {relatedTeachings.map(relatedTeaching => (
                    <Link key={relatedTeaching.id} to={`/teachings/${relatedTeaching.id}`}>
                      <div className="hover:bg-muted/50 p-3 rounded-lg transition-colors cursor-pointer">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
                            {relatedTeaching.category}
                          </span>
                          {relatedTeaching.isPremium && (
                            <span className="text-xs px-2 py-1 rounded-full bg-violet/10 text-violet">
                              Premium
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-sm mb-2 line-clamp-2">
                          {relatedTeaching.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          {relatedTeaching.duration && <span>{relatedTeaching.duration}</span>}
                          {relatedTeaching.views && (
                            <span>{relatedTeaching.views.toLocaleString()} vues</span>
                          )}
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