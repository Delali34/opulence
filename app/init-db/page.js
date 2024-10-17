"use client";

import { useState } from "react";

export default function InitDB() {
  const [message, setMessage] = useState("");

  const initializeDB = async () => {
    try {
      const response = await fetch("/api/init-db", { method: "POST" });
      const data = await response.json();
      setMessage(data.message || data.error);
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Initialize Database</h1>
      <button
        onClick={initializeDB}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Initialize Database
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
