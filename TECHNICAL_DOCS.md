# Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Core Technologies](#core-technologies)
3. [Project Structure](#project-structure)
4. [Implementation Details](#implementation-details)
5. [Best Practices](#best-practices)
6. [Development Guidelines](#development-guidelines)

## Architecture Overview

This application is built using Next.js 15's App Router architecture, implementing a modern full-stack TypeScript application for player ranking and game management. The architecture follows a modular, component-based design with clear separation of concerns.

### Key Architectural Decisions
- **Server-First Approach**: Leveraging Next.js 15's Server Components for optimal performance
- **Type Safety**: Comprehensive TypeScript implementation throughout the codebase
- **Data Layer**: Prisma ORM for type-safe database operations
- **State Management**: Zustand for client-side state management
- **Authentication**: NextAuth.js for secure user authentication
- **Styling**: TailwindCSS for utility-first styling

## Core Technologies

### Frontend
- Next.js 15 (App Router)
- React 18+
- TypeScript
- TailwindCSS
- Zustand (State Management)

### Backend
- Next.js API Routes
- Prisma ORM
- NextAuth.js
- Zod (Validation)

### Development Tools
- ESLint
- TypeScript
- Prettier
- PostCSS

## Project Structure

```
src/
├── app/                 # Next.js 15 App Router
│   ├── api/            # API Routes
│   │   ├── auth/       # Authentication endpoints
│   │   ├── games/      # Game management
│   │   ├── players/    # Player management
│   │   ├── stats/      # Statistics endpoints
│   │   └── users/      # User management
│   ├── games/          # Game-related pages
│   ├── players/        # Player-related pages
│   └── standings/      # Rankings/standings pages
├── components/         # Reusable React components
├── lib/               # Utility functions and shared logic
├── store/             # State management
├── types/             # TypeScript type definitions
└── services/          # External service integrations
```

## Implementation Details

### Authentication Flow
The application implements a secure authentication system using NextAuth.js:
1. User authentication via `/api/auth/[...nextauth]/route.ts`
2. Protected routes using middleware (`middleware.ts`)
3. Session management and user context

### Data Models
Key data models managed through Prisma:

#### Player Model
Core Information:
- **Identification**
  - Unique ID (system-generated)
  - Legajo (required, manually assigned registration number)
  - Nickname (required)
  - Real Name (optional)
  - Nationality (defaults to "Argentina")
  
- **Platform Identifiers**
  - Tenhou Name (optional)
  - MahjongSoul Name (optional)

- **Ranking Information**
  - Overall Placement in Rankings
  - Current Rank Title
  - Current Points
  - Points Required for Next Rank
  - Current Rating (default: 1500)
  - Historical Maximum Rating
  
- **Game Statistics Overview**
  - Total Games Played
  - Average Placement
  - Rentai Rate (1st/2nd placement percentage)
  - Placement Distribution
    - First Place Count & Percentage
    - Second Place Count & Percentage
    - Third Place Count & Percentage
    - Fourth Place Count & Percentage

#### Stats Model
Comprehensive statistics tracking for players:

1. **Overall Statistics**
   - Total Games Played
   - Placement Distribution
     - 1st Place: Count & Percentage
     - 2nd Place: Count & Percentage
     - 3rd Place: Count & Percentage
     - 4th Place: Count & Percentage
   - Rentai Rate
   - Average Placement
   - Current Rating
   - Peak Rating

2. **Game Type-Specific Statistics**
   
   a. Tonpuusen (East-Only)
   - Games Played
   - Placement Distribution
     - 1st Place: Count & Percentage
     - 2nd Place: Count & Percentage
     - 3rd Place: Count & Percentage
     - 4th Place: Count & Percentage
   - Rentai Rate
   - Average Placement
   
   b. Hanchan (East-South)
   - Games Played
   - Placement Distribution
     - 1st Place: Count & Percentage
     - 2nd Place: Count & Percentage
     - 3rd Place: Count & Percentage
     - 4th Place: Count & Percentage
   - Rentai Rate
   - Average Placement

3. **Rating System**
   - Current Rating (default: 1500)
   - Historical Maximum Rating
   - Rating Changes History
   - Rating Calculation Rules (to be implemented)

### Database Schema Implications

```prisma
model Player {
  id              String   @id @default(cuid())
  legajo          String   @unique
  nickname        String
  realName        String?
  nationality     String   @default("Argentina")
  tenhouName      String?
  mahjongSoulName String?
  
  // Ranking Information
  currentRank     String
  currentPoints   Int
  currentRating   Int      @default(1500)
  maxRating       Int      @default(1500)
  
  // Relationships
  stats           Stats    @relation(fields: [statsId], references: [id])
  statsId         String   @unique
  games           Game[]
}

model Stats {
  id              String   @id @default(cuid())
  
  // Overall Stats
  totalGames      Int      @default(0)
  firstPlace      Int      @default(0)
  secondPlace     Int      @default(0)
  thirdPlace      Int      @default(0)
  fourthPlace     Int      @default(0)
  rentaiRate      Float    @default(0)
  avgPlacement    Float    @default(0)
  
  // Tonpuusen Stats
  tonpuusenGames  Int      @default(0)
  tonpuusenFirst  Int      @default(0)
  tonpuusenSecond Int      @default(0)
  tonpuusenThird  Int      @default(0)
  tonpuusenFourth Int      @default(0)
  tonpuusenRentai Float    @default(0)
  tonpuusenAvg    Float    @default(0)
  
  // Hanchan Stats
  hanchanGames    Int      @default(0)
  hanchanFirst    Int      @default(0)
  hanchanSecond   Int      @default(0)
  hanchanThird    Int      @default(0)
  hanchanFourth   Int      @default(0)
  hanchanRentai   Float    @default(0)
  hanchanAvg      Float    @default(0)
  
  // Rating History
  ratingHistory   RatingChange[]
  
  // Relationship
  player          Player?
}

model RatingChange {
  id              String   @id @default(cuid())
  statsId         String
  stats           Stats    @relation(fields: [statsId], references: [id])
  newRating       Int
  change          Int
  date            DateTime @default(now())
  gameId          String?
  game            Game?    @relation(fields: [gameId], references: [id])
}
```

### API Structure
RESTful API implementation following Next.js 15 Route Handlers pattern:

```typescript
// Example Route Handler Structure
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Type-safe parameter handling
  // Request validation
  // Business logic
  // Error handling
  // Response formatting
}
```

### State Management
Zustand stores implementation:

- `playerStore.ts`: Manages player-related state
- `statsStore.ts`: Handles statistics and metrics

## Best Practices

### 1. Type Safety
- Strict TypeScript configuration
- Type inference where possible
- Custom type definitions for business logic

### 2. Performance Optimization
- Server Components by default
- Strategic client-side hydration
- Proper caching implementation

### 3. Error Handling
- Consistent error response format
- Type-safe error handling
- Proper error boundaries

### 4. Code Organization
- Feature-based directory structure
- Clear separation of concerns
- Modular component design

## Development Guidelines

### Component Development
1. Default to Server Components
2. Use 'use client' directive only when necessary
3. Implement proper TypeScript types
4. Follow accessibility best practices

### API Development
1. Use proper HTTP methods
2. Implement comprehensive validation
3. Follow RESTful conventions
4. Include proper error handling

### State Management
1. Centralize shared state
2. Use local state when possible
3. Implement proper type definitions
4. Consider performance implications

### Testing Strategy
1. Unit tests for utilities
2. Integration tests for API routes
3. Component testing
4. E2E testing for critical paths

## Personal Insights & Recommendations

### Architecture Strengths
1. **Modern Stack**: The choice of Next.js 15 with App Router provides a solid foundation for scalability and performance.
2. **Type Safety**: Comprehensive TypeScript implementation reduces runtime errors and improves maintainability.
3. **Clean Architecture**: Clear separation of concerns makes the codebase easy to navigate and maintain.

### Potential Improvements
1. **Caching Strategy**: Consider implementing more aggressive caching for static data.
2. **Error Boundaries**: Add more comprehensive error boundaries for better error handling.
3. **Performance Monitoring**: Implement performance monitoring tools.

### Development Workflow
1. **Code Review Process**: Implement strict code review guidelines.
2. **Documentation**: Keep technical documentation updated with changes.
3. **Performance Budgets**: Set and monitor performance budgets.

## Maintenance Guidelines

### Code Quality
- Run linting before commits
- Maintain consistent code style
- Follow TypeScript best practices

### Performance
- Monitor bundle sizes
- Optimize image loading
- Implement proper lazy loading

### Security
- Regular dependency updates
- Security audit implementation
- Proper secret management

## Deployment Considerations

### Environment Setup
- Proper environment variable management
- Production build optimization
- Deployment pipeline configuration

### Monitoring
- Error tracking implementation
- Performance monitoring
- User analytics

### Scaling
- Database optimization strategies
- Caching implementation
- Load balancing considerations 