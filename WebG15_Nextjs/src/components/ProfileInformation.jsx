import React, { useState } from 'react';

const ProfileInformation = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    level: 'Beginner',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  return (
    <div className="col-span-1 bg-slate-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Profile Information</h2>
      <form className="space-y-4">
        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700"
          />
        </div>
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700"
          />
        </div>
        <div>
          <label className="block mb-2">Learning Level</label>
          <select
            name="level"
            value={profile.level}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfileInformation;
