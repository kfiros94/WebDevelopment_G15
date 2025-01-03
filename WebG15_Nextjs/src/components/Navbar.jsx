"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import logo from "../../public/AlefBet_logo.png"; // Ensure logo is correctly located
import userIcon from "../../public/user-circle.svg"; // Imported new icon

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img src={logo.src} alt="AlefBet Logo" className="h-20 w-20 object-contain" />
          <span className="text-2xl font-bold">AlefBet</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link href="/mywords" className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200">
            My Words
          </Link>
          <Link href="/account" className="px-4 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200">
  Account
</Link>

          <Link href="/contact" className="px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-all duration-200">
            Contact Us
          </Link>

          {/* Sign In/Sign Up Button */}
          <Link href="/signin" className="flex items-center space-x-2">
            <img
              src={userIcon.src}
              alt="User Icon"
              className="h-6 w-6 transition-all duration-200"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline">
              Sign In/Up
            </span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
