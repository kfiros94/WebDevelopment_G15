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
    <div className="col-span-1 bg-slate-800 dark:bg-gray-900 rounded-lg p-6 transition-all duration-300">
      <h2 className="text-xl font-bold mb-4 text-white dark:text-gray-200 transition-all duration-300">
        Profile Information
      </h2>
      <form className="space-y-4">
        <div>
          <label className="block mb-2 text-gray-400 dark:text-gray-300 transition-all duration-300">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={profile.name}
            readOnly
            className="w-full p-2 rounded bg-slate-700 dark:bg-gray-800 text-white dark:text-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </div>
        <div>
          <label className="block mb-2 text-gray-400 dark:text-gray-300 transition-all duration-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={profile.email}
            readOnly
            className="w-full p-2 rounded bg-slate-700 dark:bg-gray-800 text-white dark:text-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </div>
        <div>
          <label className="block mb-2 text-gray-400 dark:text-gray-300 transition-all duration-300">
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
            className="w-full p-2 rounded bg-slate-700 dark:bg-gray-800 text-white dark:text-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            <option className="text-black dark:text-gray-300">Beginner</option>
            <option className="text-black dark:text-gray-300">Intermediate</option>
            <option className="text-black dark:text-gray-300">Advanced</option>
          </select>
        </div>
        <button className="bg-blue-600 dark:bg-blue-700 px-4 py-2 rounded text-white hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileInformation;
