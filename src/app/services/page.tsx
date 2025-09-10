"use client";

import { Monitor, Euro, Truck, Settings, Wrench, Phone, Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ServicesPage() {
  const { t } = useTranslation();

  const services = [
    {
      icon: Monitor,
      title: t('designConsultancy'),
      description: t('designConsultancyDesc'),
      details: t('designConsultancyDetails') || "Our expert team provides comprehensive 3D design solutions tailored to your restaurant or hospitality business needs. We help optimize your space layout and equipment placement for maximum efficiency."
    },
    {
      icon: Euro,
      title: t('financingPayment'),
      description: t('financingPaymentDesc'),
      details: t('financingPaymentDetails') || "Flexible financing options to help you acquire the equipment you need without straining your budget. We offer various payment plans and financing solutions."
    },
    {
      icon: Truck,
      title: t('freeDeliveryService'),
      description: t('freeDeliveryServiceDesc'),
      details: t('freeDeliveryServiceDetails') || "Free delivery service throughout Bucharest for orders over RON 200. Fast, secure, and professional delivery to your location."
    },
    {
      icon: Settings,
      title: t('installationCommissioning'),
      description: t('installationCommissioningDesc'),
      details: t('installationCommissioningDetails') || "Professional installation and commissioning services to ensure your equipment is properly set up and functioning optimally from day one."
    },
    {
      icon: Wrench,
      title: t('maintenanceService'),
      description: t('maintenanceServiceDesc'),
      details: t('maintenanceServiceDetails') || "Complete technical support including regular maintenance, repairs, and service to keep your equipment running smoothly and extend its lifespan."
    }
  ];

  return (
    <main className="min-h-screen font-sans">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Banner */}
        <section className="relative overflow-hidden rounded-[24px] mb-8">
          <div className="aspect-[16/5] w-full bg-[url('/window.svg')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
              {t('horecaEquipmentTitle')}
            </h1>
            <p className="text-lg text-gray-200 mt-2 max-w-2xl">
              {t('servicesPageDescription') || "Comprehensive solutions for your hospitality business. From design to maintenance, we provide everything you need to succeed."}
            </p>
          </div>
        </section>

        {/* Services Introduction */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('servicesIntroTitle') || "Professional Services for Your Business"}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('servicesIntroDesc') || "Our experienced team provides comprehensive solutions to help your hospitality business thrive. From initial design to ongoing maintenance, we're your trusted partner for success."}
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="mb-16">
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
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {service.description}
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {service.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-12 shadow-xl border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('contactUsForServices') || "Ready to Get Started?"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('contactServicesDesc') || "Contact our team today to discuss your hospitality equipment needs and discover how we can help your business succeed."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="p-6 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-10 w-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('phoneLabel') || "Phone"}
              </h3>
              <p className="text-gray-600 text-lg font-medium">{t('phone')}</p>
              <p className="text-gray-500 text-sm mt-2">Mon-Fri 9AM-6PM</p>
            </div>
            
            <div className="text-center group">
              <div className="p-6 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-10 w-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('emailLabel') || "Email"}
              </h3>
              <p className="text-gray-600 text-lg font-medium">info@horeca.com</p>
              <p className="text-gray-500 text-sm mt-2">24/7 Support</p>
            </div>
            
            <div className="text-center group">
              <div className="p-6 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-10 w-10 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('locationLabel') || "Location"}
              </h3>
              <p className="text-gray-600 text-lg font-medium">{t('location')}</p>
              <p className="text-gray-500 text-sm mt-2">Free Delivery</p>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-12">
            <a 
              href="/contact" 
              className="inline-block px-8 py-4 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              {t('contactUs')}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
