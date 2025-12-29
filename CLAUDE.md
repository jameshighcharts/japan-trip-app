# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a fullstack notes application built with Next.js 16 (App Router), MongoDB, and JWT authentication.

### Tech Stack
- **Framework**: Next.js 16 with React 19
- **Database**: MongoDB (cloud-hosted via Atlas)
- **Auth**: JWT tokens stored in HttpOnly cookies, bcrypt password hashing
- **Styling**: Tailwind CSS 4

### Key Files

**Auth System** (`src/lib/auth.ts`):
- `hashPassword()` / `verifyPassword()` - bcrypt operations
- `createToken()` / `verifyToken()` - JWT operations
- JWT payload contains `{ userId }`, expires in 7 days

**Database** (`src/lib/mongodb.ts`):
- Singleton MongoDB client with connection caching
- Database: `notesapp`, Collections: `users`, `notes`

**Middleware** (`middleware.ts`):
- Protects all routes except `/login` and `/signup`
- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from auth pages

### API Routes

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/auth/signup` | POST | No | Create user, set cookie |
| `/api/auth/login` | POST | No | Verify credentials, set cookie |
| `/api/auth/logout` | POST | No | Clear cookie |
| `/api/notes` | GET | Yes | Fetch user's notes |
| `/api/notes` | POST | Yes | Create note with userId |

### Data Models

**User**: `{ _id, email, passwordHash, createdAt }`

**Note**: `{ _id, text, userId, createdAt }`

### Environment Variables

Required in `.env.local`:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<random-string-32-chars>
```
