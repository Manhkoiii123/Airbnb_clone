"use server";
import prisma from "@/app/libs/prismadb";
interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}
export default async function getReservation(params: IParams) {
  try {
    const { authorId, listingId, userId } = params;
    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = { userId: authorId };
    }
    const reservations = await prisma.revervation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const safeReservations = reservations.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      startDate: r.startDate.toISOString(),
      endDate: r.endDate.toISOString(),
      listing: {
        ...r.listing,
        createdAt: r.listing.createdAt.toISOString(),
      },
    }));
    return safeReservations;
  } catch (error: any) {
    throw new Error(error);
  }
}
