# Smilo Mobile Ingestion Service

A lightweight **NestJS-based mobile gateway** for the Smilo ACS platform.
This service acts as a **secure passthrough layer** between the offline-first React Native mobile app and the legacy PHP backend.

---

## Purpose

This service is **not a core backend**.

Its responsibilities are strictly limited to:

* Acting as a **security boundary** for mobile clients
* Forwarding requests to existing PHP APIs
* Enforcing stable API contracts for the mobile app
* Handling authentication headers safely
* Providing observability, validation, and error normalization

---

## Architecture Role

```
React Native (Offline-first)
        │
        ▼
NestJS Mobile Ingestion Service
        │
        ▼
Existing PHP APIs (Scoring, Patients, Uploads)
```

---

## Features

* Token passthrough (`Authorization → user-access-token`)
* Secure image upload proxy (multipart/form-data)
* Screening submission forwarding
* Patients / history API forwarding
* Forgot-password proxy with cookie + CSRF compatibility
* Strong request validation (DTOs, no `any`)
* Environment validation at boot
* Production-grade error handling

---

## Tech Stack

* Node.js 18+
* NestJS 11
* TypeScript (ES2023, strict)
* Axios
* Zod (environment validation)
* class-validator (DTO validation)

---

## Project Structure

```
src/
├── config/                # Environment validation
├── modules/
│   ├── auth/              # Login & forgot password proxy
│   ├── patients/          # History / patients list
│   ├── submissions/       # Screening submission
│   ├── uploadImage/       # Image upload passthrough
├── app.module.ts
├── main.ts
```

---

## Environment Variables

Create a `.env` file:

```env
PORT=3000
PHP_BASE_URL=xxxxxxxxxxxxxxxx
PHP_APP_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxx
```

### Why `PHP_BASE_URL` is the host root

Keep the base URL **without** `/api/app/v2`.

* Backend route changes require **only env updates**
* Prevents hardcoding legacy paths in service code
* Avoids refactors when PHP routes change

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally (watch mode)

```bash
npm run start:dev
```

### Build & run production

```bash
npm run build
npm run start:prod
```
---

## Security Model

### Mobile sends

```
Authorization: Bearer <token>
```

### Service forwards

```
user-access-token
app-access-token
region
```

Header casing and naming are preserved for **legacy PHP compatibility**.

---

## Testing

```bash
npm run test
npm run test:e2e
```

---

## Design Principles

* Gateway, not backend
* Stateless by design
* Mobile owns data integrity
* Fail fast on misconfiguration
* Explicit contracts > implicit behavior
* No `any` in production code

---

