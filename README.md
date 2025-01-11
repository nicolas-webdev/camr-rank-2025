# Mahjong League

A comprehensive web application for managing a Mahjong league, tracking player rankings, and recording game results. This application serves as a digital platform for Mahjong communities to maintain their competitive leagues, automating the complex process of rank progression and point calculations while providing transparency in game history and player statistics.

## Overview

The Mahjong League application is designed to solve several key challenges in managing competitive Mahjong leagues:

1. **Rank Management**: Automatically handles player progression through different ranks based on their performance, implementing a sophisticated point system that accounts for game results and current player ranks.

2. **Game Recording**: Provides a reliable system for recording game results, including support for both Hanchan (full games) and Tonpuusen (east-only games), with built-in validation and point calculation.

3. **Administrative Control**: Offers administrative tools for managing games and players, including the ability to edit or delete games while maintaining a complete audit trail of changes.

4. **Statistical Analysis**: Tracks and displays comprehensive statistics for each player, helping them understand their performance and progression over time.

## Features

### Player Management
- Create and manage player profiles with unique nicknames
- Track player rankings and points through an automated system
- View detailed player statistics including win rates, average positions, and point trends
- Search players by nickname with real-time suggestions
- Automatic rank progression/demotion system with protection mechanisms

### Game Management
- Record game results for both Hanchan and Tonpuusen formats
- Edit game details with full audit trail (admin only)
- Soft delete games with point recalculation (admin only)
- Restore deleted games with point readjustment (admin only)
- View complete game history with change tracking
- Automatic point calculation based on position and current rank

### Authentication & Authorization
- Secure GitHub OAuth integration for user management
- Role-based access control distinguishing between admins and regular users
- Protected routes and API endpoints with proper authorization checks
- Secure session management with NextAuth.js

### Ranking System
The ranking system is designed to reflect player skill and progression:

- Multiple rank levels with increasing point requirements:
  - Each rank requires more points to achieve and maintain
- Automatic rank progression when point thresholds are met
- Rank protection system to prevent immediate demotion
- Position-based point calculation that scales with rank
- Different point scales for Hanchan and Tonpuusen games to reflect game length

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── games/        # Game management endpoints
│   │   ├── players/      # Player management endpoints
│   │   └── users/        # User management endpoints
│   ├── games/            # Game-related pages
│   ├── players/          # Player-related pages
│   ├── standings/        # League standings page
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── ui/              # UI components
│   └── ...              # Other components
├── lib/                 # Utility functions and shared code
│   ├── db.ts           # Database client
│   ├── ranking.ts      # Ranking system logic
│   └── ...             # Other utilities
├── store/              # State management
│   ├── gameStore.ts    # Game-related state
│   ├── playerStore.ts  # Player-related state
│   └── statsStore.ts   # Statistics state
├── types/              # TypeScript type definitions
└── services/          # External service integrations

prisma/                # Prisma ORM
├── migrations/       # Database migrations
├── schema.prisma    # Database schema
└── seed.ts          # Seed data
```

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - Handle authentication
- `GET /api/auth/session` - Get current session

### Players
- `GET /api/players` - List all players
- `POST /api/players` - Create new player (admin only)
- `GET /api/players/[id]` - Get player details
- `PUT /api/players/[id]` - Update player (admin only)
- `DELETE /api/players/[id]` - Delete player (admin only)
- `GET /api/players/[id]/games` - Get player's games

### Games
- `GET /api/games` - List all games
- `POST /api/games` - Create new game
- `GET /api/games/[id]` - Get game details
- `PUT /api/games/[id]` - Update game (admin only)
- `DELETE /api/games/[id]` - Delete game (admin only)
- `POST /api/games/[id]/restore` - Restore deleted game (admin only)
- `GET /api/games/[id]/history` - Get game history (admin only)

### Users
- `GET /api/users/[id]` - Get user details

## Database Schema

### User
- id: string (cuid)
- name: string?
- email: string?
- emailVerified: DateTime?
- image: string?
- isAdmin: boolean
- accounts: Account[]
- sessions: Session[]
- player: Player?

### Player
- id: string (cuid)
- userId: string?
- nickname: string
- rating: int
- points: int
- rank: string
- createdAt: DateTime
- updatedAt: DateTime
- games: Game[]

### Game
- id: string (cuid)
- date: DateTime
- isHanchan: boolean
- eastPlayerId: string
- eastScore: int
- southPlayerId: string
- southScore: int
- westPlayerId: string
- westScore: int
- northPlayerId: string
- northScore: int
- createdAt: DateTime
- createdById: string
- updatedAt: DateTime
- updatedById: string?
- deletedAt: DateTime?
- deletedById: string?
- isDeleted: boolean
- previousVersionId: string?

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mahjong_league"

# Authentication
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Set up the database:
   ```bash
   npm run db:setup
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database
- `npm run db:setup` - Set up database (generate, migrate, seed)

## Technologies Used

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Shadcn UI
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js
- TailwindCSS
- Zustand
- Zod
- HeadlessUI

## AI Development Prompt

To recreate this application, follow this structured approach:

1. **Initial Setup**
```
Create a Next.js application with TypeScript and the following key dependencies:
- Prisma for database management
- NextAuth.js for authentication
- TailwindCSS for styling
- Zustand for state management
- Zod for validation
```

2. **Database Design**
```
Implement a PostgreSQL database with these core models:
- User: Authentication and admin status
- Player: Game statistics and ranking information
- Game: Match results with audit trails
Ensure proper relations and constraints between models.
```

3. **Authentication System**
```
Set up NextAuth.js with GitHub provider:
- Configure OAuth credentials
- Implement protected routes
- Add admin role functionality
- Create middleware for route protection
```

4. **Core Features Implementation**
```
Build the following key features in order:
1. Player Management:
   - CRUD operations for players
   - Ranking system implementation
   - Statistics calculation

2. Game Recording:
   - Game creation form with validation
   - Point calculation system
   - Position-based scoring

3. Administrative Features:
   - Game editing with version history
   - Soft delete functionality
   - Audit trail system
```

5. **Ranking System Logic**
```
Implement the ranking system with these components:
1. Define rank levels with point thresholds
2. Create point calculation formulas:
   - Base points per position
   - Rank multipliers
   - Game type adjustments
3. Add rank progression/demotion logic
4. Implement protection mechanisms
```

6. **Frontend Development**
```
Create React components following this structure:
1. Layout components:
   - Navigation
   - Authentication UI
   - Error boundaries

2. Feature components:
   - Player profile displays
   - Game recording forms
   - Ranking displays
   - Statistics views

3. Administrative interfaces:
   - Game management
   - Player management
   - Audit trails
```

7. **State Management**
```
Implement Zustand stores for:
1. Player state:
   - Current players
   - Rankings
   - Statistics

2. Game state:
   - Recent games
   - Game history
   - Edit/delete status

3. Authentication state:
   - User session
   - Admin status
```

8. **API Development**
```
Create API endpoints following REST principles:
1. Player endpoints:
   - CRUD operations
   - Statistics calculation
   - Game history

2. Game endpoints:
   - Creation/modification
   - Point calculation
   - History tracking

3. Administrative endpoints:
   - Audit trails
   - User management
```

9. **Testing and Validation**
```
Implement comprehensive testing:
1. Unit tests for:
   - Point calculation
   - Rank progression
   - Game validation

2. Integration tests for:
   - API endpoints
   - Authentication flow
   - Database operations

3. E2E tests for:
   - Game recording flow
   - Player management
   - Administrative actions
```

10. **Deployment Considerations**
```
Prepare for deployment with:
1. Environment configuration
2. Database migration setup
3. Seed data preparation
4. Production optimizations
5. Error logging and monitoring
```

This application requires careful attention to:
- Data consistency in game records
- Accurate point calculations
- Proper audit trailing
- Secure administrative access
- Efficient state management
- Responsive user interface

The most challenging aspects are:
1. Maintaining data integrity during game modifications
2. Ensuring accurate point calculations across different ranks
3. Managing the complexity of the ranking system
4. Handling concurrent game recordings
5. Maintaining a complete audit trail
