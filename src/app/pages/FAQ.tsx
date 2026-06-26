import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Qu\'est-ce que le Cercle Atalanka?',
      answer: 'Le Cercle Atalanka est une communauté spirituelle dédiée à l\'éveil des consciences à travers l\'ère du Verseau. Nous partageons des enseignements basés sur la tradition Kôngo et la sagesse ancestrale, adaptés aux défis de notre époque. Notre mission est de reconnecter l\'humanité à ses racines spirituelles originelles.'
    },
    {
      question: 'Comment puis-je rejoindre le Cercle?',
      answer: 'Rejoindre le Cercle est simple et gratuit. Créez un compte sur notre plateforme pour accéder à nos enseignements de base. Pour un contenu plus approfondi et des enseignements premium, vous pouvez souscrire à un abonnement. Tous les niveaux de participation sont les bienvenus.'
    },
    {
      question: 'Quels types de contenus proposez-vous?',
      answer: 'Nous proposons une variété de contenus spirituels : des livres sur la spiritualité Kôngo et l\'éveil de conscience, des enseignements vidéo avec des guides pratiques, des textes enrichis avec des photos inspirantes, et des ateliers en ligne pour approfondir votre pratique.'
    },
    {
      question: 'Les enseignements sont-ils adaptés aux débutants?',
      answer: 'Absolument! Nos contenus sont conçus pour tous les niveaux, du débutant au pratiquant avancé. Nous proposons des parcours progressifs qui vous permettent d\'évoluer à votre rythme, avec des enseignements fondamentaux pour débuter et des contenus plus avancés pour approfondir.'
    },
    {
      question: 'Quelle est la différence entre le contenu gratuit et premium?',
      answer: 'Le contenu gratuit vous donne accès aux enseignements de base et à une introduction à nos pratiques. Le contenu premium inclut des enseignements approfondis, des ateliers exclusifs, des livres complets, et un accès prioritaire aux événements en direct avec nos guides.'
    },
    {
      question: 'Puis-je annuler mon abonnement à tout moment?',
      answer: 'Oui, vous pouvez annuler votre abonnement premium à tout moment sans frais cachés. Votre accès au contenu premium reste actif jusqu\'à la fin de la période de facturation en cours.'
    },
    {
      question: 'Comment fonctionne la communauté?',
      answer: 'Notre communauté est un espace d\'échange et de partage entre membres. Vous pouvez participer aux forums, rejoindre des groupes de discussion, assister à des événements en ligne, et partager votre expérience avec d\'autres pratiquants sur le même chemin spirituel.'
    },
    {
      question: 'Les enseignements sont-ils basés sur une religion spécifique?',
      answer: 'Le Cercle Atalanka n\'est affilié à aucune religion organisée. Nos enseignements sont basés sur la spiritualité Kôngo traditionnelle et la sagesse ancestrale, mais sont ouverts à tous, quelle que soit votre origine ou vos croyances actuelles. Nous valorisons l\'expérience personnelle et la connexion directe avec le divin.'
    },
    {
      question: 'Comment puis-je contacter le support?',
      answer: 'Vous pouvez nous contacter via le formulaire de contact sur notre site, ou par email à support@cercleatalanka.org. Notre équipe répond généralement dans les 24-48 heures ouvrées.'
    },
    {
      question: 'Mes informations personnelles sont-elles sécurisées?',
      answer: 'Oui, nous prenons la protection de vos données très au sérieux. Toutes vos informations sont cryptées et stockées en toute sécurité conformément à notre politique de confidentialité. Nous ne partageons jamais vos données personnelles avec des tiers sans votre consentement explicite.'
    }
  ];

  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='max-w-3xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4'>Questions Fréquentes</h1>
          <p className='text-xl text-muted-foreground'>
            Trouvez les réponses à vos questions sur le Cercle Atalanka
          </p>
        </div>

        <div className='space-y-4'>
          {faqs.map((faq, index) => (
            <Card key={index} className='overflow-hidden'>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className='w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors'
              >
                <span className='font-semibold pr-4'>{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className='h-5 w-5 text-muted-foreground flex-shrink-0' />
                ) : (
                  <ChevronDown className='h-5 w-5 text-muted-foreground flex-shrink-0' />
                )}
              </button>
              {openIndex === index && (
                <CardContent className='px-6 pb-4 pt-0'>
                  <p className='text-muted-foreground leading-relaxed'>{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <p className='text-muted-foreground mb-4'>
            Vous ne trouvez pas la réponse à votre question?
          </p>
          <Button variant='outline'>
            Nous contacter
          </Button>
        </div>
      </div>
    </div>
  );
}
