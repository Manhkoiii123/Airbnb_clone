import getCurrentUser from "@/app/actions/getCurrentUser";
import { getListings } from "@/app/actions/getListings";
import ClientOnly from "@/app/components/ClientOnly";
import Container from "@/app/components/Container";
import EmptyState from "@/app/components/EmptyState";
import ListingCard from "@/app/components/listings/ListingCard";

export default async function Home() {
  const currentUser = await getCurrentUser();
  const listings = await getListings();
  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }
  return (
    <div className="">
      <ClientOnly>
        <Container>
          <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {listings.map((item) => {
              return (
                <ListingCard
                  currentUser={currentUser}
                  key={item.id}
                  data={item}
                />
              );
            })}
          </div>
        </Container>
      </ClientOnly>
    </div>
  );
}
