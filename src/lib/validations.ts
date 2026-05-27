import { z } from "zod";

const meaningfulText = z
  .string()
  .trim()
  .min(20, "Refleksi minimal 20 karakter.")
  .refine((value) => value !== "-", "Refleksi tidak boleh hanya berisi tanda '-'.")
  .refine((value) => /[\p{L}\p{N}]/u.test(value), "Refleksi harus berisi teks bermakna, bukan hanya simbol.");

const meaningfulModuleReflection = z
  .string()
  .trim()
  .min(30, "Refleksi modul minimal 30 karakter.")
  .refine((value) => value !== "-", "Refleksi modul tidak boleh hanya berisi tanda '-'.")
  .refine((value) => /[\p{L}\p{N}]/u.test(value), "Refleksi modul harus berisi kalimat bermakna.");

export const loginSchema = z.object({
  email: z.string().trim().email("Email tidak valid."),
  password: z.string().min(1, "Password wajib diisi.")
});

export const registerSchema = z.object({
  name: z.string().trim()
    .min(3, "Nama lengkap minimal 3 karakter.")
    .refine((val) => val.split(/\s+/).filter(Boolean).length >= 2, "Nama lengkap wajib minimal dua kata.")
    .refine((val) => /^[\p{L}\s'-]+$/u.test(val), "Nama hanya boleh berisi huruf, spasi, dan tanda hubung."),
  email: z.string().trim()
    .email("Format email tidak valid.")
    .refine((val) => !val.includes(".."), "Format email tidak valid.")
    .refine((val) => val.includes(".") && val.split("@")[1]?.includes("."), "Email harus memiliki domain yang valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
  role: z.enum(["STUDENT", "TEACHER"], {
    required_error: "Pilih role pendaftaran."
  }),
  nim: z.string().trim().optional(),
  classCode: z.string().trim().optional()
}).superRefine((value, ctx) => {
  if (value.role === "STUDENT") {
    if (!value.nim || value.nim.length < 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nim"],
        message: "NIM minimal 4 karakter."
      });
    }
    if (!value.classCode || value.classCode.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["classCode"],
        message: "Kode kelas wajib diisi untuk pendaftaran mahasiswa."
      });
    }
  }
});

export const classCreateSchema = z.object({
  name: z.string().trim().min(3, "Nama kelas minimal 3 karakter."),
  semester: z.string().trim().min(3, "Semester wajib diisi."),
  academicYear: z.string().trim().min(4, "Tahun akademik wajib diisi.")
});

export const testSubmissionSchema = z.object({
  answers: z.record(z.string(), z.enum(["A", "B", "C", "D", "E"]))
});

export const moduleStudyProgressSchema = z.object({
  readSectionCount: z.coerce.number().int().min(1, "Minimal satu bagian materi harus dibaca.")
});

export const moduleCompletionSchema = z.object({
  reflectionText: meaningfulModuleReflection
});

export const lkmSubmissionSchema = z.object({
  answerText: z.string().trim().min(20, "Jawaban LKM minimal 20 karakter."),
  uploadedFileUrl: z.string().trim().url("URL file tidak valid.").optional().or(z.literal(""))
});

export const peerAssessmentSchema = z.object({
  assessedFriendName: z.string().trim().min(3, "Nama teman minimal 3 karakter."),
  contributionScore: z.coerce.number().int().min(1).max(5),
  communicationScore: z.coerce.number().int().min(1).max(5),
  responsibilityScore: z.coerce.number().int().min(1).max(5),
  collaborationScore: z.coerce.number().int().min(1).max(5)
});

export const learningFeedbackSchema = z.object({
  reflectionText: meaningfulText,
  rating: z.coerce.number().int().min(1).max(5).default(4)
});

export const teacherNoteSchema = z.object({
  noteText: z.string().trim().min(1, "Catatan guru tidak boleh kosong.")
});

export const teacherMessageSchema = z.object({
  title: z.string().trim().min(4, "Judul pesan minimal 4 karakter."),
  content: z.string().trim().min(10, "Isi pesan minimal 10 karakter.")
});
