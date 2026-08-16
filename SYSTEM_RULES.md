# Bus Dorkar — Core System Engineering & Architecture Principles

This document defines the mandatory engineering standards, performance constraints, and architectural guidelines for building and maintaining the **Bus Dorkar** platform.

---

## 🏛️ Core Engineering Principles

### 1. Enterprise Scale & High Concurrency
- **High-Volume Capacity**: Always design and code with the mindset that this is an **industry-level software system serving millions of daily active users** across Bangladesh.
- **Fault Tolerance**: Ensure all database queries, API endpoints, and authentication handlers contain fallback mechanisms, graceful error handling, and zero single points of failure.

### 2. Space Complexity & Bandwidth Optimization (Low MB / Low Data Consumption)
- **Minimal Data Footprint**: Strictly optimize response payload sizes so the application consumes the **lowest possible internet data (MBs)** for users on 2G/3G/4G mobile networks across Bangladesh.
- **Payload Sanitization**: Strip all unnecessary database fields, sensitive attributes, and unused relations from API responses ($O(1)$ space complexity payloads, typical response size < 300 bytes).
- **Asset Compression**: Use Brotli/Gzip response compression, Next.js WebP/AVIF image formats, and minimal bundle chunking to keep client JavaScript downloads ultra-lightweight.

### 3. Lowest Time Complexity & Rapid Rendering ($O(1)$ Performance)
- **Ultra-Fast Initial Render**: Ensure initial page load and component hydration happen instantly with zero blocking state delays.
- **$O(1)$ Database & Auth Lookups**: Utilize indexed database fields (`@@index([phone])`, `@@index([email])`) and constant-time password hashing bounds (72-character maximum ceiling) to guarantee rapid response times.
- **No Unnecessary Network Roundtrips**: Use synchronous local state hydration for cached sessions alongside asynchronous background verification.

### 4. Professional & Careful Execution Standards
- **Zero Symptom Swallowing**: Thoroughly diagnose root causes and test all edge cases (XSS, CSRF, ReDoS, SQLi, DoS password length limits).
### 5. Simplistic & Effective Norwegian UI Design Principles
- **Minimalist & Functional Aesthetics**: Always keep design simplistic, crisp, and highly effective.
- **Norwegian Transport Benchmarks**: Draw UI/UX inspiration from Norwegian platforms like **finn.no**, **Skyss**, and **Hudd / Vy**.
- **High Outdoor Legibility**: Utilize clean white backgrounds, high-contrast typography, clear hierarchy, and purpose-driven micro-interactions.

---

*Last Updated: August 2026 — Bus Dorkar Engineering Team*
