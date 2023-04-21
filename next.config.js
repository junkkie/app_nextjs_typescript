/** @type {import('next').NextConfig} */

//next.config.js
const debug = process.env.NODE_ENV !== 'production'
const name = 'app_nextjs_typescript'

const nextConfig = {
  reactStricMode: true,
  assetPrefix: !debug ? `/${name}/` : '',
  basePath: '/app_nextjs_typesxript',
  trailingSlash: true
}

module.exports = nextConfig