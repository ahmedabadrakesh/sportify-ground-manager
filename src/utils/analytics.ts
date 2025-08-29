// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-BN98Y2PNL5', {
      page_path: path,
    });
  }
};

export const trackEvent = (
  action: string,
  category: string = 'engagement',
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('click', 'button', `${buttonName}${location ? ` - ${location}` : ''}`);
};

export const trackFormSubmit = (formName: string) => {
  trackEvent('submit', 'form', formName);
};

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', 'engagement', searchTerm);
};