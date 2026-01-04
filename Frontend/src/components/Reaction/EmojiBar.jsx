import { useState, useRef, useEffect } from "react";

import { db } from "../../db.js";
import { id } from "@instantdb/react";
import EmojiPicker from "emoji-picker-react";

const groupReactions = (reactions = []) => {
  const map = {};
  reactions.forEach((r) => {
    map[r.emoji] = (map[r.emoji] || 0) + 1;
  });
  return map;
};

export default function EmojiBar({ imageId, reactions = [] }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);


  useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(e.target)
    ) {
      setShowPicker(false);
    }
  };

  if (showPicker) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showPicker]);



  const counts = groupReactions(reactions);
  const user = JSON.parse(localStorage.getItem("user"));

  // current user's reaction
  const myReaction = reactions.find(
    (r) => r.user?.id === user?.id
  );

  const toggleReaction = async (emoji) => {
    if (!user) return;

    // same emoji → remove
    if (myReaction && myReaction.emoji === emoji) {
      await db.transact([
        db.tx.reactions[myReaction.id].delete(),
      ]);
    }
    // update emoji
    else if (myReaction) {
      await db.transact([
        db.tx.reactions[myReaction.id].update({
          emoji,
          createdAt: Date.now(),
        }),
      ]);
    }
    // create reaction
    else {
      await db.transact([
        db.tx.reactions[id()].update({
          emoji,
          createdAt: Date.now(),
          image: imageId,
          user: user.id,
        }),
      ]);
    }

    setShowPicker(false);
  };

  return (
    <div className="relative flex gap-2 mt-2 items-center">
      {/* EXISTING REACTIONS */}
      {Object.entries(counts).map(([emoji, count]) => (
        <button
          key={emoji}
          onClick={() => toggleReaction(emoji)}
          className={`flex items-center gap-1 border rounded-full px-3 py-1 text-sm
            ${
              myReaction?.emoji === emoji
                ? "bg-gray-200"
                : "bg-white"
            }`}
        >
          <span>{emoji}</span>
          <span className="font-semibold">{count}</span>
        </button>
      ))}

      {/* ADD EMOJI BUTTON */}
      <button
        onClick={() => setShowPicker((p) => !p)}
        className="border rounded-full px-3 py-1 text-sm bg-white hover:bg-gray-100"
      >
        ➕
      </button>

      {/* EMOJI PICKER */}
     {showPicker && (
  <div
    ref={pickerRef}
    className="absolute top-12 right-0 z-50 bg-white shadow-xl rounded-xl"
  >

          <EmojiPicker
            onEmojiClick={(e) => toggleReaction(e.emoji)}
            theme="light"
            searchDisabled
            lazyLoadEmojis
          />
        </div>
      )}
    </div>
  );
}
