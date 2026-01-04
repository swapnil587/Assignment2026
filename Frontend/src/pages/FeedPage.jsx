import { useState, useEffect } from "react";
import { db } from "../db";
import EmojiBar from "../components/Reaction/EmojiBar";
import CommentBox from "../components/Comments/CommentsPanel";

export default function Feed() {
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // ✏️ Edit state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const { data } = db.useQuery({
    images: {
      reactions: { user: {} },
      comments: { user: {} },
    },
  });

  const images = data?.images || [];
  const selectedImage = images.find((img) => img.id === selectedImageId);

  // 🗑 Delete
  const handleDelete = async (commentId) => {
    await db.transact([db.tx.comments[commentId].delete()]);
  };

  // ✏️ Edit
  const handleEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  // 💾 Save edit
  const saveEdit = async () => {
    if (!editText.trim()) return;

    await db.transact([
      db.tx.comments[editingId].update({
        text: editText,
      }),
    ]);

    setEditingId(null);
    setEditText("");
  };

  // 📱 Responsive pagination
  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 640 ? 12 : 8);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(images.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentImages = images.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-orange-500">
        Saved Images!
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentImages.map((img) => (
          <div
            key={img.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
          >
            <div
              className="h-72 sm:h-80 lg:h-[22rem] cursor-zoom-in"
              onClick={() => setSelectedImageId(img.id)}
            >
              <img
                src={img.url}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="px-4">
              <EmojiBar imageId={img.id} reactions={img.reactions} />
            </div>

            <div className="p-2">
              <CommentBox imageId={img.id} />
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setSelectedImageId(null)}
        >
          <div
            className="bg-white w-[95%] md:w-[70%] h-[80vh] rounded-2xl flex overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LEFT */}
            <div className="w-1/2 bg-black relative">
              <img
                src={selectedImage.url}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* RIGHT */}
            <div className="w-1/2 flex flex-col">
              <div className="border-b px-4 py-3">
                <EmojiBar
                  imageId={selectedImage.id}
                  reactions={selectedImage.reactions}
                />
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {selectedImage.comments?.map((c) => {
                  const isOwner = c.user?.id === currentUser?.id;

                  return (
                    <div
                      key={c.id}
                      className="group rounded-lg p-2 bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <span className="font-semibold">
                            {c.user?.name}
                          </span>

                          {editingId === c.id ? (
                            <div className="mt-1 flex gap-2">
                              <input
                                value={editText}
                                onChange={(e) =>
                                  setEditText(e.target.value)
                                }
                                className="w-full border border-blue-400 rounded-xl px-3 py-2 text-base focus:outline-none"
                              />
                              <button
                                onClick={saveEdit}
                                className="px-3 cursor-pointer py-1 text-sm rounded bg-green-600 text-white"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <p className="text-gray-600 text-sm">
                              {c.text}
                            </p>
                          )}
                        </div>

                        {isOwner && (
                          <div className="flex gap-2  transition">
                            <button
                              onClick={() => handleEdit(c)}
                              className="text-sm font-semibold cursor-pointer text-blue-500"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="text-sm font-semibold cursor-pointer text-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t p-3 text-center text-gray-400 text-sm">
                Exit focus view to add comment
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
