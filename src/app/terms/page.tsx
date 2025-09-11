"use client";
/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-bold text-black mb-6">{t('termsOfService')}</h1>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-black">
          <p className="mb-6 leading-relaxed">{t('termsIntro1')} {t('termsIntro2')}</p>
          
          <p className="mb-6 leading-relaxed">
            EGM HORECA ("we," "our," or "us") operates the website egmhoreca.com, which provides professional tableware and kitchen equipment sales, and related hospitality services. Our service is designed to connect customers with high-quality professional kitchen and dining equipment.
          </p>
          
          <p className="mb-8 leading-relaxed">{t('termsIntro3')}</p>

          <h2 className="text-2xl font-bold text-black mb-4">{t('acceptanceOfTerms')}</h2>
          <p className="mb-6 leading-relaxed">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">{t('useLicense')}</h2>
          <p className="mb-4 leading-relaxed">
            Permission is granted to temporarily download one copy of the materials (information or software) on EGM HORECA's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial);</li>
            <li>Attempt to reverse engineer any software contained on the website;</li>
            <li>Remove any copyright or other proprietary notations from the materials;</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by EGM HORECA at any time.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">{t('userAccounts')}</h2>
          <p className="mb-4 leading-relaxed">
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
          <p className="mb-6 leading-relaxed">
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service. You agree not to disclose your password to any third party.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">{t('productInfoPricing')}</h2>
          <p className="mb-4 leading-relaxed">
            We strive to display accurate product information, including descriptions, images, and pricing. However, we do not warrant that product descriptions, colors, information, or other content available on the Service is accurate, complete, reliable, current, or error-free.
          </p>
          <p className="mb-6 leading-relaxed">
            All prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time. Prices do not include applicable taxes, shipping, or handling charges, which will be added to your order total.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">{t('orderingPayment')}</h2>
          <p className="mb-4 leading-relaxed">
            By placing an order through our Service, you represent and warrant that you are legally capable of entering into binding contracts and that you have the legal right to purchase the products you are ordering.
          </p>
          <p className="mb-4 leading-relaxed">
            All orders are subject to acceptance and availability. We reserve the right to refuse service to anyone for any reason at any time. Payment must be received in full before your order is processed and shipped.
          </p>
          <p className="mb-6 leading-relaxed">
            We accept payment through Stripe, a secure third-party payment processor. By providing your payment information, you authorize us to charge the applicable amount to your chosen payment method.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">{t('shippingDelivery')}</h2>
          <p className="mb-4 leading-relaxed">
            Delivery times are estimates only and may vary depending on your location and the availability of products. We are not responsible for delays beyond our control, including but not limited to weather conditions, customs delays, or carrier issues.
          </p>
          <p className="mb-6 leading-relaxed">
            Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier. You are responsible for filing any claims with carriers for damaged or lost shipments.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">{t('returnsRefunds')}</h2>
          <p className="mb-4 leading-relaxed">
            We want you to be completely satisfied with your purchase. If you are not satisfied, you may return most items within 30 days of delivery for a refund or exchange, subject to the following conditions:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Items must be in their original condition and packaging</li>
            <li>Items must not be used, damaged, or altered</li>
            <li>Returns must be initiated within 30 days of delivery</li>
            <li>Shipping costs for returns are the responsibility of the customer</li>
            <li>Certain items may not be eligible for return due to hygiene or safety reasons</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            Refunds will be processed within 5-10 business days after we receive and inspect the returned items. Refunds will be issued to the original payment method used for the purchase.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">{t('intellectualProperty')}</h2>
          <p className="mb-6 leading-relaxed">
            The Service and its original content, features, and functionality are and will remain the exclusive property of EGM HORECA and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">{t('prohibitedUses')}</h2>
          <p className="mb-4 leading-relaxed">
            You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material</li>
            <li>To impersonate or attempt to impersonate the Company, a Company employee, or any other person</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
            <li>To introduce viruses, trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful</li>
          </ul>

          <h2 className="text-2xl font-bold text-black mb-4">{t('limitationOfLiability')}</h2>
          <p className="mb-6 leading-relaxed">
            In no event shall EGM HORECA, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">{t('disclaimerOfWarranties')}</h2>
          <p className="mb-6 leading-relaxed">
            The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, EGM HORECA excludes all representations, warranties, conditions, and terms whether express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">{t('governingLaw')}</h2>
          <p className="mb-6 leading-relaxed">
            These Terms shall be interpreted and governed by the laws of Romania, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">{t('changesToTerms')}</h2>
          <p className="mb-6 leading-relaxed">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">{t('contactInformation')}</h2>
          <p className="mb-4 leading-relaxed">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="mb-2">
              <strong>Email:</strong>{" "}
              <Link href="mailto:info@egmhoreca.com" className="text-blue-600 hover:text-blue-800 underline">
                info@egmhoreca.com
              </Link>
            </p>
            <p className="mb-2">
              <strong>Phone:</strong>{" "}
              <Link href="tel:+40741302753" className="text-blue-600 hover:text-blue-800 underline">
                +40 741 302 753
              </Link>
            </p>
            <p>
              <strong>Address:</strong> Bucharest, Romania
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </main>
  );
}
