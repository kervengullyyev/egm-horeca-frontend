"use client";

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Dynamic import for web-vitals to reduce bundle size
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      const sendToAnalytics = (metric: { name: string; id: string; value: number }) => {
        // Send to your analytics service
        console.log('Performance Metric:', metric);
        
        // Example: Send to Google Analytics
        if (typeof window !== 'undefined' && 'gtag' in window) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true,
          });
        }
      };

      onCLS(sendToAnalytics);
      onINP(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
    }).catch((error) => {
      console.error('Failed to load web-vitals:', error);
    });
  }, []);

  return null;
}
