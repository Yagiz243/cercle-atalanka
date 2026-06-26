# Guide de Déploiement sur Hostinger

## Déploiement Automatique via GitHub Actions (Recommandé)

Le projet est configuré pour se déployer automatiquement sur Hostinger à chaque push sur la branche main.

### Configuration des Secrets GitHub

1. Allez sur votre dépôt GitHub : https://github.com/Yagiz243/cercle-atalanka/settings/secrets/actions
2. Cliquez sur **New repository secret** et ajoutez les secrets suivants :

#### Secrets à configurer pour cercleatalanka.org :

| Nom du secret | Valeur |
|---------------|--------|
| FTP_SERVER | tp.cercleatalanka.org |
| FTP_USERNAME | u217103748.varsyagiz |
| FTP_PASSWORD | arsVars20@ |
| FTP_SERVER_DIR | /home/u217103748/domains/cercleatalanka.org/public_html |

### Comment configurer les secrets :

1. Cliquez sur **New repository secret**
2. Pour le **Name**, entrez le nom du secret (ex: FTP_SERVER)
3. Pour le **Secret**, entrez la valeur correspondante
4. Cliquez sur **Add secret**
5. Répétez pour les 4 secrets

### Comment ça fonctionne

À chaque git push origin main :
1. GitHub Actions construit automatiquement le projet (
pm run build)
2. Le contenu du dossier dist/ est uploadé via FTP sur Hostinger
3. Le site est mis à jour automatiquement sur cercleatalanka.org

### Vérifier le déploiement

1. Allez sur votre dépôt GitHub
2. Cliquez sur l'onglet **Actions**
3. Vous verrez le workflow en cours ou terminé
4. Cliquez sur le workflow pour voir les logs

---

## Déploiement Manuel (Alternative)

Si vous préférez déployer manuellement via FTP :

### Identifiants FTP pour cercleatalanka.org

- **Hôte** : tp.cercleatalanka.org
- **Utilisateur** : u217103748.varsyagiz
- **Mot de passe** : arsVars20@
- **Dossier distant** : /home/u217103748/domains/cercleatalanka.org/public_html

### Étape 1 : Construire le projet

En local, dans le dossier du projet :

`ash
npm run build
`

Cela crée le dossier dist/ contenant tous les fichiers optimisés pour la production.

### Étape 2 : Uploader via FTP

1. Utilisez un client FTP (FileZilla, WinSCP, etc.)
2. Connectez-vous avec les identifiants ci-dessus
3. Naviguez vers /home/u217103748/domains/cercleatalanka.org/public_html
4. Uploadez tout le contenu du dossier dist/ :
   - index.html
   - ssets/ (dossier complet)
   - logo.png
   - hero-bg.jpg
   - ikaye.jpg
   - manifest.json
   - obots.txt
   - sitemap.xml

### Étape 3 : Vérifier le déploiement

1. Ouvrez https://cercleatalanka.org dans un navigateur
2. Vérifiez que :
   - La page d'accueil s'affiche correctement
   - Les images chargent (logo, hero-bg, ikaye)
   - La navigation fonctionne
   - Le favicon s'affiche dans l'onglet

## Fichiers à NE PAS uploader

N'uploadez PAS ces dossiers/fichiers :
- src/
- 
ode_modules/
- package.json
- package-lock.json
- ite.config.ts
- 	sconfig.json
- .env
- Tout fichier de configuration

Seul le contenu de dist/ doit être uploadé.
