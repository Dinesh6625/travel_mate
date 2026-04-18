# TravelMate Frontend

React frontend for the TravelMate Spring Boot backend.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm start
```
The app runs at **http://localhost:3000**

> Make sure your Spring Boot backend is running at **http://localhost:8080**

---

## Features

| Page | Description |
|------|-------------|
| **Home / Explore** | Browse all tour packages with search & sort filters |
| **Booking Modal** | Select travel date and confirm a booking |
| **My Bookings** | View personal booking history; cancel bookings |
| **Reviews** | Read all reviews; write a review for any destination |
| **Admin Panel** | Add / Edit / Delete destinations; Confirm or Cancel bookings |
| **Profile** | View and edit personal account details |

## Roles

- **USER** — Can browse, book, and review destinations
- **ADMIN** — All user features + full destination & booking management

## API Endpoints Used

| Method | URL | Purpose |
|--------|-----|---------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login (returns user object) |
| PUT  | `/api/user/{id}` | Update user profile |
| GET  | `/api/places` | Get all destinations |
| POST | `/api/places?role=ADMIN` | Add destination (admin) |
| PUT  | `/api/places/{id}?role=ADMIN` | Update destination (admin) |
| DELETE | `/api/places/{id}?role=ADMIN` | Delete destination (admin) |
| POST | `/api/book` | Create a booking |
| GET  | `/api/bookings` | Get all bookings |
| PUT  | `/api/booking/{id}` | Update booking status |
| POST | `/api/review` | Add a review |
| GET  | `/api/reviews` | Get all reviews |

## Project Structure

```
src/
├── api/
│   └── travelApi.js       # All Axios API calls
├── context/
│   └── AuthContext.jsx    # Global user auth state
├── components/
│   └── Navbar.jsx         # Navigation bar
├── pages/
│   ├── AuthPage.jsx       # Login & Register
│   ├── HomePage.jsx       # Explore destinations + booking
│   ├── BookingsPage.jsx   # User booking history
│   ├── ReviewsPage.jsx    # Reviews list + form
│   ├── AdminPage.jsx      # Admin management panel
│   └── ProfilePage.jsx    # User profile editor
├── App.jsx                # Root app with page routing
├── index.jsx              # Entry point
└── index.css              # Global styles & design tokens
```
