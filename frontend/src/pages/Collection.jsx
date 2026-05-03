import React, { useContext, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import SEO from "../components/SEO";
import { useTranslation } from "react-i18next";
import {
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
  SearchX,
} from "lucide-react";

const FilterSection = React.memo(
  ({
    className = "",
    t,
    search,
    setSearch,
    category,
    setCategory,
    difficulty,
    setDifficulty,
    light,
    setLight,
    price,
    setPrice,
    activeFilterCount,
    resetFilters,
  }) => (
    <div className={className}>
      {/* Header */}
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-primary-100">
        <h3 className="font-semibold text-primary-700 flex items-center gap-2">
          <Filter className="w-5 h-5" strokeWidth={1.5} />
          {t("collection.filters")}
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary-500 text-white rounded-full">
              {activeFilterCount}
            </span>
          )}
        </h3>
        <button
          onClick={resetFilters}
          className="text-sm text-secondary-600 hover:text-secondary-700 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
          {t("collection.clearFilters")}
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("collection.search")}
        </label>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("collection.searchPlaceholder")}
            className="w-full bg-primary-50/50 border border-primary-200 rounded-lg pl-10 pr-3 py-2.5 text-sm
                   placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
                   transition-all duration-200"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400"
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Category */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("collection.category")}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setCategory(category === "indoor" ? "" : "indoor")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border
            ${
              category === "indoor"
                ? "bg-primary-500 text-white border-primary-500"
                : "bg-white text-gray-600 border-primary-200 hover:border-primary-400"
            }`}
          >
            {t("product.category.indoor")}
          </button>
          <button
            onClick={() => setCategory(category === "outdoor" ? "" : "outdoor")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border
            ${
              category === "outdoor"
                ? "bg-primary-500 text-white border-primary-500"
                : "bg-white text-gray-600 border-primary-200 hover:border-primary-400"
            }`}
          >
            {t("product.category.outdoor")}
          </button>
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("collection.difficulty")}
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "easy", label: t("product.difficulty.easy") },
            { value: "medium", label: t("product.difficulty.medium") },
            { value: "hard", label: t("product.difficulty.hard") },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() =>
                setDifficulty(difficulty === item.value ? "" : item.value)
              }
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border
              ${
                difficulty === item.value
                  ? "bg-secondary-500 text-white border-secondary-500"
                  : "bg-white text-gray-600 border-secondary-200 hover:border-secondary-400"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Light Requirement */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("collection.light")}
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "low", label: t("product.light.low") },
            { value: "medium", label: t("product.light.medium") },
            { value: "high", label: t("product.light.high") },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setLight(light === item.value ? "" : item.value)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border
              ${
                light === item.value
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-gray-600 border-primary-200 hover:border-primary-400"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("collection.priceRange")}
        </label>
        <div className="bg-primary-50/50 rounded-lg p-4 border border-primary-100">
          <div className="flex items-center justify-between text-sm font-medium text-primary-700 mb-5">
            <span className="px-3 py-1.5 bg-white rounded-md border border-primary-200 font-semibold">
              {price[0].toLocaleString()}
              {t("common.currency")}
            </span>
            <span className="text-gray-400">—</span>
            <span className="px-3 py-1.5 bg-white rounded-md border border-primary-200 font-semibold">
              {price[1].toLocaleString()}
              {t("common.currency")}
            </span>
          </div>

          {/* Dual Range Slider */}
          <div className="relative py-6 px-1">
            {/* Background Track */}
            <div className="absolute left-1 right-1 top-1/2 -translate-y-1/2 h-2 bg-primary-200 rounded-full"></div>

            {/* Active Track (colored range) */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-150"
              style={{
                left: `calc(${(price[0] / 2000000) * 100}% + 4px)`,
                right: `calc(${100 - (price[1] / 2000000) * 100}% + 4px)`,
              }}
            ></div>

            {/* Min Range Input */}
            <input
              type="range"
              min={0}
              max={2000000}
              step={5000}
              value={price[0]}
              onChange={(e) => {
                const newValue = Math.min(+e.target.value, price[1] - 5000);
                setPrice([newValue, price[1]]);
              }}
              className="absolute w-full top-0 h-full bg-transparent appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:active:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150
                       [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:hover:scale-125 [&::-moz-range-thumb]:active:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:duration-150"
              style={{ zIndex: price[0] > price[1] - 100000 ? 5 : 3 }}
            />

            {/* Max Range Input */}
            <input
              type="range"
              min={0}
              max={2000000}
              step={5000}
              value={price[1]}
              onChange={(e) => {
                const newValue = Math.max(+e.target.value, price[0] + 5000);
                setPrice([price[0], newValue]);
              }}
              className="absolute w-full top-0 h-full bg-transparent appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-primary-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:active:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150
                       [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-primary-600 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:hover:scale-125 [&::-moz-range-thumb]:active:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:duration-150"
              style={{ zIndex: 4 }}
            />
          </div>
        </div>
      </div>
    </div>
  ),
);

const Collection = () => {
  const { t } = useTranslation();
  const { products, search, setSearch } = useContext(ShopContext);

  const [sortType, setSortType] = useState("relavent");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [light, setLight] = useState("");
  const [price, setPrice] = useState([0, 2000000]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setDifficulty("");
    setLight("");
    setPrice([0, 2000000]);
    setSortType("relavent");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search) count++;
    if (category) count++;
    if (difficulty) count++;
    if (light) count++;
    if (price[0] > 0 || price[1] < 2000000) count++;
    return count;
  }, [search, category, difficulty, light, price]);

  const filterProducts = useMemo(() => {
    let filtered = products;

    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (difficulty) {
      filtered = filtered.filter((p) => p.difficulty === difficulty);
    }

    if (light) {
      filtered = filtered.filter((p) => p.light === light);
    }

    filtered = filtered.filter(
      (p) => p.price >= price[0] && p.price <= price[1],
    );

    if (sortType === "low-high") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, search, category, difficulty, light, price, sortType]);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pt-6 pb-12">
      <SEO
        title="Bộ Sưu Tập Cây Cảnh - Vườn Lá Nhỏ | Cây Trong Nhà & Ngoài Trời"
        description="Khám phá bộ sưu tập cây cảnh đa dạng: cây trong nhà, cây ngoài trời, sen đá, xương rồng. Lọc theo giá, loại, độ khó chăm sóc. Giao hàng toàn quốc."
        keywords="cây cảnh, bộ sưu tập, cây trong nhà, cây ngoài trời, cây trang trí, mua cây online"
        ogUrl="https://vuonlanho.store/collection"
      />
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Title
              text1={t("collection.title1")}
              text2={t("collection.title2")}
            />
            <p className="text-sm text-gray-500 mt-1">
              {filterProducts.length}{" "}
              {t("collection.productsFound", {
                count: filterProducts.length,
              }) || "sản phẩm"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg border border-primary-200 text-sm font-medium hover:bg-primary-100 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
              {t("collection.filters")}
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary-500 text-white rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700
                       focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
                       cursor-pointer min-w-[160px]"
            >
              <option value="relavent">{t("collection.sortRelevant")}</option>
              <option value="low-high">{t("collection.sortLowHigh")}</option>
              <option value="high-low">{t("collection.sortHighLow")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-4">
            <FilterSection
              className="bg-white rounded-2xl border border-primary-100 shadow-sm p-5"
              t={t}
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              light={light}
              setLight={setLight}
              price={price}
              setPrice={setPrice}
              activeFilterCount={activeFilterCount}
              resetFilters={resetFilters}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1 min-w-0">
          {filterProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filterProducts.map((item) => (
                <ProductItem
                  key={item._id}
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  image={item.image}
                  rating={item.rating}
                  reviewCount={item.reviewCount}
                  sizes={item.sizes}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 mb-4 text-primary-200">
                <SearchX className="w-full h-full" strokeWidth={0.5} />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {t("collection.noProducts") || "Không tìm thấy sản phẩm"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {t("collection.tryAdjustFilters") ||
                  "Thử điều chỉnh bộ lọc để xem thêm sản phẩm"}
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                {t("collection.clearFilters")}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />

          {/* Panel */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto animate-slide-left">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-800">
                {t("collection.filters")}
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            <FilterSection
              className="p-4"
              t={t}
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              light={light}
              setLight={setLight}
              price={price}
              setPrice={setPrice}
              activeFilterCount={activeFilterCount}
              resetFilters={resetFilters}
            />

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                {t("collection.showResults", {
                  count: filterProducts.length,
                }) || `Xem ${filterProducts.length} sản phẩm`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
