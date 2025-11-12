// Single Source of Truth for Categories
export const CATEGORIES = [
  {
    id: "electronics",
    nameEn: "Electronics",
    nameVi: "Điện tử",
  },
  {
    id: "fashion",
    nameEn: "Fashion",
    nameVi: "Thời trang",
  },
  {
    id: "accessories",
    nameEn: "Accessories",
    nameVi: "Phụ kiện",
  },
  {
    id: "shoes",
    nameEn: "Shoes",
    nameVi: "Giày dép",
  },
  {
    id: "home-living",
    nameEn: "Home & Living",
    nameVi: "Nhà cửa & Đời sống",
  },
  {
    id: "beauty",
    nameEn: "Beauty",
    nameVi: "Làm đẹp",
  },
];

// Helper functions
export const getCategoryById = (id: string) =>
  CATEGORIES.find((cat) => cat.id === id);

export const getCategoryNameVi = (id: string) =>
  getCategoryById(id)?.nameVi || id;

export const getCategoryNameEn = (id: string) =>
  getCategoryById(id)?.nameEn || id;

export const getAllCategoryNamesVi = () => CATEGORIES.map((cat) => cat.nameVi);

export const getAllCategoryNamesEn = () => CATEGORIES.map((cat) => cat.nameEn);

export const getAllCategoryIds = () => CATEGORIES.map((cat) => cat.id);

// Get categories as object for i18n
export const getCategoriesAsI18nObject = () =>
  CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = cat.nameVi;
    return acc;
  }, {} as Record<string, string>);
