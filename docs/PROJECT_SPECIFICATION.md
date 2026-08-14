# 🚌 Bus Dorkar — Bangladesh Inter-District Bus Discovery, Timetable & Ticketing Platform

> **Complete Project Specification & Architecture Document**
> Version: 1.0 | Last Updated: August 2026

---

## 1. Product Vision

Bus Dorkar connects:

```
Passengers ↔ Bus Operators ↔ Drivers/Staff ↔ Bus Counters ↔ Platform Administrators
```

### Passenger Capabilities
- Search buses between two districts
- See available departure times
- Compare operators
- View route/stops
- Select seats
- Reserve a ticket
- Pay online or choose counter/payment options where supported
- Receive a digital ticket
- Track booking status
- Manage their profile
- View booking history
- Cancel according to operator policy
- Receive notifications
- Find nearby bus terminals/counters on a map

### Operator Capabilities
- Register their company
- Add buses
- Configure seats
- Create routes
- Create schedules
- Set fares
- Manage bookings
- Manage counters
- Manage staff
- View revenue
- Manage cancellations
- Monitor occupancy

### Admin Capabilities
- Full control of the entire ecosystem

---

## 2. Core Architecture Decision

**Build Bus Dorkar as a transportation management platform, not a simple bus-booking website.**

The core relationship:

```
Operator
   │
   ├── Bus
   │     └── Seat Layout
   │
   ├── Route
   │     ├── Origin
   │     ├── Destination
   │     └── Intermediate Stops
   │
   ├── Schedule
   │     ├── Departure
   │     ├── Arrival
   │     └── Fare
   │
   └── Trip
          ├── Seat Inventory
          ├── Bookings
          └── Passengers
```

### Critical Distinction: Route vs Trip

A **route** is:
```
Dhaka → Chattogram
```

A **trip** is:
```
Green Line
Dhaka → Chattogram
2026-08-20
10:30 PM
```

The trip owns the actual seat inventory.

---

## 3. Bangladesh-Specific Scope

### Supported Districts (Initial)
- Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, Mymensingh
- Cumilla, Cox's Bazar, Bogura, Jessore, Dinajpur, Pabna, Kushtia, Tangail
- Feni, Noakhali, Brahmanbaria, Narsingdi, Gazipur, Faridpur

### Geographic Hierarchy
```
Division
   ↓
District
   ↓
Upazila
   ↓
Terminal / Counter / Stop
```

---

## 4. Map-Based System

### Map Technology
- **Frontend**: MapLibre GL JS or Leaflet with React Leaflet
- **Tiles**: OpenStreetMap-based

### Map Features
- Terminal markers
- Counter markers
- Route polylines
- Origin/Destination markers
- Boarding point markers
- Distance calculation
- Estimated travel duration

---

## 5. User Roles (RBAC)

### PASSENGER
- Search, Book, Pay, Cancel, Review, Manage profile, View tickets
- Save favorite routes, Save passengers, Receive notifications

### BUS_OPERATOR
- Manage company, buses, routes, schedules, trips, seats, fares
- Manage counters, staff, View bookings, View revenue

### COUNTER_STAFF
- Search trips, Create bookings, Assign seats, Cancel eligible bookings
- Print tickets, Check passengers
- **Cannot**: Change operator settings, Delete buses, Modify company info

### DRIVER
- View assigned trips, passengers, trip route
- Start trip, Update trip status

### ADMIN
- Full control

---

## 6. Authentication

### Methods
- Email + Password
- Phone number + OTP
- Google OAuth

### Bangladesh Phone Format
```
+880 17XXXXXXXX
```

### Security
- Argon2 password hashing
- Secure cookies
- CSRF protection

---

## 7. Passenger Profile Structure

```
My Profile
├── Personal Information
├── Phone
├── Email
├── Profile Photo
├── Emergency Contact
├── Saved Passengers
├── Saved Routes
├── Favorite Operators
├── Booking History
├── Upcoming Trips
├── Cancelled Trips
├── Notifications
├── Payment History
└── Security
```

---

## 8. Search System

### Basic Search
- From, To, Travel Date, Passengers

### Advanced Filters
- Departure/Arrival Time, Bus Type, Operator, Price Range
- Seat Type, AC/Non-AC, Sleeper, Rating
- Boarding Point, Dropping Point

### Sorting Options
- Cheapest, Earliest, Fastest, Highest rated

---

## 9. Search Result Card

```
┌─────────────────────────────────────────────┐
│ Green Line                                  │
│ AC • Executive                              │
│                                             │
│ Dhaka             →             Cox's Bazar │
│ 10:30 PM                       07:00 AM     │
│                                             │
│ Travel: 8h 30m                              │
│                                             │
│ ★ 4.6        ৳1,800                         │
│                                             │
│ 18 seats available                          │
│                                             │
│ [View Seats]        [Book Now]              │
└─────────────────────────────────────────────┘
```

---

## 10. Bus Details Page

### Information Displayed
- Operator: name, logo, rating, reviews
- Bus: model, registration, type, facilities (AC, WiFi, Charging, etc.)
- Trip: departure, arrival, duration, stops, boarding/dropping points
- Seat map (interactive)

---

## 11. Professional Seat Selection

```
                 FRONT
        ┌─────────────────────┐
        │       DRIVER        │
        ├─────┬───────┬───────┤
        │ A1  │       │ B1    │
        │ A2  │       │ B2    │
        │ A3  │       │ B3    │
        │ A4  │       │ B4    │
        │ A5  │       │ B5    │
        └─────┴───────┴───────┘
                 BACK
```

### Seat States
- Available, Selected, Reserved, Booked, Blocked

### Architecture
```
Trip → TripSeat → Seat
```

---

## 12. Booking Workflow

```
Search → Select Trip → Select Boarding Point → Select Dropping Point
→ Select Seat → Passenger Information → Price Calculation
→ Temporary Seat Lock → Payment → Booking Confirmation
→ Ticket Generation → Notification
```

---

## 13. Seat Locking

### Challenge
When User A and User B both select seat A1, only one can obtain it.

### Implementation
```
A1
status = LOCKED
lockedBy = userId
lockedUntil = 2026-08-14 23:15
```

After expiration: `LOCKED → AVAILABLE`

### Technology
- MVP: PostgreSQL transactions + row-level locking
- Production: Redis for high-concurrency deployments

---

## 14. Booking Status State Machine

```
PENDING → PAYMENT_PENDING → CONFIRMED → CHECKED_IN → COMPLETED

Alternative branches:
PENDING → CANCELLED
PAYMENT_PENDING → EXPIRED
CONFIRMED → CANCELLED
CONFIRMED → NO_SHOW
```

---

## 15. Digital Ticket

### Contains
- Booking ID (e.g., BD-20260814-8X92KD)
- Passenger name, Operator, Route, Travel Date
- Departure time, Seat number
- Boarding/Dropping points, Fare, Status
- **QR Code** (signed ticket identifier)

### QR Verification Flow
```
QR → Booking ID → Backend verification → Valid? → Passenger details → Check-in
```

---

## 16. Payment System

### Bangladesh Payment Providers
- bKash, Nagad, SSLCommerz, Card

### Architecture
```
PaymentService → BkashProvider / NagadProvider / CardProvider
```

### Payment State Machine
```
INITIATED → PROCESSING → SUCCESS
PROCESSING → FAILED / CANCELLED / EXPIRED
```

> **Always verify payment server-side. Never trust browser-side payment status.**

---

## 17. Operator Dashboard

### Metrics
- Today's Trips, Bookings, Revenue, Occupancy, Cancellations
- Revenue charts (daily/weekly/monthly)

### Management Features
- Company Profile, Buses, Drivers, Staff, Counters
- Routes, Schedules, Trips, Fares, Seat Layouts
- Bookings, Refunds, Reviews, Reports

---

## 18. Bus Management

### Fields
- Bus ID, Registration Number, Bus Type, Manufacturer, Model, Year
- AC, Sleeper, Total Seats, Facilities

### Status Values
- ACTIVE, MAINTENANCE, INACTIVE, RETIRED

---

## 19. Route Management

### Route Structure
```
Dhaka → Tangail → Sirajganj → Bogra → Rangpur
```

### Stop Data
- sequence, district, latitude, longitude
- arrival offset, departure offset
- boarding allowed, dropping allowed

---

## 20. Segment-Based Seat Inventory (V2)

```
Seat A1:
Dhaka → Tangail       AVAILABLE
Tangail → Bogura      BOOKED
Bogura → Rangpur      AVAILABLE
```

---

## 21. Timetable System

### Search by Time Slots
- Morning, Afternoon, Evening, Night

### Schedule Types
- Daily, Weekly, Specific Days, Seasonal, Temporary

### Trip Generation
Schedules automatically generate trips (don't create manually).

---

## 22. Counter Management

### Fields
- Name, Address, Latitude, Longitude, Phone
- Opening Hours, Manager, Status

### Map Discovery
Users can find nearby counters with distance, hours, phone, directions.

---

## 23. Reviews

### Rating Categories
- Overall, Cleanliness, Comfort, Staff behavior, Punctuality

> Only `booking.status = COMPLETED` can submit reviews.

---

## 24. Notifications

### Channels
- In-app, Email, SMS

### Events
- Booking confirmed, Payment successful, Trip reminder
- Trip changed/cancelled, Seat changed, Refund processed

---

## 25. Admin Dashboard

### Management
- Users, Operators, Buses, Routes, Trips, Bookings
- Payments, Refunds, Reviews, Reports, Complaints, System Logs

### Operator Verification Flow
```
PENDING → UNDER_REVIEW → APPROVED / REJECTED / SUSPENDED
```

---

## 26. Complaint System

### Categories
- Late Departure, Bus Quality, Staff Behavior
- Seat Problem, Payment Problem, Cancellation, Other

### Status
- OPEN → IN_PROGRESS → RESOLVED → CLOSED

---

## 27. Refund Management

### Configurable Cancellation Policy (per operator)
| Time Before Departure | Refund |
|----------------------|--------|
| > 48 hours | 90% |
| 24–48 hours | 70% |
| 6–24 hours | 40% |
| < 6 hours | No refund |

---

## 28. Database Architecture

### Core Models (Prisma)
```
User, Role, PassengerProfile, Operator, OperatorStaff, Driver
Bus, Seat, Route, RouteStop, Schedule, Trip, TripStop, TripSeat
Counter, Booking, BookingPassenger, BookingSeat, Payment, Ticket
Review, Notification, CancellationPolicy, Refund, Complaint, AuditLog
```

### Key Relationships
```
Operator 1 ───── N Bus
Operator 1 ───── N Route
Route 1 ───── N RouteStop
Route 1 ───── N Schedule
Schedule 1 ───── N Trip
Trip 1 ───── N TripSeat
Trip 1 ───── N Booking
Booking 1 ───── N BookingSeat
Booking 1 ───── 1 Payment
Booking 1 ───── 1 Ticket
```

---

## 29. PostgreSQL Indexing Strategy

```sql
Trip(date)
Trip(routeId, date)
Booking(userId)
Booking(tripId)
TripSeat(tripId, seatId)
RouteStop(routeId, sequence)
Payment(bookingId)
Notification(userId, createdAt)
```

---

## 30. Transaction Architecture

```sql
BEGIN TRANSACTION
  1. Lock requested seats
  2. Verify availability
  3. Create booking
  4. Create booking seats
  5. Update trip inventory
  6. Create payment record
COMMIT
-- If anything fails: ROLLBACK
```

---

## 31. Technology Stack

### Core
- Next.js (App Router), TypeScript, PostgreSQL, Prisma

### UI
- Tailwind CSS, shadcn/ui

### Additional Libraries
- Zod, React Hook Form, TanStack Query
- Auth.js, MapLibre, Redis
- Resend (email), S3-compatible storage

### Deployment
- Vercel, Neon/Supabase PostgreSQL
- Upstash Redis, Cloudflare R2/S3

---

## 32. Next.js App Router Architecture

```
app/
├── (public)/          # Homepage, search, routes, operators, timetable
├── (auth)/            # Login, register, forgot-password
├── dashboard/         # Passenger dashboard
├── operator/          # Operator portal
├── counter/           # Counter staff portal
├── driver/            # Driver portal
├── admin/             # Admin panel
└── api/               # API routes
```

---

## 33. Service Layer Architecture

```
API Route → Controller → Service → Repository → Prisma → PostgreSQL
```

---

## 34. API Error Codes

```
BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT
VALIDATION_ERROR, PAYMENT_FAILED, SEAT_UNAVAILABLE
BOOKING_EXPIRED, INTERNAL_SERVER_ERROR
```

---

## 35. Security Checklist

- [x] RBAC
- [x] Input validation (Zod)
- [x] Rate limiting
- [x] CSRF protection
- [x] Secure cookies
- [x] Password hashing (Argon2)
- [x] SQL injection protection (Prisma)
- [x] XSS protection
- [x] API authorization
- [x] Audit logging
- [x] Payment verification
- [x] File upload validation

---

## 36. Testing Strategy

### Unit Tests (Vitest)
- Fare calculation, seat availability, cancellation logic, date validation

### Integration Tests
- Booking API, payment webhook, seat locking, authentication

### E2E Tests (Playwright)
- Login → Search → Select → Book → Pay → Ticket

### Load Tests (k6)
- 1000 simultaneous searches
- 100 users competing for same seat

---

## 37. Bangladesh Localization

### Languages
- English, বাংলা

### Formatting
- Currency: ৳ (BDT)
- Date: 20 August 2026
- Phone: +880

---

## 38. SEO Strategy

### Indexable Routes
```
/bus/dhaka-to-chattogram
/bus/dhaka-to-sylhet
/bus/dhaka-to-coxs-bazar
```

### Schema Markup
- Organization, LocalBusiness, BreadcrumbList, FAQPage

---

## 39. Advanced Features (V2+)

### Smart Bus Recommendation
```
Score = w1×Price + w2×Time + w3×Rating + w4×Punctuality + w5×Comfort + w6×Availability
```

### Trip Reliability Tracking
```
Punctuality = on-time trips / total completed trips
```

### AI Search Layer
```
"আমি আগামী শুক্রবার রাতে ঢাকা থেকে কক্সবাজার যেতে চাই। কম দামের AC বাস দেখাও।"
→ Intent Extraction → Search Engine → Results
```

---

## 40. Development Phases

| Phase | Focus |
|-------|-------|
| 1 | Foundation: Next.js + Prisma + DB |
| 2 | Authentication + RBAC |
| 3 | Bangladesh Geographic Data |
| 4 | Operator Management |
| 5 | Bus Management |
| 6 | Route Engine |
| 7 | Timetable + Schedules |
| 8 | Search Engine |
| 9 | Seat Inventory |
| 10 | Booking |
| 11 | Payment |
| 12 | Digital Ticket + QR |
| 13 | Notifications |
| 14 | Reviews |
| 15 | Admin Dashboard |
| 16 | Analytics |
| 17 | Production Hardening |

---

## 41. 10-Week Roadmap

| Week | Target |
|------|--------|
| 1 | Requirements + architecture + ERD + Prisma |
| 2 | Authentication + RBAC + profiles |
| 3 | Operators + buses + seats |
| 4 | Bangladesh geography + routes + map |
| 5 | Schedules + trip generation + timetable |
| 6 | Search + filters + seat selection |
| 7 | Booking + transactions + cancellation |
| 8 | Payment + QR ticket + notifications |
| 9 | Operator/Admin dashboards + analytics |
| 10 | Testing + security + deployment + docs |

---

## 42. Priority Tiers

### Tier 1 — Must Have
1. Authentication + RBAC
2. Bangladesh district/terminal database
3. Bus/operator management
4. Route + timetable system
5. Bus search
6. Seat selection
7. Transaction-safe booking
8. Digital ticket + QR
9. Operator dashboard
10. Admin dashboard

### Tier 2 — Should Have
- Map, Reviews, Notifications, Payment, Cancellation/Refund, Analytics

### Tier 3 — Nice to Have
- Redis seat locks, SMS, Recommendation engine
- Segment-based inventory, Demand analytics, Dynamic pricing

---

## 43. Demo Accounts

```
admin@busdorkar.demo
operator@busdorkar.demo
staff@busdorkar.demo
driver@busdorkar.demo
user@busdorkar.demo
```

---

## 44. Portfolio CV Statement

> Developed **Bus Dorkar**, a Bangladesh-focused inter-district transportation management and ticketing platform using Next.js, TypeScript, PostgreSQL, Prisma and shadcn/ui, implementing RBAC, geospatial route discovery, schedule-driven trip generation, transactional seat reservation, digital QR ticketing, payment abstraction, operator management, and analytics.

---

## 45. Overall System Architecture

```
                         BUS DORKAR
                             │
             ┌───────────────┴───────────────┐
             │                               │
          CLIENT                         OPERATORS
             │                               │
       Next.js App                      Operator Portal
             │                               │
             └───────────────┬───────────────┘
                             │
                       Next.js Backend
                             │
                  ┌──────────┼──────────┐
                  │          │          │
              Auth/RBAC   Services    APIs
                  │          │          │
                  └──────────┼──────────┘
                             │
                         Prisma ORM
                             │
                       PostgreSQL
                             │
             ┌───────────────┼───────────────┐
             │               │               │
           Redis          Storage         Payments
```

---

> **Key Principle**: Build Bus Dorkar as a transportation platform, not a bus-booking website.
>
> Focus engineering effort on:
> 1. Trip/route/schedule modeling
> 2. Concurrency-safe seat reservation
> 3. Operator/admin management
