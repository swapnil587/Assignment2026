export default function FeedItem({ item }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="flex items-start gap-2">
        <div className="text-xl">{item.emoji}</div>

        <div className="flex-1">
          <p className="text-gray-800">{item.text}</p>

          <p className="text-xs text-gray-500 mt-1">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
