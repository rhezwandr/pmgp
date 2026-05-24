import { describe, expect, it } from "vitest";

import { registerUser } from "@/lib/services/auth-service";

function createFakeDb(options: { classExists?: boolean } = {}) {
  const createdUsers: unknown[] = [];
  const memberships: unknown[] = [];
  const db: any = {
    user: {
      findUnique: async () => null,
      create: async ({ data, include }: { data: unknown; include?: unknown }) => {
        createdUsers.push(data);
        const user = {
          id: "user-1",
          name: (data as { name: string }).name,
          email: (data as { email: string }).email,
          role: (data as { role: string }).role,
          student: (data as { role: string }).role === "STUDENT" ? { id: "student-1" } : null,
          teacher: (data as { role: string }).role === "TEACHER" ? { id: "teacher-1" } : null
        };
        return include ? user : user;
      }
    },
    class: {
      findUnique: async () =>
        options.classExists
          ? {
              id: "class-1",
              code: "KLS-VALID1",
              teacherId: "teacher-1"
            }
          : null
    },
    classMember: {
      create: async ({ data }: { data: unknown }) => {
        memberships.push(data);
        return data;
      }
    },
    $transaction: async <T>(callback: (tx: typeof db) => Promise<T>) => callback(db)
  };
  return { db, createdUsers, memberships };
}

describe("registerUser", () => {
  it("registers a lecturer without a class code", async () => {
    const { db, createdUsers } = createFakeDb();

    const result = await registerUser(
      {
        name: "Dosen Baru",
        email: "dosen@example.com",
        password: "password123",
        role: "TEACHER"
      },
      { db, hashPassword: async () => "hashed-password" }
    );

    expect(result.user.role).toBe("TEACHER");
    expect(result.redirectTo).toBe("/guru/dashboard");
    expect(createdUsers[0]).toMatchObject({
      role: "TEACHER",
      teacher: { create: expect.objectContaining({ lecturerNumber: expect.stringContaining("DSN-") }) }
    });
  });

  it("rejects student registration without a class code", async () => {
    const { db } = createFakeDb();

    await expect(
      registerUser(
        {
          name: "Mahasiswa Baru",
          email: "mhs@example.com",
          password: "password123",
          role: "STUDENT",
          nim: "20260001"
        },
        { db, hashPassword: async () => "hashed-password" }
      )
    ).rejects.toThrow("Kode kelas wajib diisi untuk pendaftaran mahasiswa.");
  });

  it("rejects student registration when class code is invalid", async () => {
    const { db } = createFakeDb({ classExists: false });

    await expect(
      registerUser(
        {
          name: "Mahasiswa Baru",
          email: "mhs@example.com",
          password: "password123",
          role: "STUDENT",
          nim: "20260001",
          classCode: "KLS-SALAH"
        },
        { db, hashPassword: async () => "hashed-password" }
      )
    ).rejects.toThrow("Kode kelas tidak ditemukan. Periksa kembali kode dari dosen Anda.");
  });

  it("registers a student and enrolls them into the class matching the class code", async () => {
    const { db, createdUsers, memberships } = createFakeDb({ classExists: true });

    const result = await registerUser(
      {
        name: "Mahasiswa Baru",
        email: "mhs@example.com",
        password: "password123",
        role: "STUDENT",
        nim: "20260001",
        classCode: "kls-valid1"
      },
      { db, hashPassword: async () => "hashed-password" }
    );

    expect(result.user.role).toBe("STUDENT");
    expect(result.redirectTo).toBe("/mahasiswa/tes-kam");
    expect(createdUsers[0]).toMatchObject({
      role: "STUDENT",
      student: { create: { nim: "20260001", classId: "class-1" } }
    });
    expect(memberships).toEqual([{ studentId: "student-1", classId: "class-1" }]);
  });
});
