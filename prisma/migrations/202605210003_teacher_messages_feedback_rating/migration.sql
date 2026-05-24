ALTER TABLE "LearningFeedback" ADD COLUMN "rating" INTEGER NOT NULL DEFAULT 4;

CREATE TABLE "TeacherMessage" (
  "id" TEXT NOT NULL,
  "teacherId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "TeacherMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TeacherMessage_teacherId_idx" ON "TeacherMessage"("teacherId");
CREATE INDEX "TeacherMessage_studentId_readAt_idx" ON "TeacherMessage"("studentId", "readAt");

ALTER TABLE "TeacherMessage" ADD CONSTRAINT "TeacherMessage_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TeacherMessage" ADD CONSTRAINT "TeacherMessage_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
