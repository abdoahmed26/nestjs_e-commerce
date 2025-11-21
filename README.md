# E-Commerce API

A comprehensive RESTful API built with NestJS for managing an e-commerce platform. This API provides complete functionality for user management, product catalog, shopping cart, orders, reviews, wishlists, and more.

## 🚀 Features

- **Authentication & Authorization**
  - User registration and login with JWT
  - Role-based access control (Admin/User)
  - Password reset functionality
  - Profile image upload

- **User Management**
  - User CRUD operations
  - Profile management
  - Role-based permissions

- **Product Management**
  - Product CRUD operations
  - Image upload with Cloudinary
  - Product search and filtering
  - Category-based organization

- **Category Management**
  - Category CRUD operations
  - Hierarchical category structure

- **Shopping Cart**
  - Add/remove items
  - Update quantities
  - Cart persistence

- **Wishlist**
  - Save favorite products
  - Manage wishlist items

- **Reviews & Ratings**
  - Product reviews
  - Rating system
  - Review moderation

- **Order Management**
  - Order creation and tracking
  - Order history
  - Order status updates

- **Coupon System**
  - Discount coupons
  - Coupon validation
  - Apply coupons to orders

- **Email Notifications**
  - Email service integration with Nodemailer
  - Transactional emails

- **Caching**
  - Redis integration for improved performance
  - Cache management

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) v11
- **Language**: TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Caching**: Redis
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **Validation**: class-validator & class-transformer
- **Security**: Helmet, bcrypt
- **Testing**: Jest

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MySQL database
- Redis server
- Cloudinary account (for image uploads)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/abdoahmed26/nestjs_e-commerce.git
   cd nestjs_e-commerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Server
   PORT=3000

   # Database
   DB_HOST=your_db_host
   DB_PORT=your_db_port
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name

   # JWT
   JWT_SECRET=your_jwt_secret_key

   # Cloudinary
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_FOLDER_NAME=your_folder_name

   # Redis
   REDIS_URL=your_redis_url

   # Email (Nodemailer)
   EMAIL=your_email@gmail.com
   PASS=your_email_password
   ```

4. **Database Setup**

   Run migrations to set up the database schema:

   ```bash
   npm run migration
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

The API will be available at `http://localhost:3000` (or your configured PORT)

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication Endpoints

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| POST   | `/auth/register` | Register new user | No            |
| POST   | `/auth/login`    | User login        | No            |

### User Endpoints

| Method | Endpoint     | Description    | Auth Required |
| ------ | ------------ | -------------- | ------------- |
| GET    | `/users`     | Get all users  | Yes (Admin)   |
| GET    | `/users/:id` | Get user by ID | Yes           |
| PATCH  | `/users/:id` | Update user    | Yes           |
| DELETE | `/users/:id` | Delete user    | Yes (Admin)   |

### Product Endpoints

| Method | Endpoint        | Description       | Auth Required |
| ------ | --------------- | ----------------- | ------------- |
| GET    | `/products`     | Get all products  | Yes           |
| GET    | `/products/:id` | Get product by ID | Yes           |
| POST   | `/products`     | Create product    | Yes (Admin)   |
| PATCH  | `/products/:id` | Update product    | Yes (Admin)   |
| DELETE | `/products/:id` | Delete product    | Yes (Admin)   |

### Category Endpoints

| Method | Endpoint          | Description        | Auth Required |
| ------ | ----------------- | ------------------ | ------------- |
| GET    | `/categories`     | Get all categories | Yes           |
| GET    | `/categories/:id` | Get category by ID | Yes           |
| POST   | `/categories`     | Create category    | Yes (Admin)   |
| PATCH  | `/categories/:id` | Update category    | Yes (Admin)   |
| DELETE | `/categories/:id` | Delete category    | Yes (Admin)   |

### Cart Endpoints

| Method | Endpoint     | Description      | Auth Required |
| ------ | ------------ | ---------------- | ------------- |
| GET    | `/carts`     | Get user cart    | Yes           |
| POST   | `/carts`     | Add item to cart | Yes           |
| PATCH  | `/carts/:id` | Update cart item | Yes           |
| DELETE | `/carts/:id` | Remove from cart | Yes           |

### Wishlist Endpoints

| Method | Endpoint         | Description          | Auth Required |
| ------ | ---------------- | -------------------- | ------------- |
| GET    | `/wishlists`     | Get user wishlist    | Yes           |
| POST   | `/wishlists`     | Add to wishlist      | Yes           |
| DELETE | `/wishlists/:id` | Remove from wishlist | Yes           |

### Review Endpoints

| Method | Endpoint       | Description     | Auth Required |
| ------ | -------------- | --------------- | ------------- |
| GET    | `/reviews`     | Get all reviews | Yes           |
| POST   | `/reviews`     | Create review   | Yes           |
| PATCH  | `/reviews/:id` | Update review   | Yes           |
| DELETE | `/reviews/:id` | Delete review   | Yes           |

### Order Endpoints

| Method | Endpoint      | Description         | Auth Required |
| ------ | ------------- | ------------------- | ------------- |
| GET    | `/orders`     | Get user orders     | Yes           |
| GET    | `/orders/:id` | Get order by ID     | Yes           |
| POST   | `/orders`     | Create order        | Yes           |
| PATCH  | `/orders/:id` | Update order status | Yes (Admin)   |

### Coupon Endpoints

| Method | Endpoint       | Description     | Auth Required |
| ------ | -------------- | --------------- | ------------- |
| GET    | `/coupons`     | Get all coupons | Yes (Admin)   |
| POST   | `/coupons`     | Create coupon   | Yes (Admin)   |
| PATCH  | `/coupons/:id` | Update coupon   | Yes (Admin)   |
| DELETE | `/coupons/:id` | Delete coupon   | Yes (Admin)   |

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📦 Database Migrations

```bash
# Generate migration
npm run generate

# Run migrations
npm run migration

# Revert migration
npm run revert
```

## 🔒 Security Features

- **Helmet**: Secures HTTP headers
- **CORS**: Cross-Origin Resource Sharing enabled
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password encryption
- **Input Validation**: class-validator for DTO validation
- **Whitelist**: Strips unknown properties from requests
- **Global Exception Filter**: Centralized error handling

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
├── carts/                # Shopping cart module
├── categories/           # Category management
├── common/               # Shared resources (guards, filters, etc.)
├── config/               # Configuration files
├── coupons/              # Coupon system
├── email-sender/         # Email service
├── helpers/              # Utility functions
├── migrations/           # Database migrations
├── orders/               # Order management
├── password/             # Password reset functionality
├── products/             # Product management
├── redis/                # Redis cache module
├── reviews/              # Review system
├── users/                # User management
├── wishlists/            # Wishlist module
├── app.module.ts         # Root module
└── main.ts               # Application entry point
```

## 🔄 Development Workflow

1. **Code Formatting**

   ```bash
   npm run format
   ```

2. **Linting**

   ```bash
   npm run lint
   ```

3. **Build**
   ```bash
   npm run build
   ```

## 👥 Author

Abdulrahman Ahmed

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- TypeORM for database management
- All contributors and supporters

---

**Note**: Make sure to update all placeholder values in the `.env` file and this README with your actual configuration before deploying to production.
