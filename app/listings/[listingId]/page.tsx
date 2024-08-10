import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import getReservation from "@/app/actions/getReservations";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "@/app/listings/[listingId]/ListingClient";
interface IParams {
  listingId?: string;
}
const ListingPage = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  const listing = await getListingById(params);
  const reservations = await getReservation(params);
  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }
  return (
    <ClientOnly>
      <ListingClient
        reservations={reservations}
        listing={listing}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default ListingPage;
