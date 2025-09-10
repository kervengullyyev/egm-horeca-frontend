"use client";

import { Monitor, Euro, Truck, Settings, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ServicesSection() {
  const { t } = useTranslation();

  const services = [
    {
      icon: Monitor,
      title: t('designConsultancy'),
      description: t('designConsultancyDesc')
    },
    {
      icon: Euro,
      title: t('financingPayment'),
      description: t('financingPaymentDesc')
    },
    {
      icon: Truck,
      title: t('freeDeliveryService'),
      description: t('freeDeliveryServiceDesc')
    },
    {
      icon: Settings,
      title: t('installationCommissioning'),
      description: t('installationCommissioningDesc')
    },
    {
      icon: Wrench,
      title: t('maintenanceService'),
      description: t('maintenanceServiceDesc')
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-12">
          {t('horecaEquipmentTitle')}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="mb-6 p-4 bg-white rounded-full shadow-sm">
                  <IconComponent className="h-10 w-10 text-brand-primary" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 leading-tight uppercase tracking-wide">
                  {service.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
