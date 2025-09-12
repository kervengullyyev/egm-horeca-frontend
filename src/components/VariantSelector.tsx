"use client";

import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { ProductVariant } from "@/lib/api";

interface VariantSelectorProps {
  variants: ProductVariant[];
  variantType: string; // e.g., "Size", "Color", "Material"
  onVariantChange: (selectedVariants: Record<string, ProductVariant>) => void;
  initialPrice: number;
}

export default function VariantSelector({ 
  variants, 
  variantType,
  onVariantChange, 
  // initialPrice 
}: VariantSelectorProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({});
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  // All variants are of the same type, so we use a single group
  const variantGroups = useMemo(() => ({ [variantType]: variants }), [variantType, variants]);

  // Auto-select first variant of each type on component mount
  useEffect(() => {
    const autoSelectedVariants: Record<string, ProductVariant> = {};
    
    Object.entries(variantGroups).forEach(([groupName, groupVariants]) => {
      // Find the first active variant in each group
      const firstAvailableVariant = groupVariants.find(variant => 
        variant.is_active
      );
      
      if (firstAvailableVariant) {
        autoSelectedVariants[groupName] = firstAvailableVariant;
      }
    });
    
    setSelectedVariants(autoSelectedVariants);
  }, [variantGroups]); // Only run when variantGroups change

  // Notify parent component when variants change
  useEffect(() => {
    onVariantChange(selectedVariants);
  }, [selectedVariants, onVariantChange]);

  const handleVariantSelect = (variant: ProductVariant) => {
    // Since we only have one variant type, we can clear previous selection and set new one
    const variantType = Object.keys(variantGroups)[0];
    setSelectedVariants({
      [variantType]: variant
    });
  };

  const isVariantAvailable = (variant: ProductVariant) => {
    return variant.is_active;
  };

  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{t('selectOptions')}</h3>
      
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            const isSelected = Object.values(selectedVariants).some(selectedVariant => selectedVariant.id === variant.id);
            const isAvailable = isVariantAvailable(variant);
            
            return (
              <button
                key={variant.id}
                onClick={() => handleVariantSelect(variant)}
                disabled={!isAvailable}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg border transition-all
                  ${isSelected 
                    ? 'border-brand-primary bg-brand-primary-light text-brand-primary-dark' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }
                  ${!isAvailable 
                    ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <div className="text-center">
                  <div className="font-medium">{currentLanguage === 'ro' ? (variant.value_ro || variant.value_en) : variant.value_en}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      

    </div>
  );
}
