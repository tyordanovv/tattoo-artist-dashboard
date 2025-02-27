/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "gpndqmsmgmntvbobftms.supabase.co",
            pathname: "/storage/v1/object/public/designs/**",
          },
        ],
    },
}

module.exports = nextConfig
