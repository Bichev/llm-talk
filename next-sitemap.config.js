/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://llm-talk.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/test', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/test', '/api/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://llm-talk.vercel.app'}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom transform for specific pages
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
