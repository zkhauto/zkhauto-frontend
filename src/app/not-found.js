"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }) {
  // useEffect(() => {
  //   console.error("App error:", error);
  // }, [error]);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <Player
        autoplay
        loop
        src="/errorr.json" // path inside public
        style={{ height: "300px", width: "300px" }}
      />
      <h1 className="text-4xl font-bold text-red-600">
        Oops! Something went wrong.
      </h1>
      <p className="text-gray-700 mt-4 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
}
