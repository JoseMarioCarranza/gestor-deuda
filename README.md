# Debt Manager

Debt Manager is a web application developed to manage debts, transactions, and employees within a company. The application includes features for administrators and regular users, ensuring efficient and accessible control.

## Production Deployment

- **Backend**: [https://gestor-deuda-backend-demo.onrender.com/api](https://gestor-deuda-backend-demo.onrender.com/api)
- **Frontend**: [https://gestor-deuda-frontend-demo.onrender.com](https://gestor-deuda-frontend-demo.onrender.com)

## Test Users

### Administrator

- **Username**: Admin
- **Password**: gdadmin

### Regular User

- **Username**: User
- **Password**: gduser

## Main Features

### Administrator

- Create, edit, and delete employees.
- Create and delete transactions associated with employees.
- View all employee transactions.
- View total general and per-employee balances.

### Regular User

- View employees and their transactions.
- View total general and per-employee balances.

## Technologies Used

### Backend

- **Framework**: Node.js with Express.
- **Database**: MongoDB.
- **Authentication**: JWT (JSON Web Tokens).
- **Deployment**: Render.

### Frontend

- **Framework**: React with Vite.
- **Styling**: Bootstrap.
- **Deployment**: Render.

## Backend Routes

### Authentication

- **POST /auth/register**: Register a new user.
  - **Body**: `{ "username": "string", "nombre": "string", "apellido": "string", "password": "string", "esAdmin": "boolean" }`
  - **Requires**: No token.
- **POST /auth/login**: Log in.
  - **Body**: `{ "username": "string", "password": "string" }`
  - **Response**: JWT token.

### Employees

- **GET /empleados**: Get all employees.
  - **Requires**: JWT token.
- **POST /empleados**: Create a new employee (administrators only).
  - **Body**: `{ "nombre": "string", "apellido": "string" }`
  - **Requires**: Administrator JWT token.
- **DELETE /empleados/****:id**: Delete an employee by ID (administrators only).
  - **Requires**: Administrator JWT token.

### Transactions

- **GET /transacciones**: Get all transactions.
  - **Requires**: JWT token.
- **GET /transacciones/****:empleadoId**: Get transactions for an employee by ID.
  - **Requires**: JWT token.
- **POST /transacciones**: Create a new transaction (administrators only).
  - **Body**: `{ "empleadoId": "string", "tipo": "string", "descripcion": "string", "monto": "number", "fecha": "string (optional)" }`
  - **Requires**: Administrator JWT token.
- **DELETE /transacciones/****:id**: Delete a transaction by ID (administrators only).
  - **Requires**: Administrator JWT token.

## Local Installation

### Prerequisites

Make sure you have installed:

- Node.js
- MongoDB

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/JoseMarioCarranza/gestor-deuda.git
   cd gestor-deuda/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_url
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd gestor-deuda/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variable:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the application:
   ```bash
   npm run dev
   ```

## Usage

### Administrator Access

1. Log in with the administrator credentials.
2. Manage employees and transactions from the administration panel.

### Regular User Access

1. Log in with the regular user credentials.
2. View employees and their transactions.

## Project Structure

```
/
|-- backend/
|   |-- models/
|   |-- routes/
|   |-- middleware/
|   |-- server.js
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |-- .env
```

## Contributions

Contributions are welcome. Please open an issue or submit a pull request in the official repository.

## License

This project is under the MIT license. See the `LICENSE` file for more details.

---

## Contact

- **Name**: José Mario Rivera Carranza
- **GitHub**: [https://github.com/JoseMarioCarranza](https://github.com/JoseMarioCarranza)
- **Email**: [imt_josecarranza@outlook.com](mailto:imt_josecarranza@outlook.com)
- **Website**: [https://www.ingjosemario.com](https://www.ingjosemario.com)

