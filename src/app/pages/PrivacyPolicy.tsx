import { Card, CardContent } from '../components/ui/Card';

export function PrivacyPolicy() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4'>Politique de Confidentialité</h1>
          <p className='text-xl text-muted-foreground'>
            Dernière mise à jour : Juin 2026
          </p>
        </div>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>1. Introduction</h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Le Cercle Atalanka ('nous', 'notre') s\'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations personnelles lorsque vous utilisez notre site web et nos services.
            </p>
            <p className='text-muted-foreground leading-relaxed'>
              En utilisant notre site, vous acceptez la collecte et l\'utilisation de vos informations conformément à cette politique.
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>2. Informations que Nous Collectons</h2>
            <h3 className='text-xl font-semibold mb-3'>Informations Personnelles</h3>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Nous pouvons collecter les informations personnelles suivantes :
            </p>
            <ul className='text-muted-foreground leading-relaxed list-disc list-inside mb-6 space-y-2'>
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Mot de passe (crypté)</li>
              <li>Informations de paiement (traitées par notre fournisseur de paiement sécurisé)</li>
              <li>Adresse de livraison (si applicable)</li>
              <li>Numéro de téléphone (si fourni)</li>
            </ul>

            <h3 className='text-xl font-semibold mb-3'>Informations de Navigation</h3>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Nous collectons automatiquement certaines informations lorsque vous naviguez sur notre site :
            </p>
            <ul className='text-muted-foreground leading-relaxed list-disc list-inside mb-6 space-y-2'>
              <li>Adresse IP</li>
              <li>Type de navigateur et version</li>
              <li>Système d\'exploitation</li>
              <li>Pages visitées et temps passé</li>
              <li>Liens sur lesquels vous cliquez</li>
              <li>Informations sur l\'appareil</li>
            </ul>

            <h3 className='text-xl font-semibold mb-3'>Cookies</h3>
            <p className='text-muted-foreground leading-relaxed'>
              Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter certaines fonctionnalités du site.
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>3. Utilisation de Vos Informations</h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Nous utilisons vos informations personnelles pour :
            </p>
            <ul className='text-muted-foreground leading-relaxed list-disc list-inside mb-6 space-y-2'>
              <li>Créer et gérer votre compte</li>
              <li>Traiter vos paiements et abonnements</li>
              <li>Fournir les services et contenus demandés</li>
              <li>Envoyer des communications importantes (confirmations, mises à jour)</li>
              <li>Améliorer nos services et l\'expérience utilisateur</li>
              <li>Analyser les tendances d\'utilisation</li>
              <li>Détecter et prévenir les activités frauduleuses</li>
              <li>Personnaliser le contenu selon vos préférences</li>
            </ul>
            <p className='text-muted-foreground leading-relaxed'>
              Nous ne vendons pas vos informations personnelles à des tiers.
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>4. Partage d\'Informations</h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Nous pouvons partager vos informations dans les circonstances suivantes :
            </p>
            <ul className='text-muted-foreground leading-relaxed list-disc list-inside mb-6 space-y-2'>
              <li><strong>Avec votre consentement :</strong> Lorsque vous nous autorisez explicitement à partager vos informations</li>
              <li><strong>Fournisseurs de services :</strong> Avec des tiers qui nous aident à exploiter notre site (paiements, hébergement, analyse)</li>
              <li><strong>Obligations légales :</strong> Si la loi l\'exige ou pour protéger nos droits</li>
              <li><strong>Transferts d\'entreprise :</strong> En cas de fusion, acquisition ou vente d\'actifs</li>
            </ul>
            <p className='text-muted-foreground leading-relaxed'>
              Nos fournisseurs de services tiers sont tenus de protéger vos informations et ne sont autorisés à les utiliser que pour nous fournir les services demandés.
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>5. Sécurité des Données</h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre l\'accès non autorisé, l\'altération, la divulgation ou la destruction.
            </p>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Ces mesures incluent :
            </p>
            <ul className='text-muted-foreground leading-relaxed list-disc list-inside mb-6 space-y-2'>
              <li>Cryptage des données sensibles (SSL/TLS)</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Tests de sécurité réguliers</li>
              <li>Surveillance continue des systèmes (si applicable)</li>
            </ul>
            <p className='text-muted-foreground leading-relaxed'>
              Cependant, aucune méthode de transmission sur Internet n\'est 100% sécurisée. Nous ne pouvons garantir une sécurité absolue.
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>6. Vos Droits</h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Conformément aux réglementations en vigueur, vous avez le droit de :
            </p>
            <ul className='text-muted-foreground leading-relaxed list-disc list-inside mb-6 space-y-2'>
              <li>Accéder à vos informations personnelles</li>
              <li>Demander la correction de vos informations inexactes</li>
              <li>Demander la suppression de vos informations personnelles</li>
              <li>Vous opposer au traitement de vos informations</li>
              <li>Demander la limitation du traitement</li>
              <li>Demander le transfert de vos données</li>
              <li>Retirer votre consentement à tout moment</li>
            </ul>
            <p className='text-muted-foreground leading-relaxed'>
              Pour exercer ces droits, contactez-nous à privacy@cercleatalanka.org
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>7. Conservation des Données</h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Nous conservons vos informations personnelles aussi longtemps que nécessaire pour :
            </p>
            <ul className='text-muted-foreground leading-relaxed list-disc list-inside mb-6 space-y-2'>
              <li>Fournir nos services</li>
              <li>Respecter nos obligations légales</li>
              <li>Résoudre des litiges</li>
              <li>Faire respecter nos accords</li>
            </ul>
            <p className='text-muted-foreground leading-relaxed'>
              Lorsque vous supprimez votre compte, nous supprimons vos informations personnelles dans un délai raisonnable, sauf si nous sommes légalement tenus de les conserver.
            </p>
          </CardContent>
        </Card>

        <Card className='mb-8'>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>8. Modifications de la Politique</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page avec une date de mise à jour révisée. Nous vous encourageons à consulter régulièrement cette politique.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>9. Contact</h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              Pour toute question concernant cette politique de confidentialité ou vos informations personnelles, contactez-nous :
            </p>
            <ul className='text-muted-foreground leading-relaxed list-disc list-inside space-y-2'>
              <li>Email : privacy@cercleatalanka.org</li>
              <li>Adresse : [Adresse physique si applicable]</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
