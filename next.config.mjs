// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['topgear.com.my', 'another-domain.com'], // Add all the domains you are using
    },
  };
  
  export default nextConfig;
  