# StockFlow -- Inventory Management System

A multi-tenant inventory management MVP built for the Wexa AI SDE Intern
assessment. StockFlow allows users to create an organization, manage
products and stock quantities, and monitor low-stock inventory through a
dashboard.

## Features

### Authentication and organization management

-   User signup with email, password, and organization name.
-   Login using email and password.
-   Password hashing with bcrypt.
-   JWT-based authentication for protected API routes.
-   Each user is associated with an organization.

### Product and inventory management

-   Create, view, update, and delete products.
-   Search products by name or SKU.
-   SKU uniqueness within an organization.
-   Track quantity on hand, cost price, and selling price.
-   Optional product-specific low-stock threshold.

### Dashboard

-   Total number of products.
-   Total quantity across all products.
-   Low-stock product list.
-   Low-stock calculation using a product-specific threshold when
    provided, otherwise the organization's default threshold.

### Organization settings

-   View organization name.
-   Configure the default low-stock threshold.

### Multi-tenant data isolation

-   Product queries are scoped to the authenticated user's organization.
-   Dashboard and organization settings are loaded for the authenticated
    user's organization.

## Technology Stack

  Layer                Technology
  -------------------- -----------------------
  Frontend             React, Vite
  Styling              Tailwind CSS
  Routing              React Router
  HTTP client          Axios
  Backend              Node.js, Express
  Database             MongoDB Atlas
  ODM                  Mongoose
  Authentication       JSON Web Tokens (JWT)
  Password hashing     bcryptjs
  Development server   Nodemon

## Project Structure

``` text
stockflow/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── dashboardController.js
│   │   └── organizationController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Organization.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── organizationRoutes.js
│   ├── scripts/
│   │   └── seed.js
│   ├── services/
│   │   └── authService.js
│   ├── .env.example
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

> The structure above reflects the intended application organization. If
> your local project uses different filenames or folders, update this
> section to match the repository.

## Prerequisites

Install the following before running the application:

-   Node.js (LTS version recommended).
-   npm.
-   A MongoDB Atlas account and an available cluster, or a local MongoDB
    instance.
-   Git (optional, for cloning and version control).

## Getting Started

### 1. Clone the repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd stockflow
```

Replace the placeholder with the actual repository URL.

### 2. Configure the backend

``` bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
NODE_ENV=development
```

Configure `MONGO_URI` with your MongoDB connection string. Ensure the
database user has the required permissions and your current public IP
address is allowed in MongoDB Atlas Network Access.

Create `backend/.env.example` for documentation and safe sharing:

``` env
PORT=5000
MONGO_URI=
JWT_SECRET=
NODE_ENV=development
```

Do not commit the real `.env` file or expose database credentials and
JWT secrets.

### 3. Start the backend

From the `backend` directory:

``` bash
npm run dev
```

The API should be available at:

``` text
http://localhost:5000
```

If your project does not yet define the `dev` script, add:

``` json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node scripts/seed.js"
  }
}
```

Keep any other existing package scripts.

### 4. Configure the frontend

Open a second terminal:

``` bash
cd frontend
npm install
```

Create `frontend/.env`:

``` env
VITE_API_URL=http://localhost:5000/api
```

Create `frontend/.env.example`:

``` env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start the frontend

From the `frontend` directory:

``` bash
npm run dev
```

Open the local URL printed by Vite, typically:

``` text
http://localhost:5173
```

## API Reference

The API base URL for local development is:

``` text
http://localhost:5000/api
```

Protected endpoints require a JWT access token in the request header:

``` http
Authorization: Bearer <JWT_TOKEN>
```

### Authentication

  -----------------------------------------------------------------------
  Method            Endpoint          Description       Authentication
  ----------------- ----------------- ----------------- -----------------
  POST              `/auth/signup`    Register a user   No
                                      and create an     
                                      organization      

  POST              `/auth/login`     Authenticate a    No
                                      user and receive  
                                      a token           

  GET               `/auth/me`        Get the           Yes
                                      authenticated     
                                      user's profile    
  -----------------------------------------------------------------------

Example signup request:

``` json
{
  "email": "owner@example.com",
  "password": "StrongPassword123",
  "organizationName": "My Store"
}
```

Example login request:

``` json
{
  "email": "owner@example.com",
  "password": "StrongPassword123"
}
```

### Products

  ---------------------------------------------------------------------------------
  Method            Endpoint                    Description       Authentication
  ----------------- --------------------------- ----------------- -----------------
  POST              `/products`                 Create a product  Yes

  GET               `/products`                 List products for Yes
                                                the user's        
                                                organization      

  GET               `/products?search=iphone`   Search by product Yes
                                                name or SKU       

  GET               `/products/:id`             Get a product by  Yes
                                                ID                

  PUT               `/products/:id`             Update a product  Yes

  DELETE            `/products/:id`             Delete a product  Yes
  ---------------------------------------------------------------------------------

Example product request:

``` json
{
  "name": "Wireless Mouse",
  "sku": "MOUSE-001",
  "description": "Wireless optical mouse",
  "quantityOnHand": 25,
  "costPrice": 500,
  "sellingPrice": 899,
  "lowStockThreshold": 5
}
```

### Dashboard

  -----------------------------------------------------------------------------
  Method            Endpoint                Description       Authentication
  ----------------- ----------------------- ----------------- -----------------
  GET               `/dashboard/overview`   Get inventory     Yes
                                            summary and       
                                            low-stock         
                                            products          

  -----------------------------------------------------------------------------

### Organization settings

  --------------------------------------------------------------------------------
  Method            Endpoint                   Description       Authentication
  ----------------- -------------------------- ----------------- -----------------
  GET               `/organization/settings`   Get organization  Yes
                                               settings          

  PUT               `/organization/settings`   Update the        Yes
                                               default low-stock 
                                               threshold         
  --------------------------------------------------------------------------------

Example settings request:

``` json
{
  "defaultLowStockThreshold": 10
}
```

## Low-Stock Calculation

StockFlow determines whether a product is low in stock using the
following rule:

1.  If the product has its own `lowStockThreshold`, use that value.
2.  Otherwise, use the organization's `defaultLowStockThreshold`.
3.  A product is low in stock when:

``` text
quantityOnHand <= effectiveLowStockThreshold
```

For example, if the organization's default threshold is `10`: - A
product with quantity `8` and no custom threshold is low in stock. - A
product with quantity `3` and a custom threshold of `2` is not low in
stock.

## Sample Database Data

A development seed script is provided at:

``` text
backend/scripts/seed.js
```

Run it from the backend directory:

``` bash
npm run seed
```

The sample script creates three development users, three organizations,
and five products per organization. It is intended for local development
and testing.

Sample credentials used by the seed script:

  Organization   Email                      Password
  -------------- -------------------------- ------------
  Store One      `alice@storeone.com`       `Test@123`
  Store Two      `bob@storetwo.com`         `Test@123`
  Store Three    `charlie@storethree.com`   `Test@123`

These are test credentials only. Do not use them in production. Do not
run the seed script against a production database.

## Testing Checklist

Before considering the MVP ready for demonstration, verify:

### Authentication

-   [ ] A new user can sign up.
-   [ ] Duplicate email registration is rejected.
-   [ ] A user can log in with valid credentials.
-   [ ] Invalid credentials are rejected.
-   [ ] Protected endpoints reject missing or invalid tokens.

### Products

-   [ ] A product can be created.
-   [ ] Products can be listed and searched.
-   [ ] A product can be updated.
-   [ ] A product can be deleted after confirmation.
-   [ ] Duplicate SKUs within the same organization are rejected.
-   [ ] Negative or invalid quantities and prices are rejected.

### Dashboard and settings

-   [ ] Product count is correct.
-   [ ] Total quantity is correct.
-   [ ] Low-stock products are calculated correctly.
-   [ ] A product-specific threshold overrides the organization default.
-   [ ] Updating the organization default threshold changes low-stock
    results.

### Tenant isolation

-   [ ] Each user sees only their organization's products.
-   [ ] A user cannot retrieve another organization's product by ID.
-   [ ] A user cannot update or delete another organization's product.
-   [ ] Dashboard totals are organization-specific.
-   [ ] Organization settings are organization-specific.

### Frontend

-   [ ] Signup, login, and logout work.
-   [ ] Protected pages redirect unauthenticated users.
-   [ ] Product create, edit, delete, and search work.
-   [ ] Loading, empty, and error states are handled.
-   [ ] The application remains usable after a browser refresh.

## Security and Configuration Notes

-   Keep `.env` files out of source control.
-   Use a strong, unique JWT secret.
-   Never store plaintext passwords; hash passwords before saving them.
-   Validate all input on the backend, even when frontend validation
    exists.
-   Scope every organization-owned database query to the authenticated
    user's organization ID.
-   Use HTTPS and secure deployment configuration in production.
-   For production authentication, consider secure, HttpOnly, SameSite
    cookies instead of storing JWTs in browser local storage.
-   Restrict MongoDB Atlas network access to trusted IP addresses where
    practical.

## Current MVP Scope and Limitations

This project focuses on the reduced MVP requirements:

-   Single owner user per organization.
-   Basic email/password authentication.
-   Product CRUD and stock quantity management.
-   Inventory summary and low-stock monitoring.
-   Organization-level default low-stock threshold.

The following are outside the current MVP scope:

-   Multiple warehouses.
-   Product variants, categories, and images.
-   Purchase orders and supplier management.
-   Order management and reservations.
-   External channel integrations.
-   CSV import/export.
-   Billing and subscription management.
-   Advanced roles and permissions.
-   Detailed stock movement history and audit logs.

## Future Improvements

Potential enhancements beyond the MVP:

-   Automated backend and frontend test suites.
-   Centralized API error handling and structured logging.
-   Pagination and sorting for large product lists.
-   Stock adjustment history.
-   Password reset and email verification.
-   More granular roles and permissions.
-   Automated deployment pipeline.

## License

Add the license applicable to this repository before public
distribution.
