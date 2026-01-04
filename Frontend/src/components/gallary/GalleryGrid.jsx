import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchImages } from "../../api/unplash.js";

export default function GalleryGrid({ onSelect, savedImages }) {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["unsplash-images"],
    queryFn: () => fetchImages(1),
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  // 🔥 Responsive pagination
  useEffect(() => {
    const updatePerPage = () => {
      setPerPage(window.innerWidth < 640 ? 12 : 20);
    };
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  // ✅ Create Set of saved unsplash IDs
  const savedSet = useMemo(() => {
    return new Set(savedImages.map((img) => img.unsplashId));
  }, [savedImages]);

  if (isLoading) return <p className="mt-4">Loading images...</p>;
  if (error) return <p className="mt-4">Failed to load images</p>;

  const totalPages = Math.ceil(data.length / perPage);
  const start = (page - 1) * perPage;
  const visibleImages = data.slice(start, start + perPage);

  return (
    <>
      {/* 🖼 IMAGE GRID */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[80vh] overflow-y-auto pr-2 scrollbar-hide">
        {visibleImages.map((img) => {
          const isSaved = savedSet.has(img.id);

          return (
            <div
              key={img.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition"
            >
              {/* IMAGE */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={img.urls.small}
                  alt={img.alt_description}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* FOOTER */}
              <div className="px-3 py-4 flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate max-w-[70%]">
                  {img.alt_description || "Unsplash Photo"}
                </span>

                {/* 🔥 SMART SAVE BUTTON */}
                <button
                  disabled={isSaved}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSaved) {
                      onSelect({
                        unsplashId: img.id,
                        url: img.urls.regular,
                        description: img.alt_description,
                      });
                    }
                  }}
                  className={`text-sm px-4 py-1 rounded-full font-semibold transition
                    ${
                      isSaved
                        ? "bg-orange-600 text-white cursor-not-allowed"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    }`}
                >
                  {isSaved ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔢 PAGINATION */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded border disabled:opacity-40"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              page === i + 1 ? "bg-black text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded border disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </>
  );
}
