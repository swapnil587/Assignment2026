import { db } from "../db";
import { id } from "@instantdb/react";
import GalleryGrid from "../components/gallary/GalleryGrid";

export default function Home() {
  const { data } = db.useQuery({
    images: {},
  });

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
