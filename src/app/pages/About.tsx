import { Heart, Target, Users, Award, Sparkles, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router';

export function About() {
  const values = [
    {
      icon: Heart,
      title: 'Authenticité',
      description: 'Nous partageons des enseignements authentiques issus de traditions spirituelles ancestrales et de pratiques contemporaines éprouvées.',
      color: 'violet',
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Une communauté bienveillante où chacun peut partager son expérience et grandir ensemble sur le chemin de l\'éveil.',
      color: 'primary',
    },
    {
      icon: Sparkles,
      title: 'Transformation',
      description: 'Nous croyons au potentiel infini de transformation de chaque être humain à travers la pratique spirituelle.',
      color: 'secondary',
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Chaque contenu est soigneusement sélectionné et créé pour offrir la meilleure qualité d\'enseignement possible.',
      color: 'accent',
    },
  ];

  const team = [
    {
      name: 'Maître Atalanka',
      role: 'Fondateur & Guide Spirituel',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'Plus de 30 ans d\'expérience dans les pratiques spirituelles et l\'enseignement de la méditation.',
    },
    {
      name: 'Sophie Martin',
      role: 'Responsable des Enseignements',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      bio: 'Enseignante certifiée en méditation et yoga, passionnée par la transmission des savoirs ancestraux.',
    },
    {
      name: 'Pierre Dubois',
      role: 'Responsable Communauté',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Facilitateur d\'ateliers spirituels et animateur de cercles de partage depuis 15 ans.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Membres actifs' },
    { value: '500+', label: 'Enseignements' },
    { value: '150+', label: 'Livres disponibles' },
    { value: '95%', label: 'Satisfaction' },
  ];

  return (
    <div className="w-full">
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-violet/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">À propos du Cercle Atalanka</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Le Cercle Atalanka est né d'une vision : créer un espace sacré où chacun peut explorer,
              apprendre et grandir sur son chemin spirituel. Nous sommes dédiés à la transmission
              d'enseignements authentiques qui transforment les vies.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-violet to-secondary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Notre Mission</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nous aspirons à créer un pont entre la sagesse ancestrale et les besoins du monde moderne,
              rendant les enseignements spirituels accessibles à tous, partout dans le monde.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className={`hover:shadow-lg transition-shadow border-2 border-${value.color}/20`}>
                <CardContent className="p-8">
                  <div className={`h-14 w-14 rounded-full bg-${value.color}/10 flex items-center justify-center mb-4`}>
                    <value.icon className={`h-7 w-7 text-${value.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Notre Équipe</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Des guides expérimentés dédiés à votre évolution spirituelle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-violet/10 via-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-center">
              <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Notre Histoire</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4 text-left">
                <p>
                  Le Cercle Atalanka a été fondé en 2010 par Maître Atalanka, après plus de 30 ans
                  de pratique et d'enseignement spirituel à travers le monde. Inspiré par sa propre
                  quête d'éveil et les transformations profondes qu'il a vécues, il a créé cet espace
                  pour partager ces enseignements avec le plus grand nombre.
                </p>
                <p>
                  Au fil des années, le Cercle s'est développé pour devenir une communauté mondiale
                  de pratiquants dédiés, offrant des livres, des enseignements vidéo, et des pratiques
                  guidées qui touchent des milliers de vies chaque jour.
                </p>
                <p>
                  Aujourd'hui, nous continuons à innover et à évoluer, tout en restant fidèles à notre
                  mission première : rendre la sagesse spirituelle accessible, authentique et transformatrice
                  pour tous ceux qui cherchent à éveiller leur conscience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt à rejoindre notre communauté?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Commencez votre voyage spirituel dès aujourd'hui avec des enseignements qui transforment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="violet" size="lg">
                Créer un compte gratuit
              </Button>
            </Link>
            <Link to="/teachings">
              <Button variant="outline" size="lg">
                Explorer les enseignements
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
