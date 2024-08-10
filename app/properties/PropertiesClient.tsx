"use client";

import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import ListingCard from "@/app/components/listings/ListingCard";
import { SafeListings, SafeRevervation, SafeUser } from "@/app/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

interface PropertiesClientProps {
  listings: SafeListings[];
  currentUser?: SafeUser | null;
}
const PropertiesClient = ({ currentUser, listings }: PropertiesClientProps) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);
      axios
        .delete(`/api/listings/${id}`)
        .then(() => {
          toast.success("Listings deleted");
          router.refresh();
        })
        .catch(() => {
          toast.error("Something went wrong");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );
  return (
    <Container>
      <Heading title="Properties" subTitle="List of your properties" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-col-6 gap-8">
        {listings.map((item: SafeListings) => {
          return (
            <ListingCard
              actionId={item.id}
              onAction={onCancel}
              disabled={deletingId === item.id}
              actionLabel="Delete property"
              currentUser={currentUser}
              key={item.id}
              data={item}
            />
          );
        })}
      </div>
    </Container>
  );
};

export default PropertiesClient;
