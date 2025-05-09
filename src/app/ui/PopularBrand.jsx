"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Marquee from "react-fast-marquee";
const brands = [
  {
    name: "BMW",
    logo: "/images/car brands/BMW.png",
  },
  {
    name: "Audi",
    logo: "/images/car brands/Audi.png",
  },
  {
    name: "Tesla",
    logo: "/images/car brands/tesla.png",
  },
  {
    name: "Opel",
    logo: "/images/car brands/opel.png",
  },
  { name: "Toyota", logo: "/images/car brands/toyota.png" },
  { name: "Volvo", logo: "/images/car brands/volvo.png" },
];
const PopularBrand = () => {
  const router = useRouter();

  const handleBrandClick = () => {
    router.push("/carlisting");
  };

  return (
    <div className="py-6 bg-gray-100">
      <h2 className="text-center text-2xl font-semibold mb-4">
        Popular Brands
      </h2>
      <Marquee pauseOnHover gradient={false} speed={100}>
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="mx-6 mt-6 cursor-pointer hover:scale-105 transition-transform"
            onClick={handleBrandClick}
          >
            <Image
              src={brand?.logo}
              alt={brand.name}
              width={100}
              height={60}
              className="object-cover"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default PopularBrand;
