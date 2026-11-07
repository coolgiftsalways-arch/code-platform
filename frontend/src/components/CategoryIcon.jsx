import { createElement } from "react";

import { categoryIcon } from "../lib/categoryTheme.js";

// <CategoryIcon name="brain" className="h-5 w-5" />
export default function CategoryIcon({ name, ...props }) {
  return createElement(categoryIcon(name), props);
}
