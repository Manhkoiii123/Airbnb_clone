"use client";

import Image from "next/image";

const Avatar = ({ src }: { src?: string | null | undefined }) => {
  return (
    <Image
      src={src || "/images/avt.jpg"}
      className="rounded-full"
      height="30"
      width={"30"}
      alt="Avatar"
    />
  );
};

export default Avatar;
