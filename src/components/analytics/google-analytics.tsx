'use client'

import Script from 'next/script'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}

// Event tracking helper
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// E-commerce tracking
export function trackPurchase(transactionId: string, value: number, items: any[]) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'CAD',
      items: items.map((item, index) => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.service,
        price: item.unitPrice,
        quantity: item.quantity,
        index: index,
      })),
    })
  }
}

// Quote request tracking (since this is quote-based, not direct purchase)
export function trackQuoteRequest(orderNumber: string, value: number, items: any[]) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'generate_lead', {
      currency: 'CAD',
      value: value,
      transaction_id: orderNumber,
    })
  }
}

// Add to cart tracking (for design studio quotes)
export function trackAddToCart(item: any) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'add_to_cart', {
      currency: 'CAD',
      value: item.totalPrice,
      items: [{
        item_id: item.id,
        item_name: item.name,
        item_category: item.service,
        price: item.unitPrice,
        quantity: item.quantity,
      }],
    })
  }
}

// Contact form submission tracking
export function trackContactForm(subject?: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'contact_form_submit', {
      event_category: 'engagement',
      event_label: subject || 'general',
    })
  }
}

// Design save tracking
export function trackDesignSave(productType: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'design_save', {
      event_category: 'engagement',
      event_label: productType,
    })
  }
}
