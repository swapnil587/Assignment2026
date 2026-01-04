import { db } from "../db";
import { id } from "@instantdb/react";
import GalleryGrid from "../components/gallary/GalleryGrid";

export default function Home() {
  const { data } = db.useQuery({
    images: {},
  });

const saveImage = async (img) => {
  //  Prevent duplicate saves
  const existing = data?.images?.find(
    (i) => i.unsplashId === img.id
  );
  if (existing) return;

  //  Generate stable ID
  const imageId = id();

  // Create image using update (InstantDB way)
  await db.transact([
    db.tx.images[imageId].update({
      createdAt: Date.now(),
      unsplashId: img.id,          
      url: img.urls.regular,       
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
