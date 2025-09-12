"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CategoryFiltersProps {
  onFiltersChange: (filters: {
    min_price: string;
    max_price: string;
    price_sort: "none" | "asc" | "desc";
  }) => void;
}

export default function CategoryFilters({ onFiltersChange }: CategoryFiltersProps) {
  const [filters, setFilters] = useState({
    min_price: "",
    max_price: "",
    price_sort: "none" as "none" | "asc" | "desc",
  });

  const clearFilters = () => {
    const newFilters = {
      min_price: "",
      max_price: "",
      price_sort: "none" as "none" | "asc" | "desc",
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(filters);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Category Filters</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Price Range */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Price Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.min_price}
                onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.max_price}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Price Sorting */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Price Sorting</label>
            <select
              value={filters.price_sort}
              onChange={(e) => setFilters({ ...filters, price_sort: e.target.value as "none" | "asc" | "desc" })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
            >
              <option value="none">No sorting</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button onClick={clearFilters} variant="outline" className="flex-1">
              Clear
            </Button>
            <Button onClick={applyFilters} className="flex-1">
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
