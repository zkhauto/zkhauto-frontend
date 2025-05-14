"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import Navbar from "../ui/Navbar";
const faqData = [
  {
    question: "What is the process to purchase a car?",
    answer:
      "To purchase a car, browse our listings, select your desired vehicle, and contact us to schedule a test drive or discuss financing options.",
  },
  {
    question: "Can I trade in my current vehicle?",
    answer:
      "Yes, we accept trade-ins. Bring your vehicle for an appraisal, and we'll offer a competitive value.",
  },
  {
    question: "How can I schedule a test drive?",
    answer:
      "You can schedule a test drive by contacting us via phone, email, or through our website's scheduling form.",
  },
  {
    question: "What documents are required to purchase a car?",
    answer:
      "Typically, you'll need a valid driver's license, proof of insurance, and financing approval documents if applicable.",
  },
  {
    question: "Do you offer financing options?",
    answer:
      "Yes, we offer various financing options. Our team can assist you in finding the best plan that suits your budget.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We have a 7-day return policy. If you're not satisfied with your purchase, you can return it within 7 days for a full refund.",
  },
  {
    question: "Do you provide vehicle history reports?",
    answer:
      "Yes, we provide vehicle history reports for all our cars to ensure transparency and peace of mind.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach our customer support team via phone, email, or through the contact form on our website.",
  },
  {
    question: "What warranties do you offer?",
    answer:
      "We offer various warranty options depending on the vehicle. Please inquire for specific details on the car you're interested in.",
  },
  {
    question: "Can I customize my vehicle?",
    answer:
      "Yes, we offer customization options for certain vehicles. Please discuss your preferences with our sales team.",
  },
];

const page = () => {
  return (
    <div>
      <Navbar />
      <section className="bg-white py-16">
        <Player
          autoplay
          loop
          src="/faq.json" // path inside public
          style={{ height: "200px", width: "300px", marginBottom: "20px" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <details key={faq.question} className="group border-b pb-4">
                <summary className="flex justify-between items-center cursor-pointer text-lg font-medium text-gray-900">
                  {faq.question}
                  <span className="ml-4 group-open:rotate-180 transition-transform">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
