import FeedItem from "./FeedItem";

export default function Feed({ items }) {
  if (!items || items.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">
        No activity yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <FeedItem key={item.id} item={item} />
      ))}
    </div>
  );
}
