// src/components/ProfileInformation.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from "../utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ProfileInformation = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    level: "Beginner",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfile({
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            level: "Beginner", // Default level (can be updated)
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-slate-800 dark:bg-gray-900 rounded-lg p-2 transition-all duration-300 h-full">
      <h2 className="text-md font-semibold mb-1 text-white dark:text-gray-200 transition-all duration-300">
        Profile Information
      </h2>
      <form className="space-y-2">
        <div>
          <label className="block mb-0.5 text-gray-400 dark:text-gray-300 transition-all duration-300 text-xs">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={profile.name}
            readOnly
            className="w-full p-1 rounded bg-slate-700 dark:bg-gray-800 text-white dark:text-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-xs"
          />
        </div>
        <div>
          <label className="block mb-0.5 text-gray-400 dark:text-gray-300 transition-all duration-300 text-xs">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={profile.email}
            readOnly
            className="w-full p-1 rounded bg-slate-700 dark:bg-gray-800 text-white dark:text-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-xs"
          />
        </div>
        <div>
          <label className="block mb-0.5 text-gray-400 dark:text-gray-300 transition-all duration-300 text-xs">
            Learning Level
          </label>
          <select
            name="level"
            value={profile.level}
            onChange={(e) =>
              setProfile((prevProfile) => ({
                ...prevProfile,
                level: e.target.value,
              }))
            }
            className="w-full p-1 rounded bg-slate-700 dark:bg-gray-800 text-white dark:text-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-xs"
          >
            <option className="text-black dark:text-gray-300">Beginner</option>
            <option className="text-black dark:text-gray-300">Intermediate</option>
            <option className="text-black dark:text-gray-300">Advanced</option>
          </select>
        </div>
        <button className="bg-blue-600 dark:bg-blue-700 px-2 py-0.5 rounded text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 text-xs">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileInformation;
