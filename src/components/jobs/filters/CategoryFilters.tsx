import { missionCategories } from "@/types/categories";

export function CategoryFilters() {
  return (
    <div>
      {Object.entries(missionCategories).map(([category, { icon, subcategories }]) => (
        <div key={category}>
          <h3>{category}</h3>
          <div>
            {subcategories.map((subcategory) => (
              <div key={subcategory}>{subcategory}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
