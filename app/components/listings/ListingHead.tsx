"use client";

import Heading from "@/app/components/Heading";
import HeartButton from "@/app/components/HeartButton";
import useCountry from "@/app/hooks/useCountry";
import { SafeUser } from "@/app/types";
import Image from "next/image";

interface ListingHeadProps {
  title: string;
  imageSrc: string;
  locationValue: string;
  id: string;
  currentUser?: SafeUser | null;
}
const ListingHead = ({
  id,
  imageSrc,
  locationValue,
  title,
  currentUser,
}: ListingHeadProps) => {
  const { getByValue } = useCountry();
  const location = getByValue(locationValue);
  return (
    <>
      <Heading
        title={title}
        subTitle={`${location?.region}, ${location?.label}`}
      />
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <Image
          alt="iamge"
          src={imageSrc}
          fill
          className="w-full object-cover"
        />
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default ListingHead;
