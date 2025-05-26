
# Gestion des Formations 🎓📚  
**Application complète de gestion des formations en entreprise (Frontend React + Backend Laravel)**

## 🚀 Guide d'Installation Complète

### 📋 Prérequis
- Node.js v18+ (`node -v`)
- PHP 8.2+ (`php -v`)
- Composer 2+ (`composer -v`)
- PostgreSQL 15+ (`psql --version`)
- Git (`git --version`)

---

## 🔧 Installation Pas à Pas

### 1. Clonage du Projet
```bash
git clone https://github.com/votre-utilisateur/gestion-des-formations.git
cd gestion-des-formations


### 2. Installation des dépendances
#### Backend (Laravel)
```bash
cd backend
enlever ";"  de  ";extension=zip "
composer install
cp .env.example .env
php artisan jwt:secret
composer require psr/simple-cache:^1.0 maatwebsite/excel --ignore-platform-reqs 
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
npm install --legacy-peer-deps
```
#### to login :
```bash
email : admin@sonatrach.dz
password : admin
 ``` 
