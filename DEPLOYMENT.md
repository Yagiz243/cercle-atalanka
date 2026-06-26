# Guide de Déploiement sur Hostinger

## Déploiement Automatique via GitHub Actions (Recommandé)

Le projet est configuré pour se déployer automatiquement sur Hostinger à chaque push sur la branche main.

### Configuration des Secrets GitHub

1. Allez sur votre dépôt GitHub
2. Cliquez sur **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **New repository secret** et ajoutez les secrets suivants :

#### Secrets à configurer :

| Nom du secret | Description | Exemple |
|---------------|-------------|---------|
| FTP_SERVER | Adresse FTP de votre hébergement Hostinger | tp.votre-site.com |
| FTP_USERNAME | Nom d'utilisateur FTP | u123456789 |
| FTP_PASSWORD | Mot de passe FTP | otre_mot_de_passe_ftp |
| FTP_SERVER_DIR | Dossier distant sur le serveur | /public_html |

#### Comment trouver vos identifiants FTP Hostinger :

1. Connectez-vous au panneau de contrôle Hostinger
2. Allez dans **Hébergement** → **Gérer**
3. Cliquez sur **Comptes FTP**
4. Créez un nouveau compte FTP ou utilisez l'existant
5. Copiez :
   - **Hôte** → pour FTP_SERVER
   - **Utilisateur** → pour FTP_USERNAME
   - **Mot de passe** → pour FTP_PASSWORD
   - **Dossier** → généralement /public_html pour FTP_SERVER_DIR

### Comment ça fonctionne

À chaque git push origin main :
1. GitHub Actions construit automatiquement le projet (
pm run build)
2. Le contenu du dossier dist/ est uploadé via FTP sur Hostinger
3. Le site est mis à jour automatiquement

### Vérifier le déploiement

1. Allez sur votre dépôt GitHub
2. Cliquez sur l'onglet **Actions**
3. Vous verrez le workflow en cours ou terminé
4. Cliquez sur le workflow pour voir les logs

---

## Déploiement Manuel (Alternative)

Si vous préférez déployer manuellement :

### Étape 1 : Construire le projet

En local, dans le dossier du projet :

`ash
npm run build
`

Cela crée le dossier dist/ contenant tous les fichiers optimisés pour la production.

### Étape 2 : Uploader sur Hostinger

#### Option A : Via FTP

1. Utilisez un client FTP (FileZilla, WinSCP, etc.)
2. Connectez-vous avec vos identifiants FTP Hostinger
3. Naviguez vers le dossier public_html (ou le sous-dossier si applicable)
4. Uploadez tout le contenu du dossier dist/ :
   - index.html
   - ssets/ (dossier complet)
   - logo.png
   - hero-bg.jpg
   - ikaye.jpg
   - manifest.json
   - obots.txt
   - sitemap.xml

#### Option B : Via le Gestionnaire de fichiers Hostinger

1. Connectez-vous au panneau de contrôle Hostinger
2. Ouvrez le "Gestionnaire de fichiers"
3. Naviguez vers public_html
4. Uploadez tous les fichiers du dossier dist/

### Étape 3 : Vérifier le déploiement

1. Ouvrez votre site dans un navigateur
2. Vérifiez que :
   - La page d'accueil s'affiche correctement
   - Les images chargent (logo, hero-bg, ikaye)
   - La navigation fonctionne
   - Le favicon s'affiche dans l'onglet

## Configuration si le site est dans un sous-dossier

Si votre site est hébergé dans un sous-dossier (ex: https://votre-site.com/cercle-atalanka/), modifiez ite.config.ts :

`	ypescript
export default defineConfig({
  base: '/cercle-atalanka/', // Ajoutez cette ligne
  // ... le reste de la configuration
})
`

Puis reconstruisez avec 
pm run build et mettez à jour FTP_SERVER_DIR dans les secrets GitHub.

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
