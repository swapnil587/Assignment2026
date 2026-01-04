import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { db } from "./db";
import { id } from "@instantdb/react";

import Home from "./pages/HomePage";
import Feed from "./pages/FeedPage";

function App() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const createUser = async () => {
    if (!name.trim()) return;

    const userId = id();

    await db.transact([
      db.tx.users[userId].update({
        name,
        createdAt: Date.now(),
      }),
    ]);

    const newUser = { id: userId, name };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  
if (!user) {
  return (
    <div className="h-screen flex items-center justify-center bg-orange-50">
      {/* Card */}
      <div className="w-[320px] bg-white rounded-xl shadow-lg p-6 border border-orange-100">
        
        {/* Heading */}
        <h2 className="text-xl font-semibold text-center text-orange-600 mb-2">
          Welcome 
        </h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          Enter your name to continue
        </p>

        {/* Input */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none px-3 py-2 rounded-lg mb-4 transition"
          placeholder="Your name"
        />

        {/* Button */}
        <button
          onClick={createUser}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

  return (
    <BrowserRouter>
     
      <nav className="flex gap-6 px-8 py-4 border-b">
        <Link to="/" className="font-semibold hover:underline">
          Home
        </Link>
        <Link to="/feed" className="font-semibold hover:underline">
          Feed
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
