"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth, db } from "../utils/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import ThemeToggle from "./ThemeToggle";
import { Button } from "@mui/material";
import logo from "../../public/AlefBet_logo.png";
import userIcon from "../../public/user-circle.svg";
import dynamic from "next/dynamic";

// Dynamically load HamburgerMenu
const HamburgerMenu = dynamic(() => import("./HamburgerMenu"), { ssr: false });

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName || "User");
        }
      } else {
        setUser(null);
        setFirstName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const confirmSignOut = window.confirm("Are you sure you want to sign out?");
    if (confirmSignOut) {
      await signOut(auth);
      setUser(null);
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md w-full">
      <div className="flex justify-between items-center w-full px-8 lg:px-12">
        {/* Left Section: Logo and Greeting */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <img src={logo.src} alt="AlefBet Logo" className="h-20 w-20 object-contain" />
            <span className="text-2xl font-bold">AlefBet</span>
          </Link>
          {user && <span className="font-cursive text-lg text-blue-600 dark:text-yellow-400">Hello, {firstName}!</span>}
        </div>

        {/* Desktop Links */}
        <div className="flex-grow hidden lg:flex justify-end items-center space-x-4">
          <Link href="/mywords" passHref>
            <Button variant="contained" color="primary">
              My Words
            </Button>
          </Link>
          <Link href="/quiz" passHref>
            <Button variant="contained" sx={{ backgroundColor: "#ff9800", "&:hover": { backgroundColor: "#f57c00" } }}>
              Quiz
            </Button>
          </Link>
          <Link href="/account" passHref>
            <Button variant="contained" color="secondary">
              Account
            </Button>
          </Link>
          <Link href="/contact" passHref>
            <Button variant="contained" sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}>
              Contact Us
            </Button>
          </Link>
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium dark:text-white transition-all duration-200"
            >
              <img src={userIcon.src} alt="User Icon" className="h-6 w-6 transition-all duration-200" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          ) : (
            <Link
              href="/signin"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-black dark:text-white transition-all duration-200"
            >
              <img src={userIcon.src} alt="User Icon" className="h-6 w-6 transition-all duration-200" />
              <span className="text-sm font-medium hover:underline">Sign In/Up</span>
            </Link>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile Hamburger Menu (shown only below 1030px) */}
        <div className="block lg:hidden flex items-center space-x-4">
          <ThemeToggle />
          <HamburgerMenu user={user} handleSignOut={handleSignOut} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
