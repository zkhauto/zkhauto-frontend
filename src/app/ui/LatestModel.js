"use client";
import Image from "next/image";
import latest from "../../../public/img/latest.png";
import Layer_1 from "../../../public/img/Layer_1.png";
const LatestModel = () => {
  return (
    <div className="bg-gray-900 text-white py-20 px-10">
      <div className="flex flex-col md:flex-row items-center container mx-auto">
        <div style={{ flex: 1 }}>
          <Image src={latest} alt="Latest Model" />
        </div>
        <div style={{ flex: 1, padding: "0 20px" }} className="space-y-5 mt-8">
          <h2 className="text-4xl font-bold mb-16">
            Explore the Features of Our Latest Model
          </h2>
          <p>
            Discover the exceptional performance and innovative technology of
            our latest car model. With its sleek design and advanced features,
            this vehicle offers a driving experience like no other. Experience
            luxury and efficiency in every journey.
          </p>
          <p className="flex items-center gap-2">
            {" "}
            <Image src={Layer_1} alt="carLogo" /> Engine: 2.0L Turbocharged
          </p>
          <p className="flex items-center gap-2">
            {" "}
            <Image src={Layer_1} alt="carLogo" /> Transmission: 8-Speed
            Automatic
          </p>
          <p className="flex items-center gap-2">
            {" "}
            <Image src={Layer_1} alt="carLogo" /> Price: Starting at $35, 000
          </p>
          <div className="flex gap-6   ">
            <div>
              <h3>300 HP</h3>
              <p className="text-gray-400">
                Horsepower for a thrilling drive.{" "}
              </p>
            </div>
            <div>
              <h3>300 HP</h3>
              <p className="text-gray-400">
                Horsepower for a thrilling drive.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestModel;
