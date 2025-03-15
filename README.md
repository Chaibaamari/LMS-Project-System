<<<<<<< HEAD
# gestion-des-formation-
Une application de gestion des formations en entreprise permettant d'organiser, suivre et administrer les sessions de formation pour les employés.
=======
# Gestion des Formations 🎓📚

Une application de gestion des formations en entreprise permettant d'organiser, suivre et administrer les sessions de formation pour les employés.

## 🚀 Fonctionnalités
- 📌 **Gestion des formations** : Création, mise à jour, suppression des formations.
- 👥 **Gestion des participants** : Inscription et suivi des employés.
- 📅 **Planification des sessions** : Organisation et gestion des dates de formation.
- 📊 **Rapports et statistiques** : Suivi des performances et analyses des formations.
- 🔐 **Authentification et autorisation** : Accès sécurisé selon les rôles des utilisateurs.

## 🛠️ Technologies utilisées
- **Frontend** : React (TypeScript, shadcn/ui)
- **Backend** : Laravel (PHP) avec requêtes SQL brutes
- **Base de données** : PostgreSQL (hébergé sur Neon)

## 📦 Installation
### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-utilisateur/gestion-des-formations.git
cd gestion-des-formations
```

### 2. Installation des dépendances
#### Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```
Configurer la base de données dans `.env`, puis exécuter :
```bash
php artisan migrate --seed
php artisan serve
```

#### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## 📌 Utilisation
1. Accéder à l'application via `http://localhost:5173` (ou l’URL spécifiée dans la config).
2. Se connecter avec les identifiants administrateur ou utilisateur.
3. Gérer les formations et suivre les sessions en temps réel.

## 🤝 Contribution
Les contributions sont les bienvenues ! Pour contribuer :
1. Forker le projet
2. Créer une branche (`feature/ma-fonctionnalite`)
3. Soumettre une Pull Request

## 📜 Licence
Ce projet est sous licence **MIT**. Voir [LICENSE](LICENSE) pour plus d’informations.

>>>>>>> bcf345f (Create README.md)
