-- =====================================================================
-- DAMAS DIGITAL — Base de données
-- À exécuter une seule fois dans Supabase : SQL Editor > New query > coller > Run
-- =====================================================================

-- ---------- Administrateurs ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Paramètres du site (une seule ligne) ----------
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  brand_name text not null default 'Damas Digital',
  slogan text not null default 'Vos idées, notre mission digitale.',
  whatsapp text not null default '242068522857',
  hero_title text not null default 'Une présence forte en ligne.',
  hero_accent text not null default 'Un vrai impact sur votre activité.',
  hero_text text not null default 'Damas Digital gère vos réseaux sociaux, crée vos contenus et pilote votre communication pour que votre activité gagne en visibilité, attire plus de clients et vende davantage.',
  hero_punch text not null default 'Choisissez votre pack, on se charge de tout.',
  stat1_value int not null default 20000,
  stat1_label text not null default 'personnes sont passées chez Damas Digital',
  stat2_value int not null default 50000,
  stat2_label text not null default 'personnes ont utilisé nos services',
  founder_name text not null default 'Yann Damas',
  founder_role text not null default 'Fondateur de Damas Digital · Brazzaville',
  founder_bio text not null default 'Entrepreneur du digital et du e-commerce, Yann a créé Damas Digital pour aider les entrepreneurs et les marques à se développer en ligne.',
  about_text text not null default 'Damas Digital est une agence de communication et de marketing digital. Nous aidons les entrepreneurs, les commerces et les marques à avoir une présence forte et un vrai impact en ligne. Vous choisissez votre pack, nous nous chargeons de tout.',
  facebook text not null default '',
  instagram text not null default '',
  tiktok text not null default '',
  email text not null default '',
  updated_at timestamptz not null default now()
);
insert into public.settings (id) values (1) on conflict (id) do nothing;

-- ---------- Packs ----------
create table if not exists public.packs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price int not null check (price >= 0),
  period text not null default 'mois',
  level text not null default '',
  tagline text not null default '',
  networks text not null default '',
  contents text not null default '',
  items text[] not null default '{}',
  audience text[] not null default '{}',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Prestations supplémentaires ----------
create table if not exists public.extras (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_label text not null,
  is_active boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Domaines / services ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  icon text not null default 'cm' check (icon in ('cm','md','bv','cv','ec')),
  name text not null,
  description text not null default '',
  points text[] not null default '{}',
  is_active boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- FAQ ----------
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_active boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Demandes d'accompagnement ----------
do $$ begin
  create type public.demande_status as enum ('nouvelle','contactee','payee','active','annulee');
exception when duplicate_object then null; end $$;

create table if not exists public.demandes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  pack_id uuid references public.packs(id) on delete set null,
  pack_name text not null,
  pack_price int not null default 0,
  extras text[] not null default '{}',
  name text not null check (char_length(name) between 2 and 120),
  country text not null default '' check (char_length(country) <= 60),
  phone text not null check (char_length(phone) between 6 and 30),
  status public.demande_status not null default 'nouvelle',
  notes text not null default '',
  updated_at timestamptz not null default now()
);
create index if not exists demandes_created_idx on public.demandes (created_at desc);
create index if not exists demandes_status_idx on public.demandes (status);

-- ---------- Sécurité (Row Level Security) ----------
alter table public.admins   enable row level security;
alter table public.settings enable row level security;
alter table public.packs    enable row level security;
alter table public.extras   enable row level security;
alter table public.services enable row level security;
alter table public.faqs     enable row level security;
alter table public.demandes enable row level security;

-- admins : chaque admin peut voir sa propre ligne
drop policy if exists admins_self on public.admins;
create policy admins_self on public.admins for select using (user_id = auth.uid());

-- lecture publique du contenu actif, gestion complète par l'admin
drop policy if exists settings_read on public.settings;
create policy settings_read on public.settings for select using (true);
drop policy if exists settings_admin on public.settings;
create policy settings_admin on public.settings for update using (public.is_admin()) with check (public.is_admin());

do $$
declare t text;
begin
  foreach t in array array['packs','extras','services','faqs'] loop
    execute format('drop policy if exists %1$s_read on public.%1$s', t);
    execute format('create policy %1$s_read on public.%1$s for select using (is_active or public.is_admin())', t);
    execute format('drop policy if exists %1$s_admin on public.%1$s', t);
    execute format('create policy %1$s_admin on public.%1$s for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- demandes : tout visiteur peut en créer une (statut « nouvelle » uniquement), seul l'admin peut les lire et les gérer
drop policy if exists demandes_insert on public.demandes;
create policy demandes_insert on public.demandes for insert to anon, authenticated
  with check (status = 'nouvelle' and notes = '');
drop policy if exists demandes_admin on public.demandes;
create policy demandes_admin on public.demandes for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Contenu de départ ----------
insert into public.packs (slug,name,price,level,tagline,networks,contents,items,audience,is_featured,position) values
('starter','Starter',75000,'Pour démarrer','Une présence efficace pour bien démarrer.','2 réseaux sociaux','8 publications / mois',
 array['Audit rapide','Stratégie de communication','Gestion de 2 réseaux sociaux','8 publications / mois','Visuels simples','Rédaction des textes'],
 array['Entrepreneurs qui lancent leur activité','Petits commerces qui veulent être présents en ligne','Marques qui publient sans régularité'],false,1),
('pro','Pro',150000,'Pour grandir','Une communication complète et performante.','3 réseaux sociaux','12 publications / mois',
 array['Stratégie marketing','Gestion de 3 réseaux sociaux','12 publications / mois','8 stories','Création de visuels','Rédaction + calendrier éditorial','Animation de communauté','Suivi des statistiques'],
 array['Entreprises qui veulent une communication régulière','Marques qui veulent animer leur communauté','Commerces qui veulent suivre leurs résultats'],false,2),
('premium','Premium',250000,'Impact maximal','Une stratégie avancée pour un impact maximal.','Toutes les pages','16 publications / mois',
 array['Stratégie complète','Gestion de toutes les pages','16 publications / mois','Stories régulières','Création de contenus vidéo','Rédaction + calendrier éditorial','Animation de communauté','Optimisation des pages','Analyse mensuelle','Recommandations pour développer les ventes'],
 array['Marques présentes sur plusieurs réseaux','Entreprises qui veulent de la vidéo','Activités qui veulent développer leurs ventes'],false,3),
('full-boost','Full Boost',350000,'Sur-mesure','Un accompagnement sur-mesure pour aller encore plus loin.','Gestion quotidienne','Contenu professionnel',
 array['Prise en charge complète de la communication','Stratégie marketing avancée','Création de contenu professionnel','Gestion quotidienne des réseaux','Vidéos / Reels / TikTok','Campagnes publicitaires','Suivi des prospects','Reporting détaillé','Optimisation continue'],
 array['Entreprises qui délèguent toute leur communication','Marques qui investissent dans la publicité','Dirigeants qui veulent des résultats sans y passer du temps'],true,4)
on conflict (slug) do nothing;

insert into public.extras (name,price_label,position)
select * from (values
 ('Création d’une identité visuelle','75 000 FCFA',1),
 ('Création d’un logo','30 000 FCFA',2),
 ('Création d’une affiche / publicité','10 000 à 20 000 FCFA',3),
 ('Montage d’une vidéo courte','15 000 à 30 000 FCFA',4),
 ('Gestion d’une campagne sponsorisée','30 000 FCFA + budget publicitaire',5),
 ('Audit complet d’une entreprise','50 000 FCFA',6),
 ('Élaboration d’une stratégie marketing complète','75 000 FCFA',7)
) v(name,price_label,position)
where not exists (select 1 from public.extras);

insert into public.services (icon,name,description,points,position)
select * from (values
 ('cm','Community Management','Vos réseaux sociaux gérés efficacement, du profil jusqu’à la relation client.',
   array['Création et optimisation de pages','Stratégie de communication','Création de contenus','Calendrier éditorial','Gestion des communautés','Relation client','Analyse des performances'],1),
 ('md','Marketing digital','Des actions pour vendre en ligne et attirer de nouveaux clients.',
   array['Stratégie de vente en ligne','Publicité Facebook et Instagram','Publicité TikTok','Acquisition de clients','Tunnel de vente','WhatsApp Business'],2),
 ('bv','Booster ses comptes et sa visibilité','Une présence en ligne qui grandit, de façon organique et avec la publicité.',
   array['Optimisation des profils','Croissance organique','Techniques d’engagement','Analyse des statistiques','Publicité de visibilité'],3),
 ('cv','Création de contenu vidéo','Des vidéos qui retiennent l’attention et donnent envie d’acheter.',
   array['Tournage','Montage CapCut','Vidéos publicitaires','Storytelling','Reels et TikTok'],4)
) v(icon,name,description,points,position)
where not exists (select 1 from public.services);

insert into public.faqs (question,answer,position)
select * from (values
 ('Comment choisir mon accompagnement ?','Starter convient pour démarrer avec 2 réseaux, Pro pour une communication régulière sur 3 réseaux, Premium pour un impact maximal avec de la vidéo, et Full Boost si vous voulez nous confier toute votre communication, publicité comprise. En cas de doute, choisissez un pack : nous ajustons avec vous lors de l’échange.',1),
 ('Comment effectuer mon inscription ?','Cliquez sur « Choisir cet accompagnement », indiquez votre nom, votre pays et votre numéro, ajoutez si besoin des prestations supplémentaires, puis envoyez le message préparé sur WhatsApp. Nous vous répondons pour finaliser.',2),
 ('Comment payer ma formule ?','Aucun paiement ne se fait sur le site. Les modalités de paiement vous sont communiquées directement lors de l’échange sur WhatsApp, puis votre accompagnement est confirmé.',3),
 ('Quand démarre mon accompagnement ?','Dès la confirmation, nous lançons votre accompagnement : audit, puis stratégie, puis création et publication de vos contenus.',4),
 ('Puis-je tout suivre depuis mon téléphone ?','Oui. Tout se fait depuis votre téléphone : échanges, validation des contenus et rapports.',5),
 ('Est-ce que je reçois les contenus créés pour moi ?','Oui. Les visuels, vidéos et textes réalisés pour votre activité vous sont transmis et restent à votre disposition.',6),
 ('Peut-on bénéficier d’un accompagnement personnalisé ?','Oui. Le pack Full Boost est entièrement sur-mesure, et chaque pack est adapté à votre activité dès l’audit.',7)
) v(question,answer,position)
where not exists (select 1 from public.faqs);

-- =====================================================================
-- DERNIÈRE ÉTAPE (après avoir créé votre compte admin dans Authentication > Users) :
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'VOTRE-EMAIL@exemple.com';
-- =====================================================================
