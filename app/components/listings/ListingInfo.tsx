"use client";

import Avatar from "@/app/components/Avatar";
import ListingCategory from "@/app/components/listings/ListingCategory";
import useCountry from "@/app/hooks/useCountry";
import { SafeUser } from "@/app/types";
import dynamic from "next/dynamic";
import { IconType } from "react-icons";

// Tải component 'Map' chỉ ở client-side
const Map = dynamic(() => import("@/app/components/Map"), {
  ssr: false,
});

interface ListingInfoProps {
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  locationValue: string;
  category:
    | {
        label: string;
        icon: IconType;
        description: string;
      }
    | undefined;
}

const ListingInfo = ({
  bathroomCount,
  category,
  description,
  guestCount,
  locationValue,
  roomCount,
  user,
}: ListingInfoProps) => {
  const { getByValue } = useCountry();
  const coordinates = getByValue(locationValue)?.latlng;

  return (
    <div className="col-span-4 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold flex flex-row items-center gap-2">
          <div>Hosted by {user?.name}</div>
          <Avatar src={user?.image} />
        </div>
      </div>
      <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
        <div>
          {guestCount}{" "}
          {guestCount < 2 ? <span>guest</span> : <span>guests</span>}
        </div>
        <div>
          {roomCount} {roomCount < 2 ? <span>room</span> : <span>rooms</span>}
        </div>
        <div>
          {bathroomCount}{" "}
          {bathroomCount < 2 ? <span>bathroom</span> : <span>bathrooms</span>}
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category.label}
          description={category.description}
        />
      )}
      <hr />
      <div className="text-lg font-light text-neutral-500">{description}</div>
      <hr />
      {coordinates && <Map center={coordinates} />}
    </div>
  );
};

export default ListingInfo;
