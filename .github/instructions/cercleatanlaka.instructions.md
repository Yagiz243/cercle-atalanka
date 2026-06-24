---
applyTo: "src/**/*.{ts,tsx,css}"
description: "Conventions Cercle Atalanka pour code React/TypeScript, UI, accessibilite et qualite."
---

# Conventions Projet Cercle Atalanka

## Objectif
Appliquer des changements coherents avec l'architecture actuelle (React 18, TypeScript, React Router, Tailwind, composants UI deja presents dans `src/app/components/ui`).

## Regles De Structure
- Garder les pages dans `src/app/pages`.
- Garder la logique partagee dans `src/app/lib` ou `src/app/context` selon le besoin.
- Eviter les composants trop longs: extraire les sous-composants reutilisables.
- Preserver les noms existants et le style de code du fichier modifie.

## Regles UI Et UX
- Reutiliser les composants existants de `src/app/components/ui` avant d'en creer de nouveaux.
- Respecter le theme du projet: primaire bleu ciel, secondaire orange, accent vert, usage violet reserve aux zones premium/admin.
- Conserver un rendu responsive mobile-first.
- Ne pas casser la navigation existante ni la hierarchie des layouts.

## Accessibilite
- Ajouter des labels explicites sur les champs de formulaire.
- Verifier la navigation clavier sur les interactions principales.
- Utiliser des textes de boutons explicites (action claire).

## Donnees Et Etat
- Typage strict TypeScript pour les donnees metier (livres, enseignements, achats, messages).
- Eviter la duplication de types: preferer les types de `src/app/lib/types.ts` et `src/app/lib/database.types.ts`.
- Pour les donnees mockees, rester coherent avec les structures de `src/app/lib/mockData.ts`.

## Qualite Des Changements
- Ne modifier que le minimum necessaire a la demande.
- Eviter tout refactoring massif non demande.
- Si une fonctionnalite impacte une page detaillee, verifier aussi les flux associes (liste, detail, panier/dashboard selon le cas).
- Signaler clairement les hypothese quand des exigences manquent.
