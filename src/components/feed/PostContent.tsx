interface PostContentProps {
  content: string;
  images?: string[];
}

export function PostContent({ content, images }: PostContentProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-300">{content}</div>
      
      {images && images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="rounded-lg object-cover w-full h-48"
            />
          ))}
        </div>
      )}
    </div>
  );
}