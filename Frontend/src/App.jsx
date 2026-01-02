import { useEffect, useState } from "react";
import { db } from "./db";
import { id } from "@instantdb/react";
import GalleryGrid from "./components/gallary/GalleryGrid.jsx";
import EmojiBar from "./components/Reaction/EmojiBar.jsx";
import CommentBox from "./components/Comments/CommentsPanel.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  // 1️⃣ Load or create user identity
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

  const newUser = {
    id: userId,
    name,
  };

  localStorage.setItem("user", JSON.stringify(newUser));
  setUser(newUser);
};


  // 2️⃣ Fetch images + reactions + comments
  const { data } = db.useQuery({
    images: {
      reactions: { user: {} },
      comments: { user: {} },
    },
  });

  // 3️⃣ Save image
  const saveImage = async (img) => {
    await db.transact([
      db.tx.images[id()].update({
        createdAt: Date.now(),
        unsplashId: img.unsplashId,
        url: img.url,
        description: img.description,
      }),
    ]);
  };

  // 4️⃣ Ask name once
  if (!user) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div>
          <h2>Enter your name</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{ padding: 8, marginRight: 8 }}
          />
          <button onClick={createUser}>Continue</button>
        </div>
      </div>
    );
  }

  // 5️⃣ Main app
  return (
    <div style={{ padding: 20 }}>
      <h1>📸 Unsplash Gallery</h1>

      <GalleryGrid onSelect={saveImage} />

      <h2 style={{ marginTop: 30 }}>Saved Images</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {data?.images?.map((img) => (
          <div key={img.id} style={{ marginBottom: 20 }}>
            <img src={img.url} style={{ width: "100%" }} />

            {/* ❤️ Reactions */}
            <EmojiBar imageId={img.id}  reactions={img.reactions} />

            {/* <div>{img.reactions?.map((r) => r.emoji).join(" ")}</div> */}

            {/* 💬 Comments */}
            <CommentBox imageId={img.id} />

            <div style={{ marginTop: 6 }}>
              {img.comments?.map((c) => (
                <p key={c.id}>
                  <strong>{c.user?.name}:</strong> {c.text}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
