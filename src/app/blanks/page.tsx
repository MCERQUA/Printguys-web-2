import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, ChevronLeft, ChevronRight, Package, Shirt, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BreadcrumbSchema } from "@/components/seo/schema-markup";

export const metadata: Metadata = {
  title: "Shop Blank Apparel | Printguys - T-Shirts, Hoodies, Polos & More",
  description:
    "Browse our catalog of blank apparel from top suppliers. Find premium t-shirts, hoodies, polos, and more from brands like Gildan, Bella+Canvas, and Next Level.",
  keywords: [
    "blank apparel",
    "wholesale clothing",
    "blank t-shirts",
    "wholesale hoodies",
    "custom printing blanks",
    "Gildan",
    "Bella Canvas",
    "Next Level",
  ],
  openGraph: {
    title: "Shop Blank Apparel | Printguys",
    description:
      "Browse our catalog of blank apparel from top suppliers. Premium t-shirts, hoodies, polos and more.",
    type: "website",
    url: "https://printguys.ca/blanks",
  },
};

// Types for the API responses
interface BlankProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  primaryImageUrl: string | null;
  priceMin: number;
  priceMax: number;
  isNew: boolean;
  isFeatured: boolean;
  styleNumber: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface Brand {
  name: string;
  productCount: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface BlanksResponse {
  products: BlankProduct[];
  pagination: PaginationInfo;
}

interface CategoriesResponse {
  categories: Category[];
}

interface BrandsResponse {
  brands: Brand[];
}

// Fetch helper - uses headers to construct absolute URL for server-side fetch
async function fetchData<T>(endpoint: string): Promise<T | null> {
  try {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}${endpoint}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Search params interface
interface SearchParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

// Product Card Component
function ProductCard({ product }: { product: BlankProduct }) {
  const formatPrice = (min: number, max: number) => {
    if (min === max) {
      return `$${min.toFixed(2)}`;
    }
    return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
  };

  return (
    <Link href={`/blanks/${product.slug}`}>
      <Card className="group bg-zinc-900 border-gray-800 hover:border-red-500/50 transition-all duration-300 overflow-hidden h-full">
        <div className="relative aspect-square bg-gray-800 overflow-hidden">
          {product.primaryImageUrl ? (
            <Image
              src={product.primaryImageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Shirt className="w-16 h-16 text-gray-600" />
            </div>
          )}
          {product.isNew && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white">
              New
            </Badge>
          )}
          {product.isFeatured && !product.isNew && (
            <Badge className="absolute top-2 left-2 bg-amber-600 text-white">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
          <h3 className="font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
          {product.styleNumber && (
            <p className="text-xs text-gray-500 mb-2">#{product.styleNumber}</p>
          )}
          <p className="text-red-500 font-semibold">
            {formatPrice(product.priceMin, product.priceMax)}
          </p>
          {product.category && (
            <p className="text-xs text-gray-500 mt-2">{product.category.name}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

// Filter Sidebar Component
function FilterSidebar({
  categories,
  brands,
  searchParams,
}: {
  categories: Category[];
  brands: Brand[];
  searchParams: SearchParams;
}) {
  const selectedCategory = searchParams.category || "";
  const selectedBrand = searchParams.brand || "";
  const minPrice = searchParams.minPrice || "";
  const maxPrice = searchParams.maxPrice || "";
  const searchQuery = searchParams.search || "";

  // Build URL with updated params
  const buildFilterUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams();

    // Preserve existing params
    if (searchQuery && updates.search !== null) params.set("search", updates.search ?? searchQuery);
    if (selectedCategory && updates.category !== null) params.set("category", updates.category ?? selectedCategory);
    if (selectedBrand && updates.brand !== null) params.set("brand", updates.brand ?? selectedBrand);
    if (minPrice && updates.minPrice !== null) params.set("minPrice", updates.minPrice ?? minPrice);
    if (maxPrice && updates.maxPrice !== null) params.set("maxPrice", updates.maxPrice ?? maxPrice);

    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else if (value) {
        params.set(key, value);
      }
    });

    // Always reset to page 1 when filtering
    params.delete("page");

    const queryString = params.toString();
    return queryString ? `/blanks?${queryString}` : "/blanks";
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-white mb-2 block">Search</Label>
        <form action="/blanks" method="GET">
          {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
          {selectedBrand && <input type="hidden" name="brand" value={selectedBrand} />}
          {minPrice && <input type="hidden" name="minPrice" value={minPrice} />}
          {maxPrice && <input type="hidden" name="maxPrice" value={maxPrice} />}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={searchQuery}
              className="pl-10 bg-zinc-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
        </form>
      </div>

      {/* Categories */}
      <div>
        <Label className="text-white mb-3 block">Categories</Label>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildFilterUrl({
                category: selectedCategory === cat.slug ? null : cat.slug,
              })}
              className={`flex items-center justify-between py-1.5 px-2 rounded text-sm transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-red-600/20 text-red-400"
                  : "text-gray-300 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span className="flex items-center gap-2">
                <Checkbox
                  checked={selectedCategory === cat.slug}
                  className="border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                {cat.name}
              </span>
              <span className="text-gray-500 text-xs">({cat.productCount})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <Label className="text-white mb-3 block">Brands</Label>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={buildFilterUrl({
                brand: selectedBrand === brand.name ? null : brand.name,
              })}
              className={`flex items-center justify-between py-1.5 px-2 rounded text-sm transition-colors ${
                selectedBrand === brand.name
                  ? "bg-red-600/20 text-red-400"
                  : "text-gray-300 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span className="flex items-center gap-2">
                <Checkbox
                  checked={selectedBrand === brand.name}
                  className="border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                {brand.name}
              </span>
              <span className="text-gray-500 text-xs">({brand.productCount})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-white mb-3 block">Price Range</Label>
        <form action="/blanks" method="GET" className="space-y-3">
          {searchQuery && <input type="hidden" name="search" value={searchQuery} />}
          {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
          {selectedBrand && <input type="hidden" name="brand" value={selectedBrand} />}
          <div className="flex gap-2">
            <Input
              type="number"
              name="minPrice"
              placeholder="Min"
              defaultValue={minPrice}
              min="0"
              step="0.01"
              className="bg-zinc-800 border-gray-700 text-white placeholder:text-gray-500"
            />
            <Input
              type="number"
              name="maxPrice"
              placeholder="Max"
              defaultValue={maxPrice}
              min="0"
              step="0.01"
              className="bg-zinc-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Apply Price Filter
          </Button>
        </form>
      </div>

      {/* Clear Filters */}
      {(selectedCategory || selectedBrand || minPrice || maxPrice || searchQuery) && (
        <Link href="/blanks">
          <Button
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-zinc-800 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        </Link>
      )}
    </div>
  );
}

// Pagination Component
function Pagination({
  pagination,
  searchParams,
}: {
  pagination: PaginationInfo;
  searchParams: SearchParams;
}) {
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchParams.search) params.set("search", searchParams.search);
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.brand) params.set("brand", searchParams.brand);
    if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
    if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);
    params.set("page", page.toString());
    return `/blanks?${params.toString()}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const { page, totalPages } = pagination;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous */}
      {pagination.hasPrevPage ? (
        <Link href={buildPageUrl(pagination.page - 1)}>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300 hover:bg-zinc-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled
          className="border-gray-700 text-gray-600"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((pageNum, idx) =>
        pageNum === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <Link key={pageNum} href={buildPageUrl(pageNum as number)}>
            <Button
              variant={pagination.page === pageNum ? "default" : "outline"}
              size="sm"
              className={
                pagination.page === pageNum
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "border-gray-700 text-gray-300 hover:bg-zinc-800"
              }
            >
              {pageNum}
            </Button>
          </Link>
        )
      )}

      {/* Next */}
      {pagination.hasNextPage ? (
        <Link href={buildPageUrl(pagination.page + 1)}>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300 hover:bg-zinc-800"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled
          className="border-gray-700 text-gray-600"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

// Active Filters Display
function ActiveFilters({ searchParams }: { searchParams: SearchParams }) {
  const filters: { label: string; key: keyof SearchParams }[] = [];

  if (searchParams.search) filters.push({ label: `Search: "${searchParams.search}"`, key: "search" });
  if (searchParams.category) filters.push({ label: `Category: ${searchParams.category}`, key: "category" });
  if (searchParams.brand) filters.push({ label: `Brand: ${searchParams.brand}`, key: "brand" });
  if (searchParams.minPrice) filters.push({ label: `Min: $${searchParams.minPrice}`, key: "minPrice" });
  if (searchParams.maxPrice) filters.push({ label: `Max: $${searchParams.maxPrice}`, key: "maxPrice" });

  if (filters.length === 0) return null;

  const removeFilter = (keyToRemove: keyof SearchParams) => {
    const params = new URLSearchParams();
    if (searchParams.search && keyToRemove !== "search") params.set("search", searchParams.search);
    if (searchParams.category && keyToRemove !== "category") params.set("category", searchParams.category);
    if (searchParams.brand && keyToRemove !== "brand") params.set("brand", searchParams.brand);
    if (searchParams.minPrice && keyToRemove !== "minPrice") params.set("minPrice", searchParams.minPrice);
    if (searchParams.maxPrice && keyToRemove !== "maxPrice") params.set("maxPrice", searchParams.maxPrice);
    const queryString = params.toString();
    return queryString ? `/blanks?${queryString}` : "/blanks";
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((filter) => (
        <Link key={filter.key} href={removeFilter(filter.key)}>
          <Badge
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-600/20 cursor-pointer"
          >
            {filter.label}
            <X className="w-3 h-3 ml-1" />
          </Badge>
        </Link>
      ))}
    </div>
  );
}

// Loading Skeleton
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} className="bg-zinc-900 border-gray-800 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-800" />
          <CardContent className="p-4 space-y-2">
            <div className="h-3 bg-gray-800 rounded w-1/3" />
            <div className="h-4 bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-800 rounded w-2/3" />
            <div className="h-4 bg-gray-800 rounded w-1/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Empty State
function EmptyState() {
  return (
    <div className="text-center py-16">
      <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        We could not find any products matching your filters. Try adjusting your search criteria or clearing filters.
      </p>
      <Link href="/blanks">
        <Button className="bg-red-600 hover:bg-red-700">
          Clear All Filters
        </Button>
      </Link>
    </div>
  );
}

// Main Page Component
export default async function BlanksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Build API query string
  const apiParams = new URLSearchParams();
  if (params.search) apiParams.set("search", params.search);
  if (params.category) apiParams.set("category", params.category);
  if (params.brand) apiParams.set("brand", params.brand);
  if (params.minPrice) apiParams.set("minPrice", params.minPrice);
  if (params.maxPrice) apiParams.set("maxPrice", params.maxPrice);
  if (params.page) apiParams.set("page", params.page);

  // Fetch data in parallel
  const [blanksData, categoriesData, brandsData] = await Promise.all([
    fetchData<BlanksResponse>(`/api/blanks?${apiParams.toString()}`),
    fetchData<CategoriesResponse>("/api/blanks/categories"),
    fetchData<BrandsResponse>("/api/blanks/brands"),
  ]);

  const products = blanksData?.products || [];
  const pagination = blanksData?.pagination || {
    page: 1,
    limit: 24,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };
  const categories = categoriesData?.categories || [];
  const brands = brandsData?.brands || [];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://printguys.ca" },
          { name: "Shop Blanks", url: "https://printguys.ca/blanks" },
        ]}
      />

      <main className="bg-black text-white min-h-screen">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-zinc-900 to-black">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 px-4 py-2 rounded-full mb-6">
              <Shirt className="w-5 h-5" />
              <span>Premium Suppliers</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Shop Blank Apparel
            </h1>
            <p className="text-xl text-gray-400 mb-4 max-w-2xl mx-auto">
              Browse our catalog of premium blank apparel from top wholesale suppliers.
              Find the perfect blanks for your custom printing projects.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span>Gildan</span>
              <span className="text-gray-600">|</span>
              <span>Bella+Canvas</span>
              <span className="text-gray-600">|</span>
              <span>Next Level</span>
              <span className="text-gray-600">|</span>
              <span>Champion</span>
              <span className="text-gray-600">|</span>
              <span>And More</span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 bg-black">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 bg-zinc-900 rounded-xl p-6 border border-gray-800">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h2>
                  <FilterSidebar
                    categories={categories}
                    brands={brands}
                    searchParams={params}
                  />
                </div>
              </aside>

              {/* Products Section */}
              <div className="flex-1">
                {/* Mobile Filter Button & Results Count */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-gray-400">
                    {pagination.totalCount > 0 ? (
                      <span>
                        Showing{" "}
                        <span className="text-white font-medium">
                          {(pagination.page - 1) * pagination.limit + 1}-
                          {Math.min(
                            pagination.page * pagination.limit,
                            pagination.totalCount
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="text-white font-medium">
                          {pagination.totalCount}
                        </span>{" "}
                        products
                      </span>
                    ) : (
                      <span>No products found</span>
                    )}
                  </div>

                  {/* Mobile Filter Sheet */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="lg:hidden border-gray-700 text-gray-300"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="bg-zinc-900 border-gray-800 overflow-y-auto"
                    >
                      <SheetHeader>
                        <SheetTitle className="text-white">Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar
                          categories={categories}
                          brands={brands}
                          searchParams={params}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Active Filters */}
                <ActiveFilters searchParams={params} />

                {/* Products Grid */}
                <Suspense fallback={<ProductGridSkeleton />}>
                  {products.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                      <Pagination pagination={pagination} searchParams={params} />
                    </>
                  ) : (
                    <EmptyState />
                  )}
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-zinc-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Custom Printing?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              We offer DTF transfers, screen printing, embroidery, and more.
              Get a quote for your custom apparel project.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="/contact">Get a Quote</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
                asChild
              >
                <Link href="/services/dtf">View Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
