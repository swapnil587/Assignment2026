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
      <div className="h-screen flex items-center justify-center">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Enter your name</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 mr-2 rounded"
            placeholder="Your name"
          />
          <button
            onClick={createUser}
            className="px-4 py-2 bg-black text-white rounded"
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
