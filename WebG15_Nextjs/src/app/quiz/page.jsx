"use client";
import Image from "next/image";
import withAuth from "@/components/withAuth"; // Higher-order component for authentication

const Quiz = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Quiz Coming Soon!</h1>
      <Image
        src="/comingSoon.jpg" // Path to the image in the public folder
        alt="Coming Soon"
        width={400}
        height={400}
        className="rounded-lg shadow-lg"
      />
      <p className="text-lg text-gray-600 mt-4 dark:text-gray-300">
        Stay tuned for exciting challenges to test your Hebrew skills!
      </p>
    </div>
  );
};

export default withAuth(Quiz); // Protect the page so only signed-in users can access it
