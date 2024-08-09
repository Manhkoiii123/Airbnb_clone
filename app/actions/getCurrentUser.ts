import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import prisma from "@/app/libs/prismadb";

export async function getSession() {
  return await getServerSession(authOptions);
}
export default async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session?.user?.email) return null;
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.log("🚀 ~ getCurrentUser ~ error:", error);
    return null;
  }
}
