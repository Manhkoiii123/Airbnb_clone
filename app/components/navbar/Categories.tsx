"use client";
import CategoryBox from "@/app/components/CategoryBox";
import Container from "@/app/components/Container";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { BsSnow } from "react-icons/bs";
import { FaSkiing } from "react-icons/fa";
import {
  GiBarbedNails,
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCampingTent,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from "react-icons/gi";
import { IoDiamond } from "react-icons/io5";
import { MdOutlineVilla } from "react-icons/md";
import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
export const categories = [
  {
    label: "Beach",
    icon: TbBeach,
    description: "This property is close to the beach!",
  },
  {
    label: "Windmills",
    icon: GiWindmill,
    description: "This property has windmills!",
  },
  {
    label: "Modern",
    icon: MdOutlineVilla,
    description: "This property is modern!",
  },
  {
    label: "Countryside",
    icon: TbMountain,
    description: "This property is in the Countryside!",
  },
  {
    label: "Pools",
    icon: TbPool,
    description: "This property has pools!",
  },
  {
    label: "Islands",
    icon: GiIsland,
    description: "This property has Islands!",
  },
  {
    label: "Lake",
    icon: GiBoatFishing,
    description: "This property has Lake!",
  },
  {
    label: "Skiing",
    icon: FaSkiing,
    description: "This property has Skiing!",
  },
  {
    label: "Castle",
    icon: GiCastle,
    description: "This property in a Castle!",
  },
  {
    label: "Camping",
    icon: GiForestCamp,
    description: "This property in a Camping!",
  },
  {
    label: "Arctic",
    icon: BsSnow,
    description: "This property in a Arctic!",
  },
  {
    label: "Cave",
    icon: GiCaveEntrance,
    description: "This property in a Cave!",
  },
  {
    label: "Desert",
    icon: GiCactus,
    description: "This property in a Desert!",
  },
  {
    label: "Barns",
    icon: GiBarn,
    description: "This property in a Barns!",
  },
  {
    label: "Lux",
    icon: IoDiamond,
    description: "This property in a Luxury!",
  },
];
const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();
  const isMainPage = pathname === "/";
  if (!isMainPage) {
    return null;
  }
  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            // description={item.description}
            selected={category === item.label}
            icon={item.icon}
          />
        ))}
      </div>
    </Container>
  );
};

export default Categories;
