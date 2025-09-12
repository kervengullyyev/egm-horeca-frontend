"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const messageData = {
      name: formData.get('firstName') + ' ' + formData.get('lastName'),
      email: formData.get('email') as string,
      subject: 'Contact Form Submission',
      message: formData.get('message') as string,
    };

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiBaseUrl) {
        throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable must be set');
      }
      
      const response = await fetch(`${apiBaseUrl}/api/v1/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form using ref
        if (formRef.current) {
          formRef.current.reset();
        }
        // Reset button text after 3 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Write us a message</h2>
      
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Status Messages */}
        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              There was an error sending your message. Please try again.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              placeholder="Jane"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              placeholder="Smith"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="jane@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="Leave us a message..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="privacy"
            name="privacy"
            required
            className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
          />
          <label htmlFor="privacy" className="text-sm text-gray-700">
            I agree to the{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || submitStatus === 'success'}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            submitStatus === 'success'
              ? 'bg-green-600 text-primary-foreground cursor-default'
              : isSubmitting
              ? 'bg-gray-400 text-primary-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {submitStatus === 'success' 
            ? 'Successfully sent' 
            : isSubmitting 
            ? 'Sending...' 
            : 'Send'
          }
        </button>
      </form>
    </div>
  );
}
