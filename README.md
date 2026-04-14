# BookYourSeat

BookYourSeat is a full-stack movie seat booking app with a React frontend, a Node/Express backend, and PostgreSQL as the data layer. The app is live at [https://bookyourseat.arghyalogs.in/](https://bookyourseat.arghyalogs.in/).

The vibe is simple: pick a movie, check the seat layout, log in, and book or cancel seats in a few clicks. The frontend handles the user experience, while the backend keeps auth, booking logic, and database state in sync.

## What The App Does

- Shows a landing page with featured movies pulled from the API.
- Lets users register and log in with email and password.
- Protects booking actions with JWT authentication.
- Loads movie-specific seat layouts from PostgreSQL.
- Books and unbooks seats with transactional server-side logic.
- Keeps the UI in sync with the database after every booking action.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router DOM 7
- Tailwind CSS 4
- Native fetch API for backend calls

### Backend

- Node.js
- Express 5
- PostgreSQL via `pg`
- JSON Web Tokens for auth
- bcrypt for password hashing
- helmet for security headers
- cors for cross-origin access
- express-validator for request validation
- express-rate-limit for basic abuse protection

### Database And Deployment

- PostgreSQL hosted on Render
- Backend deployed on Render
- Frontend deployed on Vercel
- Custom subdomain managed through Hostinger DNS

## Live Setup

- Production frontend: [https://bookyourseat.arghyalogs.in/](https://bookyourseat.arghyalogs.in/)
- Backend API: deployed separately on Render
- Database: Render PostgreSQL instance

The backend currently allows requests from localhost, the Vercel deployment, and the custom domain used for production.

## How The App Flows

### 1. Landing Page

The home page loads the movie list from the backend and uses that data to build the hero section, trending cards, and movie highlights. It gives users a fast visual entry point before they head into booking.

### 2. Register And Login

Users can create an account from the register page and then sign in through the login page. Passwords are hashed on the server before they touch the database, and a JWT is returned after successful login.

### 3. Auth State On The Frontend

After login, the token and username are stored in localStorage. The navbar reads that state to show login/register or logout actions, and protected booking routes redirect unauthenticated users back to login.

### 4. Browse Movies

The Movies page fetches the full movie list from the API, shows posters and ratings, and links each movie into the booking flow.

### 5. Booking Flow

The Booking page reads the selected movie from the URL, loads the seat map for that movie, and shows seat counts for total, available, and booked seats. Clicking an available seat books it. Clicking a booked seat unbooks it.

### 6. Server-Side Seat Safety

Seat changes happen inside PostgreSQL transactions. That matters because it prevents duplicate bookings and keeps the movie seat table and booking table aligned.

## Project Structure

```text
SeatBookingApp/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── booking.controller.js
│   │   └── movies.controller.js
│   ├── db/
│   │   ├── db.js
│   │   ├── init.js
│   │   └── migrate.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── migrations/
│   │   ├── 001_create_core_tables.sql
│   │   └── 002_seed_movies_and_seats.sql
│   └── routes/
│       ├── auth.routes.js
│       ├── booking.routes.js
│       └── movies.routes.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   ├── main.jsx
    │   ├── components/
    │   │   └── Navbar.jsx
    │   └── pages/
    │       ├── Landing.jsx
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── Movies.jsx
    │       └── Booking.jsx
```

## Frontend Breakdown

### `src/App.jsx`

- Defines the main routes.
- Protects the booking route with a simple token check.
- Sends unauthenticated users to login with a redirect target.

### `src/components/Navbar.jsx`

- Handles top-level navigation.
- Toggles between login/register and logout depending on auth state.
- Syncs auth state from localStorage.

### Pages

- `Landing.jsx`: homepage and movie showcase.
- `Login.jsx`: user sign-in and token storage.
- `Register.jsx`: account creation with password confirmation.
- `Movies.jsx`: catalog view for all movies.
- `Booking.jsx`: seat grid, booking, unbooking, and status display.

## Backend Breakdown

### `server.js`

- Boots the Express server.
- Applies CORS, JSON parsing, helmet, and rate limiting.
- Mounts auth, booking, and movie routes.
- Exposes a basic database health check at `/`.

### Controllers

- `auth.controller.js`: register and login logic.
- `movies.controller.js`: movie list, seat loading, booking, and unbooking.
- `booking.controller.js`: legacy/general seat booking flow used by the booking route.

### Middleware

- `auth.middleware.js`: verifies JWTs from the Authorization header.
- `validate.middleware.js`: returns validation errors from express-validator.
- `error.middleware.js`: centralized fallback error handler.

## API Routes

### Auth

- `GET /api/auth/test` - route smoke test.
- `POST /api/auth/register` - create a user.
- `POST /api/auth/login` - authenticate and return a JWT.

### Movies

- `GET /api/movies` - list all movies.
- `GET /api/movies/:movieId/seats` - get seats for one movie.
- `POST /api/movies/:movieId/seats/:seatId/book` - book a seat.
- `DELETE /api/movies/:movieId/seats/:seatId/book` - unbook a seat.

### Booking

- `GET /api/booking/protected` - sample authenticated route.
- `GET /api/booking/seats` - list all seats.
- `POST /api/booking/book/:id` - book a seat through the legacy booking flow.
- `DELETE /api/booking/delete/:id` - remove a booking and free the seat.

## Database Model

The migrations define a straightforward schema:

- `users`: stores name, email, hashed password, and timestamps.
- `movies`: stores title, rating, image URL, and timestamps.
- `movie_seats`: stores seat layout per movie and the booking flag.
- `movie_bookings`: stores which user booked which seat for which movie.
- `schema_migrations`: tracks applied SQL files.

The seed migration inserts the sample movie list and generates a fixed number of seats per movie. Seat count can be adjusted with `SEATS_PER_MOVIE`.

## Environment Variables

### Backend

- `PORT` - server port, defaults to `3000`.
- `DATABASE_URL` - production PostgreSQL connection string.
- `DB_USER` - local database user.
- `DB_HOST` - local database host.
- `DB_NAME` - local database name.
- `DB_PASSWORD` - local database password.
- `DB_PORT` - local database port.
- `JWT_SECRET` - secret used to sign login tokens.
- `CORS_ORIGIN` - optional comma-separated origin list.
- `SEATS_PER_MOVIE` - number of seats created per movie during seeding.

### Frontend

- `VITE_API_URL` - base URL for the backend API.

## Local Development

### Backend

```bash
cd backend
npm install
npm run migrate
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

By default, the frontend runs on Vite and talks to the backend through `VITE_API_URL`. If that variable is missing, some pages fall back to `http://localhost:3000`.

## Deployment Notes

### Render PostgreSQL

The database is hosted on Render PostgreSQL in production. That keeps the data persistent outside the app runtime and makes the backend connection string easy to manage through `DATABASE_URL`.

Typical Render-side setup:

- Create a PostgreSQL database on Render.
- Copy the connection string into the backend environment as `DATABASE_URL`.
- Keep `JWT_SECRET` and the rest of the backend env vars in Render too.

### Render Backend Deploy

The backend is built and deployed on Render. The production start path should run migrations first and then launch the server, which matches the available scripts in `backend/package.json`.

Recommended Render commands:

- Build command: `npm install`
- Start command: `npm run start:prod`

That start script runs migrations and then boots the Express server, so the API comes up with the database already prepared.

### Vercel Frontend Deploy

The frontend is deployed on Vercel as the public-facing app. Vercel handles the static build from Vite and serves the React client.

Recommended Vercel setup:

- Framework preset: Vite
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL` pointing to the Render backend

The frontend just needs the API base URL, so once that is set the site can talk to the backend cleanly from production.

### Hostinger Subdomain

The custom domain `bookyourseat.arghyalogs.in` is set up as a Hostinger-managed subdomain that points users to the live deployment. In practice, this is the branded entry point for the app.

Typical DNS approach:

- Point the subdomain to the Vercel-hosted frontend.
- Keep the backend on its Render URL.
- Make sure the backend CORS allowlist includes the production domain.

## Notes On The Current Implementation

- Seat booking is protected on the frontend and verified again on the backend.
- JWTs are stored in localStorage, so a refresh keeps the user signed in until the token expires.
- The booking UI is movie-aware, so each movie has its own seat state.
- The app is designed to be simple to extend if you want showtimes, booking history, or admin tools later.
