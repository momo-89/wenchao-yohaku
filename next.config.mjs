/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers(){
    return [
      { source: '/private/:path*', headers: [
        {key:'X-Robots-Tag', value:'noindex, nofollow, noarchive'},
        {key:'Cache-Control', value:'private, no-store, max-age=0'}
      ]}
    ]
  }
};
export default nextConfig;
