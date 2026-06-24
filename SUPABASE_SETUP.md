# Configuration Supabase pour Cercle Atalanka

## Workflow recommande (versionne dans le repo)

Le backend est maintenant versionne dans le dossier `supabase/`:
- Migration schema + RLS: `supabase/migrations/202606230001_initial_schema.sql`
- Seed: `supabase/seed.sql`
- Configuration locale CLI: `supabase/config.toml`

Commandes recommandees:
```bash
pnpm supabase:start
pnpm supabase:push
pnpm supabase:reset
```

Consultez `supabase/README.md` pour les details local/cloud.

## Prérequis

1. Créer un compte sur [Supabase](https://supabase.com)
2. Créer un nouveau projet Supabase

## Configuration des variables d'environnement

1. Copier le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```

2. Remplir les variables dans `.env` :
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Création du schéma de base de données

Exécuter ces commandes SQL dans l'éditeur SQL de Supabase :

```sql
-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Books table
CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  pdf_url TEXT,
  price DECIMAL(10, 2) NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  category TEXT NOT NULL,
  rating DECIMAL(2, 1),
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teachings table
CREATE TABLE teachings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'text_video', 'text_photo', 'text')),
  video_url TEXT,
  content TEXT,
  images JSONB,
  is_premium BOOLEAN DEFAULT false,
  category TEXT NOT NULL,
  duration TEXT,
  rating DECIMAL(2, 1),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases table
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('book', 'teaching')),
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_admin_reply BOOLEAN DEFAULT false,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community members table
CREATE TABLE community_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_community_members_user_id ON community_members(user_id);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_teachings_category ON teachings(category);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachings ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read all profiles, update only their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Books: Everyone can read, only admins can modify
CREATE POLICY "Books are viewable by everyone" ON books FOR SELECT USING (true);
CREATE POLICY "Only admins can insert books" ON books FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update books" ON books FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete books" ON books FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Teachings: Everyone can read, only admins can modify
CREATE POLICY "Teachings are viewable by everyone" ON teachings FOR SELECT USING (true);
CREATE POLICY "Only admins can insert teachings" ON teachings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update teachings" ON teachings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete teachings" ON teachings FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Purchases: Users can view own purchases, admins can view all
CREATE POLICY "Users can view own purchases" ON purchases FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can create purchases" ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages: Users can view own messages and admin replies
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can reply to messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') AND is_admin_reply = true
);
CREATE POLICY "Admins can update messages" ON messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Community members: Everyone can read, users can update their own
CREATE POLICY "Community members are viewable by everyone" ON community_members FOR SELECT USING (true);
CREATE POLICY "Users can create own community profile" ON community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own community profile" ON community_members FOR UPDATE USING (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', 'New User'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_teachings_updated_at BEFORE UPDATE ON teachings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

## Configuration du Storage (pour les fichiers)

1. Dans Supabase Dashboard, aller dans Storage
2. Créer les buckets suivants :
   - `book-covers` (public)
   - `book-pdfs` (private)
   - `teaching-videos` (public)
   - `teaching-images` (public)
   - `avatars` (public)

3. Configurer les politiques de storage pour chaque bucket

## Insérer des données de test

```sql
-- Insérer des livres de test
INSERT INTO books (title, author, description, cover_image_url, price, is_premium, category, rating, reviews)
VALUES 
  ('Le Chemin de la Sagesse', 'Maître Atalanka', 'Un guide spirituel profond explorant les voies de la sagesse intérieure et de l''éveil spirituel.', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop', 29.99, true, 'Spiritualité', 4.8, 124),
  ('Méditations Quotidiennes', 'Cercle Atalanka', '365 méditations guidées pour transformer votre vie quotidienne en pratique spirituelle.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=600&fit=crop', 19.99, false, 'Méditation', 4.9, 256);

-- Insérer des enseignements de test
INSERT INTO teachings (title, description, type, is_premium, category, duration, rating, views)
VALUES
  ('Introduction à la Méditation', 'Apprenez les bases de la méditation avec ce cours vidéo complet pour débutants.', 'video', false, 'Méditation', '45 min', 4.9, 5234),
  ('Les Sept Chakras', 'Exploration approfondie du système énergétique des chakras avec exercices pratiques.', 'text_video', true, 'Énergie', '1h 30min', 5.0, 3456);
```

## Utilisation dans le code

Les contextes `AuthContext` et autres utilisent déjà le client Supabase configuré dans `src/app/lib/supabase.ts`.

Pour activer Supabase :
1. Configurez les variables d'environnement
2. Le code basculera automatiquement de mock data vers Supabase

## Authentification

Supabase gère automatiquement :
- Inscription
- Connexion
- Sessions
- Réinitialisation de mot de passe
- Authentification sociale (Google, GitHub, etc.)

## Notes importantes

- Les données mockées sont utilisées par défaut si Supabase n'est pas configuré
- Row Level Security (RLS) protège vos données
- Les admins doivent être créés manuellement en modifiant le rôle dans la table profiles
- Compte admin de référence à créer dans Supabase Auth: `admin@cercleatalanka.org`
- Mot de passe de référence: `Kongo999@`
