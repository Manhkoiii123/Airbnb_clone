"use client";

import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import ListingCard from "@/app/components/listings/ListingCard";
import { SafeListings, SafeUser } from "@/app/types";

interface FavoritesClientProps {
  favs: SafeListings[];
  currentUser?: SafeUser | null;
}
const FavoritesClient = ({ favs, currentUser }: FavoritesClientProps) => {
  return (
    <Container>
      <Heading title="Favorites" subTitle="List of places you have favorited" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-col-6 gap-8">
        {favs.map((f) => (
          <ListingCard key={f.id} data={f} currentUser={currentUser} />
        ))}
      </div>
    </Container>
  );
};

export default FavoritesClient;
