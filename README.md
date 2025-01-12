# Mahjong League 🀄

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Edge Runtime](https://img.shields.io/badge/Edge%20Runtime-compatible-success)](https://vercel.com/docs/functions/edge-functions)

A comprehensive web application for managing a Mahjong league, tracking player rankings, and recording game results. This application serves as a digital platform for Mahjong communities to maintain their competitive leagues, automating the complex process of rank progression and point calculations while providing transparency in game history and player statistics.

## 🌟 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technical Architecture](#-technical-architecture)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

The Mahjong League application is designed to solve several key challenges in managing competitive Mahjong leagues:

1. **Rank Management**: Automatically handles player progression through different ranks (新人 to 神室王) based on their performance, implementing a sophisticated point system that accounts for game results and current player ranks.

2. **Game Recording**: Provides a reliable system for recording game results, including support for both Hanchan (full games) and Tonpuusen (east-only games), with built-in validation and point calculation.

3. **Administrative Control**: Offers administrative tools for managing games and players, including the ability to edit or delete games while maintaining a complete audit trail of changes.

4. **Statistical Analysis**: Tracks and displays comprehensive statistics for each player, helping them understand their performance and progression over time.

## 🎮 Features

### Player Management
- Create and manage player profiles with unique nicknames
- Track player rankings and points through an automated system
- View detailed player statistics including win rates, average positions, and point trends
- Search players by nickname with real-time suggestions and autocomplete
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
- Edge-compatible authentication using NextAuth.js
- Public access to view games and player statistics
- Admin-only access for CUD operations (Create, Update, Delete)

## 🏆 Ranking System

The ranking system is designed to reflect player skill and progression through Japanese Mahjong ranks:

### Rank Progression
1. **新人** (Beginner) - Starting rank
2. **1級** (1 Kyu) - First promotion
3. **初段** (Shodan/1 Dan) - First dan rank
4. **二段** (2 Dan) - Second dan rank
5. **三段** (3 Dan) - Third dan rank
6. **四段** (4 Dan) - Fourth dan rank
7. **五段** (5 Dan) - Fifth dan rank
8. **六段** (6 Dan) - Sixth dan rank
9. **七段** (7 Dan) - Seventh dan rank
10. **八段** (8 Dan) - Eighth dan rank
11. **九段** (9 Dan) - Ninth dan rank
12. **十段** (10 Dan) - Tenth dan rank
13. **神室王** (Shinshitsuou/Divine Room King) - Ultimate rank

### Point System
- **Hanchan (Full Game)**
  - 1st Place: +60 points
  - 2nd Place: +30 points
  - 3rd Place: -30 points (varies by rank)
  - 4th Place: -60 points (varies by rank)

- **Tonpuusen (East-only Game)**
  - 1st Place: +40 points
  - 2nd Place: +20 points
  - 3rd Place: -20 points (varies by rank)
  - 4th Place: -40 points (varies by rank)

*Note: Point values vary based on player rank, with higher ranks having more severe penalties for lower positions.*

## 🛠️ Technical Architecture

### Runtime Architecture
The application uses a hybrid runtime approach:
- **Edge Runtime**: Used specifically for middleware operations
  - Authentication middleware
  - Request/response interception
  - Headers and cookies manipulation
- **Node.js Runtime**: Main application runtime
  - API Routes
  - Server Components
  - Data fetching and mutations
- **CDN**: Static assets and cached pages
  - Static file serving
  - Cached API responses
  - Static site generation outputs

### Tech Stack
- **Frontend**: 
  - Next.js 15 (Latest with enhanced performance and features)
  - React 19 (Latest with improved server components)
  - TypeScript 5
- **Styling**: 
  - TailwindCSS 3.4.1
  - Headless UI components
- **Database**: 
  - PostgreSQL with Prisma ORM
  - Connection pooling for scalability
- **Authentication**: 
  - NextAuth.js with GitHub OAuth
  - Middleware-based auth checks
- **State Management**: 
  - Zustand for client state
  - Server components for server state
- **Validation**: 
  - Zod for type-safe validations
- **Date Handling**: 
  - date-fns for consistent date operations

### Project Structure
```
src/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── games/        # Game management
│   │   └── players/      # Player management
│   ├── games/            # Game-related pages
│   ├── players/          # Player-related pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable components
│   ├── GameActions.tsx   # Game management actions
│   ├── GameEditModal.tsx # Game editing interface
│   ├── GameHistoryModal.tsx # Game history viewer
│   └── PlayerSearch.tsx  # Player search component
├── lib/                  # Utility functions
│   ├── ranking.ts        # Ranking calculations
│   └── index.ts         # Common utilities
├── types/                # TypeScript definitions
│   ├── game.ts          # Game-related types
│   └── player.ts        # Player-related types
└── middleware.ts         # Edge middleware
```

### Important Caveats & Gotchas

#### Runtime Considerations
1. **Middleware Limitations**: Only middleware runs in Edge Runtime - be mindful of Edge Runtime limitations
2. **API Routes**: Run in Node.js runtime with full Node.js capabilities
3. **Server Components**: Leverage Next.js 15's enhanced server component features

#### Authentication
1. **Admin Status**: Admin status is cached client-side and should be re-validated on sensitive operations
2. **Session Handling**: Edge functions require special session handling with NextAuth
3. **GitHub OAuth**: Callback URL must match exactly with GitHub OAuth settings

#### Game Management
1. **Point Calculations**: Always run point calculations server-side to prevent manipulation
2. **Game Edits**: Game edits trigger cascading point recalculations for all affected players
3. **Soft Deletes**: Games are soft-deleted to maintain audit trail and allow restoration

#### Player Management
1. **Rank Changes**: Rank changes should be calculated after all point calculations are complete
2. **Protection Rules**: Rank protection rules must be checked before any point deductions
3. **Nickname Uniqueness**: Player nicknames must be unique and are case-insensitive

#### Database
1. **Migrations**: Always backup before running migrations in production
2. **Transactions**: Use transactions for operations affecting multiple players
3. **Indexes**: Custom indexes needed for player search and game history queries

#### Performance
1. **API Routes**: Some operations might hit edge function execution limits
2. **Point Calculations**: Heavy calculations should be queued for background processing
3. **Caching**: Implement caching for frequently accessed data like player rankings

#### Development
1. **TypeScript**: Strict mode enabled - all types must be properly defined
2. **Testing**: Mock NextAuth session for admin-only feature tests
3. **Environment**: Local `.env` must include all required variables

### Database Configuration
```typescript
// prisma/schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Data Revalidation & Caching Strategy

The application implements a comprehensive data revalidation strategy to ensure data consistency across all pages:

#### Server Components
- All server components use `revalidate = 0` to ensure fresh data on every request
- This includes:
  - Player profile pages (`/players/[id]`)
  - Players list page (`/players`)
  - Individual game pages (`/games/[id]`)

#### API Routes
- API routes trigger revalidation of affected pages after data mutations
- Key revalidation points:
  - Game creation/update/deletion
  - Player rank changes
  - Point recalculations

#### Revalidation Paths
After game-related operations, the following paths are revalidated:
```typescript
revalidatePath('/');               // Home page
revalidatePath('/players');        // Players list
revalidatePath('/players/[id]');   // Individual player profiles
revalidatePath('/games');          // Games list
```

#### Client Components
- Client components fetch fresh data through API routes
- Implement optimistic updates where appropriate
- Use SWR or React Query for client-side caching (planned feature)

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- PostgreSQL 14.x or later
- GitHub account (for authentication)
- pnpm (recommended) or npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/mahjong-league.git
   cd mahjong-league
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
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

4. Set up the database
   ```bash
   pnpm db:setup
   ```

5. Start the development server
   ```bash
   pnpm dev
   ```

Visit `http://localhost:3000` to see the application running.

## 💻 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run database migrations
pnpm prisma:seed      # Seed database
pnpm db:setup         # Full database setup

# Testing
pnpm test         # Run all tests
pnpm test:unit    # Run unit tests
pnpm test:e2e     # Run end-to-end tests
```

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Follow React hooks best practices
- Implement proper error boundaries
- Write meaningful commit messages

## 📚 API Documentation

### Authentication
- `GET /api/auth/[...nextauth]` - NextAuth.js authentication endpoints
- `GET /api/users/:id` - Get user details and admin status

### Players
- `GET /api/players` - List all players
- `GET /api/players/:id` - Get player details
- `POST /api/players` - Create new player (admin only)
- `PUT /api/players/:id` - Update player (admin only)
- `GET /api/players/:id/games` - Get player's game history

### Games
- `GET /api/games` - List all games
- `GET /api/games/:id` - Get game details
- `POST /api/games` - Record new game (admin only)
- `PUT /api/games/:id` - Update game (admin only)
- `DELETE /api/games/:id` - Soft delete game (admin only)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your PR adheres to:
- Consistent code style
- Proper test coverage
- Clear commit messages
- Updated documentation

### Development Guidelines
1. Write clean, maintainable code
2. Follow TypeScript best practices
3. Add proper error handling
4. Include necessary tests
5. Update documentation as needed
6. Consider edge runtime compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the Mahjong community for their feedback and support
- Built with [Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/), and [Prisma](https://www.prisma.io/)

# Ranking System

## Overview
The game implements a Japanese mahjong ranking system with 21 ranks from Beginner (新人) to Rey Dios (神室王). Players progress through ranks by accumulating points from game results.

## Points vs Rating
- **Points**: Used for rank progression and determining when a player should move up or down in rank. Points are awarded based on game results and current rank.
- **Rating**: A separate ELO-like system that reflects player skill level (not used for rank progression).

## Complete Rank List (in ascending order)
1. 新人 (Beginner)
2. 9級 (9 Kyu)
3. 8級 (8 Kyu)
4. 7級 (7 Kyu)
5. 6級 (6 Kyu)
6. 5級 (5 Kyu)
7. 4級 (4 Kyu)
8. 3級 (3 Kyu)
9. 2級 (2 Kyu)
10. 1級 (1 Kyu)
11. 初段 (1 Dan)
12. 二段 (2 Dan)
13. 三段 (3 Dan)
14. 四段 (4 Dan)
15. 五段 (5 Dan)
16. 六段 (6 Dan)
17. 七段 (7 Dan)
18. 八段 (8 Dan)
19. 九段 (9 Dan)
20. 十段 (10 Dan)
21. 神室王 (Rey Dios)

## Rank Progression Details

### Points Required for Next Rank
Points needed to progress from current rank to next rank:
```
新人  →  9級:    50 points
9級   →  8級:    50 points
8級   →  7級:   100 points
7級   →  6級:   100 points
6級   →  5級:   100 points
5級   →  4級:   100 points
4級   →  3級:   100 points
3級   →  2級:   100 points
2級   →  1級:   150 points
1級   → 初段:   150 points
初段  → 二段:   200 points
二段  → 三段:   400 points
三段  → 四段:   400 points
四段  → 五段:   600 points
五段  → 六段:   600 points
六段  → 七段:   800 points
七段  → 八段:  1000 points
八段  → 九段:  1000 points
九段  → 十段:  1500 points
十段  → 神室王: 1500 points
神室王: No further progression possible
```

### Total Points Required (Cumulative)
Total points needed to reach each rank from the beginning:
```
9級:     50 points
8級:    100 points
7級:    200 points
6級:    300 points
5級:    400 points
4級:    500 points
3級:    600 points
2級:    700 points
1級:    850 points
初段:   1000 points
二段:   1200 points
三段:   1600 points
四段:   2000 points
五段:   2600 points
六段:   3200 points
七段:   4000 points
八段:   5000 points
九段:   6000 points
十段:   7500 points
神室王: 9000 points
```

### Rank Protection and Demotion
Demotion rules for each rank:
- Ranks 新人 through 1級: Cannot lose points from games
- 初段: Cannot be demoted
- 二段: Demotes if points fall below 1200
- 三段: Demotes if points fall below 1600
- 四段: Demotes if points fall below 2000
- 五段: Demotes if points fall below 2600
- 六段: Demotes if points fall below 3200
- 七段: Demotes if points fall below 4000
- 八段: Demotes if points fall below 5000
- 九段: Demotes if points fall below 6000
- 十段: Demotes if points fall below 7500
- 神室王: Cannot be demoted (special rank)

## Points Calculation
Points are awarded based on:
1. Game type (Hanchan or Tonpuusen)
2. Player's position (1st to 4th)
3. Current rank

### Point Awards by Game Type

#### Hanchan (Full Game)
- 1st place: +60 points
- 2nd place: +30 points
- 3rd place: 
  - 0 points (新人 through 三段)
  - -15 points (四段 through 六段)
  - -30 points (七段 and above)
- 4th place:
  - 0 points (新人 through 8級)
  - -30 points (7級 through 三段)
  - -45 points (四段 through 六段)
  - -60 points (七段 through 八段)
  - -75 points (九段 and above)

#### Tonpuusen (East-only Game)
- 1st place: +40 points
- 2nd place: +20 points
- 3rd place:
  - 0 points (新人 through 三段)
  - -10 points (四段 through 六段)
  - -20 points (七段 and above)
- 4th place:
  - 0 points (新人 through 8級)
  - -20 points (7級 through 三段)
  - -30 points (四段 through 六段)
  - -40 points (七段 through 八段)
  - -50 points (九段 and above)
