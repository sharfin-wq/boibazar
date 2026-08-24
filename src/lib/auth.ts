import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      (("digest" in error && (error as { digest: string }).digest === "DYNAMIC_SERVER_USAGE") ||
        ("message" in error &&
          typeof (error as { message: string }).message === "string" &&
          (error as { message: string }).message.includes("Dynamic server usage")))
    ) {
      throw error;
    }
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}
