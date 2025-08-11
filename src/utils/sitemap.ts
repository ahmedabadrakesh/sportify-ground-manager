import { supabase } from "@/integrations/supabase/client";

export const generateSitemapXML = async (): Promise<string> => {
  const baseUrl = "https://jokova.com";
  const currentDate = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/sports-professionals', changefreq: 'weekly', priority: '0.9' },
    { url: '/search', changefreq: 'weekly', priority: '0.8' },
    { url: '/events', changefreq: 'weekly', priority: '0.8' },
    { url: '/shop', changefreq: 'weekly', priority: '0.8' },
    { url: '/bookings', changefreq: 'weekly', priority: '0.7' },
    { url: '/api-documentation', changefreq: 'monthly', priority: '0.5' },
  ];

  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static pages
  staticPages.forEach(page => {
    sitemapXML += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  try {
    // Fetch all sports professionals
    const { data: professionals } = await supabase
      .from('sports_professionals')
      .select('id, name, updated_at');

    if (professionals) {
      professionals.forEach(professional => {
        const professionalUrl = `/professional/${professional.name.toLowerCase().replace(/\s+/g, '-')}/${professional.id}`;
        const lastmod = professional.updated_at ? new Date(professional.updated_at).toISOString().split('T')[0] : currentDate;
        
        sitemapXML += `
  <url>
    <loc>${baseUrl}${professionalUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
    }

    // Fetch all grounds
    const { data: grounds } = await supabase
      .from('grounds')
      .select('id, updated_at');

    if (grounds) {
      grounds.forEach(ground => {
        const groundUrl = `/ground/${ground.id}`;
        const lastmod = ground.updated_at ? new Date(ground.updated_at).toISOString().split('T')[0] : currentDate;
        
        sitemapXML += `
  <url>
    <loc>${baseUrl}${groundUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });
    }

    // Fetch all inventory items for shop
    const { data: products } = await supabase
      .from('inventory_items')
      .select('id, name, updated_at');

    if (products) {
      products.forEach(product => {
        const productName = product.name ? product.name.toLowerCase().replace(/\s+/g, '-') : 'product';
        const productUrl = `/product/${productName}/${product.id}`;
        const lastmod = product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : currentDate;
        
        sitemapXML += `
  <url>
    <loc>${baseUrl}${productUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      });
    }

  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  sitemapXML += `
</urlset>`;

  return sitemapXML;
};