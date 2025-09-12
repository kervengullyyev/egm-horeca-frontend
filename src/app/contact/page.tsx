import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {

  return (
    <main className="min-h-screen font-sans bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Section - Contact Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact us</h1>
              <p className="text-lg text-gray-600">
                We’ll love to hear from you. Please fill out this form, and we’ll reply soon.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                </div>
                <p className="text-sm text-gray-600 ml-13">
                  Contact us by email, and we will respond shortly.
                </p>
                <a 
                  href="mailto:info@egmhoreca.com" 
                  className="text-sm font-medium text-gray-900 hover:text-gray-700 ml-13 block"
                >
                  info@egmhoreca.com
                </a>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                </div>
                <p className="text-sm text-gray-600 ml-13">
                  Call us on weekdays from 9 AM to 6 PM.
                </p>
                <a 
                  href="tel:+40741302753" 
                  className="text-sm font-medium text-gray-900 hover:text-gray-700 ml-13 block"
                >
                  +40 741 302 753
                </a>
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image
                      src="/social-icons/whatsapp.png"
                      alt="WhatsApp"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                </div>
                <p className="text-sm text-gray-600 ml-13">
                  Send us a message anytime, we’ll respond quickly.
                </p>
                <a 
                  href="https://wa.me/40741302753" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-900 hover:text-gray-700 ml-13 block"
                >
                  +40 741 302 753
                </a>
              </div>

              {/* Office */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Office</h3>
                </div>
                <p className="text-sm text-gray-600 ml-13">
                  Visit us at our headquarters.
                </p>
                <a 
                  href="https://maps.google.com/?q=Bucharest,Romania" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-900 hover:text-gray-700 ml-13 block"
                >
                  Bucharest, Romania
                </a>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
