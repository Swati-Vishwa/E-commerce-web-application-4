# E-Commerce Website

A full-stack e-commerce application for product browsing and management. Customers can browse products, add them to a cart, and place orders. Admins can manage the product catalog and update order statuses.

## ✨ Features

### Customers
- **Product catalog** - Browse products with search and category filter
- **Product details** - Image, price, description, and stock availability
- **Shopping cart** - Add items, change quantities, remove items, and see a live total
- **Persistent cart** - Each user's cart is saved in the browser, and a guest cart is merged into the user's cart on login
- **User accounts** - Register, log in, and log out with JWT authentication
- **Checkout** - Shipping details form with Cash on Delivery
- **My Orders** - View past orders and their status

### Admins
- **Manage products** - Add, edit, and delete products
- **Manage orders** - View all orders with customer details and update status (Pending, Shipped, Delivered)

### Behind the scenes
- **Role-based access** - Admin-only routes are protected on both the server and the client
- **Server-side pricing** - Order totals are calculated on the server from database prices
- **Stock handling** - Stock is reduced when an order is placed, orders that exceed stock are rejected, and stock is restored if an order fails
- **Consistent API responses and error messages**

## 🛠️ Tech Stack

**Frontend:** React (Vite), React Router, Tailwind CSS, Axios

**Backend:** Node.js, Express, MongoDB (Atlas), Mongoose, JSON Web Tokens, bcryptjs

## 📂 Project Structure

```
ecommerce-website-4/
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       │   └── admin/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
└── server/
    └── src/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        ├── utils/
        ├── app.js
        └── index.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or later
- A MongoDB database 

### 1. Clone the repository
```bash
git clone https://github.com/Swati-Vishwa/E-commerce-web-application-4
cd E-commerce-web-application-4
```

### 2. Set up the backend
```bash
cd server
npm install
```

Copy `.env.example` to `.env` and fill in your own values:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

Start the server:
```bash
npm run dev
```
The API runs at `http://localhost:3000`.

### 3. Set up the frontend
Open a second terminal:
```bash
cd client
npm install
```

Copy `.env.example` to `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

Start the app:
```bash
npm run dev
```
The app runs at `http://localhost:5173`.

### 4. Create an admin account
Everyone who registers starts as a normal customer. To make an admin:

1. Register an account through the app.
2. In MongoDB (Atlas → Browse Collections → `users`), edit that user and set `role` to `"admin"`.
3. Log out and log in again. "Manage Products" and "Manage Orders" will appear in the navbar.

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Create an account | Public |
| POST | `/api/auth/login` | Log in and receive a token | Public |
| GET | `/api/auth/me` | Get the current user | Logged in |

### Products
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/products` | List products (`search`, `category` filters) | Public |
| GET | `/api/products/categories` | List categories | Public |
| GET | `/api/products/:id` | Get one product | Public |
| POST | `/api/products` | Add a product | Admin |
| PUT | `/api/products/:id` | Update a product | Admin |
| DELETE | `/api/products/:id` | Delete a product | Admin |

### Orders
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/orders` | Place an order | Logged in |
| GET | `/api/orders/my` | Get my orders | Logged in |
| GET | `/api/orders` | Get all orders | Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |

Protected routes need an `Authorization: Bearer <token>` header.

## 🧪 Tested Workflows

- Register, browse, add to cart, check out, and see the order in My Orders
- Admin adds, edits, and deletes products, and updates order status
- Customers are blocked from admin routes (403 from the API, redirect in the UI)
- Orders exceeding available stock are rejected without changing stock
- Cart contents are kept separately for each user

## 🔮 Possible Improvements

- Online payments 
- Image uploads for products
- Pagination for products and orders
- Product reviews and ratings
- Store the token in an httpOnly cookie instead of localStorage

## 📄 License

© 2026 Swati Vishwakarma. All rights reserved.
This repository is public for review and portfolio purposes.


## Support

For issues, questions, or contributions, please open an issue in the repository or contact the project maintainer.