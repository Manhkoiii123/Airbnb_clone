import { Listing, Revervation, User } from "@prisma/client";

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
export type SafeRevervation = Omit<
  Revervation,
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListings;
};
