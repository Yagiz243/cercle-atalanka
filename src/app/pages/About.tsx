import { Heart, Target, Users, Award, Sparkles, BookOpen, Globe, Shield, Sun } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router';

export function About() {
  const values = [
    {
      icon: Shield,
      title: 'La Mémoire des Profondeurs',
      description: 'Atalanka est le rappel d\'Atlantide, une mémoire vivante de l\'âge où l\'homme et la nature communiaient dans un équilibre parfait. Le Cercle devient le lieu de résurgence de cette sagesse, purifiée pour l\'ère nouvelle.',
      color: 'violet',
    },
    {
      icon: Globe,
      title: 'L\'Ère du Verseau',
      description: 'L\'ère du verseau est la libération de la conscience, l\'universalité de la fraternité et la réconciliation avec la nature. Le Cercle Atalanka est le temple vivant où la vérité intérieure prévaut sur les dogmes extérieurs.',
      color: 'primary',
    },
    {
      icon: Sun,
      title: 'La Racine Kôngo',
      description: 'Le Bukongo, spiritualité originelle du peuple Kôngo, est la racine du Cercle. Non pas une reproduction des formes anciennes, mais une réactualisation de l\'esprit pour répondre aux défis planétaires de notre époque.',
      color: 'secondary',
    },
    {
      icon: Users,
      title: 'La Fraternité Cosmique',
      description: 'Les frères et sœurs s\'asseyent ensemble en égalité. Dans un monde fragmenté par la corruption et la guerre, le Cercle ramène les principes de justice, vérité, équilibre et réconciliation dans la conscience des peuples.',
      color: 'accent',
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
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-violet/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">À propos du Cercle Atalanka</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Le Cercle Atalanka n'est pas une institution ordinaire ni une invention éphémère. 
              Il est le fruit d'une longue gestation spirituelle portée par celui que les ancêtres 
              et les forces des profondeurs ont choisi comme pionnier : “IKAYEH YOTARANA ÔMANAYEH”, 
              Le Divin Poisson, Père des Profondeurs.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Mission, But, Objectif */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Notre Vision</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Le Cercle Atalanka naît pour répondre à l'appel cosmique de l'ère du verseau.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow border-2 border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Le But</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Réactualiser les connaissances philosophiques de la tradition kôngo pour les rendre 
                  vivantes et pertinentes dans le monde d'aujourd'hui.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-violet/20">
              <CardContent className="p-8 text-center">
                <div className="h-14 w-14 rounded-full bg-violet/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-7 w-7 text-violet" />
                </div>
                <h3 className="text-xl font-semibold mb-3">La Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Éveiller les consciences partout dans le monde en reconnectant l'humanité à ses 
                  racines spirituelles originelles.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-secondary/20">
              <CardContent className="p-8 text-center">
                <div className="h-14 w-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">L'Objectif</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Faciliter et accélérer l'éveil des consciences humaines en cette ère du verseau, 
                  en harmonie avec les cycles cosmiques.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Les Piliers du Cercle</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Des principes intemporels qui guident notre cheminement spirituel.
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

      {/* Le Guide */}
      <section className="py-16 bg-gradient-to-br from-violet/10 via-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-2">Le Guide du Cercle</h2>
                <p className="text-lg text-muted-foreground italic">
                  “Le Divin Poisson, Père des Profondeurs”
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-primary via-violet to-secondary p-1">
                      <img
                        src="../../public/ikaye.jpg"
                        alt="Maître Atalanka"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">IKAYEH YOTARANA ÔMANAYEH</h3>
                  <p className="text-primary font-medium mb-4">Fondateur & Guide Spirituel</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Incarnant la mémoire des eaux primordiales, il est le guide pour ceux qui cherchent 
                    la lumière dans les ténèbres de ce monde. En tant que père des profondeurs, il ne 
                    ramène pas des doctrines étrangères, mais reconnecte ses enfants aux racines les plus 
                    anciennes de la conscience africaine et kôngo. Il rappelle que, tout comme le poisson 
                    nage entre les mondes visibles et invisibles, l'être humain est appelé à circuler 
                    entre le matériel et le spirituel, entre la surface de l'existence et la profondeur 
                    de l'être.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Histoire */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
              <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6 text-center">Notre Histoire</h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Chaque ère cosmique apporte une vibration particulière à l'humanité. L'ère des poissons, 
                  qui vient de s'achever, fut une époque de croyances imposées, de religions hiérarchisées, 
                  de structures dogmatiques et de centralisation du pouvoir spirituel.
                </p>
                <p>
                  L'ère du verseau, dans laquelle nous sommes entrés, est l'ère de la libération de la 
                  conscience, de l'universalité de la fraternité et de la réconciliation avec la nature. 
                  Le Cercle Atalanka naît pour répondre à cet appel cosmique.
                </p>
                <p>
                  Atalanka est le rappel d'Atlantide, non pas comme un mythe lointain, mais comme une 
                  mémoire vivante de l'âge où l'homme et la nature communiaient dans un équilibre parfait. 
                  Le Cercle Atalanka devient alors le lieu de résurgence de cette mémoire, ajustée et 
                  purifiée pour la tâche nouvelle de l'ère du verseau.
                </p>
                <p>
                  Le Bukongo, la spiritualité originelle du peuple Kôngo, est la racine sur laquelle le 
                  Cercle s'appuie. Il ne s'agit pas de reproduire les formes anciennes, mais de réactualiser 
                  l'esprit pour répondre aux défis spirituels, sociaux et planétaires de notre époque.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-violet/10 via-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt à rejoindre cette aventure?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Commencez votre voyage spirituel et participez à l'éveil des consciences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="violet" size="lg">
                Créer un compte
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