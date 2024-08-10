"use client";

import useCountry from "@/app/hooks/useCountry";
import { SafeListings, SafeUser } from "@/app/types";
import { Listing, Revervation } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "@/app/components/HeartButton";
import Button from "@/app/components/Button";
interface ListingCardProps {
  data: SafeListings;
  revervation?: Revervation;
  onAction?: (id: string) => void;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  disabled?: boolean;
}
const ListingCard = ({
  data,
  actionId = "",
  actionLabel,
  currentUser,
  onAction,
  revervation,
  disabled,
}: ListingCardProps) => {
  const router = useRouter();
  const { getByValue } = useCountry();

  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) {
        return;
      }
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    if (revervation) {
      return revervation.totalPrice;
    }
    return data.price;
  }, [data.price, revervation]);
  const reservationDate = useMemo(() => {
    if (!revervation) {
      return null;
    }
    const start = new Date(revervation.startDate);
    const end = new Date(revervation.endDate);
    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [revervation]);
  return (
    <div
      className="col-span-1 cursor-pointer group"
      onClick={() => router.push(`/listings/${data.id}`)}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            alt="image"
            fill
            src={data.imageSrc}
            className="w-full h-full group-hover:scale-110 transition"
          />
          <div className="absolute top-3 right-3 ">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="font-semibold text-lg ">
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold ">$ {price}</div>
          {!revervation && <div className="font-light">night</div>}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
