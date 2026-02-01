# 📑 Rapport de Projet: Build Master
## Démonstration des Pratiques DevOps et de la Méthodologie Agile/Scrum

---

# I. Présentation du Projet et Vision

## 1.1 Résumé Exécutif

**Build Master** est une plateforme e-commerce spécialisée dans l'assemblage de PC sur mesure. Elle permet aux utilisateurs de sélectionner des composants informatiques compatibles entre eux grâce à un moteur de compatibilité intelligent, de sauvegarder leurs configurations, et de passer commande.

Ce projet a été développé dans le cadre d'un cours sur les **méthodologies DevOps et Agile/Scrum**, avec pour objectif principal de démontrer la maîtrise de ces pratiques à travers un cas d'usage concret et techniquement exigeant.

**Liens de Production:**
- **Frontend (Vercel):** `https://buildmaster-fawn.vercel.app`
- **Backend (Render):** `https://buildmaster-ijra.onrender.com`
- **Base de Données (Supabase):** PostgreSQL managé

> **📸 Screenshot suggéré:** Page d'accueil du site en production montrant les "New Arrivals" et "Shop by Category".

---

## 1.2 Le Concept "Build Master"

Assembler un PC est une tâche complexe qui nécessite une connaissance approfondie de la compatibilité entre les différents composants (socket CPU/Carte Mère, type de RAM DDR4/DDR5, taille du GPU par rapport au boîtier, puissance de l'alimentation par rapport au TDP total, etc.).

**Build Master** résout ce problème en proposant:

1. **Un PC Builder Guidé:** Un assistant pas-à-pas qui filtre automatiquement les composants incompatibles à chaque étape.
2. **Un Catalogue Dynamique:** Une base de données de composants avec des spécifications JSON flexibles, permettant d'ajouter de nouveaux types de produits sans modifier le schéma de la base de données.
3. **Un Chatbot IA:** Un assistant technique alimenté par l'IA pour aider les utilisateurs à comprendre les spécifications et à faire des choix éclairés.

> **📸 Screenshot suggéré:** Le PC Builder en action, montrant la sélection d'un composant avec le filtre de compatibilité actif.

---

## 1.3 Objectifs Fondamentaux

Ce projet poursuit deux catégories d'objectifs complémentaires:

### Objectifs Techniques (Le "Quoi")
| Objectif | Description |
|----------|-------------|
| **Application Full-Stack** | Développer une SPA Vue.js communicant avec une API REST Express.js |
| **Base de Données Relationnelle** | Modéliser les entités (Users, Components, Orders, SavedBuilds) avec Prisma ORM |
| **Logique Métier Avancée** | Implémenter le moteur de compatibilité PC (filtrage JSON dynamique) |
| **Intégration IA** | Connecter un chatbot à l'API Google Gemini |
| **Déploiement Cloud** | Héberger le projet sur une architecture distribuée (Vercel + Render + Supabase) |

### Objectifs Méthodologiques (Le "Comment")
| Objectif | Description |
|----------|-------------|
| **Pratique du Framework Scrum** | Organiser le travail en Sprints avec des User Stories |
| **Maîtrise de GitFlow** | Utiliser des branches de fonctionnalités et des Pull Requests |
| **Pipeline CI/CD** | Automatiser les déploiements à chaque `git push` |
| **Collaboration d'Équipe** | Coordonner le travail entre développeurs Frontend et Backend |
| **Gestion des Environnements** | Séparer les configurations de développement et de production |

---

# II. Méthodologie Agile: Le Framework Scrum

## 2.0 Organisation de l'Équipe et Rôles

L'équipe du projet Build Master est organisée selon les principes Scrum avec une répartition claire des responsabilités:

### Structure de l'Équipe

```
┌─────────────────────────────────────────────────────────────┐
│                    ÉQUIPE BUILD MASTER                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐    ┌─────────────────┐                  │
│  │   FRONTEND      │    │    BACKEND      │                  │
│  │   TEAM          │    │    TEAM         │                  │
│  ├─────────────────┤    ├─────────────────┤                  │
│  │ • Vue.js SPA    │    │ • Express API   │                  │
│  │ • Tailwind CSS  │    │ • Prisma ORM    │                  │
│  │ • Pinia Store   │    │ • Auth/Security │                  │
│  │ • UI Components │    │ • PC Builder    │                  │
│  └────────┬────────┘    └────────┬────────┘                  │
│           │                      │                            │
│           └──────────┬───────────┘                            │
│                      ▼                                        │
│           ┌─────────────────┐                                │
│           │   INTÉGRATION   │                                │
│           │   & DEVOPS      │                                │
│           ├─────────────────┤                                │
│           │ • GitFlow       │                                │
│           │ • CI/CD         │                                │
│           │ • Déploiement   │                                │
│           └─────────────────┘                                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Répartition des Responsabilités

**Équipe Frontend:**
- Développement des composants Vue.js réutilisables
- Implémentation du design system avec Tailwind CSS
- Gestion de l'état global avec Pinia
- Création de l'interface utilisateur du PC Builder
- Intégration du Chatbot IA

**Équipe Backend:**
- Conception et implémentation de l'API REST
- Modélisation de la base de données avec Prisma
- Développement du moteur de compatibilité
- Gestion de l'authentification JWT
- Administration des composants et catégories

> **📸 Screenshot suggéré:** Organigramme de l'équipe ou capture d'écran de l'outil de gestion de projet montrant les assignations.

---

## 2.1 Product Backlog et User Stories

Le Product Backlog est le répertoire central de toutes les fonctionnalités à développer. Chaque élément est formulé sous forme de **User Story** selon le format standard:

> *"En tant que [rôle], je veux [action] afin de [bénéfice]."*

### Exemples de User Stories du Projet

| ID | User Story | Priorité | Points |
|----|------------|----------|--------|
| US-001 | En tant qu'utilisateur, je veux parcourir le catalogue de composants par catégorie afin de découvrir les produits disponibles | Haute | 5 |
| US-002 | En tant qu'utilisateur, je veux utiliser le PC Builder pour assembler un PC compatible afin d'éviter les erreurs d'incompatibilité | Haute | 13 |
| US-003 | En tant qu'utilisateur, je veux sauvegarder ma configuration afin de la retrouver plus tard | Moyenne | 8 |
| US-004 | En tant qu'utilisateur, je veux discuter avec un chatbot IA afin d'obtenir des conseils sur mes choix de composants | Moyenne | 8 |
| US-005 | En tant qu'administrateur, je veux gérer les composants (CRUD) afin de maintenir le catalogue à jour | Haute | 8 |
| US-006 | En tant qu'administrateur, je veux voir les spécifications techniques de chaque composant afin de les éditer correctement | Haute | 5 |

### Critères d'Acceptation (Exemple pour US-002)

**User Story:** PC Builder avec compatibilité
```
✅ GIVEN un utilisateur qui a sélectionné un CPU Intel (socket LGA1700)
   WHEN il passe à l'étape "Carte Mère"
   THEN seules les cartes mères avec socket LGA1700 sont affichées

✅ GIVEN un utilisateur qui a sélectionné un GPU de 336mm de longueur
   WHEN il passe à l'étape "Boîtier"
   THEN seuls les boîtiers supportant cette longueur sont affichés

✅ GIVEN un utilisateur avec un CPU de 125W TDP et un GPU de 450W TDP
   WHEN il passe à l'étape "Alimentation"
   THEN seules les PSU d'au moins 862.5W (1.5x total TDP) sont affichées
```

> **📸 Screenshot suggéré:** Capture d'écran du backlog dans Trello/Jira montrant les User Stories organisées.

---

## 2.2 Gestion des Sprints

### Planning de Sprint

Chaque Sprint commence par une session de **Sprint Planning** où l'équipe:
1. Sélectionne les User Stories à traiter depuis le Product Backlog
2. Estime la charge de travail en **Story Points** (suite de Fibonacci: 1, 2, 3, 5, 8, 13...)
3. Décompose les Stories en **Tasks** techniques assignables

### Structure d'un Sprint Type

```
┌────────────────────────────────────────────────────────────┐
│                     SPRINT N (2 semaines)                   │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  Jour 1: Sprint Planning                                     │
│  ├── Revue du Backlog priorisé                              │
│  ├── Sélection des Stories pour le Sprint                   │
│  └── Décomposition en Tasks                                 │
│                                                              │
│  Jours 2-9: Développement                                    │
│  ├── Daily Scrum (15 min chaque matin)                      │
│  │   • Qu'ai-je fait hier?                                  │
│  │   • Que vais-je faire aujourd'hui?                       │
│  │   • Y a-t-il des blocages?                               │
│  └── Développement des Features                             │
│                                                              │
│  Jour 10: Sprint Review & Retrospective                      │
│  ├── Démonstration des fonctionnalités terminées            │
│  ├── Feedback du Product Owner                              │
│  └── Rétrospective: Amélioration continue                   │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

### Daily Scrum (Mêlée Quotidienne)

Le Daily Scrum est une réunion quotidienne de **15 minutes maximum** où chaque membre répond à trois questions:

1. **Hier:** "J'ai terminé l'intégration de l'API de composants"
2. **Aujourd'hui:** "Je vais implémenter le filtre de compatibilité Socket"
3. **Blocages:** "J'ai besoin de clarification sur le format des spécifications JSON"

### Sprint Retrospective

À la fin de chaque Sprint, l'équipe organise une **Rétrospective** pour identifier:

| Ce qui a bien fonctionné | Ce qui peut être amélioré | Actions à prendre |
|--------------------------|---------------------------|-------------------|
| Communication sur Discord | Tests manuels trop longs | Créer des collections Postman |
| Revue de code systématique | Conflits de merge fréquents | Adopter GitFlow strict |
| Déploiement Vercel fluide | Backend lent au premier appel | Investiguer le "cold start" de Render |

> **📸 Screenshot suggéré:** Tableau Scrum (Trello/Jira) montrant les colonnes "To Do", "In Progress", "Done" d'un Sprint.

---

## 2.3 Outils de Collaboration

### Git & GitHub

**Rôle:** Gestion de versions et collaboration sur le code source.

```
Repository: github.com/dev8Zakaria/buildmaster
├── main (Production - déploiement automatique)
├── feature/pc-builder
├── feature/chatbot-technician
├── feature/cart-checkout
└── feature/filter-compability
```

### Trello / Jira

**Rôle:** Gestion du Product Backlog et suivi des Sprints.

- **Colonnes Kanban:** Backlog → Sprint Backlog → In Progress → Code Review → Done
- **Labels:** Frontend, Backend, Bug, Enhancement, Urgent

### Discord / Slack

**Rôle:** Communication asynchrone et Daily Scrums à distance.

- **Canaux:** #general, #frontend, #backend, #deployement, #bugs

> **📸 Screenshot suggéré:** Vue d'ensemble du tableau Trello/Jira avec les colonnes Kanban.

---

# III. Analyse Fonctionnelle et Conception

## 3.1 Architecture du Système

L'architecture de Build Master suit le modèle **Three-Tier Architecture** (Architecture à 3 niveaux) déployée sur des services cloud spécialisés:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ARCHITECTURE BUILD MASTER                      │
└─────────────────────────────────────────────────────────────────────────┘

     ┌─────────────────────┐
     │    UTILISATEUR      │
     │    (Navigateur)     │
     └──────────┬──────────┘
                │ HTTPS
                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ TIER 1: PRÉSENTATION                                          [VERCEL] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                      VUE.JS 3 SPA                             │     │
│   ├──────────────────────────────────────────────────────────────┤     │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │     │
│   │  │   ROUTER    │  │    PINIA    │  │   COMPOSANTS UI     │  │     │
│   │  │ (Vue Router)│  │   (Store)   │  │  (Tailwind CSS)     │  │     │
│   │  └─────────────┘  └─────────────┘  └─────────────────────┘  │     │
│   │                                                               │     │
│   │  Pages: Home, Catalogue, PC Builder, Admin Dashboard          │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                          │
│   URL: https://buildmaster-fawn.vercel.app                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                │
                │ REST API (JSON over HTTPS)
                │ Authorization: Bearer <JWT>
                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ TIER 2: LOGIQUE MÉTIER                                        [RENDER] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                     EXPRESS.JS API                            │     │
│   ├──────────────────────────────────────────────────────────────┤     │
│   │                                                               │     │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │     │
│   │  │    AUTH     │  │   CORS      │  │   MIDDLEWARE        │  │     │
│   │  │   (JWT)     │  │  (Origin)   │  │   (Multer, etc.)    │  │     │
│   │  └─────────────┘  └─────────────┘  └─────────────────────┘  │     │
│   │                                                               │     │
│   │  ┌──────────────────────────────────────────────────────┐   │     │
│   │  │                   ROUTES API                          │   │     │
│   │  ├──────────────────────────────────────────────────────┤   │     │
│   │  │  /api/auth       → Inscription, Connexion            │   │     │
│   │  │  /api/component  → CRUD Composants                   │   │     │
│   │  │  /api/category   → CRUD Catégories                   │   │     │
│   │  │  /api/pcBuild    → PC Builder & Saved Builds         │   │     │
│   │  │  /api/cart       → Panier d'achat                    │   │     │
│   │  │  /api/orders     → Historique des commandes          │   │     │
│   │  │  /api/chat       → Chatbot IA (Gemini)               │   │     │
│   │  └──────────────────────────────────────────────────────┘   │     │
│   │                                                               │     │
│   │  ┌──────────────────────────────────────────────────────┐   │     │
│   │  │               PRISMA ORM CLIENT                       │   │     │
│   │  └──────────────────────────────────────────────────────┘   │     │
│   │                                                               │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                          │
│   URL: https://buildmaster-ijra.onrender.com                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                │
                │ PostgreSQL Wire Protocol (SSL)
                │ Connection Pooling (Port 6543)
                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ TIER 3: DONNÉES                                              [SUPABASE] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                PostgreSQL DATABASE                            │     │
│   ├──────────────────────────────────────────────────────────────┤     │
│   │                                                               │     │
│   │  Tables:                                                      │     │
│   │  ├── users              (Comptes utilisateurs)               │     │
│   │  ├── components         (Catalogue produits)                 │     │
│   │  ├── component_categories (CPU, GPU, RAM, etc.)              │     │
│   │  ├── orders             (Commandes)                          │     │
│   │  ├── order_items        (Lignes de commande)                 │     │
│   │  └── saved_builds       (Configurations PC sauvegardées)     │     │
│   │                                                               │     │
│   │  Features:                                                    │     │
│   │  • JSON Columns for dynamic specifications                   │     │
│   │  • Row Level Security (RLS)                                  │     │
│   │  • Connection Pooling with PgBouncer                         │     │
│   │                                                               │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                          │
│   Host: aws-1-eu-west-3.pooler.supabase.com                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Avantages de cette Architecture

| Aspect | Avantage |
|--------|----------|
| **Scalabilité** | Chaque tier peut être mis à l'échelle indépendamment |
| **Maintenabilité** | Séparation claire des responsabilités |
| **Déploiement** | Mises à jour indépendantes Frontend/Backend |
| **Coût** | Utilisation de tiers gratuits (Vercel Hobby, Render Free, Supabase Free) |
| **Disponibilité** | CDN global pour le Frontend (Vercel Edge Network) |

> **📸 Screenshot suggéré:** Diagramme d'architecture (peut être généré avec draw.io, Lucidchart, ou Mermaid).

---

## 3.2 Modélisation de la Base de Données

*[Section réservée - Diagramme ERD à compléter]*

---

## 3.3 La Logique Principale (PC Builder)

Le PC Builder est le cœur fonctionnel de Build Master. Il guide l'utilisateur à travers 7 étapes de sélection, en filtrant dynamiquement les composants incompatibles.

### Les 7 Étapes du PC Builder

```
┌────────────────────────────────────────────────────────────────┐
│                    FLUX DU PC BUILDER                          │
└────────────────────────────────────────────────────────────────┘

   ┌─────────┐                                        ┌──────────┐
   │ ÉTAPE 1 │                                        │ ÉTAPE 7  │
   │   CPU   │ ──────────────────────────────────────▶│ BOÎTIER  │
   └─────────┘                                        └──────────┘
        │                                                   ▲
        │ Détermine le Socket                               │
        ▼                                                   │
   ┌─────────┐         ┌─────────┐         ┌─────────┐     │
   │ ÉTAPE 2 │         │ ÉTAPE 3 │         │ ÉTAPE 4 │     │
   │ MOBO    │────────▶│   RAM   │────────▶│   GPU   │─────┤
   └─────────┘         └─────────┘         └─────────┘     │
        │                   │                   │          │
        │ Détermine:        │ Filtre:           │ Filtre:  │
        │ • Type RAM        │ • DDR4/DDR5       │ • Wattage│
        │ • Form Factor     │                   │ • Taille │
        ▼                   ▼                   ▼          │
   ┌──────────────────────────────────────────────────┐    │
   │                    ÉTAPE 5: STOCKAGE              │    │
   │              (Pas de filtres spécifiques)         │────┤
   └──────────────────────────────────────────────────┘    │
                                │                          │
                                ▼                          │
   ┌──────────────────────────────────────────────────┐    │
   │                    ÉTAPE 6: PSU                   │    │
   │    Filtre: Wattage ≥ (CPU_TDP + GPU_TDP) × 1.5   │────┘
   └──────────────────────────────────────────────────┘
```

### Implémentation du Filtrage (Backend)

Le filtrage est implémenté dans le contrôleur `pcBuilderController.js`. Voici la logique principale:

```javascript
// Étape 2: Filtrer les Cartes Mères par Socket CPU
if (categoryName === 'Cartes Mères' && cpuId) {
  const cpu = await prisma.component.findUnique({ where: { id: cpuId } });
  filters.specifications = {
    path: ['socket'],
    equals: cpu.specifications.socket  // Ex: "LGA1700" ou "AM5"
  };
}

// Étape 3: Filtrer la RAM par Type de Mémoire
if (categoryName === 'Mémoire RAM' && moboId) {
  const mobo = await prisma.component.findUnique({ where: { id: moboId } });
  filters.specifications = {
    path: ['type'],
    equals: mobo.specifications.memoryType  // Ex: "DDR5" ou "DDR4"
  };
}

// Étape 6: Filtrer le PSU par Wattage Minimum
if (categoryName === 'Alimentation' && cpuId && gpuId) {
  const cpu = await prisma.component.findUnique({ where: { id: cpuId } });
  const gpu = await prisma.component.findUnique({ where: { id: gpuId } });
  const minWattage = (cpu.specifications.tdp + gpu.specifications.tdp) * 1.5;
  filters.specifications = {
    path: ['wattage'],
    gte: minWattage  // Greater than or equal
  };
}

// Étape 7: Filtrer les Boîtiers par Compatibilité Form Factor + GPU Length
if (categoryName === 'Boîtiers' && moboId && gpuId) {
  const mobo = await prisma.component.findUnique({ where: { id: moboId } });
  const gpu = await prisma.component.findUnique({ where: { id: gpuId } });
  filters.AND = [
    { specifications: { path: ['motherboardSupport'], array_contains: mobo.specifications.formFactor } },
    { specifications: { path: ['maxGPULength'], gte: gpu.specifications.length } }
  ];
}
```

### Stockage des Spécifications (JSON Flexible)

Plutôt que de créer une colonne pour chaque spécification (ce qui serait ingérable), nous utilisons une colonne **JSON** dans PostgreSQL:

```json
// Exemple: Spécifications d'un CPU
{
  "socket": "LGA1700",
  "cores": 24,
  "threads": 32,
  "baseClock": "3.2 GHz",
  "boostClock": "6.0 GHz",
  "tdp": 125,
  "cache": "36MB",
  "integratedGraphics": "UHD 770"
}

// Exemple: Spécifications d'un Boîtier
{
  "type": "Mid-Tower",
  "motherboardSupport": ["ATX", "Micro-ATX", "Mini-ITX"],
  "maxGPULength": 360,
  "maxCpuCoolerHeight": "170mm",
  "includedFans": "2x 120mm",
  "radiatorSupport": "360mm"
}
```

Prisma permet de requêter ces champs JSON avec les opérateurs `path`, `equals`, `gte`, `array_contains`.

> **📸 Screenshot suggéré:** Le PC Builder en action montrant le filtrage (ex: seules les cartes mères LGA1700 après avoir sélectionné un CPU Intel).

---

## 3.4 Intégration de l'Intelligence Artificielle

Le Chatbot de Build Master utilise l'API **Google Gemini** pour fournir des conseils personnalisés aux utilisateurs.

### Workflow du Chatbot

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLUX DU CHATBOT IA                           │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
    │ UTILISATEUR  │          │   BACKEND    │          │  GOOGLE      │
    │              │          │   API        │          │  GEMINI      │
    └──────┬───────┘          └──────┬───────┘          └──────┬───────┘
           │                         │                         │
           │  "Quel GPU pour 1080p?" │                         │
           │────────────────────────▶│                         │
           │                         │                         │
           │                         │ Formatte le prompt      │
           │                         │ avec le contexte        │
           │                         │ (catalogue, user...)    │
           │                         │                         │
           │                         │  Request to Gemini API  │
           │                         │────────────────────────▶│
           │                         │                         │
           │                         │                         │ Génère
           │                         │                         │ la réponse
           │                         │                         │
           │                         │◀────────────────────────│
           │                         │  Response with text     │
           │                         │                         │
           │◀────────────────────────│                         │
           │  "Pour le 1080p, je     │                         │
           │   recommande le RTX     │                         │
           │   4070 Ti..."           │                         │
           │                         │                         │
```

### Personnalité du Chatbot

Le chatbot est configuré avec un **System Prompt** qui définit sa personnalité:

```
Tu es un expert technique en assemblage de PC gaming.
Tu travailles pour Build Master, une boutique en ligne spécialisée.
Ton rôle est d'aider les clients à:
- Comprendre les spécifications techniques
- Choisir les composants adaptés à leur budget
- Vérifier la compatibilité entre les pièces

Réponds de manière concise et professionnelle.
Si une question dépasse ton domaine, redirige vers le support humain.
```

> **📸 Screenshot suggéré:** Interface du chatbot avec un exemple de conversation.

---

# IV. Implémentation Technique (La Stack)

## 4.1 Architecture Frontend

### L'Écosystème Vue 3

Build Master utilise **Vue 3** avec la **Composition API**, offrant une meilleure organisation du code et une réactivité optimale.

```
┌─────────────────────────────────────────────────────────────────┐
│                    STACK FRONTEND                                │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────┐
    │                     VUE 3                                │
    │              (Composition API)                           │
    ├─────────────────────────────────────────────────────────┤
    │                                                          │
    │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐  │
    │   │ VUE ROUTER  │   │    PINIA    │   │   AXIOS     │  │
    │   │ (Routing)   │   │   (State)   │   │   (HTTP)    │  │
    │   └─────────────┘   └─────────────┘   └─────────────┘  │
    │                                                          │
    └─────────────────────────────────────────────────────────┘
                              │
                              ▼
    ┌─────────────────────────────────────────────────────────┐
    │                   BUILD TOOLS                            │
    ├─────────────────────────────────────────────────────────┤
    │                                                          │
    │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐  │
    │   │    VITE     │   │  TAILWIND   │   │  ICONIFY    │  │
    │   │ (Bundler)   │   │    CSS      │   │  (Icons)    │  │
    │   └─────────────┘   └─────────────┘   └─────────────┘  │
    │                                                          │
    └─────────────────────────────────────────────────────────┘
```

### Structure des Dossiers Frontend

```
frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── admin/           # Composants spécifiques admin
│   │   └── ...
│   ├── views/               # Pages principales
│   │   ├── Home.vue
│   │   ├── PCBuilder.vue
│   │   └── admin/
│   │       └── AdminDashboard.vue
│   ├── stores/              # State Management (Pinia)
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   └── pcBuilder.js     # Store du PC Builder
│   ├── lib/
│   │   └── spec-definitions.js  # Définitions des spécifications par catégorie
│   ├── router/
│   │   └── index.js         # Configuration des routes
│   └── UI-elements/         # Design System
│       └── ...
└── vite.config.js           # Configuration Vite
```

### Gestion de l'État avec Pinia

Le store `pcBuilder.js` gère l'état complet du PC Builder:

```javascript
export const usePCBuilderStore = defineStore('pcBuilder', () => {
  // === STATE ===
  const currentStepIndex = ref(0);
  const selectedParts = ref({});  // { cpu: {...}, motherboard: {...}, ... }
  const availableComponents = ref([]);
  const isLoading = ref(false);

  // === COMPUTED ===
  const totalPrice = computed(() => {
    return Object.values(selectedParts.value).reduce((sum, part) => {
      return sum + (part ? parseFloat(part.price) : 0);
    }, 0);
  });

  const allPartsSelected = computed(() => {
    return BUILD_STEPS.every(step => selectedParts.value[step.id]);
  });

  // === ACTIONS ===
  const fetchStepComponents = async (categoryName) => {
    // Appel API avec les IDs déjà sélectionnés pour le filtrage
    const params = new URLSearchParams();
    if (selectedParts.value.cpu) params.append('cpuId', selectedParts.value.cpu.id);
    if (selectedParts.value.motherboard) params.append('moboId', selectedParts.value.motherboard.id);
    // ... etc

    const response = await api.get(`/pcBuild/step/${categoryName}?${params}`);
    availableComponents.value = response.data;
  };

  const selectPart = (stepId, component) => {
    selectedParts.value[stepId] = component;
  };

  return { /* ... exports ... */ };
});
```

### Tailwind CSS: Utility-First Styling

Tailwind CSS permet un développement rapide et cohérent de l'interface:

```html
<!-- Exemple: Bouton Call-to-Action -->
<button class="
  px-6 py-3
  bg-yellow-500 hover:bg-yellow-600
  text-white font-semibold
  rounded-lg shadow-lg
  transition-all duration-200
  transform hover:scale-105
">
  Build Your PC
</button>
```

> **📸 Screenshot suggéré:** Code Vue d'un composant clé (ex: ProductCard ou BuilderStep).

---

## 4.2 Architecture Backend

*[Section réservée]*

---

## 4.3 Implémentation de la Sécurité

*[Section réservée]*

---

# V. Le Cycle DevOps: Du Code au Cloud

## 5.1 Stratégie de Contrôle de Version

### GitFlow Adapté: Branches Séquentielles

L'équipe Build Master utilise une stratégie de **branches séquentielles** où chaque nouvelle fonctionnalité se construit sur la précédente, avec des merges périodiques vers la branche `develop`.

```
┌─────────────────────────────────────────────────────────────────┐
│              STRATÉGIE DE BRANCHES SÉQUENTIELLES                 │
└─────────────────────────────────────────────────────────────────┘

    main ──────────────────────────────────────────────────────────
      │
      │ (Production stable)
      │
      ▼
    develop ────┬────────────┬────────────┬────────────────────────
                │            │            │
                │            │            │ Merge périodique
                │            │            │
                ▼            ▼            ▼
    branch1 ────┐            │            │
    (Feature A) │            │            │
                │            │            │
                ▼            │            │
    branch2 ────┐            │            │
    (Feature B) │            │            │
    basée sur   │            │            │
    branch1     │            │            │
                │            │            │
                ▼            │            │
    branch3 ────┐            │            │
    (Feature C) │            │            │
    basée sur   │            │            │
    branch2     │            │            │
                │            │            │
                └────────────┴────────────┘
                             │
                             ▼
                          develop (mise à jour)
                             │
                             │ Merge final après validation
                             ▼
                          main (déploiement)

```

### Principe de la Stratégie

Cette approche permet de:
1. **Construire progressivement** les fonctionnalités en s'appuyant sur le travail précédent
2. **Éviter les conflits** en travaillant sur une base commune
3. **Intégrer régulièrement** via des merges vers `develop`
4. **Déployer** uniquement quand `develop` est stable (merge vers `main`)

### Branches du Projet

| Branche | Rôle | Protection |
|---------|------|------------|
| `main` | Production - Déploiement automatique | ✅ Protégée |
| `develop` | Intégration des features - Base de développement | ✅ Protégée |
| `feature/branch1` | Première fonctionnalité (basée sur develop) | ❌ Non protégée |
| `feature/branch2` | Deuxième fonctionnalité (basée sur branch1) | ❌ Non protégée |
| `feature/branch3` | Troisième fonctionnalité (basée sur branch2) | ❌ Non protégée |

**Note:** Chaque branche `feature/branchN` se base sur la branche précédente `feature/branch(N-1)`, permettant une construction incrémentale des fonctionnalités.

### Workflow de Contribution

```
1. Créer la première branche depuis develop
   $ git checkout develop
   $ git checkout -b feature/pc-builder

2. Développer et commiter
   $ git add .
   $ git commit -m "feat: implement PC builder step 1"

3. Créer la branche suivante basée sur la précédente
   $ git checkout -b feature/compatibility-filters
   # Cette branche contient maintenant le code de feature/pc-builder

4. Développer la nouvelle fonctionnalité
   $ git add .
   $ git commit -m "feat: add compatibility filters"

5. Merge périodique vers develop
   $ git checkout develop
   $ git merge feature/compatibility-filters

6. Continuer avec une nouvelle branche depuis la dernière
   $ git checkout feature/compatibility-filters
   $ git checkout -b feature/chatbot-integration

7. Après validation, merger develop vers main pour déploiement
   $ git checkout main
   $ git merge develop
```

### Convention de Commits (Conventional Commits)

Nous suivons la convention **Conventional Commits** pour des messages clairs:

```
feat: add PC builder step navigation
fix: correct CORS configuration for production
docs: update README with deployment instructions
chore: upgrade dependencies
refactor: simplify compatibility filter logic
```

> **📸 Screenshot suggéré:** Historique de commits GitHub ou graphe de branches.

---

## 5.2 Intégration et Gestion des Environnements

### Environnements

| Environnement | Frontend | Backend | Base de Données |
|---------------|----------|---------|-----------------|
| **Développement** | `localhost:5173` | `localhost:3000` | Docker PostgreSQL local ou Supabase |
| **Production** | `buildmaster-fawn.vercel.app` | `buildmaster-ijra.onrender.com` | Supabase Cloud |

### Variables d'Environnement

**Backend (.env):**
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/db"

# Security
ACCES_TOKEN_SECRET="jwt_secret_key"

# CORS
FRONTEND_URL="https://buildmaster-fawn.vercel.app"

# Services
PORT=3000
NODE_ENV=production
```

**Frontend (.env):**
```env
VITE_API_BASE_URL="https://buildmaster-ijra.onrender.com/api"
```

### Gestion des Secrets

- Les fichiers `.env` sont dans `.gitignore` (jamais commités)
- Les variables de production sont configurées directement dans les dashboards Vercel/Render
- Les mots de passe base de données sont gérés via Supabase

> **📸 Screenshot suggéré:** Dashboard Render ou Vercel montrant les variables d'environnement (valeurs masquées).

---

## 5.3 Automatisation (CI/CD)

L'un des objectifs majeurs de ce projet est de démontrer l'automatisation du cycle de vie logiciel. Build Master utilise les pipelines intégrés de **Vercel** et **Render** pour un déploiement continu.

### Pipeline Vercel (Frontend)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PIPELINE VERCEL                               │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
    │  COMMIT  │      │  BUILD   │      │  DEPLOY  │      │   LIVE   │
    │ to main  │─────▶│  Vite    │─────▶│   Edge   │─────▶│  Global  │
    │          │      │          │      │  Network │      │   CDN    │
    └──────────┘      └──────────┘      └──────────┘      └──────────┘
         │                 │                 │                 │
         │                 │                 │                 │
         ▼                 ▼                 ▼                 ▼
    "git push"        "npm run build"   Déploiement      Accessible
    déclenche         Compile Vue        sur 100+        en ~30 sec
    le pipeline       + Tailwind         serveurs

```

**Étapes du Pipeline Vercel:**

1. **Déclencheur:** Push sur la branche `main`
2. **Installation:** `npm install` dans le dossier `/frontend`
3. **Build:** `npm run build` → génère le dossier `dist/`
4. **Déploiement:** Upload automatique vers le CDN Edge
5. **URL de Preview:** Pour chaque PR, une URL de preview est générée

### Pipeline Render (Backend)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PIPELINE RENDER                               │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
    │  COMMIT  │      │  BUILD   │      │  PRISMA  │      │  START   │
    │ to main  │─────▶│  Node    │─────▶│ Generate │─────▶│  Server  │
    │          │      │          │      │          │      │          │
    └──────────┘      └──────────┘      └──────────┘      └──────────┘
         │                 │                 │                 │
         │                 │                 │                 │
         ▼                 ▼                 ▼                 ▼
    "git push"        "npm install"    "npx prisma       "node
    déclenche         Installe         generate"         src/server.js"
    le pipeline       dépendances      Génère client     Lance Express

```

**Configuration Render:**

```yaml
# render.yaml (implicite via Dashboard)
services:
  - type: web
    name: buildmaster
    env: node
    rootDir: backend
    buildCommand: npm install && npx prisma generate
    startCommand: node src/server.js
    envVars:
      - key: DATABASE_URL
        sync: false  # Configuré manuellement
      - key: NODE_ENV
        value: production
```

### Workflow Complet CI/CD

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     WORKFLOW CI/CD COMPLET                               │
└─────────────────────────────────────────────────────────────────────────┘

  Développeur        GitHub           Vercel              Render
       │                │                │                   │
       │   git push     │                │                   │
       │───────────────▶│                │                   │
       │                │                │                   │
       │                │   Webhook      │                   │
       │                │───────────────▶│                   │
       │                │                │                   │
       │                │   Webhook      │                   │
       │                │────────────────┼──────────────────▶│
       │                │                │                   │
       │                │                │   Build Vue       │
       │                │                │───────────┐       │
       │                │                │           │       │
       │                │                │◀──────────┘       │
       │                │                │                   │
       │                │                │           Build Node
       │                │                │           │───────┐
       │                │                │           │       │
       │                │                │           │◀──────┘
       │                │                │                   │
       │                │                │  Deploy to        │
       │                │                │  Vercel Edge      │
       │                │                │───────────┐       │
       │                │                │◀──────────┘       │
       │                │                │                   │
       │                │                │           Deploy to
       │                │                │           Render │
       │                │                │           │───────┐
       │                │                │           │◀──────┘
       │                │                │                   │
       │◀───────────────┼────────────────┼───────────────────│
       │   Notifications (Email/Slack)   │                   │
       │   "Deploy Successful"           │                   │
       │                                 │                   │

```

### Temps de Déploiement Typique

| Étape | Durée |
|-------|-------|
| Push → Build Frontend | ~30 secondes |
| Build → Live Frontend | ~15 secondes |
| Push → Build Backend | ~2 minutes |
| Build → Live Backend | ~30 secondes |
| **Total (Frontend)** | **~45 secondes** |
| **Total (Backend)** | **~2.5 minutes** |

> **📸 Screenshot suggéré:** Logs de déploiement Vercel ou Render montrant les étapes du pipeline.

---

## 5.4 Base de Données en tant que Service (DBaaS)

### Pourquoi Supabase?

Au lieu de gérer notre propre serveur PostgreSQL (configuration, sauvegardes, mises à jour de sécurité), nous utilisons **Supabase**, une plateforme DBaaS.

### Avantages de Supabase

| Fonctionnalité | Description |
|----------------|-------------|
| **PostgreSQL Managé** | Base de données relationnelle complète sans administration |
| **Connection Pooling** | PgBouncer intégré pour gérer les connexions (important pour les serverless) |
| **Dashboard SQL** | Interface web pour exécuter des requêtes et visualiser les données |
| **Backups Automatiques** | Sauvegardes quotidiennes incluses |
| **Row Level Security** | Sécurité au niveau des lignes (optionnel) |

### Configuration de la Connexion

Pour éviter les problèmes de connexion IPv6 (Render ne supporte pas nativement IPv6), nous utilisons le **Connection Pooler**:

```
# URL Standard (IPv6 - peut échouer sur certains hébergeurs)
postgresql://user:pass@db.xxx.supabase.co:5432/postgres

# URL Pooler (IPv4 compatible - recommandé)
postgresql://user:pass@aws-1-eu-west-3.pooler.supabase.com:6543/postgres
```

### Prisma & Supabase

Prisma s'intègre parfaitement avec Supabase via la variable `DATABASE_URL`:

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

> **📸 Screenshot suggéré:** Dashboard Supabase montrant les tables du projet (Table Editor).

---

# VI. Tests et Assurance Qualité

*[Section réservée]*

---

# VII. Résultats, Défis et Conclusion

## 7.1 Résultats du Déploiement

Le projet Build Master a été déployé avec succès sur une architecture cloud distribuée, démontrant la maîtrise des pratiques DevOps modernes.

### Environnements de Production

| Service | Plateforme | URL | Statut |
|---------|------------|-----|--------|
| **Frontend** | Vercel | `https://buildmaster-fawn.vercel.app` | ✅ Live |
| **Backend** | Render | `https://buildmaster-ijra.onrender.com` | ✅ Live |
| **Base de Données** | Supabase | PostgreSQL Cloud (EU-West-3) | ✅ Connectée |
| **Stockage Images** | Cloudinary | CDN Global | ✅ Actif |

### Métriques de Déploiement

| Métrique | Valeur |
|----------|--------|
| Temps de déploiement Frontend | ~45 secondes |
| Temps de déploiement Backend | ~2.5 minutes |
| Latence API (warm) | ~150-300ms |
| Score Lighthouse (Performance) | ~85-90 |
| Branches Git fusionnées | 5 feature branches |
| Commits totaux | 50+ |

### Fonctionnalités Livrées

✅ **Catalogue de Composants** - Navigation par catégorie et affichage des spécifications
✅ **PC Builder Guidé** - 7 étapes avec filtrage de compatibilité automatique
✅ **Authentification** - Inscription, connexion, et gestion des rôles (Admin/Customer)
✅ **Administration** - CRUD complet des composants avec upload d'images
✅ **Chatbot IA** - Assistant technique alimenté par Google Gemini
✅ **Panier et Commandes** - Workflow complet de checkout
✅ **Saved Builds** - Sauvegarde des configurations PC

> **📸 Screenshot suggéré:** Dashboard de monitoring Vercel/Render montrant les métriques de trafic.

---

## 7.2 Surmonter les Obstacles

Le parcours de développement a été jalonné de défis techniques significatifs. Voici les principaux obstacles rencontrés et les solutions apportées:

### Défi 1: Changement de Stratégie d'Hébergement

**Problème:** Le plan initial prévoyait un déploiement sur Google Cloud Platform (GCP) avec Docker. Cette approche s'est avérée trop complexe pour le contexte du projet (configuration Kubernetes, gestion des VMs, coûts potentiels).

**Solution:** Migration vers une architecture "Serverless" avec:
- **Vercel** pour le frontend (déploiement instantané, CDN global)
- **Render** pour le backend (container managé, zéro configuration)
- **Supabase** pour la base de données (PostgreSQL managé)

**Leçon apprise:** La simplicité opérationnelle prime sur la sophistication technique. Les plateformes PaaS modernes offrent un meilleur rapport effort/résultat pour les projets de cette envergure.

### Défi 2: Problème de Connectivité IPv6/IPv4

**Problème:** Après le déploiement sur Render, les requêtes vers Supabase échouaient avec l'erreur:
```
PrismaClientInitializationError: Can't reach database server
```

Supabase utilise des adresses **IPv6** par défaut, alors que Render (et de nombreux hébergeurs) ne supporte que **IPv4**.

**Solution:** Utilisation du **Connection Pooler** de Supabase qui expose une adresse IPv4 compatible:
```
# Avant (IPv6 - échec)
postgresql://...@db.xxx.supabase.co:5432/postgres

# Après (IPv4 via Pooler - succès)
postgresql://...@aws-1-eu-west-3.pooler.supabase.com:6543/postgres
```

**Leçon apprise:** La documentation des fournisseurs cloud n'est pas toujours explicite sur les contraintes réseau. Le debugging nécessite une compréhension des couches basses (DNS, protocoles réseau).

### Défi 3: Configuration CORS pour Domaines Croisés

**Problème:** Les requêtes API depuis Vercel vers Render étaient bloquées par le navigateur:
```
Access-Control-Allow-Origin header is missing
```

**Solution:** Configuration CORS robuste côté backend avec gestion dynamique des origines:
```javascript
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "https://buildmaster-fawn.vercel.app"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};
```

**Leçon apprise:** La sécurité web (CORS, CSP) est souvent la source de bugs frustrants. Une configuration proactive et des logs détaillés sont essentiels.

### Défi 4: Synchronisation des Clés de Spécifications

**Problème:** Le PC Builder ne filtrait pas correctement les boîtiers car les clés JSON ne correspondaient pas entre:
- Le fichier `seed.js` (données initiales)
- Le contrôleur `pcBuilderController.js` (logique de filtrage)
- Le fichier `spec-definitions.js` (formulaire admin)

Exemple: Le seed utilisait `mbSupport` alors que le frontend attendait `motherboardSupport`.

**Solution:** Audit complet des clés et normalisation sur une convention unique:

| Avant | Après |
|-------|-------|
| `mbSupport` | `motherboardSupport` |
| `vramSize` | `vram` |
| `latency` | `casLatency` |
| `connectivity` | `wifi` |

**Leçon apprise:** La documentation d'un "contrat de données" (data schema) entre Frontend et Backend est cruciale pour éviter ce type de désynchronisation.

### Défi 5: Gestion des Dépendances en Conflit

**Problème:** L'installation des dépendances échouait avec des conflits de versions:
```
npm WARN ERESOLVE peer dep conflict: cloudinary@2.x vs multer-storage-cloudinary@4.x
```

**Solution:** Downgrade de `cloudinary` vers une version compatible (`^1.41.3`) et documentation des contraintes dans le `package.json`.

**Leçon apprise:** Les mises à jour de dépendances doivent être testées dans un environnement isolé avant d'être appliquées à la branche principale. L'utilisation de `package-lock.json` est essentielle pour la reproductibilité.

### Tableau Récapitulatif des Défis

| Défi | Impact | Temps de Résolution | Criticité |
|------|--------|---------------------|----------|
| Migration GCP → Vercel/Render | Architecture | 1 jour | 🔴 Haute |
| Connectivité IPv6/IPv4 | Déploiement bloqué | 3 heures | 🔴 Haute |
| Configuration CORS | App non fonctionnelle | 2 heures | 🟠 Moyenne |
| Clés JSON désynchronisées | Feature cassée | 4 heures | 🟠 Moyenne |
| Conflits de dépendances | Build impossible | 1 heure | 🟡 Basse |

> **📸 Screenshot suggéré:** Logs d'erreurs (avant) vs logs de succès (après) pour un des défis.

---

## 7.3 Évaluation Finale

Cette section évalue l'atteinte des objectifs initiaux définis dans le Cahier des Charges et les objectifs pédagogiques du cours DevOps/Agile.

### Conformité au Cahier des Charges

| Exigence | Statut | Commentaire |
|----------|--------|-------------|
| Catalogue de composants PC | ✅ | 7 catégories, 21 produits |
| PC Builder avec compatibilité | ✅ | Filtrage Socket, RAM, TDP, GPU Length |
| Gestion utilisateurs (Auth) | ✅ | JWT + bcrypt + Rôles |
| Interface d'administration | ✅ | CRUD composants + catégories |
| Chatbot IA | ✅ | Intégration Google Gemini |
| Panier et commandes | ✅ | Checkout complet |
| Déploiement cloud | ✅ | Vercel + Render + Supabase |

### Démonstration des Compétences DevOps

| Compétence | Démonstration dans le Projet |
|------------|-----------------------------|
| **Contrôle de version (Git)** | Utilisation de branches feature, commits conventionnels, Pull Requests |
| **CI/CD** | Déploiement automatique via Vercel et Render à chaque push sur main |
| **Infrastructure as Code** | Configuration des environnements via variables d'environnement |
| **Monitoring** | Logs centralisés dans les dashboards Vercel/Render |
| **Containerisation** | Docker-compose pour le développement local (optionnel) |
| **Cloud Computing** | Architecture distribuée multi-cloud (Vercel + Render + Supabase) |

### Démonstration des Pratiques Agile/Scrum

| Pratique | Application dans le Projet |
|----------|---------------------------|
| **User Stories** | Backlog structuré avec critères d'acceptation |
| **Sprints** | Itérations de 2 semaines avec objectifs définis |
| **Daily Scrum** | Points quotidiens de synchronisation (Discord) |
| **Sprint Review** | Démonstrations des fonctionnalités terminées |
| **Rétrospective** | Identification des améliorations après chaque Sprint |
| **Kanban Board** | Suivi visuel via Trello/Jira |

### Note d'Auto-Évaluation

| Critère | Note /10 | Justification |
|---------|----------|---------------|
| Fonctionnalités livrées | 9/10 | Toutes les features du MVP sont opérationnelles |
| Qualité du code | 7/10 | Structure claire, mais manque de tests automatisés |
| Pratiques DevOps | 8/10 | CI/CD fonctionnel, environnements séparés |
| Méthodologie Agile | 8/10 | Sprints respectés, collaboration efficace |
| Documentation | 7/10 | README présent, mais API non documentée (Swagger) |
| **MOYENNE** | **7.8/10** | |

---

## 7.4 Perspectives Futures

Bien que le projet ait atteint ses objectifs initiaux, plusieurs axes d'amélioration et d'évolution ont été identifiés:

### Améliorations Techniques à Court Terme

| Amélioration | Description | Priorité |
|--------------|-------------|----------|
| **Tests Automatisés** | Ajouter Jest (unitaires) et Cypress (E2E) | 🔴 Haute |
| **Documentation API** | Intégrer Swagger/OpenAPI pour documenter les endpoints | 🟠 Moyenne |
| **Caching** | Implémenter Redis pour les requêtes fréquentes (catalogue) | 🟠 Moyenne |
| **PWA** | Transformer le frontend en Progressive Web App | 🟡 Basse |

### Évolutions Fonctionnelles

| Feature | Description | Valeur Ajoutée |
|---------|-------------|----------------|
| **Comparateur de Composants** | Tableau comparatif côte-à-côte | UX améliorée |
| **Notifications Push** | Alertes stock faible, promotions | Engagement |
| **Reviews & Ratings** | Avis clients sur les produits | Confiance |
| **Export PDF** | Générer un devis PDF pour les builds | Professionnalisme |
| **Benchmark Estimé** | Prédire les FPS en jeu selon la config | Différenciation |

### Scaling et Performance

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE ÉVOLUÉE                          │
└─────────────────────────────────────────────────────────────────┘

     Actuel                          Futur
     ──────                          ────

    ┌─────────┐                    ┌─────────┐
    │ Vercel  │                    │ Vercel  │
    │ (Free)  │                    │ (Pro)   │
    └────┬────┘                    └────┬────┘
         │                              │
         ▼                              ▼
    ┌─────────┐                    ┌─────────────────────┐
    │ Render  │        ────▶       │   Render (Redis)    │
    │ (Free)  │                    │   + Load Balancer   │
    └────┬────┘                    └──────────┬──────────┘
         │                                    │
         ▼                                    ▼
    ┌─────────┐                    ┌──────────────────────┐
    │Supabase │        ────▶       │ Supabase + Read      │
    │ (Free)  │                    │ Replicas + Backups   │
    └─────────┘                    └──────────────────────┘
```

### Intégration DevOps Avancée

| Outil | Usage Prévu |
|-------|-------------|
| **GitHub Actions** | Pipeline CI/CD personnalisé (lint, test, deploy) |
| **Sentry** | Monitoring des erreurs en production |
| **Grafana + Prometheus** | Dashboards de métriques personnalisés |
| **Terraform** | Infrastructure as Code pour le provisioning |

### Conclusion Générale

Le projet **Build Master** a permis de mettre en pratique l'ensemble du cycle de vie d'une application moderne, de la conception à la mise en production. Au-delà des compétences techniques acquises (Vue.js, Express, Prisma, PostgreSQL), c'est surtout la maîtrise des pratiques **DevOps** et **Agile** qui constitue l'apport principal de ce projet.

La collaboration en équipe, la gestion des branches Git, l'automatisation des déploiements, et la résolution collective des problèmes ont simulé un environnement professionnel réaliste. Les obstacles rencontrés (IPv6, CORS, synchronisation des données) ont été autant d'opportunités d'apprentissage.

Ce projet constitue une base solide pour de futures évolutions et pourrait servir de référence pour d'autres initiatives académiques ou professionnelles dans le domaine du e-commerce et du développement web moderne.

> **📸 Screenshot suggéré:** Vue finale de l'application en production avec toutes les sections fonctionnelles.

---

# Annexes

## A. Liste des Screenshots à Inclure

Veuillez capturer et insérer les screenshots suivants dans les sections indiquées:

| # | Description | Section |
|---|-------------|---------|
| 1 | Page d'accueil en production (avec données) | I.1.1 |
| 2 | PC Builder montrant le filtre de compatibilité | I.1.2 |
| 3 | Organigramme de l'équipe | II.2.0 |
| 4 | Product Backlog dans Trello/Jira | II.2.1 |
| 5 | Tableau Scrum avec colonnes Kanban | II.2.2 |
| 6 | Tableau de collaboration (Trello overview) | II.2.3 |
| 7 | Diagramme d'architecture (draw.io ou Mermaid) | III.3.1 |
| 8 | PC Builder en action | III.3.3 |
| 9 | Interface du Chatbot | III.3.4 |
| 10 | Code Vue d'un composant | IV.4.1 |
| 11 | Historique de commits GitHub | V.5.1 |
| 12 | Variables d'environnement (valeurs masquées) | V.5.2 |
| 13 | Logs de déploiement Vercel ou Render | V.5.3 |
| 14 | Dashboard Supabase (Table Editor) | V.5.4 |
| 15 | Interface Postman avec test réussi | VI.6.1 |

## B. Glossaire DevOps

| Terme | Définition |
|-------|------------|
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **GitFlow** | Modèle de branching Git pour le développement collaboratif |
| **DBaaS** | Database as a Service |
| **CDN** | Content Delivery Network |
| **JWT** | JSON Web Token (authentification) |
| **ORM** | Object-Relational Mapping |
| **SPA** | Single Page Application |

---

*Rapport généré pour le cours DevOps & Méthodologie Agile/Scrum*
*Projet: Build Master - E-commerce PC Components*
