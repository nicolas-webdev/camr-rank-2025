-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "nickname" TEXT NOT NULL,
    "legajo" INTEGER NOT NULL,
    "realName" TEXT,
    "nationality" TEXT NOT NULL DEFAULT 'Argentina',
    "tenhouName" TEXT,
    "mahjongSoulName" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 1500,
    "maxRating" DOUBLE PRECISION NOT NULL DEFAULT 1500,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rank" TEXT NOT NULL DEFAULT '新人',
    "rankProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "totalGames" INTEGER NOT NULL DEFAULT 0,
    "firstPlace" INTEGER NOT NULL DEFAULT 0,
    "secondPlace" INTEGER NOT NULL DEFAULT 0,
    "thirdPlace" INTEGER NOT NULL DEFAULT 0,
    "fourthPlace" INTEGER NOT NULL DEFAULT 0,
    "rentaiRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgPlacement" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tonpuusenGames" INTEGER NOT NULL DEFAULT 0,
    "tonpuusenFirst" INTEGER NOT NULL DEFAULT 0,
    "tonpuusenSecond" INTEGER NOT NULL DEFAULT 0,
    "tonpuusenThird" INTEGER NOT NULL DEFAULT 0,
    "tonpuusenFourth" INTEGER NOT NULL DEFAULT 0,
    "tonpuusenRentai" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tonpuusenAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hanchanGames" INTEGER NOT NULL DEFAULT 0,
    "hanchanFirst" INTEGER NOT NULL DEFAULT 0,
    "hanchanSecond" INTEGER NOT NULL DEFAULT 0,
    "hanchanThird" INTEGER NOT NULL DEFAULT 0,
    "hanchanFourth" INTEGER NOT NULL DEFAULT 0,
    "hanchanRentai" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hanchanAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingChange" (
    "id" TEXT NOT NULL,
    "statsId" TEXT NOT NULL,
    "oldRating" INTEGER NOT NULL,
    "newRating" INTEGER NOT NULL,
    "change" INTEGER NOT NULL,
    "gameId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RatingChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isHanchan" BOOLEAN NOT NULL DEFAULT true,
    "eastPlayerId" TEXT NOT NULL,
    "eastScore" INTEGER NOT NULL,
    "southPlayerId" TEXT NOT NULL,
    "southScore" INTEGER NOT NULL,
    "westPlayerId" TEXT NOT NULL,
    "westScore" INTEGER NOT NULL,
    "northPlayerId" TEXT NOT NULL,
    "northScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "previousVersionId" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_key" ON "Player"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_nickname_key" ON "Player"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Player_legajo_key" ON "Player"("legajo");

-- CreateIndex
CREATE UNIQUE INDEX "Stats_playerId_key" ON "Stats"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_previousVersionId_key" ON "Game"("previousVersionId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingChange" ADD CONSTRAINT "RatingChange_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "Stats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingChange" ADD CONSTRAINT "RatingChange_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_eastPlayerId_fkey" FOREIGN KEY ("eastPlayerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_southPlayerId_fkey" FOREIGN KEY ("southPlayerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_westPlayerId_fkey" FOREIGN KEY ("westPlayerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_northPlayerId_fkey" FOREIGN KEY ("northPlayerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_previousVersionId_fkey" FOREIGN KEY ("previousVersionId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
