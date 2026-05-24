CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER');
CREATE TYPE "TestType" AS ENUM ('KAM', 'PRE_TEST', 'POST_TEST');
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED');
CREATE TYPE "ModuleProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE "LKMSubmissionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'GRADED');
CREATE TYPE "AutomaticFeedbackSourceType" AS ENUM ('KAM', 'PRE_TEST', 'LKM', 'POST_TEST');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Student" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "nim" TEXT NOT NULL,
  "classId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Teacher" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "lecturerNumber" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Class" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "semester" TEXT NOT NULL,
  "academicYear" TEXT NOT NULL,
  "teacherId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClassMember" (
  "id" TEXT NOT NULL,
  "classId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  CONSTRAINT "ClassMember_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Test" (
  "id" TEXT NOT NULL,
  "type" "TestType" NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "durationMinutes" INTEGER NOT NULL,
  "kkm" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Question" (
  "id" TEXT NOT NULL,
  "testId" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "questionText" TEXT NOT NULL,
  "optionA" TEXT NOT NULL,
  "optionB" TEXT NOT NULL,
  "optionC" TEXT NOT NULL,
  "optionD" TEXT NOT NULL,
  "correctAnswer" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentTestAttempt" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "testId" TEXT NOT NULL,
  "attemptNumber" INTEGER NOT NULL,
  "score" INTEGER,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "submittedAt" TIMESTAMP(3),
  "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StudentTestAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentAnswer" (
  "id" TEXT NOT NULL,
  "attemptId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "selectedAnswer" TEXT NOT NULL,
  "isCorrect" BOOLEAN NOT NULL,
  CONSTRAINT "StudentAnswer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Module" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "isPrerequisite" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentModuleProgress" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "moduleId" TEXT NOT NULL,
  "status" "ModuleProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "StudentModuleProgress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LKM" (
  "id" TEXT NOT NULL,
  "number" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "instruction" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LKM_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StudentLKMSubmission" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "lkmId" TEXT NOT NULL,
  "answerText" TEXT NOT NULL,
  "uploadedFileUrl" TEXT,
  "score" INTEGER,
  "status" "LKMSubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
  "submittedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StudentLKMSubmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PeerAssessment" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "lkmId" TEXT NOT NULL,
  "assessedFriendName" TEXT NOT NULL,
  "contributionScore" INTEGER NOT NULL,
  "communicationScore" INTEGER NOT NULL,
  "responsibilityScore" INTEGER NOT NULL,
  "collaborationScore" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PeerAssessment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LearningFeedback" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "lkmId" TEXT NOT NULL,
  "reflectionText" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LearningFeedback_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AutomaticFeedback" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "sourceType" "AutomaticFeedbackSourceType" NOT NULL,
  "sourceId" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "strongTopics" TEXT[] NOT NULL,
  "weakTopics" TEXT[] NOT NULL,
  "recommendation" TEXT NOT NULL,
  "nextAction" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AutomaticFeedback_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ActivityLog" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "activityType" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TeacherNote" (
  "id" TEXT NOT NULL,
  "teacherId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "noteText" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TeacherNote_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");
CREATE UNIQUE INDEX "Student_nim_key" ON "Student"("nim");
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");
CREATE UNIQUE INDEX "Teacher_lecturerNumber_key" ON "Teacher"("lecturerNumber");
CREATE UNIQUE INDEX "ClassMember_classId_studentId_key" ON "ClassMember"("classId", "studentId");
CREATE INDEX "StudentTestAttempt_studentId_testId_idx" ON "StudentTestAttempt"("studentId", "testId");
CREATE UNIQUE INDEX "StudentAnswer_attemptId_questionId_key" ON "StudentAnswer"("attemptId", "questionId");
CREATE UNIQUE INDEX "StudentModuleProgress_studentId_moduleId_key" ON "StudentModuleProgress"("studentId", "moduleId");
CREATE UNIQUE INDEX "LKM_number_key" ON "LKM"("number");
CREATE UNIQUE INDEX "StudentLKMSubmission_studentId_lkmId_key" ON "StudentLKMSubmission"("studentId", "lkmId");
CREATE UNIQUE INDEX "LearningFeedback_studentId_lkmId_key" ON "LearningFeedback"("studentId", "lkmId");

ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClassMember" ADD CONSTRAINT "ClassMember_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClassMember" ADD CONSTRAINT "ClassMember_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Question" ADD CONSTRAINT "Question_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentTestAttempt" ADD CONSTRAINT "StudentTestAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentTestAttempt" ADD CONSTRAINT "StudentTestAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentAnswer" ADD CONSTRAINT "StudentAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "StudentTestAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentAnswer" ADD CONSTRAINT "StudentAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentAnswer" ADD CONSTRAINT "StudentAnswer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentModuleProgress" ADD CONSTRAINT "StudentModuleProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentModuleProgress" ADD CONSTRAINT "StudentModuleProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentLKMSubmission" ADD CONSTRAINT "StudentLKMSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentLKMSubmission" ADD CONSTRAINT "StudentLKMSubmission_lkmId_fkey" FOREIGN KEY ("lkmId") REFERENCES "LKM"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PeerAssessment" ADD CONSTRAINT "PeerAssessment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PeerAssessment" ADD CONSTRAINT "PeerAssessment_lkmId_fkey" FOREIGN KEY ("lkmId") REFERENCES "LKM"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearningFeedback" ADD CONSTRAINT "LearningFeedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearningFeedback" ADD CONSTRAINT "LearningFeedback_lkmId_fkey" FOREIGN KEY ("lkmId") REFERENCES "LKM"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AutomaticFeedback" ADD CONSTRAINT "AutomaticFeedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TeacherNote" ADD CONSTRAINT "TeacherNote_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TeacherNote" ADD CONSTRAINT "TeacherNote_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
