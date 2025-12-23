# Aquarium E-commerce Platform

An e-commerce platform for aquarium products with role-based access for customers, retailers, wholesalers, and admins.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Accessing the Application](#accessing-the-application)
- [User Roles and Functionalities](#user-roles-and-functionalities)
- [Development Workflow](#development-workflow)
- [API Endpoints](#api-endpoints)
- [Image Management](#image-management)
- [Troubleshooting](#troubleshooting)
- [Development Tips](#development-tips)
- [Deployment](#deployment)

## Features

- Role-based authentication (Customer, Retailer, Wholesaler, Admin)
- Product catalog with category filtering
- Dual pricing system (customer vs. wholesaler pricing)
- Product image management
- Order management system
- Product tracking capabilities
- Location-based product information
- Recommendation system

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication

### Frontend
- React.js
- React Router for navigation
- CSS3 for styling

## Project Structure

```
.
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── README.md
├── README.md
└── package.json
```

## Setup Instructions

### Prerequisites

1. Node.js (v14 or higher)
2. MongoDB (local installation or cloud instance)
3. npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the backend directory with the following content:
   ```
   MONGO_URI=mongodb://localhost:27017/aquarium-commerce
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. Start MongoDB:
   - Make sure MongoDB is installed and running on your system
   - On Windows, you can start MongoDB as a service or run:
     ```bash
     mongod
     ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Method 1: Using VS Code Integrated Terminal

#### Running the Backend:

1. Open the project in VS Code
2. Open the integrated terminal (Ctrl+`)
3. Navigate to the backend directory:
   ```bash
   cd backend
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:5000`

#### Running the Frontend:

1. Open a new terminal in VS Code (Ctrl+Shift+`)
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`

### Method 2: Using Separate Terminals

#### Backend:
```bash
cd backend
npm run dev
```

#### Frontend:
```bash
cd frontend
npm start
```

## Accessing the Application

1. Once both servers are running, open your browser and navigate to:
   ```
   http://localhost:3000
   ```

2. You will see the homepage with options to log in or sign up as different user roles:
   - Customer
   - Retailer
   - Wholesaler
   - Admin

## User Roles and Functionalities


### Wholesaler
- Can add/edit/delete products with dual pricing
- Can view orders from retailers
- Can update order statuses
- Access via: `/login/wholesaler`

### Retailer
- Can browse and purchase from wholesalers
- Can view orders from customers
- Can update order statuses
- Access via: `/login/retailer`

### Customer
- Can browse and purchase products
- Can view order history
- Access via: `/login/customer`

## Development Workflow

### Backend Development

1. All API endpoints are defined in the `routes/` directory
2. Controllers are in the `controllers/` directory
3. Models are in the `models/` directory
4. Middleware is in the `middleware/` directory

### Frontend Development

1. Components are organized by role in the `src/components/` directory
2. Services for API calls are in the `src/services/` directory
3. Shared components are in the `src/components/shared/` directory

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users/me/products` - Get current wholesaler's products
- `GET /api/users/me/orders` - Get current user's orders

### Products
- `GET /api/products` - Get all products
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Add new product (Wholesaler only)
- `PUT /api/products/:id` - Update product (Wholesaler only)
- `DELETE /api/products/:id` - Delete product (Wholesaler only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status

## Image Management

### Adding Images to Products

Wholesalers can add images to products when creating or editing products:

1. Navigate to the Wholesaler Dashboard
2. Go to Product Management section
3. Click "Add New Product" or "Edit" on an existing product
4. In the product form, use the "Product Images" section to:
   - Select up to 5 images from your device
   - Images will be previewed before submission
   - First image will be used as the main product image
   - All images are converted to base64 format for storage

### Image Display

- Product catalog shows the main image for each product
- Product detail page shows all images in a gallery format
- Image gallery includes thumbnail navigation
- Images are responsive and maintain aspect ratio

### Image Requirements

- Supported formats: JPEG, PNG, GIF
- Maximum file size: 5MB per image
- Maximum images per product: 5
- Images are automatically resized for optimal display

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Change the PORT in the backend `.env` file
   - Update the API URL in frontend services if you change the port

2. **MongoDB connection error**:
   - Ensure MongoDB is running
   - Check the MONGO_URI in the backend `.env` file

3. **CORS errors**:
   - The backend already includes CORS middleware
   - Ensure both frontend and backend are running

4. **Dependency issues**:
   - Delete `node_modules` folders in both frontend and backend
   - Run `npm install` in both directories

### Development Tips

1. Use the VS Code debugger for both frontend and backend
2. Install useful extensions:
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint
   - MongoDB for VS Code

## Deployment

For production deployment, consider:
ok
1. Using a cloud MongoDB service (MongoDB Atlas)
2. Deploying backend to a Node.js hosting service (Heroku, AWS, etc.)
3. Deploying frontend to a static hosting service (Netlify, Vercel, etc.)
4. Setting proper environment variables for production
5. Implementing proper error handling and logging
