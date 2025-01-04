"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth, db } from "../utils/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import ThemeToggle from "./ThemeToggle";
import logo from "../../public/AlefBet_logo.png"; // Ensure logo is correctly located
import userIcon from "../../public/user-circle.svg"; // Imported new icon

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch firstName from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName || "User"); // Default to "User" if no firstName
        }
      } else {
        setUser(null);
        setFirstName("");
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleSignOut = async () => {
    const confirmSignOut = window.confirm("Are you sure you want to sign out?");
    if (confirmSignOut) {
      await signOut(auth);
      setUser(null); // Clear user state
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Left Section: Logo and Greeting */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <img src={logo.src} alt="AlefBet Logo" className="h-20 w-20 object-contain" />
            <span className="text-2xl font-bold">AlefBet</span>
          </Link>
          {/* Greeting */}
          {user && (
            <span className="font-cursive text-lg text-blue-600 dark:text-yellow-400">
              Hello, {firstName}!
            </span>
          )}
        </div>

        {/* Right Section: Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link
            href="/mywords"
            className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
          >
            My Words
          </Link>
          <Link
            href="/account"
            className="px-4 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200"
          >
            Account
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
          >
            Contact Us
          </Link>

          {/* Sign In/Sign Out Button */}
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium dark: text-black dark:text-white transition-all duration-200"
            >
              <img
                src={userIcon.src}
                alt="User Icon"
                className="h-6 w-6 transition-all duration-200"
              />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          ) : (
            <Link
              href="/signin"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-black dark:text-white transition-all duration-200"
            >
              <img
                src={userIcon.src}
                alt="User Icon"
                className="h-6 w-6 transition-all duration-200"
              />
              <span className="text-sm font-medium hover:underline">
                Sign In/Up
              </span>
            </Link>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
