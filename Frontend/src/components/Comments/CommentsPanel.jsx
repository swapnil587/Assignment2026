import { useState } from "react";
import { db } from "../../db";
import { id } from "@instantdb/react";
import { SendHorizonal } from "lucide-react";

export default function CommentBox({ imageId }) {
  const [text, setText] = useState("");
  const [error, setError] = useState(false);

  const addComment = async () => {
    if (!text.trim()) {
      setError(true);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    await db.transact([
      db.tx.comments[id()].update({
        text,
        createdAt: Date.now(),
        image: imageId,
        user: user.id,
      }),
    ]);

    setText("");
    setError(false);
  };

  return (
    <div className="relative">
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError(false);
        }}
        placeholder="Write a comment..."
        className={`w-full rounded-lg border px-4 py-2 pr-11 text-sm focus:outline-none transition
          ${
            error
              ? "border-red-500"
              : "border-gray-300 focus:border-black"
          }`}
        onKeyDown={(e) => e.key === "Enter" && addComment()}
      />

      <button
        onClick={addComment}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full
        text-gray-500 hover:bg-gray-100 hover:text-black transition"
      >
        <SendHorizonal size={18} />
      </button>
    </div>
  );
}
