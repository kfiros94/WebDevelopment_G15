'use client';

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { auth, db } from "../../utils/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignInSignUp = () => {
  const router = useRouter(); // Initialize router here
  const [isSignUp, setIsSignUp] = useState(false); // Default to "Sign In" view
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { email, password } = formData;

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          ...formData, // Save all the form data in Firestore
          learningLevel: "Beginner", // Default learning level
        });

        // Immediately sign out after sign-up to require explicit sign-in
        await signOut(auth);

        setMessage("Account created successfully! Please sign in.");
        setIsSignUp(false); // Switch to sign-in mode after account creation
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setMessage("Sign-in successful! Redirecting...");
        router.push("/account"); // Redirect to account page
      }
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email. Please sign up first.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        default:
          setError("An error occurred: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-5xl flex">
        {/* Left Section */}
        <div className="w-[55%] p-6 border-r border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6">{isSignUp ? "Sign Up" : "Sign In"}</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>
          <p
            className="mt-4 text-center text-blue-500 cursor-pointer"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Sign In" : "Don’t have an account? Sign Up"}
          </p>
          {message && <p className="mt-4 text-green-500">{message}</p>}
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>

        {/* Right Section */}
        <div className="w-[45%] p-4 flex flex-col justify-start items-center text-center">
          <h3 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
            {isSignUp ? "Join Us Today!" : "Welcome!"}
          </h3>
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
            {isSignUp
              ? "Unlock a world of knowledge and track your progress easily by signing up today."
              : "Access your account and continue your learning journey with ease."}
          </p>
          {/* Dynamic Image */}
          <img
            src={isSignUp ? "/signUp_kids_happy.png" : "/signup_pinguin.png"}
            alt={isSignUp ? "Sign Up Kids Happy" : "Sign Up Pinguin"}
            className=""
          />
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
