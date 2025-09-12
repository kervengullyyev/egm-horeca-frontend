"use client";

import { Monitor, Euro, Truck, Settings, Wrench } from "lucide-react";
import TranslatedText from "@/components/TranslatedText";

const services = [
  {
    icon: Monitor,
    titleKey: 'designConsultancy',
    descriptionKey: 'designConsultancyDesc',
    detailsKey: 'designConsultancyDetails',
    fallbackDetails: "Our expert team provides comprehensive 3D design solutions tailored to your restaurant or hospitality business needs. We help optimize your space layout and equipment placement for maximum efficiency."
  },
  {
    icon: Euro,
    titleKey: 'financingPayment',
    descriptionKey: 'financingPaymentDesc',
    detailsKey: 'financingPaymentDetails',
    fallbackDetails: "Flexible financing options to help you acquire the equipment you need without straining your budget. We offer various payment plans and financing solutions."
  },
  {
    icon: Truck,
    titleKey: 'freeDeliveryService',
    descriptionKey: 'freeDeliveryServiceDesc',
    detailsKey: 'freeDeliveryServiceDetails',
    fallbackDetails: "Free delivery service throughout Bucharest for orders over RON 200. Fast, secure, and professional delivery to your location."
  },
  {
    icon: Settings,
    titleKey: 'installationCommissioning',
    descriptionKey: 'installationCommissioningDesc',
    detailsKey: 'installationCommissioningDetails',
    fallbackDetails: "Professional installation and commissioning services to ensure your equipment is properly set up and functioning optimally from day one."
  },
  {
    icon: Wrench,
    titleKey: 'maintenanceService',
    descriptionKey: 'maintenanceServiceDesc',
    detailsKey: 'maintenanceServiceDetails',
    fallbackDetails: "Complete technical support including regular maintenance, repairs, and service to keep your equipment running smoothly and extend its lifespan."
  }
];

export default function ServicesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => {
        const IconComponent = service.icon;
        return (
          <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-brand-primary/20">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <IconComponent className="h-12 w-12 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                <TranslatedText translationKey={service.titleKey} />
              </h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                <TranslatedText translationKey={service.descriptionKey} />
              </p>
              <p className="text-gray-700 leading-relaxed text-sm">
                <TranslatedText 
                  translationKey={service.detailsKey} 
                  fallback={service.fallbackDetails}
                />
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
