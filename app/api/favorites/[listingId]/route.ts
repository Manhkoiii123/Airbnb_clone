"use server";
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
interface IParams {
  listingId: string;
}
export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
      throw new Error("Invalid ID");
    }

    let favoriteIds = [...(currentUser.favouriteIds || [])];
    favoriteIds.push(listingId);
    const user = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        favouriteIds: favoriteIds,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
      throw new Error("Invalid ID");
    }

    let favoriteIds = [...(currentUser.favouriteIds || [])];
    favoriteIds = favoriteIds.filter((i) => i !== listingId);
    const user = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        favouriteIds: favoriteIds,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
