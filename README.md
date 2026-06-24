# 🌟 Cercle Atalanka - Plateforme Spirituelle E-Commerce

Une plateforme complète de vente de livres spirituels et d'enseignements en ligne, avec gestion de communauté et dashboard administrateur.

## ✨ Fonctionnalités

### 🎯 Fonctionnalités Principales

#### Pour les utilisateurs
- **Catalogue de livres** : Parcourir et acheter des livres spirituels (premium et gratuits)
- **Enseignements multiformats** : Vidéos, textes enrichis, galeries photos
- **Système de panier** : Ajouter des articles, gérer les quantités, checkout
- **Authentification** : Inscription, connexion, gestion de profil
- **Dashboard personnel** :
  - Vue d'ensemble des achats
  - Historique complet
  - Messagerie avec l'administrateur
  - Paramètres et profil
- **Communauté** : Voir les membres, leurs intérêts, rejoindre la communauté

#### Pour les administrateurs
- **Dashboard admin** complet avec :
  - Statistiques en temps réel
  - Gestion des livres (CRUD)
  - Gestion des enseignements (CRUD)
  - Gestion des utilisateurs
  - Messagerie centralisée
  - Analytics et rapports

### 🎨 Design & UX
- **Thème personnalisé** : Bleu ciel (#87CEEB), Orange (#FF8C42), Vert (#4CAF50), Violet (#9C27B0)
- **Hero section** inspirée de designs modernes
- **Interface responsive** pour mobile, tablette et desktop
- **Navigation intuitive** avec React Router
- **Composants réutilisables** avec Radix UI et Tailwind CSS

## 🏗️ Architecture Technique

### Stack Technologique
- **Frontend** : React 18 + TypeScript
- **Routing** : React Router v7
- **Styling** : Tailwind CSS v4
- **UI Components** : Radix UI
- **Icons** : Lucide React
- **Backend** : Supabase (Auth, Database, Storage)
- **Paiement** : Chariow Checkout API via Supabase Edge Functions
- **State Management** : React Context API

### Structure du Projet
```
src/
├── app/
│   ├── components/
│   │   ├── auth/          # Composants d'authentification
│   │   ├── layout/        # Header, Footer, MainLayout
│   │   └── ui/            # Composants UI réutilisables
│   ├── context/
│   │   ├── AuthContext.tsx    # Gestion authentification
│   │   └── CartContext.tsx    # Gestion panier
│   ├── lib/
│   │   ├── supabase.ts        # Client Supabase
│   │   ├── types.ts           # Types TypeScript
│   │   ├── mockData.ts        # Données de test
│   │   └── utils.ts           # Fonctions utilitaires
│   ├── pages/
│   │   ├── Home.tsx           # Page d'accueil
│   │   ├── About.tsx          # À propos
│   │   ├── Books.tsx          # Catalogue livres
│   │   ├── BookDetail.tsx     # Détails d'un livre
│   │   ├── Teachings.tsx      # Liste enseignements
│   │   ├── TeachingDetail.tsx # Détails enseignement
│   │   ├── Community.tsx      # Page communauté
│   │   ├── Cart.tsx           # Panier d'achat
│   │   ├── Login.tsx          # Connexion
│   │   ├── Register.tsx       # Inscription
│   │   ├── Dashboard.tsx      # Dashboard utilisateur
│   │   ├── dashboard/         # Pages du dashboard user
│   │   ├── admin/             # Dashboard administrateur
│   │   └── NotFound.tsx       # Page 404
│   ├── routes.tsx         # Configuration des routes
│   └── App.tsx            # Composant racine
└── styles/
    ├── theme.css          # Thème personnalisé
    └── fonts.css          # Polices

```

### Schéma de Base de Données

```
profiles
  - id, email, full_name, avatar_url, role, created_at

books
  - id, title, author, description, cover_image_url, pdf_url
  - price, is_premium, category, rating, reviews

teachings
  - id, title, description, type, video_url, content, images
  - is_premium, category, duration, rating, views

purchases
  - id, user_id, item_id, item_type, amount, status

messages
  - id, user_id, message, is_admin_reply, read

community_members
  - id, user_id, bio, interests
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ et pnpm
- Compte Supabase (optionnel pour la démo)

### Installation
```bash
# Cloner le repository
git clone <repo-url>
cd cercle-atalanka

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement (optionnel)
cp .env.example .env
# Éditer .env avec vos clés Supabase
```

### Démarrage
```bash
# Mode développement
pnpm dev

# Build production
pnpm build
```

L'application sera accessible sur `http://localhost:5173`

## 🔐 Configuration Supabase

Pour activer le backend Supabase, consultez [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Mode démo** : Sans configuration Supabase, l'application utilise des données mockées.

## 📦 Fonctionnalités Détaillées

### Système d'Authentification
- Inscription avec nom, email, mot de passe
- Connexion avec persistance de session
- Protection des routes (dashboard, admin)
- Gestion du profil utilisateur

### Catalogue et Recherche
- **Livres** : Filtres par catégorie, premium, recherche par titre/auteur
- **Enseignements** : Filtres par type (vidéo, texte+vidéo, etc.), catégorie

### Panier d'Achat
- Ajout/suppression d'articles
- Gestion des quantités
- Calcul du total automatique
- Checkout (mode démo)

### Dashboard Utilisateur
- **Vue d'ensemble** : Stats personnelles, achats récents, recommandations
- **Mes achats** : Historique complet, téléchargement des livres
- **Messages** : Chat en temps réel avec l'admin
- **Paramètres** : Modification profil, notifications, sécurité

### Dashboard Administrateur
- **Vue d'ensemble** : Statistiques globales, activité récente
- **Gestion livres** : Tableau complet avec CRUD
- **Gestion enseignements** : CRUD avec prévisualisation
- **Utilisateurs** : Liste, rôles, bannissement
- **Messages** : Inbox centralisée avec réponses

### Pages de Détails
- **Livre** : Couverture, description, avis, livres similaires
- **Enseignement** : Lecteur vidéo, contenu, commentaires

## 🎨 Système de Design

### Palette de Couleurs
- **Primary (Bleu ciel)** : Actions principales, navigation
- **Secondary (Orange)** : Prix, highlights
- **Accent (Vert)** : Succès, enseignements
- **Violet** : Premium, admin

### Composants UI
Tous les composants suivent les principes :
- **Accessibilité** : ARIA labels, keyboard navigation
- **Responsive** : Mobile-first design
- **Consistance** : Design system unifié
- **Performance** : Optimisations React

## 🔒 Sécurité

### Row Level Security (RLS)
- Policies Supabase pour chaque table
- Isolation des données par utilisateur
- Protection des routes admin

### Gestion des Cas Limites
- Validation des formulaires
- Gestion des erreurs réseau
- États de chargement
- Pages 404
- Protection contre les injections

## 📱 Responsive Design

L'application est entièrement responsive :
- **Mobile** : < 768px
- **Tablette** : 768px - 1024px
- **Desktop** : > 1024px

## 🧪 Données de Test

### Compte Administrateur
- **Email** : admin@cercleatalanka.org
- **Mot de passe** : Kongo999@
- **Rôle** : admin via la table `profiles` dans Supabase

### Données Mockées
- 6 livres avec différentes catégories
- 6 enseignements (vidéo, texte, mixte)
- 3 membres de communauté
- Messages de démonstration

## 🚧 Améliorations Futures

### Phase 2
- [ ] Intégration paiement réel (Stripe)
- [ ] Système de reviews/notes
- [ ] Wishlist
- [ ] Notifications push
- [ ] Recherche avancée avec filtres multiples

### Phase 3
- [ ] Événements et webinaires
- [ ] Forum communautaire
- [ ] Système de points/gamification
- [ ] Application mobile (React Native)

## 📄 License

Propriétaire - Cercle Atalanka © 2026

## 👥 Équipe

Développé par l'équipe Cercle Atalanka

## 📞 Support

Pour toute question :
- Email : support@cercleatalanka.com
- Dashboard : Section Messages

---

**Cercle Atalanka** - Votre guide vers l'éveil spirituel 🌟
