"use client";

import Image from "next/image";

const Avatar = () => {
  return (
    <Image
      src={"/images/avt.jpg"}
      className="rounded-full"
      height="30"
      width={"30"}
      alt="Avatar"
    />
  );
};

export default Avatar;
