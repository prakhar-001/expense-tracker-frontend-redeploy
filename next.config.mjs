/** @type {import('next').NextConfig} */

import withPWA from 'next-pwa';

const pwaConfig = {
    dest: 'public',
  };

const nextConfig = {};

export default withPWA(pwaConfig)(nextConfig);
// export default (nextConfig);