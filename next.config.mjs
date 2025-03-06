const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },

  // Configuración de i18n
  i18n: {
    defaultLocale: 'es', // Idioma por defecto
    locales: ['es', 'en'], // Idiomas soportados
  },
};

// Exporta la configuración con next-intl
module.exports = withNextIntl(nextConfig);