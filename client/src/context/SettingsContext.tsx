import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteSettings } from '../types';
import { api } from '../services/api';

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  formatPrice: (price: number, currency?: string, prefix?: string | null, suffix?: string | null, compact?: boolean) => string;
  formatFullPrice: (price: number, currency?: string) => string;
  getWhatsAppUrl: (message?: string) => string;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  company_name: 'Astrra Estates',
  tagline: 'Curators of Extraordinary Indian Architectural Living',
  contact_email: 'concierge@astreates.in',
  contact_phone: '+91 22 6988 5000',
  whatsapp_number: '+919820012345',
  office_address: 'Astrra Tower, Level 28, Bandra Kurla Complex (BKC), Mumbai 400051, India',
  office_hours: 'Monday - Saturday: 9:30 AM - 7:30 PM IST',
  currency_symbol: '₹',
  whatsapp_template: 'Namaste Astrra Estates concierge, I am interested in {title} (Ref: {refNumber}). Please share the private portfolio dossier and arrange a confidential viewing.',
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  formatPrice: () => '',
  formatFullPrice: () => '',
  getWhatsAppUrl: () => '',
  refreshSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await api.getSiteSettings();
      setSettings((prev) => ({ ...prev, ...data }));
    } catch (e) {
      console.warn('Using fallback settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const formatPrice = (
    price: number,
    currency: string = 'INR',
    prefix?: string | null,
    suffix?: string | null,
    compact: boolean = true
  ): string => {
    const isINR = !currency || currency === 'INR' || currency === '₹';
    let formattedAmount = '';
    let symbol = '₹';

    if (isINR) {
      symbol = '₹';
      if (compact && price >= 10_000_000) {
        const cr = price / 10_000_000;
        const formattedCr = cr % 1 === 0 ? cr.toString() : cr.toFixed(2).replace(/\.?0+$/, '');
        formattedAmount = `${formattedCr} Cr`;
      } else if (compact && price >= 100_000) {
        const lakh = price / 100_000;
        const formattedLakh = lakh % 1 === 0 ? lakh.toString() : lakh.toFixed(2).replace(/\.?0+$/, '');
        formattedAmount = `${formattedLakh} Lakh`;
      } else {
        formattedAmount = new Intl.NumberFormat('en-IN').format(price);
      }
    } else {
      symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : `${currency} `;
      formattedAmount = new Intl.NumberFormat('en-US').format(price);
    }

    const prefixStr = prefix ? `${prefix} ` : '';
    const suffixStr = suffix ? ` ${suffix}` : '';
    return `${prefixStr}${symbol} ${formattedAmount}${suffixStr}`;
  };

  const formatFullPrice = (
    price: number,
    currency: string = 'INR'
  ): string => {
    const isINR = !currency || currency === 'INR' || currency === '₹';
    const symbol = isINR ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : `${currency} `;
    const locale = isINR ? 'en-IN' : 'en-US';
    return `${symbol} ${new Intl.NumberFormat(locale).format(price)}`;
  };

  const getWhatsAppUrl = (message?: string): string => {
    const rawNumber = settings.whatsapp_number || '+919820012345';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const encodedMsg = message ? encodeURIComponent(message) : '';
    return `https://wa.me/${cleanNumber}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        formatPrice,
        formatFullPrice,
        getWhatsAppUrl,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
