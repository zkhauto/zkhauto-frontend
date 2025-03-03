// "use client";

// import { Mail, MapPin, PhoneCall } from "lucide-react";
// import Navbar from "../ui/Navbar";
// const page = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b text-white bg-gray-900">
//       <Navbar />
//       <div className="flex flex-col md:flex-row  justify-between items-center gap-4 md:px-10 py-6">
//         <div className="flex flex-col gap-4">
//           <h2 className="text-[18px]">Get In Touch</h2>
//           <h1 className="text-[18px] font-semibold">Schedule Your Visit</h1>
//           <p className="text-[16px] font-medium md:w-[651px]">
//             Fill out the form below to book a test drive or visit our dealership
//             for a personalized experience.
//           </p>
//           <button className="w-40 bg-[#1D93F1] text-white py-4 rounded-lg">
//             Book Forum
//           </button>
//         </div>

//         <div>
//           <div className="flex flex-col gap-4 md:p-6  md:mx-auto  ">
//             {/* Email */}
//             <div className="flex items-center gap-3">
//               <Mail className="text-white" size={20} />
//               <span className=" font-medium">contact@carselling.com</span>
//             </div>

//             {/* Phone */}
//             <div className="flex items-center gap-3">
//               <PhoneCall className="text-white" size={20} />
//               <span className=" font-medium">+1 (234) 567-890</span>
//             </div>

//             {/* Location */}
//             <div className="flex items-center gap-3">
//               <MapPin className="text-white" size={20} />
//               <span className=" font-medium">
//                 USA, Los Angeles, 1234 Sunset Blvd
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <h1 className=" p-4 text-[20px] font-medium">Showroom Location</h1>
//         <iframe
//           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.0075967517705!2d-118.25339172367632!3d34.069319516827484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c6fe4f47b0f7%3A0x2052ec281382e330!2s1234%20W%20Sunset%20Blvd%2C%20Los%20Angeles%2C%20CA%2090026%2C%20USA!5e0!3m2!1sen!2sbd!4v1740669096556!5m2!1sen!2sbd"
//           width="100%"
//           height="550"
//           style={{ border: 0, padding: 16, borderRadius: "16px" }}
//           allowFullScreen=""
//           loading="lazy"
//           referrerPolicy="no-referrer-when-downgrade"
//         ></iframe>
//       </div>
//     </div>
//   );
// };

// export default page;

"use client";

import axios from "axios";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import { useState } from "react";
import Navbar from "../ui/Navbar";

const Page = () => {
  // States for managing form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [carModel, setCarModel] = useState("");
  const [testDriveDate, setTestDriveDate] = useState("");
  const [message, setMessage] = useState("");

  // State for managing modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle opening and closing of modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { name, email, carModel, testDriveDate };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/book",
        formData
      );
      setMessage(response.data.message); // Display success message
      closeModal(); // Close modal after successful booking
    } catch (error) {
      setMessage("Failed to book the test drive. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b text-white bg-gray-900">
      <Navbar />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:px-10 py-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-[18px]">Get In Touch</h2>
          <h1 className="text-[18px] font-semibold">Schedule Your Visit</h1>
          <p className="text-[16px] font-medium md:w-[651px]">
            Fill out the form below to book a test drive or visit our dealership
            for a personalized experience.
          </p>
          <button
            className="w-40 bg-[#1D93F1] text-white py-4 rounded-lg"
            onClick={openModal}
          >
            Book Forum
          </button>
        </div>

        <div>
          <div className="flex flex-col gap-4 md:p-6 md:mx-auto">
            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="text-white" size={20} />
              <span className="font-medium">contact@carselling.com</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <PhoneCall className="text-white" size={20} />
              <span className="font-medium">+1 (234) 567-890</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <MapPin className="text-white" size={20} />
              <span className="font-medium">
                USA, Los Angeles, 1234 Sunset Blvd
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Booking Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-slate-900 p-6 rounded-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Book a Test Drive</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 border bg-slate-900 border-gray-300 rounded-md"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border bg-slate-900 border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Car Model"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                required
                className="w-full p-3 border bg-slate-900 border-gray-300 rounded-md"
              />
              <input
                type="date"
                placeholder="Test Drive Date"
                value={testDriveDate}
                onChange={(e) => setTestDriveDate(e.target.value)}
                required
                className="w-full p-3 border bg-slate-900 border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="w-full bg-[#1D93F1] text-white py-3 rounded-md"
              >
                Book Test Drive
              </button>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
            <button
              onClick={closeModal}
              className="w-full mt-4 py-2 text-center text-gray-600 border border-gray-300 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div>
        <h1 className="p-4 text-[20px] font-medium">Showroom Location</h1>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.0075967517705!2d-118.25339172367632!3d34.069319516827484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c6fe4f47b0f7%3A0x2052ec281382e330!2s1234%20W%20Sunset%20Blvd%2C%20Los%20Angeles%2C%20CA%2090026%2C%20USA!5e0!3m2!1sen!2sbd!4v1740669096556!5m2!1sen!2sbd"
          width="100%"
          height="550"
          style={{ border: 0, padding: 16, borderRadius: "16px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Page;
