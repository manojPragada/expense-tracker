# 💰 Expense Tracker

A modern, full-stack web application for tracking personal income and expenses with comprehensive analytics, built with Laravel and React.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Laravel](https://img.shields.io/badge/Laravel-12.x-red.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![PHP](https://img.shields.io/badge/PHP-8.2+-purple.svg)

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About the Project

Expense Tracker is a comprehensive financial management application designed to help users track their income and expenses efficiently. The application provides detailed insights through interactive charts, weekly/monthly breakdowns, and category-based analysis. Built with modern web technologies, it offers a seamless user experience with features like dark mode, responsive design, and Excel export capabilities.

### Key Highlights

- **Multi-User Support**: Track expenses for multiple users with shared visibility
- **Visual Analytics**: Interactive charts showing yearly breakdown and category distribution
- **Weekly/Monthly Reports**: Detailed overview of financial activities by week and month
- **Dynamic Categories**: Customizable expense categories with color coding
- **Excel Export**: Download financial reports in Excel format
- **Dark Mode**: Eye-friendly interface with automatic dark mode support
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Instant reflection of changes across all views

## ✨ Features

### 📊 Dashboard & Analytics
- **Overview Page**: Yearly financial breakdown with custom bar charts and pie charts
- **Weekly Overview**: Week-by-week analysis with income, expenses, and savings
- **Yearly Overview Table**: Comprehensive monthly breakdown by category with totals
- **Category Distribution**: Visual representation of spending by category
- **Interactive Charts**: Hover effects showing detailed category breakdowns

### 💸 Income & Expense Management
- **Submit Income/Expense**: Easy-to-use forms for recording transactions
- **Dynamic Categories**: Add, edit, or remove expense categories with color picker
- **User Assignment**: Track who spent what with user attribution
- **Date Tracking**: Record transactions with specific dates
- **Description Fields**: Optional notes for each transaction

### 📑 Submissions Management
- **View All Submissions**: Tabbed interface separating income and expense records
- **Inline Editing**: Quick edit functionality for any submission
- **Delete Confirmation**: Safe deletion with custom confirmation dialogs
- **Category Filtering**: Visual category pills with color coding
- **Date Formatting**: User-friendly date display (e.g., "1 Jan 2026")

### 🎨 User Interface
- **Dark Mode Toggle**: Seamless switching between light and dark themes
- **Collapsible Sidebar**: Space-saving navigation with icon tooltips
- **Responsive Layout**: Mobile-first design adapting to all screen sizes
- **Modern Icons**: Lucide React icons for clean, consistent UI
- **Color-Coded Categories**: Visual distinction for different expense types

### 📤 Export & Reports
- **Excel Export**: Download overview and weekly reports in `.xlsx` format
- **Formatted Data**: Properly structured columns with totals and calculations
- **Year-Specific**: Separate exports for different years

## 🛠 Technologies Used

### Backend
- **[Laravel 12.x](https://laravel.com/)** - PHP framework for web artisans
- **[Laravel Breeze](https://laravel.com/docs/breeze)** - Lightweight authentication scaffolding
- **[Inertia.js](https://inertiajs.com/)** - Modern monolith architecture
- **[Laravel Sanctum](https://laravel.com/docs/sanctum)** - API authentication
- **[Ziggy](https://github.com/tighten/ziggy)** - Laravel routes in JavaScript
- **SQLite** - Lightweight database (easily switchable to MySQL/PostgreSQL)

### Frontend
- **[React 18.x](https://react.dev/)** - UI component library
- **[Inertia React](https://inertiajs.com/)** - SPA without API
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Headless UI](https://headlessui.com/)** - Unstyled, accessible UI components
- **[Recharts](https://recharts.org/)** - Composable charting library
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons
- **[SheetJS (xlsx)](https://sheetjs.com/)** - Excel file generation

### Development Tools
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[Laravel Pail](https://laravel.com/docs/pail)** - Real-time log viewer
- **[Laravel Tinker](https://laravel.com/docs/tinker)** - REPL for Laravel
- **[Concurrently](https://github.com/open-cli-tools/concurrently)** - Run multiple commands simultaneously

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP 8.2 or higher** ([Download](https://www.php.net/downloads))
- **Composer** ([Download](https://getcomposer.org/download/))
- **Node.js 18.x or higher** and **npm** ([Download](https://nodejs.org/))
- **SQLite** (usually pre-installed) or **MySQL/PostgreSQL**
- **Git** ([Download](https://git-scm.com/downloads))

### Verify Installation

```bash
php -v        # Should show PHP 8.2+
composer -V   # Should show Composer version
node -v       # Should show Node 18+
npm -v        # Should show npm version
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install JavaScript Dependencies

```bash
npm install
```

### 4. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Database Setup

#### For SQLite (Default)

```bash
# Create database file
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed default data (2 users and categories)
php artisan db:seed
```

#### For MySQL/PostgreSQL

Update your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=expense_tracker
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Then run:

```bash
php artisan migrate
php artisan db:seed
```

### 6. Build Frontend Assets

```bash
# For development
npm run dev

# For production
npm run build
```

### 7. Start the Application

#### Option 1: Using Composer Script (Recommended)

```bash
composer run dev
```

This will start:
- Laravel development server (http://localhost:8000)
- Queue worker
- Log viewer (Pail)
- Vite dev server

#### Option 2: Manual Start

```bash
# Terminal 1: Start Laravel server
php artisan serve

# Terminal 2: Start Vite dev server
npm run dev
```

### 8. Access the Application

Open your browser and navigate to:

```
http://localhost:8000
```

### 9. Default Users

Two default users are seeded:

**User 1:**
- Email: `test@example.com`
- Password: `password`

**User 2:**
- Email: `test2@example.com`
- Password: `password`

## ⚙️ Configuration

### Timezone

The application is configured to use **America/Toronto** timezone by default. To change this, update `config/app.php`:

```php
'timezone' => 'America/Toronto', // Change to your timezone
```

### Default Font Size

The application uses a base font size of **14px**. This is configured in `resources/css/app.css`:

```css
body {
    font-size: 14px;
}
```

### Dark Mode

Dark mode is enabled by default and persists user preference in localStorage. Configuration is in `tailwind.config.js`:

```javascript
darkMode: 'class',
```

## 📖 Usage

### Managing Expenses

1. Click **Submit Income/Expense** in the sidebar
2. Select type (Income or Expense)
3. Fill in the required fields:
   - User (who spent/received)
   - Date (defaults to today)
   - Item/Source name
   - Amount (minimum $1)
   - Category (for expenses)
   - Description (optional)
4. Click **Submit**

### Viewing Reports

#### Overview Page
- View yearly breakdown by month with color-coded categories
- Interactive bar chart shows spending by month
- Pie chart displays category distribution
- Yearly overview table with monthly breakdown and totals
- Export data to Excel using the **Export** button

#### Weekly Overview
- See week-by-week breakdown of all expenses
- Income and gross savings per week
- Category-wise distribution
- Export weekly data to Excel

### Managing Categories

1. Click **Categories** in the sidebar
2. **Add Category**: Click "Add New Category"
   - Enter category name
   - Choose color using color picker
   - Set display order
3. **Edit Category**: Click "Edit" next to any category
4. **Delete Category**: Click "Delete" (prevented if used in expenses)

### Viewing Submissions

1. Click **View Submissions** in the sidebar
2. Switch between **Expenses** and **Incomes** tabs
3. **Edit**: Click "Edit" to modify inline
4. **Delete**: Click "Delete" for confirmation dialog

## 🚀 Deployment

### Production Build

1. **Update Environment**

```bash
# Set to production
APP_ENV=production
APP_DEBUG=false

# Update URL
APP_URL=https://your-domain.com
```

2. **Optimize Application**

```bash
# Install production dependencies
composer install --optimize-autoloader --no-dev

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Build frontend assets
npm run build
```

3. **Set Permissions**

```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Deployment Platforms

#### Laravel Forge

1. Connect your server to [Laravel Forge](https://forge.laravel.com/)
2. Create a new site
3. Deploy from your Git repository
4. Configure environment variables
5. Run deployment script

#### Laravel Vapor (Serverless)

```bash
# Install Vapor CLI
composer require laravel/vapor-cli

# Deploy
vapor deploy production
```

#### Shared Hosting (cPanel)

1. Upload files via FTP/SSH
2. Point domain to `public` directory
3. Import database
4. Set environment variables in `.env`
5. Run `composer install` and `npm run build`

#### Docker

```bash
# Using Laravel Sail
./vendor/bin/sail up -d
```

### Database Migration in Production

```bash
# Run migrations
php artisan migrate --force

# Seed initial data
php artisan db:seed --force
```

### Setting Up Queue Workers

For background job processing:

```bash
# Using Supervisor (Linux)
sudo nano /etc/supervisor/conf.d/expense-tracker.conf
```

Add:

```ini
[program:expense-tracker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/storage/logs/worker.log
```

## 📁 Project Structure

```
expense-tracker/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── CategoryController.php     # Category CRUD operations
│   │       ├── ExpenseController.php      # Expense management
│   │       ├── IncomeController.php       # Income management
│   │       ├── OverviewController.php     # Dashboard analytics
│   │       ├── SubmissionsController.php  # View all records
│   │       └── WeeklyOverviewController.php # Weekly reports
│   └── Models/
│       ├── Category.php                   # Category model
│       ├── Expense.php                    # Expense model
│       ├── Income.php                     # Income model
│       └── User.php                       # User model
├── database/
│   ├── migrations/                        # Database schema
│   └── seeders/
│       ├── CategorySeeder.php            # Default categories
│       └── DatabaseSeeder.php            # User seeding
├── resources/
│   ├── css/
│   │   └── app.css                       # Global styles
│   └── js/
│       ├── Components/
│       │   ├── DeleteConfirmationDialog.jsx
│       │   └── Dropdown.jsx
│       ├── Layouts/
│       │   └── AuthenticatedLayout.jsx   # Main layout with sidebar
│       └── Pages/
│           ├── Categories.jsx            # Category management
│           ├── Overview.jsx              # Dashboard page
│           ├── SubmitForm.jsx            # Submit transactions
│           ├── ViewSubmissions.jsx       # View all records
│           └── WeeklyOverview.jsx        # Weekly reports
├── routes/
│   ├── auth.php                          # Authentication routes
│   └── web.php                           # Application routes
├── .env.example                          # Environment template
├── composer.json                         # PHP dependencies
├── package.json                          # Node dependencies
├── tailwind.config.js                    # Tailwind configuration
└── vite.config.js                        # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🙏 Acknowledgments

- [Laravel](https://laravel.com/) - The PHP framework
- [React](https://react.dev/) - The JavaScript library
- [Tailwind CSS](https://tailwindcss.com/) - The CSS framework
- [Inertia.js](https://inertiajs.com/) - The modern monolith
- [Recharts](https://recharts.org/) - The charting library
- [Lucide](https://lucide.dev/) - The icon library

## 📧 Support

For support, email support@example.com or open an issue in the repository.

---

**Made with ❤️ using Laravel and React**
