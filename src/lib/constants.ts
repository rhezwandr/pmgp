export const APP_NAME = "Sistem Pembelajaran Geometri dan Pengukuran PGSD";

export const KAM_KKM = 70;

export const TOPICS = [
  "Segitiga, Segiempat, dan Lingkaran",
  "Keliling Bidang Datar",
  "Luas Bidang Datar",
  "Simetri, Pengubinan, dan Pencerminan",
  "Bangun Ruang Sederhana",
  "Volume Bangun Ruang"
] as const;

export type Topic = (typeof TOPICS)[number];

export const STUDENT_STAGE_LABELS = {
  TES_KAM: "Tes KAM",
  MODUL_REMEDIAL: "Modul Remedial",
  PRE_TEST: "Pre Test",
  LKM_1: "LKM 1",
  LKM_2: "LKM 2",
  LKM_3: "LKM 3",
  LKM_4: "LKM 4",
  LKM_5: "LKM 5",
  LKM_6: "LKM 6",
  POST_TEST: "Post Test",
  HASIL: "Hasil"
} as const;

export type StudentStage = keyof typeof STUDENT_STAGE_LABELS;

export const LOCK_MESSAGES = {
  dashboard: "Dashboard belum tersedia. Selesaikan Tes KAM terlebih dahulu.",
  preTest: "Pre Test masih terkunci. Nilai KAM Anda belum mencapai KKM.",
  modulRemedial: "Modul Remedial tersedia karena nilai KAM belum mencapai KKM.",
  lkm1: "LKM 1 masih terkunci. Selesaikan Pre Test terlebih dahulu.",
  lkm2: "LKM 2 masih terkunci. Selesaikan LKM 1 terlebih dahulu.",
  lkm3: "LKM 3 masih terkunci. Selesaikan LKM 2 terlebih dahulu.",
  lkm4: "LKM 4 masih terkunci. Selesaikan LKM 3 terlebih dahulu.",
  lkm5: "LKM 5 masih terkunci. Selesaikan LKM 4 terlebih dahulu.",
  lkm6: "LKM 6 masih terkunci. Selesaikan LKM 5 terlebih dahulu.",
  postTest: "Post Test masih terkunci. Selesaikan LKM 6 terlebih dahulu."
} as const;

export const PROGRESS_STEPS = [
  "Tes KAM",
  "Modul Remedial",
  "Pre Test",
  "LKM 1",
  "LKM 2",
  "LKM 3",
  "LKM 4",
  "LKM 5",
  "LKM 6",
  "Post Test",
  "Hasil"
] as const;
