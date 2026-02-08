import type { Feather } from "@expo/vector-icons";

type FeatherIconName = keyof typeof Feather.glyphMap;

type CategoryOption = {
  label: string;
  value: string;
  icon: FeatherIconName;
};

export const categoryOptions: CategoryOption[] = [
  { label: "Entertainment", value: "ENTERTAINMENT", icon: "film" },
  { label: "Social", value: "SOCIAL", icon: "globe" },
  { label: "Shopping", value: "SHOPPING", icon: "shopping-bag" },
  { label: "Bank", value: "BANKING", icon: "credit-card" },
  { label: "Travel", value: "TRAVEL", icon: "map-pin" },
];

export const vaultFilters = [
  { label: "All", value: "all" },
  ...categoryOptions.map(({ label, value }) => ({ label, value })),
];

export const getCategoryColor = (category: string) => {
  switch (category) {
    case "SOCIAL":
      return "bg-indigo-100";
    case "SHOPPING":
      return "bg-amber-100";
    case "BANKING":
    case "FINANCE":
      return "bg-emerald-100";
    case "ENTERTAINMENT":
      return "bg-rose-100";
    case "TRAVEL":
      return "bg-blue-100";
    default:
      return "bg-slate-100";
  }
};
