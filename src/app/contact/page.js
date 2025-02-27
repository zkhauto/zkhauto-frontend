import { Clock } from "lucide-react";
import Image from "next/image";
import booking from "../../../public/img/hero0.png";
const page = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center   p-4 px-28  bg-[#CBD0D3] h-[516px]">
        {/* left section */}
        <div className="container mx-auto h-full flex flex-col justify-evenly w-2/4">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="">Car</span>
              <span className="text-blue-400"> Selling</span>
            </h1>
            <p className="font-semibold">USA,Los angles,1232 sunset Blvd</p>
          </div>
          <div>
            <p className="mb-2 font-bold">
              <span className="flex items-center gap-2">
                <Clock color="red" size={16} /> Opening Hours
              </span>
            </p>
            <div className="flex justify-center items-center w-[525px] h-[68px] bg-white border border-gray-300 rounded-xl p-2 mb-3">
              <p>Monday-Friday:</p>
              <p> &nbsp; 9:00 AM - 8:00 PM</p>
            </div>
            <div className="flex justify-center items-center w-[525px] h-[68px] bg-white border border-gray-300 rounded-xl p-2">
              <p>Saturday-Sunday:</p>
              <p>&nbsp; 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        <div>
          <Image
            src={booking}
            width={700}
            alt="Luxury SUV"
            className="object-contain object-center w-full h-full"
            priority
          />
        </div>
      </div>
      {/* contact section */}
      <div className="p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold my-4">Contact Us</h1>
          <p>React out for any inqueris or assistance</p>
        </div>
        <div className="flex justify-center">
          <form action="">
            <div>
              <label className="block mb-2 text-[#FF26A1]" htmlFor="name">
                Name
              </label>
              <input
                className="w-[300px] md:w-[790px] p-3 border-2 bg-white rounded-lg shadow-lg"
                type="text"
                name="name"
                placeholder="Enter your name"
                id="name"
              />
            </div>
            <div>
              <label className="block my-2 text-[#FF26A1]" htmlFor="email">
                Email
              </label>
              <input
                className="w-[300px] md:w-[790px] p-3 border-2 bg-white rounded-lg shadow-lg"
                type="email"
                name="email"
                id="email"
                placeholder="Enter your Email"
              />
            </div>
            <div>
              <label className="block my-2 text-[#FF26A1]" htmlFor="message">
                Message
              </label>
              <textarea
                className="w-[300px] md:w-[790px] p-3 border-2 text-[#FF26A1] bg-white rounded-lg shadow-lg"
                name="message"
                id="message"
                cols="30"
                rows="5"
                placeholder="Enter your message"
              ></textarea>
            </div>
            <div className="mt-4 text-[#FF26A1]">
              <input type="checkbox" name="" id="" /> I accept the terms and
              conditions
            </div>
            <div className="flex justify-center mt-4">
              <input
                className="bg-black cursor-pointer text-white p-3 w-32 mb-6 rounded-lg"
                type="button"
                value="Submit"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default page;
