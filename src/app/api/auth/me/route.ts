import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  return Response.json({
    user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null
  });
}
