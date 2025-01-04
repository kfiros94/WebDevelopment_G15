"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push("/signin"); // Redirect to sign-in page if not signed in
        } else {
          setLoading(false); // Allow access if user is signed in
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return <div className="text-center mt-20 text-xl">Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
