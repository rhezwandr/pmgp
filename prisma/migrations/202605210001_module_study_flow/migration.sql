ALTER TABLE "Question" ADD COLUMN "explanation" TEXT;

ALTER TABLE "Module" ADD COLUMN "learningObjectives" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Module" ADD COLUMN "sections" JSONB;
ALTER TABLE "Module" ADD COLUMN "estimatedMinutes" INTEGER NOT NULL DEFAULT 12;
ALTER TABLE "Module" ADD COLUMN "minimumReadSeconds" INTEGER NOT NULL DEFAULT 45;
ALTER TABLE "Module" ADD COLUMN "requiredSectionCount" INTEGER NOT NULL DEFAULT 3;

ALTER TABLE "StudentModuleProgress" ADD COLUMN "openedAt" TIMESTAMP(3);
ALTER TABLE "StudentModuleProgress" ADD COLUMN "lastReadAt" TIMESTAMP(3);
ALTER TABLE "StudentModuleProgress" ADD COLUMN "readSectionCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "StudentModuleProgress" ADD COLUMN "readProgress" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "StudentModuleProgress" ADD COLUMN "reflectionText" TEXT;
