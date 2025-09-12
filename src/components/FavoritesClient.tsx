"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import ProductCardServer from "@/components/ProductCardServer";
import FavoriteButton from "@/components/FavoriteButton";
import AddToCartButton from "@/components/AddToCartButton";

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Get favorites from localStorage
  const getFavoritesFromStorage = (): FavoriteItem[] => {
    if (typeof window !== 'undefined') {
      try {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          const favorites = JSON.parse(savedFavorites);
          console.log('Favorites from localStorage:', favorites);
          return favorites;
        }
        return [];
      } catch (error) {
        console.error('Error reading favorites from localStorage:', error);
        return [];
      }
    }
    return [];
  };

  useEffect(() => {
    setFavorites(getFavoritesFromStorage());
  }, []);

  // Listen for favorites updates from other components
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      setFavorites(getFavoritesFromStorage());
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  // const handleRemoveFavorite = (id: string) => {
  //   // Remove from localStorage
  //   const currentFavorites = getFavoritesFromStorage();
  //   const updatedFavorites = currentFavorites.filter(item => item.id !== id);
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  //   }
    
  //   // Update local state
  //   setFavorites(updatedFavorites);
    
  //   // Dispatch event to sync other components
  //   setTimeout(() => {
  //     window.dispatchEvent(new Event('favoritesUpdated'));
  //   }, 100);
  // };

  // const handleToggleFavorite = (productData: { id: string; name: string; price: number; image?: string }) => {
  //   // Remove from favorites when heart is clicked (since we're on favorites page)
  //   handleRemoveFavorite(productData.id);
  // };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-600 mb-2">No favorites yet</h1>
        <p className="text-gray-500">Start adding products to your favorites to see them here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Favorites</h1>
        <span className="text-sm text-gray-500">{favorites.length} item{favorites.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {favorites.map((item) => {
          console.log('Rendering ProductCard with item:', item);
          return (
            <ProductCardServer
              key={item.id}
              title={item.name}
              shortDescription=""
              price={item.price}
              images={item.image ? [item.image] : []}
              href={`/product/${item.id}`}
              productId={item.id}
              favoriteSlot={
                <FavoriteButton
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  ariaLabel="Remove from favorites"
                />
              }
              actionsSlot={
                <AddToCartButton
                  productId={item.id}
                  slug={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                />
              }
            />
          );
        })}
      </div>
    </div>
  );
}
