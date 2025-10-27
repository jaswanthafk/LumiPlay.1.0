// src/pages/AccountPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";

export default function AccountPage() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setUsername(data.username || "");
        setPhotoURL(data.photoURL || "");
        setTheme(data.theme || "dark");
      }
    };
    fetchData();
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;
    await updateProfile(auth.currentUser, { displayName: username, photoURL });
    await updateDoc(doc(db, "users", user.uid), { username, photoURL, theme });
    alert("Profile updated!");
  };

  const handleResetPassword = async () => {
    await sendPasswordResetEmail(auth, user.email);
    alert("Password reset email sent!");
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-3xl font-bold mb-6">Account Settings</h2>
      <div className="flex flex-col gap-4 max-w-md">
        <div>
          <label className="block mb-1">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block mb-1">Profile Picture URL</label>
          <input
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white"
          />
          {photoURL && (
            <img
              src={photoURL}
              alt="Profile"
              className="w-20 h-20 rounded-full mt-3 object-cover"
            />
          )}
        </div>

        <div>
          <label className="block mb-1">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
          </select>
        </div>

        <button
          onClick={handleUpdate}
          className="bg-blue-600 hover:bg-blue-500 py-2 rounded font-semibold"
        >
          Save Changes
        </button>

        <button
          onClick={handleResetPassword}
          className="bg-gray-700 hover:bg-gray-600 py-2 rounded font-semibold"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
