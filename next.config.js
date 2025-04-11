/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Required for static site generation
  images: {
    unoptimized: true // Required for static export
  },
  // Ensure static assets are copied to the output directory
  distDir: 'out',
  assetPrefix: '/'
}

module.exports = nextConfig 