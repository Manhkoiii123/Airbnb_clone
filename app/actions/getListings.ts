import prisma from "@/app/libs/prismadb";
export interface IListingsParams {
  userId?: string;
}
export async function getListings(params: IListingsParams) {
  try {
    const { userId } = params;
    let query: any = {};
    if (userId) {
      query.userId = userId;
    }
    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });
    const safeListings = listings.map((l) => ({
      ...l,
      createdAt: l.createdAt.toISOString(),
    }));
    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
