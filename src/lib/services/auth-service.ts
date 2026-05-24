import { normalizeClassCode } from "../class-code";
import { registerSchema } from "../validations";

export class AuthRegistrationError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
    this.name = "AuthRegistrationError";
  }
}

type RegisterInput = unknown;

type RegisterDb = {
  user: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findUnique: (args: any) => Promise<any>;
    create: (args: {
      data: {
        name: string;
        email: string;
        passwordHash: string;
        role: "STUDENT" | "TEACHER";
        student?: { create: { nim: string; classId: string } };
        teacher?: { create: { lecturerNumber: string } };
      };
      include: { student: true; teacher: true };
    }) => Promise<{
      id: string;
      name: string;
      email: string;
      role: "STUDENT" | "TEACHER";
      student?: { id: string } | null;
      teacher?: { id: string } | null;
    }>;
  };
  class: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findUnique: (args: any) => Promise<{ id: string; code: string; teacherId: string } | null>;
  };
  classMember: {
    create: (args: { data: { studentId: string; classId: string } }) => Promise<unknown>;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $transaction?: <T>(callback: (tx: any) => Promise<T>) => Promise<T>;
};

type RegisterDeps = {
  db: RegisterDb;
  hashPassword: (password: string) => Promise<string>;
};

function createLecturerNumber() {
  return `DSN-${Date.now().toString(36).toUpperCase()}`;
}

export async function registerUser(input: RegisterInput, deps: RegisterDeps) {
  const parsed = registerSchema.parse(input);
  const existing = await deps.db.user.findUnique({ where: { email: parsed.email } });
  if (existing) throw new AuthRegistrationError("Email sudah terdaftar.", 409);

  const passwordHash = await deps.hashPassword(parsed.password);

  if (parsed.role === "TEACHER") {
    const user = await deps.db.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        passwordHash,
        role: "TEACHER",
        teacher: { create: { lecturerNumber: createLecturerNumber() } }
      },
      include: { student: true, teacher: true }
    });
    return { user, redirectTo: "/guru/dashboard" };
  }

  const classCode = normalizeClassCode(parsed.classCode ?? "");
  const classItem = await deps.db.class.findUnique({ where: { code: classCode } });
  if (!classItem) {
    throw new AuthRegistrationError("Kode kelas tidak ditemukan. Periksa kembali kode dari dosen Anda.", 404);
  }

  const createStudent = async (tx: RegisterDb) => {
    const user = await tx.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        passwordHash,
        role: "STUDENT",
        student: { create: { nim: parsed.nim!, classId: classItem.id } }
      },
      include: { student: true, teacher: true }
    });

    if (!user.student) throw new AuthRegistrationError("Profil mahasiswa gagal dibuat.", 500);
    await tx.classMember.create({ data: { studentId: user.student.id, classId: classItem.id } });
    return { user, redirectTo: "/mahasiswa/tes-kam" };
  };

  return deps.db.$transaction ? deps.db.$transaction(createStudent) : createStudent(deps.db);
}
