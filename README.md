# 🚀 Full-Stack Task Manager App

A modern, high-performance Task Management application built with **Laravel 13** and **Vue 3**. This project demonstrates a complete development lifecycle, including secure authentication, private/public task logic, automated testing, and CI/CD integration.

---

## 🛠 Tech Stack

### Backend
- **Framework:** Laravel 13 (PHP 8.3)
- **Environment:** Docker (Laravel Sail)
- **Database:** MariaDB / SQLite (testing)
- **Testing:** PHPUnit with Coverage reports

### Frontend
- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **State Management:** Pinia
- **Styling:** Tailwind CSS & DaisyUI
- **HTTP Client:** Axios (Custom Instance)
- **Testing:** Vitest

---

## 📋 Key Features

- **User Authentication:** Secure registration and login using Laravel Sanctum.
- **Task Management:** Full CRUD (Create, Read, Update, Delete) operations.
- **Public Task Sharing:** - Toggle tasks between Private and Public.
  - Generate unique secure tokens for public access.
  - Dedicated **Public View** for non-authenticated users.
- **Advanced Filtering:** Filter tasks by status (All, Pending, Completed) and real-time search by title/description.
- **Responsive Design:** Fully mobile-friendly UI using DaisyUI components.
- **CI/CD:** Automated testing pipeline via GitHub Actions.

---

## 🚀 Installation & Setup

### 1. Prerequisites
- Docker Desktop installed and running.
- Git.

### 2. Clone the Repository
```bash
git clone [https://github.com/MoisesGarciaDev/Task-manager-app.git](https://github.com/MoisesGarciaDev/Task-manager-app.git)
cd Task-manager-app

### 3. Backend Setup (Sail/Docker)
    cd backend
    cp .env.example .env
    # Install dependencies using a temporary container
    docker run --rm \
        -u "$(id -u):$(id -g)" \
        -v "$(pwd):/var/www/html" \
        -w /var/www/html \
        laravelsail/php82-composer:latest \
        composer install --ignore-platform-reqs

    # Start the environment
    ./vendor/bin/sail up -d

    # Initialize application
    ./vendor/bin/sail artisan key:generate
    ./vendor/bin/sail artisan migrate

### 4. Frontend Setup
    cd /frontend
    npm install
    npm run dev

### Backend Tests (PHPUnit)
docker exec backend-laravel.test-1 php artisan test --coverage-text

### Frontend Tests (Vitest)
cd frontend
docker compose exec frontend npm run test:unit