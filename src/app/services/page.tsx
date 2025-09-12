import TranslatedText from "@/components/TranslatedText";
import ServicesGrid from "@/components/ServicesGrid";
import ContactInfo from "@/components/ContactInfo";

export default function ServicesPage() {
  return (
    <main className="min-h-screen font-sans">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Banner - Server rendered with minimal client text */}
        <section className="relative overflow-hidden rounded-[24px] mb-8">
          <div className="aspect-[16/5] w-full bg-[url('/window.svg')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
              <TranslatedText translationKey="horecaEquipmentTitle" />
            </h1>
            <p className="text-lg text-gray-200 mt-2 max-w-2xl">
              <TranslatedText 
                translationKey="servicesPageDescription" 
                fallback="Comprehensive solutions for your hospitality business. From design to maintenance, we provide everything you need to succeed."
              />
            </p>
          </div>
        </section>

        {/* Services Introduction - Server rendered with minimal client text */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              <TranslatedText 
                translationKey="servicesIntroTitle" 
                fallback="Professional Services for Your Business"
              />
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              <TranslatedText 
                translationKey="servicesIntroDesc" 
                fallback="Our experienced team provides comprehensive solutions to help your hospitality business thrive. From initial design to ongoing maintenance, we're your trusted partner for success."
              />
            </p>
          </div>
        </section>

        {/* Services Grid - Client component */}
        <section className="mb-16">
          <ServicesGrid />
        </section>

        {/* Contact Section - Server rendered with minimal client components */}
        <section className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-12 shadow-xl border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <TranslatedText 
                translationKey="contactUsForServices" 
                fallback="Ready to Get Started?"
              />
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              <TranslatedText 
                translationKey="contactServicesDesc" 
                fallback="Contact our team today to discuss your hospitality equipment needs and discover how we can help your business succeed."
              />
            </p>
          </div>
          
          <ContactInfo />
          
          {/* Call to Action - Server rendered with minimal client text */}
          <div className="text-center mt-12">
            <a 
              href="/contact" 
              className="inline-block px-8 py-4 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              <TranslatedText translationKey="contactUs" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
