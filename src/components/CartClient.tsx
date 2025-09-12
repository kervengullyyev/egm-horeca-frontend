"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, Minus, Plus, ImageIcon } from "lucide-react";
import { getCart, updateQty, removeFromCart, type CartCookieItem } from "@/lib/cart";
import { toggleFavorite, isFavorite, type FavoriteItem } from "@/lib/favorites";

type DisplayCartItem = CartCookieItem & {
  status: "in-stock" | "available-soon" | "out-of-stock";
  color?: string;
};

function getStatusColor(status: DisplayCartItem["status"]) {
  switch (status) {
    case "in-stock":
      return "text-green-600";
    case "available-soon":
      return "text-gray-600";
    case "out-of-stock":
      return "text-red-600";
  }
}

function getStatusText(status: DisplayCartItem["status"]) {
  switch (status) {
    case "in-stock":
      return "In Stock";
    case "available-soon":
      return "Available in 2 days";
    case "out-of-stock":
      return "Out in stock";
  }
}

export default function CartClient() {
  const [items, setItems] = useState<DisplayCartItem[]>([]);

  useEffect(() => {
    const raw = getCart();
    const withStatus: DisplayCartItem[] = raw.map((it) => ({ ...it, status: "in-stock" }));
    setItems(withStatus);
  }, []);

  useEffect(() => {
    const handleFavoritesUpdate = () => {
      setItems((prev) => [...prev]);
    };
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);
    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
    };
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.qty, 0), [items]);
  const tax = subtotal * 0.21;
  const total = subtotal + tax;

  const changeQty = (
    id: string,
    size: string | null | undefined,
    newQty: number,
    variants?: Record<string, { name_en: string; value_en: string; price: number }>
  ) => {
    if (newQty < 1) return;
    updateQty(id, size, newQty, variants);
    setItems((prev) =>
      prev.map((it) =>
        it.id === id && (it.size || null) === (size || null) && JSON.stringify(it.variants || {}) === JSON.stringify(variants || {})
          ? { ...it, qty: newQty }
          : it
      )
    );
  };

  const remove = (
    id: string,
    size: string | null | undefined,
    variants?: Record<string, { name_en: string; value_en: string; price: number }>
  ) => {
    removeFromCart(id, size, variants);
    setItems((prev) =>
      prev.filter(
        (it) => !(it.id === id && (it.size || null) === (size || null) && JSON.stringify(it.variants || {}) === JSON.stringify(variants || {}))
      )
    );
  };

  const handleToggleFavorite = (item: DisplayCartItem) => {
    const favoriteItem: FavoriteItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || undefined,
    };
    toggleFavorite(favoriteItem);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left: Cart Items */}
      <div className="lg:col-span-2">
        <div className="space-y-6">
          {items.length === 0 && <p className="text-foreground/60">Your cart is empty.</p>}
          {items.map((item) => (
            <div
              key={`${item.id}-${item.variants ? JSON.stringify(item.variants) : "no-variants"}`}
              className="flex gap-4 rounded-lg border border-black/10 p-4"
            >
              {/* Image */}
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = "flex";
                    }}
                  />
                ) : null}
                {/* Fallback placeholder */}
                <div className={`h-full w-full bg-gray-200 flex items-center justify-center ${item.image ? "hidden" : "flex"}`}>
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="mt-1 text-lg font-semibold">{item.price.toFixed(2)} RON</p>
                <p className={`text-sm ${getStatusColor(item.status)}`}>{getStatusText(item.status)}</p>
                <div className="mt-1 text-sm text-foreground/70">
                  {item.variants &&
                    Object.entries(item.variants).map(([variantType, variant]) => (
                      <span key={variantType} className="mr-2">
                        {variantType}: {variant.value_en}
                      </span>
                    ))}
                </div>

                {/* Options */}
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changeQty(item.id, null, item.qty - 1, item.variants)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-black/20"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <button
                      onClick={() => changeQty(item.id, null, item.qty + 1, item.variants)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-black/20"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleToggleFavorite(item)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-black/20 text-black/60 hover:text-black"
                >
                  <Heart className={`h-4 w-4 ${isFavorite(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                </button>
                <button
                  onClick={() => remove(item.id, null, item.variants)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-black/20 text-black/60 hover:text-black"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="lg:col-span-1">
        <div className="rounded-lg border border-black/10 p-6">
          {/* Price Summary */}
          <div className="mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-foreground/70">Subtotal</span>
              <span>{subtotal.toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Tax (21%)</span>
              <span>+{tax.toFixed(2)} RON</span>
            </div>
            <div className="border-t border-black/10 pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{total.toFixed(2)} RON</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/checkout" className="block">
              <button className="h-12 w-full rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90">
                Proceed to checkout
              </button>
            </Link>
            <button className="h-12 w-full rounded-lg border border-black/20 bg-white text-foreground font-semibold hover:bg-black/5">
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


