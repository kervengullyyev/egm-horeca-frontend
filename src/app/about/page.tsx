"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AboutUsPage() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen font-sans bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-block text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            {t('backToHome')}
          </Link>
        </div>

        {/* Hero Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-600 text-sm font-medium mb-4">{t('excellence')}</p>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t('transformYour')}
                <span className="text-blue-600">{t('hospitality')}</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t('aboutHeroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  href="/products" 
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t('exploreProducts')}
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {t('contactUs')}
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">15+</div>
                  <div className="text-sm text-gray-600">{t('yearsOfExperience')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">50K+</div>
                  <div className="text-sm text-gray-600">{t('happyCustomers')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1000+</div>
                  <div className="text-sm text-gray-600">{t('premiumProducts')}</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-gray-100 rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                      </svg>
                    </div>
                    <div className="text-gray-700 font-semibold">{t('premiumQuality')}</div>
                    <div className="text-sm text-gray-600">{t('professionalGrade')}</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <div className="text-sm font-semibold text-gray-900">{t('bestServices')}</div>
                <div className="text-xs text-gray-600">EGM HORECA</div>
                <div className="text-xs text-blue-600">{t('bucharestRomania')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="text-gray-700 font-semibold">Growth Chart</div>
                    <div className="text-sm text-gray-600">15% Increase</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-4xl font-bold text-gray-900">{t('servicesRangeTitle')}</h2>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">25k+</div>
                  <div className="text-sm text-gray-600">{t('distributedProducts')}</div>
                </div>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl mb-6">
                <h3 className="text-xl font-bold text-blue-600 mb-3">{t('revolutionary')}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {t('servicesRangeDesc')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/products" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t('shopNow')}
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {t('learnMore')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('servicesPowerTitle')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('servicesPowerDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: t('svcPremiumTablewareTitle'),
                description: t('svcPremiumTablewareDesc'),
                icon: "🍽️"
              },
              {
                title: t('svcProKitchenEquipTitle'),
                description: t('svcProKitchenEquipDesc'),
                icon: "👨‍🍳"
              },
              {
                title: t('svcCustomBrandingTitle'),
                description: t('svcCustomBrandingDesc'),
                icon: "🏷️"
              },
              {
                title: t('svcWholesaleTitle'),
                description: t('svcWholesaleDesc'),
                icon: "📦"
              },
              {
                title: t('svcConsultationTitle'),
                description: t('svcConsultationDesc'),
                icon: "💡"
              },
              {
                title: t('svcAfterSalesTitle'),
                description: t('svcAfterSalesDesc'),
                icon: "🛠️"
              }
            ].map((service, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Progress Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('progressTitle')}</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t('progressDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/products" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Shop Now
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-gray-100 rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-gray-700 font-semibold">{t('qualityCheck')}</div>
                    <div className="text-sm text-gray-600">{t('verified100')}</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <div className="text-sm font-semibold text-gray-900">{t('qualityProgress')}</div>
                <div className="text-xs text-gray-600">EGM HORECA</div>
                <div className="text-xs text-blue-600">{t('premiumStandards')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('howItWorksTitle')}</h2>
          </div>
          <div className="w-full">
            <Carousel className="w-full">
              <CarouselContent>
                {[
                  {
                    step: t('step01'),
                    title: t('stepExpertConsultationTitle'),
                    description: t('stepExpertConsultationDesc'),
                    bgColor: "bg-primary text-primary-foreground"
                  },
                  {
                    step: t('step02'),
                    title: t('stepCustomizedSelectionTitle'),
                    description: t('stepCustomizedSelectionDesc'),
                    bgColor: "bg-white text-gray-900 border-2 border-gray-200"
                  },
                  {
                    step: t('step03'),
                    title: t('stepQualityAssuranceTitle'),
                    description: t('stepQualityAssuranceDesc'),
                    bgColor: "bg-primary text-primary-foreground"
                  },
                  {
                    step: t('step04'),
                    title: t('stepFastDeliveryTitle'),
                    description: t('stepFastDeliveryDesc'),
                    bgColor: "bg-white text-gray-900 border-2 border-gray-200"
                  },
                  {
                    step: t('step05'),
                    title: t('stepOngoingSupportTitle'),
                    description: t('stepOngoingSupportDesc'),
                    bgColor: "bg-primary text-primary-foreground"
                  }
                ].map((item, index) => (
                  <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3">
                    <div className={`${item.bgColor} rounded-xl p-6 shadow-lg h-full mx-2`}>
                      <div className="text-sm font-medium mb-3">{item.step}</div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="leading-relaxed opacity-90">{item.description}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('faqTitle')}</h2>
            <p className="text-gray-600">
              {t('faqSubtitle')}
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: t('faqQ1'),
                  answer: t('faqA1')
                },
                {
                  question: t('faqQ2'),
                  answer: t('faqA2')
                },
                {
                  question: t('faqQ3'),
                  answer: t('faqA3')
                },
                {
                  question: t('faqQ4'),
                  answer: t('faqA4')
                },
                {
                  question: t('faqQ5'),
                  answer: t('faqA5')
                }
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg mb-2">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                    <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="text-center">
          <div className="bg-blue-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('ctaTitle')}</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('ctaDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products" 
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t('exploreProducts')}
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                {t('getInTouch')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
