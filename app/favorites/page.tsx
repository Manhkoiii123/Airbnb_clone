import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getFavoriteListings from "@/app/actions/getFavoriteListings";
import FavoritesClient from "@/app/favorites/FavoritesClient";
export const dynamic = "force-dynamic";
const FavoritesPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
      </ClientOnly>
    );
  }
  const favs = await getFavoriteListings();
  if (favs.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No favorite found"
          subtitle="Looks like you havent favorite"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <FavoritesClient favs={favs} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default FavoritesPage;
