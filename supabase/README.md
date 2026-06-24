# Backend Supabase - Cercle Atalanka

Ce dossier contient le backend versionne du projet:
- migration schema + RLS: `supabase/migrations/202606230001_initial_schema.sql`
- seed de donnees: `supabase/seed.sql`

## Prerequis
- Docker Desktop (pour le local)
- Supabase CLI installe (`npm i -g supabase` ou `pnpm dlx supabase`)

## Flux local recommande
1. Lancer Supabase local:
   - `supabase start`
2. Appliquer les migrations:
   - `supabase db push`
3. Charger les donnees seed:
   - `supabase db reset`

`supabase db reset` recree la base locale, rejoue les migrations et execute le seed.

## Flux projet cloud (environnement distant)
1. Lier le projet:
   - `supabase link --project-ref <PROJECT_REF>`
2. Appliquer la migration:
   - `supabase db push`
3. Deployer les fonctions Edge necessaires:
   - `pnpm supabase:functions:deploy:checkout`
   - `pnpm supabase:functions:deploy:verify`
   - `pnpm supabase:functions:deploy:pulse`
4. Executer le seed dans l'editeur SQL Supabase:
   - copier le contenu de `supabase/seed.sql`

## Notes importantes
- Les policies RLS sont activees pour toutes les tables metier.
- La fonction `public.is_admin(uuid)` centralise les verifications admin dans les policies.
- Le trigger `handle_new_user` cree automatiquement un profil lors de l'inscription.
- La fonction RPC `public.has_access_to_item(text, uuid)` permet de verifier l'acces a un contenu premium.
- Compte admin de reference a creer dans Supabase Auth: `admin@cercleatalanka.org` / `Kongo999@`.
- Le compte doit ensuite avoir `role = 'admin'` dans `public.profiles`.

## Paiement Chariow
- Fonction Edge de checkout: `supabase/functions/chariow-checkout`
- Fonction Edge de verification de vente: `supabase/functions/chariow-verify-sale`
- Webhook Pulse Chariow: `supabase/functions/chariow-pulse`
- Migration sessions paiement: `supabase/migrations/202606230003_chariow_checkout.sql`

Secrets Supabase a definir:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CHARIOW_API_KEY`
- `CHARIOW_WEBHOOK_SECRET`

Exemple:
- `supabase secrets set CHARIOW_API_KEY=... CHARIOW_WEBHOOK_SECRET=... SUPABASE_SERVICE_ROLE_KEY=... SUPABASE_ANON_KEY=...`

Procedure recommandee de mise en service:
1. `supabase link --project-ref <PROJECT_REF>`
2. `supabase db push`
3. `supabase secrets set CHARIOW_API_KEY=... CHARIOW_WEBHOOK_SECRET=... SUPABASE_SERVICE_ROLE_KEY=... SUPABASE_ANON_KEY=...`
4. `pnpm supabase:functions:deploy:checkout`
5. `pnpm supabase:functions:deploy:verify`
6. `pnpm supabase:functions:deploy:pulse`
7. Configurer dans Chariow un Pulse sur l'URL publique de `chariow-pulse`
8. Remplir les vrais `product_id` Chariow dans `src/app/lib/chariowProducts.ts`
9. Tester un achat complet sur un produit pilote

Webhook Chariow a configurer:
- Trigger minimum: `sale.completed`
- Triggers conseilles: `sale.completed`, `sale.failed`, `sale.refunded`
- URL cible: `https://<project-ref>.functions.supabase.co/chariow-pulse`

Retour utilisateur apres paiement:
- URL de retour frontend: `/payment/return?session=<uuid>`
- Cette URL ameliore l'experience utilisateur, mais la confirmation fiable reste le Pulse Chariow.

Important:
- L'API Checkout Chariow cree une session pour un seul `product_id`. Le panier frontend finalise donc un contenu a la fois.
- Il faut renseigner les correspondances produit local -> produit Chariow dans `src/app/lib/chariowProducts.ts`.
- Le `redirect_url` sert au retour utilisateur, mais la confirmation fiable passe par le webhook `chariow-pulse`.

## Buckets storage recommandes
- `book-covers` (public)
- `book-pdfs` (private)
- `teaching-videos` (public)
- `teaching-images` (public)
- `avatars` (public)
