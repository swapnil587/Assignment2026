import { db } from "../db";
import { id } from "@instantdb/react";
import GalleryGrid from "../components/gallary/GalleryGrid";

export default function Home() {
  const { data } = db.useQuery({
    images: {},
  });

const saveImage = async (img) => {
  // 1️⃣ Prevent duplicate saves
  const existing = data?.images?.find(
    (i) => i.unsplashId === img.id
  );
  if (existing) return;

  // 2️⃣ Generate stable ID
  const imageId = id();

  // 3️⃣ Create image using update (InstantDB way)
  await db.transact([
    db.tx.images[imageId].update({
      createdAt: Date.now(),
      unsplashId: img.id,          // REQUIRED
      url: img.urls.regular,       // REQUIRED
      description: img.alt_description || "",
    }),
  ]);
};



  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-900 text-center">
        Unsplash Gallery
      </h1>

      <GalleryGrid
        onSelect={saveImage}
        savedImages={data?.images || []}
      />
    </div>
  );
}
