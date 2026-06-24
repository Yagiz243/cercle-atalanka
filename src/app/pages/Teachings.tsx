import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Play, Eye, Star, Search, Filter, Image, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { fetchTeachings } from '../lib/content';
import { Teaching } from '../lib/types';

export function Teachings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadTeachings = async () => {
      try {
        setError('');
        const data = await fetchTeachings();

        if (isActive) {
          setTeachings(data);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les enseignements.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadTeachings();

    return () => {
      isActive = false;
    };
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(teachings.map((teaching) => teaching.category))).sort((left, right) => left.localeCompare(right)),
    [teachings],
  );

  const filteredTeachings = teachings.filter(teaching => {
    const matchesSearch = teaching.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teaching.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || teaching.category === selectedCategory;
    const matchesType = selectedType === 'all' || teaching.type === selectedType;
    const matchesPremium = !showPremiumOnly || teaching.isPremium;

    return matchesSearch && matchesCategory && matchesType && matchesPremium;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'text_video':
        return <Play className="h-4 w-4" />;
      case 'text_photo':
        return <Image className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Vidéo';
      case 'text_video':
        return 'Texte + Vidéo';
      case 'text_photo':
        return 'Texte + Photo';
      case 'text':
        return 'Texte';
      default:
        return type;
    }
  };

  const getTeachingPreview = (teaching: Teaching) => {
    if (teaching.videoUrl) {
      return {
        kind: 'video' as const,
        src: teaching.videoUrl,
      };
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
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Enseignements Spirituels</h1>
        <p className="text-muted-foreground">
          Explorez nos cours, vidéos et contenus enrichis pour approfondir votre pratique spirituelle
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
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Type de contenu
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedType === 'all'
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Tous les types
              </button>
              {['video', 'text_video', 'text_photo', 'text'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    selectedType === type
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {getTypeIcon(type)}
                  <span>{getTypeLabel(type)}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Catégories</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Toutes
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
              <span className="text-sm">Premium uniquement</span>
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
                ? 'Chargement des enseignements...'
                : `${filteredTeachings.length} enseignement${filteredTeachings.length > 1 ? 's' : ''} trouvé${filteredTeachings.length > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTeachings.map(teaching => (
              <Card key={teaching.id} className="hover:shadow-lg transition-shadow">
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg bg-muted">
                  {getTeachingPreview(teaching)?.kind === 'video' ? (
                    <video
                      src={getTeachingPreview(teaching)?.src}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : getTeachingPreview(teaching)?.kind === 'image' ? (
                    <img
                      src={getTeachingPreview(teaching)?.src}
                      alt={teaching.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
                      <div className="rounded-full bg-background/80 p-4 shadow-sm">
                        <Play className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="rounded-full bg-background/90 px-2 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                      {getTypeLabel(teaching.type)}
                    </span>
                    {teaching.isPremium && (
                      <span className="rounded-full bg-violet/90 px-2 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/10 text-accent flex items-center space-x-1">
                        {getTypeIcon(teaching.type)}
                        <span>{getTypeLabel(teaching.type)}</span>
                      </span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {teaching.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold mb-2 line-clamp-1">{teaching.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {teaching.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-4">
                      {teaching.duration && <span>{teaching.duration}</span>}
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{teaching.views?.toLocaleString()}</span>
                      </div>
                      {teaching.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-secondary fill-secondary" />
                          <span>{teaching.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link to={`/teachings/${teaching.id}`}>
                    <Button variant="accent" size="sm" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Voir l'enseignement
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTeachings.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {isLoading ? 'Chargement en cours...' : 'Aucun enseignement ne correspond à vos critères.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
