import { useState } from "react";
import { db } from "../db";
import { id } from "@instantdb/react";

export default function AddPost() {
  const [text, setText] = useState("");

  const addPost = async () => {
    if (!text.trim()) return;

    await db.transact([
      db.tx.activityFeed[id()].update({
        createdAt: Date.now(),
        type: "post",
        text,
        emoji: "🔥",
      }),
    ]);

    setText("");
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm mb-4">
      <textarea
        className="w-full border rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-black"
        rows={3}
        placeholder="Share an update..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex justify-end mt-2">
        <button
          onClick={addPost}
          className="bg-black text-white px-4 py-1.5 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
}
