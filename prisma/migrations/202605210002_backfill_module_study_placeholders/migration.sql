UPDATE "Question"
SET "explanation" = 'Pembahasan placeholder. Kunci jawaban resmi dari dosen akan menggantikan teks ini.'
WHERE "explanation" IS NULL;

UPDATE "Module"
SET
  "learningObjectives" = ARRAY[
    'Membaca konsep utama pada topik modul.',
    'Menghubungkan contoh dengan soal latihan.',
    'Menuliskan refleksi singkat setelah belajar.'
  ],
  "sections" = jsonb_build_array(
    jsonb_build_object('title', 'Konsep Utama', 'content', "content"),
    jsonb_build_object('title', 'Contoh Terarah', 'content', 'Bagian placeholder ini akan diganti dengan contoh resmi dari dosen. Mahasiswa membaca langkah penyelesaian dan alasan setiap langkah.'),
    jsonb_build_object('title', 'Refleksi Belajar', 'content', 'Bagian placeholder ini meminta mahasiswa merangkum konsep yang dipahami dan bagian yang masih perlu diulang.')
  ),
  "estimatedMinutes" = CASE WHEN "estimatedMinutes" < 15 THEN 15 ELSE "estimatedMinutes" END,
  "minimumReadSeconds" = CASE WHEN "minimumReadSeconds" < 45 THEN 45 ELSE "minimumReadSeconds" END,
  "requiredSectionCount" = 3
WHERE "sections" IS NULL;
