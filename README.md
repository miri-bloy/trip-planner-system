# Trip Planner System - Angular Project

A comprehensive tour and trip planning system built as a final project for the Angular course (2026). The application allows users to browse, filter, and register for trips, while providing an authorized Admin interface to manage the available trips via a simulated REST API (JSON Server).

---

## 📂 Project Structure

The project is structured modularly within the `client` directory, separating pages, reusable components, and core services:

* `src/app/pages/` - Contains the main routed application screens (`all-trips`, `home`, `login`, `my-trips`, `register`, `trip-details`).
* `src/app/components/` - Houses reusable sub-components used across different pages (`trip-card` for single trip display, `trip-filters` for search control, `trip-form-modal` for adding/editing trips, and `welcome` for the dashboard greetings).
* `src/app/services/` - Contains the logic and HTTP communication services (`auth.service.ts`, `booking.service.ts`, `trips.service.ts`).
* `src/app/app.routes.ts` - Defines the client-side routing paths for navigation.

---

## ⚙️ Services & Architecture

The application implements a decoupled architecture where business logic and REST API interactions are isolated from the presentation layer using Angular Services.

### 1. AuthService
* **Path:** `src/app/services/auth.service.ts`
* **Responsibility:** Manages user session state, handles the login validation, and handles user registration.
* **Core Functions:**
  * `login(credentials)` - Validates user credentials against the `/users` endpoint using `name` and `password`.
  * `register(newUser)` - Verifies username uniqueness and performs a `POST` request to register a new user.
  * `logout()` - Resets the current authenticated user state and clears the session.

### 2. TripsService
* **Path:** `src/app/services/trips.service.ts`
* **Responsibility:** Manages all trip entities and provides full CRUD capabilities for authorized Admin profiles.
* **Core Functions:**
  * `getTrips()` - Fetches the collection of available trips (`GET /trips`).
  * `getTripById(id)` - Fetches detailed information for a specific trip (`GET /trips/:id`).
  * `createTrip(trip)` - Adds a new trip record (`POST /trips`) - Admin access only.
  * `updateTrip(id, trip)` - Modifies an existing trip (`PUT /trips/:id`).
  * `deleteTrip(id)` - Removes a trip from the database (`DELETE /trips/:id`).

### 3. BookingService
* **Path:** `src/app/services/booking.service.ts`
* **Responsibility:** Handles user trip registrations, reservations tracking, and booking cancellations.
* **Core Functions:**
  * `getBookings()` - Fetches all registration data from the server.
  * `createBooking(booking)` - Registers a user to a specific trip (`POST /bookings`).
  * `cancelBooking(bookingId)` - Deletes an existing registration record.

---

## 🔄 Application Flows

### 1. Login & Register Flow
* **Authentication:** The `login` page manages a reactive form capturing user inputs. On `onSubmit()`, it triggers the `AuthService.login()`, checking the credentials against the mock backend. Upon matching, the user profile is stored reactively, and the app routes to `/home`. Invalid entries show an appropriate error message.
* **Registration:** The `register` page handles account creation. It verifies the username availability and posts the validated entity to the backend database before redirecting to the home screen.

### 2. Booking & Validation Flow
* **Duplicate Prevention:** When a user navigates to a trip details view, the system calls `BookingService.getBookings()` to verify existing registrations. If the user is already registered for that tour, the registration button is automatically disabled, displaying a restriction notice.
* **Booking Creation:** Clicking the active registration button calls `createBooking()`, updating the backend with the traveler count and specific user details.
* **Cancellation:** In the `my-trips` view, users can view their current bookings. Triggering "Cancel Booking" dispatches a deletion request to the database, instantly refreshing the template data.

---

## 📊 State Management

The application state is handled reactively using services as a Single Source of Truth via RxJS `BehaviorSubject` and `Observables`:

* The active user session is exposed inside `AuthService` via a `BehaviorSubject`. Views like `home` (to dynamically render user details) and `all-trips` (to evaluate Admin permissions) subscribe to this stream to dynamically update the view according to changes.
* Data arrays for trips and bookings are managed within their respective services to prevent repetitive, redundant API calls and keep views synchronized.

---

## 🛠 Filtering & Sorting

The `all-trips` page incorporates the `trip-filters` sub-component to offer dynamic data mutations over the displayed trip list:

* **Filtering:** Implements real-time filtering through user inputs based on destination, travel date, and maximum price boundaries via `filterTrips()`.
* **Sorting:** Offers ordering options allowing sorting by price and date criteria in ascending or descending order via `sortTrips()`.

---

## 🚀 Installation & Setup

Follow these steps to configure and run the project locally:

1. **Clone the repository:**
   git clone <your-repository-url>
   cd TRIP-PLANNER-SYSTEM/client

2. **Install project dependencies:**
   npm install

3. **Start the Mock Backend (JSON Server):**
   Ensure json-server is available on your local system, then launch the database observer:
   json-server --watch db.json

4. **Launch the Angular Application:**
   In a separate terminal workspace, spin up the local development server:
   ng serve
   
   Open your browser and navigate to: http://localhost:4200
