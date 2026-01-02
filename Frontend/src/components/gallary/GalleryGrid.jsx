import { useQuery } from "@tanstack/react-query";
import { fetchImages } from "../../api/unplash.js";

export default function GalleryGrid({ onSelect }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["unsplash-images"],
    queryFn: () => fetchImages(1),
  });

  if (isLoading) return <p>Loading images...</p>;
  if (error) return <p>Failed to load images</p>;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12,
    }}>
      {data.map((img) => (
        <div
          key={img.id}
          onClick={() =>
            onSelect({
              unsplashId: img.id,
              url: img.urls.regular,
              description: img.alt_description,
            })
          }
          style={{
            position: "relative",
            cursor: "pointer",
            border: "3px solid transparent",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.border = "3px solid black")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.border = "3px solid transparent")
          }
        >
          <img
            src={img.urls.small}
            alt={img.alt_description}
            style={{ width: "100%" }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              background: "black",
              color: "white",
              padding: "4px 8px",
              fontSize: 12,
            }}
          >
            Save
          </div>
        </div>
      ))}
    </div>
  );
}

