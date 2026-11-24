# ADEA Gestion
 
CRM pour gérer les clients (professionnels et particuliers), leurs missions et leurs documents. Je l'ai développé seul pendant mon stage chez EI ADEA, et il est utilisé en production.
 
<!-- Ajouter une capture d'écran (données fictives) dans docs/screenshot.png puis décommenter la ligne suivante : -->
<!-- ![Capture d'écran](docs/screenshot.png) -->
 
## Fonctionnalités
 
- Gestion des clients pros et particuliers
- Missions avec étapes générées automatiquement
- Diagramme de Gantt pour suivre l'avancement
- Gestion des documents
- Recherche globale
- Création de clients depuis le site WordPress (webhook)
## Stack
 
- **Backend :** Symfony, API Platform, authentification JWT (LexikJWT), Doctrine
- **Frontend :** React, Vite, Tailwind CSS
- **Base de données :** MySQL
- **Hébergement :** OVH
## Lancer le projet
 
```bash
# Backend
cd back-end
composer install
# Configurer DATABASE_URL dans .env.local
php bin/console lexik:jwt:generate-keypair
php bin/console doctrine:migrations:migrate
symfony serve
 
# Frontend
cd front-end
npm install
npm run dev
```
 
Les valeurs de `APP_SECRET` et `JWT_PASSPHRASE` dans le dépôt sont des valeurs de développement. En production, elles sont définies dans les variables d'environnement du serveur.
 
## Points techniques
 
- Un client peut être « Pro » ou « Particulier » : j'utilise l'héritage Doctrine (Single Table Inheritance).
- Les étapes d'une mission sont créées automatiquement par un Event Subscriber.
- Le diagramme de Gantt est codé à la main, sans bibliothèque.
- J'ai déployé l'application sur OVH, avec l'API et le front sur deux sous-domaines séparés.
## Auteur
 
Lissandro Di Filippo – [GitHub](https://github.com/difilipl)
 
