"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import TranslatedText from "@/components/TranslatedText";

export default function ContactInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="text-center group">
        <div className="p-6 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Phone className="h-10 w-10 text-brand-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          <TranslatedText translationKey="phoneLabel" fallback="Phone" />
        </h3>
        <p className="text-gray-600 text-lg font-medium">
          <TranslatedText translationKey="phone" />
        </p>
        <p className="text-gray-500 text-sm mt-2">Mon-Fri 9AM-6PM</p>
      </div>
      
      <div className="text-center group">
        <div className="p-6 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Mail className="h-10 w-10 text-brand-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          <TranslatedText translationKey="emailLabel" fallback="Email" />
        </h3>
        <p className="text-gray-600 text-lg font-medium">info@horeca.com</p>
        <p className="text-gray-500 text-sm mt-2">24/7 Support</p>
      </div>
      
      <div className="text-center group">
        <div className="p-6 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <MapPin className="h-10 w-10 text-brand-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          <TranslatedText translationKey="locationLabel" fallback="Location" />
        </h3>
        <p className="text-gray-600 text-lg font-medium">
          <TranslatedText translationKey="location" />
        </p>
        <p className="text-gray-500 text-sm mt-2">Free Delivery</p>
      </div>
    </div>
  );
}
