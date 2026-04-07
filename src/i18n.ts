import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported Identity Locales
export const locales = ['en', 'hi', 'es'] as const;

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is supported
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
