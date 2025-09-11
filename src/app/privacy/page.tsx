"use client";
/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen font-sans bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-block text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-black mb-6">Privacy Policy</h1>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-black">
          <p className="mb-6 leading-relaxed">
            EGM HORECA operates the EGM HORECA website, which provides the service of professional tableware and kitchen equipment sales, and related hospitality services. This page is designed to inform website visitors about our policies regarding the collection, use, and disclosure of personal information for anyone who chooses to use our Service.
          </p>
          
          <p className="mb-6 leading-relaxed">
            By using our Service, you agree to the collection and use of information in accordance with this policy. The personal information we collect is used to provide and enhance our Service. We will not use or share your information with anyone except as described in this Privacy Policy.
          </p>
          
          <p className="mb-8 leading-relaxed">
            The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible on our website unless otherwise defined in this Privacy Policy.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">Information Collection and Use</h2>
          <p className="mb-6 leading-relaxed">
            To improve your experience with our Service, we may request certain personally identifiable information, such as your name, email address, phone number, and postal address. This information is collected to help us contact or identify you, assist with product inquiries, facilitate transactions, and provide updates on new products or services relevant to your interests.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">Log Data</h2>
          <p className="mb-6 leading-relaxed">
            When you access our Service, we automatically collect certain information sent by your browser, referred to as Log Data. This data may include details such as your computer's Internet Protocol (IP) address, browser type and version, the pages you visit on our website, the date and time of your visit, the duration of your visit, and other relevant analytical information. This data helps us analyze and improve the functionality and performance of our Service.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">Cookies</h2>
          <p className="mb-4 leading-relaxed">
            Cookies are small data files that act as anonymous unique identifiers, sent to your browser by the websites you visit and stored on your device's hard drive.
          </p>
          <p className="mb-6 leading-relaxed">
            EGM HORECA uses cookies to gather information and improve your experience with our Service. You can choose to accept or decline cookies. However, please be aware that declining cookies may affect the functionality of certain features of our Service and limit your overall experience.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">Service Providers</h2>
          <p className="mb-4 leading-relaxed">
            We may engage third-party companies and individuals for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>To facilitate our Service;</li>
            <li>To provide the Service on our behalf;</li>
            <li>To perform Service-related functions; or</li>
            <li>To assist in analyzing how our Service is used.</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            Please note that these third parties may have access to your Personal Information. However, this access is strictly limited to the tasks they perform on our behalf. These parties are bound by confidentiality agreements and are prohibited from using or disclosing your information for any purpose other than fulfilling their assigned responsibilities.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">Payment Processing</h2>
          <p className="mb-6 leading-relaxed">
            For payment processing, we use Stripe, a trusted third-party payment processor. When you make a purchase, your payment information is processed securely through Stripe's systems. We do not store your complete payment card details on our servers. Stripe has its own privacy policy and security measures in place to protect your financial information.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">Data Security</h2>
          <p className="mb-6 leading-relaxed">
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include SSL encryption for data transmission, secure data storage practices, and limited access to personal information by authorized personnel only.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">Your Rights</h2>
          <p className="mb-4 leading-relaxed">
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Access: Request a copy of the personal information we hold about you</li>
            <li>Correction: Request correction of inaccurate or incomplete information</li>
            <li>Deletion: Request deletion of your personal information (subject to legal requirements)</li>
            <li>Objection: Object to processing of your personal information</li>
            <li>Withdrawal: Withdraw consent for marketing communications at any time</li>
          </ul>

          <h2 className="text-2xl font-bold text-black mb-4">Data Retention</h2>
          <p className="mb-6 leading-relaxed">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Order information is typically retained for 7 years for accounting and tax purposes.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">Children's Privacy</h2>
          <p className="mb-6 leading-relaxed">
            Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you believe we have collected such information, please contact us immediately.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">Changes to This Policy</h2>
          <p className="mb-6 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
          </p>

          <h2 className="text-2xl font-bold text-black mb-4">Contact Us</h2>
          <p className="mb-4 leading-relaxed">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
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
