# Stock Inventory Management System (SIMS)

A full-stack web application designed to manage spare parts inventory efficiently. This system replaces manual stock tracking with a secure, real-time digital solution.

---

## 🚀 Project Overview

**SIMS (Stock Inventory Management System)** is developed for AutoFix Ltd to:

* Track spare parts in real-time
* Manage stock-in and stock-out operations
* Automatically calculate stock value
* Prevent unauthorized access using secure authentication

---

## 🚀 Problem Statement

AutoFix Ltd previously relied on:

* Manual record keeping (notebooks & spreadsheets)
* No centralized inventory system
* Untracked stock withdrawals
* Inaccurate stock reporting

This resulted in operational inefficiencies and financial losses.

---

## ✅ Solution

SIMS provides:

* Real-time inventory tracking
* Secure login system (session-based authentication)
* Accurate stock calculations
* Centralized data management

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Authentication

* express-session
* Cookies

---

## 📁 Project Structure

```
sims/
│
├── SERVER/        # Backend (Node.js + Express)
│   ├── routes/
│   ├── controllers/
│   ├── middleWare/
│   └── conn.js
│
├── UI/            # Frontend (React)
│   ├── src/
│   └── components/
│
├── sims.sql       # Database schema
└── README.md
```

---

## 🔐 Authentication Features

* User registration
* Login with hashed passwords (bcrypt)
* Session-based authentication
* Protected routes
* Logout functionality

---

## 📊 Core Features

### 🧩 Spare Management

* Add spare parts
* Update spare details
* Delete spare parts
* View all spares

### 📥 Stock In

* Add stock quantity
* Update spare quantity automatically
* Record stock-in history

### 📤 Stock Out

* Remove stock
* Prevent negative stock
* Calculate total price dynamically
* Record stock-out history

### 📈 Dashboard

* Total spare parts
* Total stock value
* Stock in/out summaries
* Recent activities

---

## ⚙️ Installation Guide

### 1. Clone the repository

```bash
git clone https://github.com/fullstackv/stock-inventory-management-system.git
cd stock-inventory-management-system
```

---

### 2. Setup Backend

```bash
cd SERVER
npm install
```


Start backend:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd UI
npm install
npm run dev
```

---

### 4. Setup Database

* Import `sims.sql` into MySQL
* Ensure database name matches `.env`

---

## 🔗 API Endpoints

### 🔐 Authentication

| Method | Endpoint   | Description        |
| ------ | ---------- | ------------------ |
| POST   | /register  | Register user      |
| POST   | /login     | Login user         |
| GET    | /dashboard | Get logged-in user |
| POST   | /logout    | Logout user        |

---

### 🔩 Spares

| Method | Endpoint    | Description      |
| ------ | ----------- | ---------------- |
| POST   | /spares     | Create spare     |
| GET    | /spares     | Get all spares   |
| GET    | /spares/:id | Get single spare |
| PUT    | /spares/:id | Update spare     |
| DELETE | /spares/:id | Delete spare     |

---

### 📥 Stock In

| Method | Endpoint  | Description           |
| ------ | --------- | --------------------- |
| POST   | /stock-in | Add stock             |
| GET    | /stock-in | View stock-in records |

---

### 📤 Stock Out

| Method | Endpoint   | Description            |
| ------ | ---------- | ---------------------- |
| POST   | /stock-out | Remove stock           |
| GET    | /stock-out | View stock-out records |

---

## 🔒 Security Features

* Password hashing using bcrypt
* Session-based authentication
* Cookie security
* Protected backend routes
* Input validation

---

## 🎨 UI/UX Features

* Responsive design
* Sidebar navigation
* Dashboard cards
* Tables for data display
* Form validation
* Toast notifications
* Clean and modern interface

---

## 📌 Future Improvements

* Role-based access (Admin / Manager)
* Reports & analytics
* Export data (PDF/Excel)
* Notifications system
* Mobile app version

---

## 👨‍💻 Author

**Jean Marie Vianney⚡**
Trainer at ACODES MUSHISHIRO TSS

---

## 📬 Submission

Repository includes:

* Full source code (Frontend + Backend)
* Database schema (`sims.sql`)
* README documentation

Trainer Email: **[fullstackv@proton.me](mailto:fullstackv@proton.me)**

---

## ⭐ Acknowledgements

This project was developed as part of a **Full-Stack Development Assessment** to demonstrate:

* Backend API development
* Database design
* Authentication systems
* Frontend UI/UX design
* Full-stack integration

---

## 📄 License

This project is for educational purposes only.
