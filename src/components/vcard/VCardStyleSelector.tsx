import { useState } from "react";

const styles = {
  modern: {
    primary: "text-blue-600 dark:text-blue-400",
    secondary: "text-gray-600 dark:text-gray-400",
    muted: "text-gray-500 dark:text-gray-500"
  },
  classic: {
    primary: "text-gray-900 dark:text-gray-100",
    secondary: "text-gray-700 dark:text-gray-300",
    muted: "text-gray-500 dark:text-gray-500"
  },
  minimal: {
    primary: "text-black dark:text-white",
    secondary: "text-gray-800 dark:text-gray-200",
    muted: "text-gray-500 dark:text-gray-500"
  }
};

export function VCardStyleSelector() {
  const [selectedStyle, setSelectedStyle] = useState("modern");

  return (
    <div className="flex space-x-4">
      {Object.keys(styles).map((style) => (
        <button
          key={style}
          onClick={() => setSelectedStyle(style)}
          className={`p-2 rounded ${styles[style].primary}`}
        >
          {style}
        </button>
      ))}
    </div>
  );
}
