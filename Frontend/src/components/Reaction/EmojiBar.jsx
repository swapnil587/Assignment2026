import { db } from "../../db.js";
import { id } from "@instantdb/react";

const EMOJIS = ["❤️", "🔥", "😂"];

const groupReactions = (reactions = []) => {
  const map = {};
  reactions.forEach((r) => {
    map[r.emoji] = (map[r.emoji] || 0) + 1;
  });
  return map;
};

export default function EmojiBar({ imageId, reactions }) {
  const counts = groupReactions(reactions);

  const addReaction = async (emoji) => {
    await db.transact([
      db.tx.reactions[id()].update({
        emoji,
        createdAt: Date.now(),
        image: imageId,
      }),
    ]);
  };

  return (
    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => addReaction(emoji)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            border: "1px solid #ddd",
            borderRadius: 16,
            padding: "4px 10px",
            cursor: "pointer",
            background: "#fff",
          }}
        >
          <span style={{ fontSize: 16 }}>{emoji}</span>
          {counts[emoji] && (
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {counts[emoji]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
