"use client";

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import { useRouter } from "next/navigation";

interface EmptyState {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}
const EmptyState = ({
  showReset,
  subtitle = "Try changing or remove some of your filters",
  title = "No exact matches",
}: EmptyState) => {
  const router = useRouter();

  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center ">
      <Heading center title={title} subTitle={subtitle} />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label="Remove all filter"
            onClick={() => router.push("/")}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
