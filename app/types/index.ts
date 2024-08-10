import { Listing, User } from "@prisma/client";

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null | undefined;
};
export type SafeListings = Omit<Listing, "createdAt"> & {
  createdAt: string;
};
