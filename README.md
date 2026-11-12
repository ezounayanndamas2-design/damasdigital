# Damas Digital

**Vos idées, notre mission digitale.**

Site vitrine et espace d'administration de Damas Digital (Next.js, TypeScript, Supabase).

- **Le site** présente les services, les packs, les prestations supplémentaires, la vidéo, l'à-propos et la FAQ.
- **Le bouton de choix d'un pack** ouvre une fenêtre (pack, nom, pays, téléphone, prestations), enregistre la demande, puis ouvre WhatsApp avec le message déjà écrit.
- **L'administration** (`/admin`) permet de tout gérer sans toucher au code : demandes et statuts, packs, prestations, services, FAQ, numéro WhatsApp, textes, chiffres et réseaux sociaux.

---

## Mise en ligne (une seule fois)

### 1. Supabase : créer la base de données
1. Ouvrez votre projet **damas-digital** sur supabase.com.
2. Menu **SQL Editor**, puis **New query**.
3. Copiez tout le contenu du fichier `supabase/schema.sql`, collez-le, puis cliquez sur **Run**.
   Les tables sont créées avec vos packs, prestations, services et FAQ.

### 2. Supabase : créer votre compte administrateur
1. Menu **Authentication**, puis **Users**, puis **Add user** et **Create new user**.
2. Entrez votre e-mail et un mot de passe solide. Cochez **Auto Confirm User**.
3. Retournez dans **SQL Editor** et exécutez (avec votre e-mail) :
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'VOTRE-EMAIL@exemple.com';
   ```

### 3. Récupérer les deux clés publiques
Menu **Project Settings**, puis **API** (ou **Data API**) :
- **Project URL**, qui correspond à `NEXT_PUBLIC_SUPABASE_URL` ;
- **anon public key**, qui correspond à `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

> N'utilisez jamais la clé `service_role` dans ce site.

### 4. Vercel : publier le site
1. Sur vercel.com, cliquez sur **Add New…**, puis **Project**, puis **Import** du dépôt GitHub `damasdigital`.
2. Avant de cliquer sur **Deploy**, ouvrez **Environment Variables** et ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` : l'adresse du site, par exemple `https://damas-digital.vercel.app`
3. Cliquez sur **Deploy**. Le site est en ligne en 1 à 2 minutes.

### 5. Se connecter à l'administration
Allez sur `https://votre-site/admin` et connectez-vous avec le compte créé à l'étape 2.

---

## Au quotidien

| Je veux… | Où |
|---|---|
| Voir et suivre les nouvelles demandes | Admin › Demandes (statuts : Nouvelle, Contactée, Payée, En cours, Annulée) |
| Changer un prix ou le contenu d'un pack | Admin › Packs › Modifier |
| Mettre le badge « Le plus choisi » | Admin › Packs › cocher « Badge Le plus choisi » |
| Changer le numéro WhatsApp | Admin › Paramètres |
| Modifier les chiffres +20 000 / +50 000 | Admin › Paramètres |
| Ajouter une prestation à la carte | Admin › Prestations |

Chaque modification apparaît sur le site immédiatement.

## Fichiers importants
- `public/presentation.mp4` et `public/poster.jpg` : la vidéo de présentation et son image.
- `public/yann-damas.jpg` : la photo du fondateur.
- `public/logo-damas-blanc.png` : le logo.

## Développement local
```bash
cp .env.example .env.local   # puis renseignez les 2 clés Supabase
npm install
npm run dev                   # http://localhost:3000
```
Sans clés Supabase, le site s'affiche quand même avec le contenu par défaut. L'administration demande alors de connecter la base.
