-- Add missing fields to Question table
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "optionE" TEXT;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "questionNumber" INTEGER;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "questionImage" TEXT;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "imageAlt" TEXT;

-- Create TeacherLkmFeedback table
CREATE TABLE IF NOT EXISTS "TeacherLkmFeedback" (
  "id" TEXT NOT NULL,
  "teacherId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "lkmId" TEXT NOT NULL,
  "feedbackText" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "TeacherLkmFeedback_pkey" PRIMARY KEY ("id")
);

-- Unique constraint for TeacherLkmFeedback
CREATE UNIQUE INDEX IF NOT EXISTS "TeacherLkmFeedback_studentId_teacherId_lkmId_key" ON "TeacherLkmFeedback"("studentId", "teacherId", "lkmId");

-- Foreign keys for TeacherLkmFeedback
ALTER TABLE "TeacherLkmFeedback" ADD CONSTRAINT "TeacherLkmFeedback_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TeacherLkmFeedback" ADD CONSTRAINT "TeacherLkmFeedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TeacherLkmFeedback" ADD CONSTRAINT "TeacherLkmFeedback_lkmId_fkey" FOREIGN KEY ("lkmId") REFERENCES "LKM"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Performance indexes for 300 mahasiswa
CREATE INDEX IF NOT EXISTS "Student_classId_idx" ON "Student"("classId");
CREATE INDEX IF NOT EXISTS "Class_teacherId_idx" ON "Class"("teacherId");
CREATE INDEX IF NOT EXISTS "ClassMember_classId_idx" ON "ClassMember"("classId");
CREATE INDEX IF NOT EXISTS "ClassMember_studentId_idx" ON "ClassMember"("studentId");
CREATE INDEX IF NOT EXISTS "Question_testId_idx" ON "Question"("testId");
CREATE INDEX IF NOT EXISTS "StudentTestAttempt_submittedAt_idx" ON "StudentTestAttempt"("submittedAt");
CREATE INDEX IF NOT EXISTS "StudentAnswer_studentId_idx" ON "StudentAnswer"("studentId");
CREATE INDEX IF NOT EXISTS "StudentAnswer_questionId_idx" ON "StudentAnswer"("questionId");
CREATE INDEX IF NOT EXISTS "StudentLKMSubmission_submittedAt_idx" ON "StudentLKMSubmission"("submittedAt");
CREATE INDEX IF NOT EXISTS "LearningFeedback_studentId_idx" ON "LearningFeedback"("studentId");
CREATE INDEX IF NOT EXISTS "LearningFeedback_lkmId_idx" ON "LearningFeedback"("lkmId");
CREATE INDEX IF NOT EXISTS "TeacherLkmFeedback_teacherId_idx" ON "TeacherLkmFeedback"("teacherId");
CREATE INDEX IF NOT EXISTS "TeacherLkmFeedback_studentId_idx" ON "TeacherLkmFeedback"("studentId");
CREATE INDEX IF NOT EXISTS "TeacherLkmFeedback_lkmId_idx" ON "TeacherLkmFeedback"("lkmId");
CREATE INDEX IF NOT EXISTS "TeacherNote_teacherId_idx" ON "TeacherNote"("teacherId");
CREATE INDEX IF NOT EXISTS "TeacherNote_studentId_idx" ON "TeacherNote"("studentId");
CREATE INDEX IF NOT EXISTS "AutomaticFeedback_studentId_idx" ON "AutomaticFeedback"("studentId");
CREATE INDEX IF NOT EXISTS "ActivityLog_studentId_idx" ON "ActivityLog"("studentId");
CREATE INDEX IF NOT EXISTS "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");
