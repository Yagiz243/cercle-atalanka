import { Card, CardContent } from '../components/ui/Card';

export function TermsOfService() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4'>Conditions d\'Utilisation</h1>
          <p className='text-xl text-muted-foreground'>
            Dernière mise à jour : Juin 2026
          </p>
        </div>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>1. Acceptation des Conditions</h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              En accédant et en utilisant le site web du Cercle Atalanka, vous acceptez d\'être lié par ces conditions d\'utilisation. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
            </p>
            <p className='text-muted-foreground leading-relaxed'>
              Le Cercle Atalanka se réserve le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication sur le site. Il est de votre responsabilité de consulter régulièrement ces conditions.
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>2. Inscription et Compte</h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Pour accéder à certaines fonctionnalités de notre site, vous devez créer un compte. Vous déclarez et garantissez que toutes les informations que vous fournissez lors de l\'inscription sont exactes, complètes et à jour.
            </p>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités qui se produisent sous votre compte. Vous nous informerez immédiatement de toute utilisation non autorisée de votre compte.
            </p>
            <p className='text-muted-foreground leading-relaxed'>
              Le Cercle Atalanka se réserve le droit de suspendre ou de résilier votre compte en cas de violation de ces conditions.
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>3. Abonnements et Paiements</h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Certains contenus et services du Cercle Atalanka sont proposés moyennant un abonnement payant. Les frais d\'abonnement sont indiqués sur notre site et peuvent être modifiés à tout moment avec un préavis raisonnable.
            </p>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Les paiements sont sécurisés via notre fournisseur de paiement tiers. En fournissant vos informations de paiement, vous autorisez le Cercle Atalanka à facturer les frais d\'abonnement à votre méthode de paiement.
            </p>
            <p className='text-muted-foreground leading-relaxed'>
              Vous pouvez annuler votre abonnement à tout moment. L\'annulation prendra effet à la fin de la période de facturation en cours. Aucun remboursement ne sera accordé pour la période en cours.
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>4. Contenu et Propriété Intellectuelle</h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Tout le contenu du site du Cercle Atalanka, y compris mais sans s\'y limiter, les textes, graphismes, logos, images, vidéos, et logiciels, est la propriété exclusive du Cercle Atalanka ou de ses partenaires et est protégé par les lois sur la propriété intellectuelle.
            </p>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Vous ne pouvez pas reproduire, distribuer, modifier, créer des œuvres dérivées, afficher publiquement, exécuter publiquement, publier, adapter, traduire ou exploiter de quelque manière que ce soit le contenu du site sans notre autorisation écrite préalable.
            </p>
            <p className='text-muted-foreground leading-relaxed'>
              Les enseignements et contenus spirituels sont partagés pour votre usage personnel. Toute utilisation commerciale ou redistribution est strictement interdite sans autorisation expresse.
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>5. Comportement de l\'Utilisateur</h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              En utilisant notre site, vous vous engagez à ne pas :
            </p>
            <ul className='text-muted-foreground leading-relaxed list-disc list-inside mb-4 space-y-2'>
              <li>Publier du contenu offensant, diffamatoire, illégal ou inapproprié</li>
              <li>Harceler, intimider ou menacer d\'autres utilisateurs</li>
              <li>Se faire passer pour une autre personne ou entité</li>
              <li>Violer les droits de propriété intellectuelle d\'autrui</li>
              <li>Utiliser le site à des fins commerciales non autorisées</li>
              <li>Interférer avec le fonctionnement du site ou des serveurs</li>
            </ul>
            <p className='text-muted-foreground leading-relaxed'>
              Le Cercle Atalanka se réserve le droit de supprimer tout contenu qui viole ces règles et de suspendre les comptes des utilisateurs qui enfreignent ces conditions.
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>6. Limitation de Responsabilité</h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Le Cercle Atalanka s\'efforce de maintenir le site accessible et fonctionnel, mais ne garantit pas que le site sera ininterrompu, sécurisé ou exempt d\'erreurs.
            </p>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Nous ne sommes pas responsables des dommages directs, indirects, accessoires, consécutifs ou spéciaux résultant de l\'utilisation ou de l\'incapacité à utiliser notre site.
            </p>
            <p className='text-muted-foreground leading-relaxed'>
              Les enseignements spirituels partagés sont proposés à titre informatif et ne remplacent pas un avis professionnel médical, psychologique ou juridique.
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>7. Confidentialité</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Votre confidentialité est importante pour nous. Veuillez consulter notre Politique de Confidentialité pour comprendre comment nous collectons, utilisons et protégeons vos données personnelles.
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>8. Loi Applicable</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Ces conditions d\'utilisation sont régies par les lois en vigueur. Tout litige relatif à ces conditions sera soumis à la compétence exclusive des tribunaux compétents.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>9. Contact</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Pour toute question concernant ces conditions d\'utilisation, veuillez nous contacter à : legal@cercleatalanka.org
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
