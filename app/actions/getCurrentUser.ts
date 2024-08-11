import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";
import { getServerSession } from "next-auth/next";
export async function getSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.log("🚀 aaaa", error);
    return null;
  }
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
    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified?.toISOString() || null,
    };
  } catch (error) {
    console.log("🚀 ", error);
    return null;
  }
}
