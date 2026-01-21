-- CreateTable
CREATE TABLE "saved_builds" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_price" DECIMAL(10,2) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "saved_builds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ComponentToSavedBuild" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ComponentToSavedBuild_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "saved_builds_userId_name_key" ON "saved_builds"("userId", "name");

-- CreateIndex
CREATE INDEX "_ComponentToSavedBuild_B_index" ON "_ComponentToSavedBuild"("B");

-- AddForeignKey
ALTER TABLE "saved_builds" ADD CONSTRAINT "saved_builds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComponentToSavedBuild" ADD CONSTRAINT "_ComponentToSavedBuild_A_fkey" FOREIGN KEY ("A") REFERENCES "components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComponentToSavedBuild" ADD CONSTRAINT "_ComponentToSavedBuild_B_fkey" FOREIGN KEY ("B") REFERENCES "saved_builds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
